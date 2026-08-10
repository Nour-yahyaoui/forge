// app/dashboard/projects/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaPlus,
  FaCode,
  FaUsers,
  FaTrash,
  FaEdit,
  FaLink,
  FaGithub,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";

interface Project {
  id: number;
  name: string;
  description: string;
  github_repo_url: string;
  join_code: string;
  created_at: string;
  is_owner: boolean;
  is_member: boolean;
  owner_name: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);

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

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setJoinError("");
    setJoining(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ joinCode: joinCode.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setJoinError(data.error || "Failed to join project");
        return;
      }

      setShowJoinModal(false);
      setJoinCode("");
      fetchProjects();
      router.refresh();
    } catch {
      setJoinError("Something went wrong");
    } finally {
      setJoining(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        fetchProjects();
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  // Extract repo name from GitHub URL
  const getRepoName = (url: string) => {
    try {
      const parts = url.replace("https://github.com/", "").split("/");
      if (parts.length >= 2) {
        return `${parts[0]}/${parts[1]}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""} • {projects.filter(p => p.is_owner).length} owned
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setShowJoinModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            <FaLink /> Join Project
          </button>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FaPlus /> New Project
          </Link>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <div className="text-6xl mb-4">🚀</div>
          <p className="text-xl font-semibold text-gray-700">No projects yet</p>
          <p className="text-gray-400 mt-2">Create your first project to get started</p>
          <Link
            href="/dashboard/projects/new"
            className="inline-block mt-4 bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Card Header with gradient accent */}
              <div className="h-2 bg-gradient-to-r from-red-500 to-red-600"></div>

              <div className="p-5 flex-1 flex flex-col">
                {/* Top row: owner badge + date */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span className="flex items-center gap-1">
                    {project.is_owner ? (
                      <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-semibold">Owner</span>
                    ) : (
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-semibold">Member</span>
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-[10px]" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Project Name */}
                <Link href={`/dashboard/projects/${project.id}`} className="block">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                </Link>

                {/* Description */}
                <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">
                  {project.description || "No description yet"}
                </p>

                {/* GitHub Repo - BIG LOGO */}
                {project.github_repo_url ? (
                  <a
                    href={project.github_repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 transition group/repo"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-2xl flex-shrink-0">
                      <FaGithub />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {getRepoName(project.github_repo_url)}
                      </p>
                      <p className="text-xs text-gray-400">View on GitHub</p>
                    </div>
                    <FaCode className="text-gray-400 group-hover/repo:text-red-500 transition" />
                  </a>
                ) : (
                  <div className="mt-3 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 opacity-60">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xl">
                      <FaGithub />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">No GitHub repo</p>
                      <p className="text-xs text-gray-400">Add one in settings</p>
                    </div>
                  </div>
                )}

                {/* Join Code & Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">Code:</span>
                    <span className="font-mono font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                      {project.join_code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.is_owner && (
                      <>
                        <Link
                          href={`/dashboard/projects/${project.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="text-sm font-medium text-red-600 hover:underline ml-1"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Join Modal - same as before but styled better */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowJoinModal(false)} />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaLink className="text-2xl text-red-600" />
              </div>
              <h2 className="text-xl font-bold">Join a Project</h2>
              <p className="text-sm text-gray-500 mt-1">Enter the join code provided by the project owner</p>
            </div>

            {joinError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 text-sm rounded-xl mb-4">
                {joinError}
              </div>
            )}

            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter join code"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-lg font-mono uppercase tracking-widest focus:border-red-600 outline-none transition bg-gray-50"
              maxLength={8}
              autoFocus
            />

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleJoin}
                disabled={joining || !joinCode.trim()}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joining ? "Joining..." : "Join Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}