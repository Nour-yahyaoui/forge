// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth";

// ─── GET /api/projects/[id] ──────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
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
    const { id } = await params;
    const projectId = parseInt(id);

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
  } catch (error: any) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/projects/[id] ──────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
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
    const { id } = await params;
    const projectId = parseInt(id);

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
    console.error("PUT /api/projects/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/projects/[id] ──────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
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
    const { id } = await params;
    const projectId = parseInt(id);

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
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}