// app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query, generateJoinCode } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth";

// ─── GET /api/projects ────────────────────────────────
// List projects (owned + joined)
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Get URL to check if there's an ID
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    // pathSegments = ["api", "projects"] or ["api", "projects", "join"] or ["api", "projects", "123"]

    if (pathSegments.length === 2) {
      // GET /api/projects → list all projects
      const projects = await query(
        `
        SELECT 
          p.id, p.name, p.description, p.github_repo_url, p.join_code, p.created_at, p.updated_at,
          u.name as owner_name,
          CASE WHEN p.owner_id = $1 THEN true ELSE false END as is_owner,
          EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = p.id AND pm.user_id = $1) as is_member
        FROM projects p
        LEFT JOIN users u ON p.owner_id = u.id
        WHERE p.owner_id = $1 OR EXISTS (
          SELECT 1 FROM project_members pm WHERE pm.project_id = p.id AND pm.user_id = $1
        )
        ORDER BY p.created_at DESC
        `,
        [userId]
      );

      return NextResponse.json({ success: true, data: projects });
    } else if (pathSegments.length === 3 && pathSegments[2] === "join") {
      // GET /api/projects/join → should be handled by POST, so return 405
      return NextResponse.json(
        { success: false, error: "Method not allowed" },
        { status: 405 }
      );
    } else {
      // GET /api/projects/{id}
      const projectId = parseInt(pathSegments[2]);
      if (isNaN(projectId)) {
        return NextResponse.json(
          { success: false, error: "Invalid project ID" },
          { status: 400 }
        );
      }

      const [project] = await query(
        `
        SELECT 
          p.*, 
          u.name as owner_name,
          CASE WHEN p.owner_id = $1 THEN true ELSE false END as is_owner,
          EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = p.id AND pm.user_id = $1) as is_member,
          COALESCE(
            (SELECT json_agg(json_build_object('id', u2.id, 'name', u2.name, 'email', u2.email))
             FROM project_members pm2
             JOIN users u2 ON pm2.user_id = u2.id
             WHERE pm2.project_id = p.id),
            '[]'::json
          ) as members
        FROM projects p
        LEFT JOIN users u ON p.owner_id = u.id
        WHERE p.id = $2
        `,
        [userId, projectId]
      );

      if (!project) {
        return NextResponse.json(
          { success: false, error: "Project not found" },
          { status: 404 }
        );
      }

      // Check if user has access (owner or member)
      if (!project.is_owner && !project.is_member) {
        return NextResponse.json(
          { success: false, error: "You don't have access to this project" },
          { status: 403 }
        );
      }

      return NextResponse.json({ success: true, data: project });
    }
  } catch (error: any) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── POST /api/projects ───────────────────────────────
// Create a new project (owner) or join via code (if body.joinCode)
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    const body = await req.json();

    // Check if it's a join request
    if (body.joinCode) {
      // POST /api/projects with joinCode → join project
      const joinCode = body.joinCode.trim().toUpperCase();

      // Find project with this join code
      const [project] = await query(
        `SELECT id, owner_id FROM projects WHERE join_code = $1`,
        [joinCode]
      );

      if (!project) {
        return NextResponse.json(
          { success: false, error: "Invalid join code" },
          { status: 404 }
        );
      }

      // Check if user is already a member
      const [existing] = await query(
        `SELECT id FROM project_members WHERE project_id = $1 AND user_id = $2`,
        [project.id, userId]
      );

      if (existing) {
        return NextResponse.json(
          { success: false, error: "You are already a member of this project" },
          { status: 409 }
        );
      }

      // Can't join own project
      if (project.owner_id === userId) {
        return NextResponse.json(
          { success: false, error: "You are the owner of this project" },
          { status: 400 }
        );
      }

      // Add user as member
      await query(
        `INSERT INTO project_members (project_id, user_id) VALUES ($1, $2)`,
        [project.id, userId]
      );

      // Return project details
      const [updatedProject] = await query(
        `SELECT * FROM projects WHERE id = $1`,
        [project.id]
      );

      return NextResponse.json({
        success: true,
        data: { project: updatedProject, message: "Successfully joined the project" },
      });
    }

    // Otherwise, create a new project
    const { name, description, githubRepoUrl } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Project name is required" },
        { status: 400 }
      );
    }

    // Generate a unique join code
    let joinCode = generateJoinCode();
    // Ensure uniqueness
    let exists = true;
    while (exists) {
      const existing = await query(`SELECT id FROM projects WHERE join_code = $1`, [joinCode]);
      if (existing.length === 0) {
        exists = false;
      } else {
        joinCode = generateJoinCode();
      }
    }

    const [project] = await query(
      `
      INSERT INTO projects (owner_id, name, description, github_repo_url, join_code)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [userId, name, description || null, githubRepoUrl || null, joinCode]
    );

    return NextResponse.json(
      { success: true, data: project },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/projects/{id} ────────────────────────────
// Update a project (only owner)
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);

    if (pathSegments.length !== 3) {
      return NextResponse.json(
        { success: false, error: "Invalid URL" },
        { status: 400 }
      );
    }

    const projectId = parseInt(pathSegments[2]);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, description, githubRepoUrl } = body;

    // Check ownership
    const [project] = await query(
      `SELECT owner_id FROM projects WHERE id = $1`,
      [projectId]
    );

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    if (project.owner_id !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the owner can update this project" },
        { status: 403 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (githubRepoUrl !== undefined) {
      updates.push(`github_repo_url = $${paramIndex++}`);
      values.push(githubRepoUrl);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(projectId);
    const queryText = `
      UPDATE projects
      SET ${updates.join(", ")}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const [updatedProject] = await query(queryText, values);

    return NextResponse.json({ success: true, data: updatedProject });
  } catch (error: any) {
    console.error("PUT /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/projects/{id} ─────────────────────────
// Delete a project (only owner)
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);

    if (pathSegments.length !== 3) {
      return NextResponse.json(
        { success: false, error: "Invalid URL" },
        { status: 400 }
      );
    }

    const projectId = parseInt(pathSegments[2]);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: "Invalid project ID" },
        { status: 400 }
      );
    }

    // Check ownership
    const [project] = await query(
      `SELECT owner_id FROM projects WHERE id = $1`,
      [projectId]
    );

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    if (project.owner_id !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the owner can delete this project" },
        { status: 403 }
      );
    }

    await query(`DELETE FROM projects WHERE id = $1`, [projectId]);

    return NextResponse.json({
      success: true,
      data: { message: "Project deleted successfully" },
    });
  } catch (error: any) {
    console.error("DELETE /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}