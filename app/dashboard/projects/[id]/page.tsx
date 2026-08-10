// app/dashboard/projects/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaGithub, FaUsers, FaCode, FaCopy } from "react-icons/fa";

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
    return <p className="text-gray-500">Loading...</p>;
  }

  if (!project) {
    return <p className="text-gray-500">Project not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/projects" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 mb-4">
        <FaArrowLeft /> Back to projects
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {project.is_owner ? "👑 Owner" : "📎 Member"} • Created {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>
          {project.is_owner && (
            <Link
              href={`/dashboard/projects/${project.id}/edit`}
              className="text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Edit Project
            </Link>
          )}
        </div>

        {/* Join Code */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FaCode className="text-gray-400" />
              <span className="text-sm text-gray-500">Join Code:</span>
              <span className="font-mono font-bold text-lg tracking-wider">{project.join_code}</span>
            </div>
            <button
              onClick={copyJoinCode}
              className="text-sm text-gray-500 hover:text-gray-700 transition flex items-center gap-1"
            >
              <FaCopy /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Share this code with others to let them join the project
          </p>
        </div>

        {/* Description */}
        {project.description && (
          <div className="mb-6">
            <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">Plan</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
          </div>
        )}

        {/* GitHub */}
        {project.github_repo_url && (
          <div className="mb-6">
            <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">GitHub Repository</h3>
            <a
              href={project.github_repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:underline flex items-center gap-2"
            >
              <FaGithub /> {project.github_repo_url}
            </a>
          </div>
        )}

        {/* Members */}
        <div>
          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <FaUsers /> Members ({project.members.length + 1})
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              👑 {project.owner_name} (Owner)
            </span>
            {project.members.map((member) => (
              <span key={member.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {member.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}