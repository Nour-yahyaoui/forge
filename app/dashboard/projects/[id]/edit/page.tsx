// app/dashboard/projects/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const projectId = params.id as string;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const project = data.data;
          if (!project.is_owner) {
            router.push(`/dashboard/projects/${projectId}`);
            return;
          }
          setName(project.name);
          setDescription(project.description || "");
          setGithubRepoUrl(project.github_repo_url || "");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description, githubRepoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update project");
        return;
      }

      router.push(`/dashboard/projects/${projectId}`);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href={`/dashboard/projects/${projectId}`} className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 mb-4">
        <FaArrowLeft /> Back to project
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Edit Project</h1>
        <p className="text-sm text-gray-500 mb-6">Update your project details</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 text-sm rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition bg-gray-50"
              placeholder="My Awesome Project"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Description (Plan)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition bg-gray-50"
              placeholder="What's the project about? What's the plan?"
            />
          </div>

          <div>
            <label htmlFor="github" className="block text-sm font-semibold text-gray-700 mb-1">
              GitHub Repo URL
            </label>
            <input
              id="github"
              type="url"
              value={githubRepoUrl}
              onChange={(e) => setGithubRepoUrl(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition bg-gray-50"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href={`/dashboard/projects/${projectId}`}
              className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}