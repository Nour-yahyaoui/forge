// app/dashboard/projects/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaGithub,
  FaUsers,
  FaCode,
  FaCopy,
  FaEdit,
  FaCalendarAlt,
  FaUser,
  FaCrown,
  FaCheck,
  FaClock,
  FaExternalLinkAlt,
} from "react-icons/fa";

interface Member {
  id: number;
  name: string;
  email: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  github_repo_url: string;
  join_code: string;
  created_at: string;
  updated_at: string;
  owner_id: number;
  owner_name: string;
  is_owner: boolean;
  is_member: boolean;
  members: Member[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const projectId = params.id as string;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setProject(data.data);
        } else {
          router.push("/dashboard/projects");
        }
      } catch {
        router.push("/dashboard/projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId, router]);

  const copyJoinCode = () => {
    if (!project) return;
    navigator.clipboard.writeText(project.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
        <Link href="/dashboard/projects" className="text-red-600 hover:underline mt-2 inline-block">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition"
      >
        <FaArrowLeft /> Back to projects
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              {project.is_owner ? (
                <span className="inline-flex items-center gap-1 bg-white/20 text-white px-3 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                  <FaCrown className="text-yellow-300" /> Owner
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-white/20 text-white px-3 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                  <FaUser /> Member
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">
                <FaClock className="text-xs" />
                Created {new Date(project.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <FaUsers className="text-xs" />
                {project.members.length + 1} members
              </span>
            </div>
          </div>
          {project.is_owner && (
            <Link
              href={`/dashboard/projects/${project.id}/edit`}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition backdrop-blur-sm border border-white/10"
            >
              <FaEdit /> Edit Project
            </Link>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Join Code Section */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FaCode className="text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Join Code</p>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xl tracking-wider text-gray-800">
                      {project.join_code}
                    </span>
                    <button
                      onClick={copyJoinCode}
                      className="text-gray-400 hover:text-gray-600 transition flex items-center gap-1 text-sm"
                    >
                      {copied ? (
                        <>
                          <FaCheck className="text-green-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <FaCopy /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 pl-14">
              Share this code with others to let them join the project
            </p>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Description + GitHub */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {project.description && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Plan & Description
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>
              )}

              {/* GitHub */}
              {project.github_repo_url ? (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Repository
                  </h3>
                  <a
                    href={project.github_repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-5 py-3 transition group"
                  >
                    <FaGithub className="text-xl" />
                    <span className="font-medium">{project.github_repo_url.replace("https://github.com/", "")}</span>
                    <FaExternalLinkAlt className="text-gray-400 group-hover:text-white transition text-sm" />
                  </a>
                </div>
              ) : (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Repository
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-gray-400 text-sm">
                    No GitHub repository linked yet
                  </div>
                </div>
              )}
            </div>

            {/* Right: Members */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FaUsers /> Members ({project.members.length + 1})
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                {/* Owner */}
                <div className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                    {project.owner_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{project.owner_name}</p>
                    <p className="text-xs text-gray-400">Owner</p>
                  </div>
                  <FaCrown className="text-yellow-400" />
                </div>

                {/* Members */}
                {project.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-gray-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{member.name}</p>
                      <p className="text-xs text-gray-400">Member</p>
                    </div>
                  </div>
                ))}

                {project.members.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-2">No members yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}