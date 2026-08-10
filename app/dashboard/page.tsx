// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaUsers, FaProjectDiagram, FaCalendarAlt } from "react-icons/fa";

interface Project {
  id: number;
  name: string;
  description: string;
  github_repo_url: string;
  join_code: string;
  created_at: string;
  is_owner: boolean;
  is_member: boolean;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setProjects(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const totalProjects = projects.length;
  const ownedProjects = projects.filter((p) => p.is_owner).length;
  const joinedProjects = projects.filter((p) => p.is_member && !p.is_owner).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your projects and community</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center gap-2 min-h-[44px] justify-center"
        >
          <FaPlus /> New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Total Projects</p>
          <p className="text-2xl font-bold">{totalProjects}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Owned</p>
          <p className="text-2xl font-bold">{ownedProjects}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Joined</p>
          <p className="text-2xl font-bold">{joinedProjects}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Members</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-4">Recent Projects</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No projects yet</p>
            <Link href="/dashboard/projects/new" className="text-red-600 hover:underline text-sm">
              Create your first project →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {projects.slice(0, 5).map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="block py-3 hover:bg-gray-50 transition px-2 -mx-2 rounded"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-3 mt-0.5">
                      <span>{project.is_owner ? "👑 Owner" : "📎 Member"}</span>
                      <span>•</span>
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 border border-gray-200 px-2 py-1 rounded">
                    {project.join_code}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}