// app/paths/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaGraduationCap, FaCheckCircle, FaArrowRight } from "react-icons/fa";

interface Path {
  id: string;
  title: string;
  icon: string;
  description: string;
  technologies: string[];
  duration: string;
  projects: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
}

const paths: Path[] = [
  {
    id: "frontend",
    title: "Frontend Development",
    icon: "💻",
    description: "Build beautiful, responsive, and interactive user interfaces from scratch.",
    technologies: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js"],
    duration: "8–10 weeks",
    projects: ["Portfolio Website", "Blog Platform", "E‑Commerce Store", "Dashboard UI"],
    level: "Beginner",
  },
  {
    id: "backend",
    title: "Backend Development",
    icon: "⚙️",
    description: "Build robust, scalable APIs and services that power modern web and mobile applications.",
    technologies: ["Node.js", "Express.js", "Python", "Django", "PHP"],
    duration: "8–10 weeks",
    projects: ["REST API", "Authentication System", "File Upload Service", "Payment Integration"],
    level: "Intermediate",
  },
  {
    id: "database",
    title: "Database & Storage",
    icon: "🗄️",
    description: "Design, query, and optimize databases for real‑world applications.",
    technologies: ["SQL", "PostgreSQL", "Neon", "Prisma", "Drizzle"],
    duration: "4–6 weeks",
    projects: ["E‑Commerce Database", "Analytics Dashboard", "Inventory Management"],
    level: "Intermediate",
  },
  {
    id: "advanced",
    title: "Advanced & Production",
    icon: "🚀",
    description: "Take your skills to the next level with production‑ready techniques.",
    technologies: ["AI Integration", "Rate Limiting", "Caching", "Security", "Redis", "WebSockets"],
    duration: "6–8 weeks",
    projects: ["AI‑Powered Chatbot", "Real‑Time Dashboard", "Secure API Gateway"],
    level: "Advanced",
  },
  {
    id: "mobile",
    title: "Mobile Development",
    icon: "📱",
    description: "Build cross‑platform mobile applications for iOS and Android.",
    technologies: ["React Native", "Flutter", "Mobile APIs", "Push Notifications"],
    duration: "6–8 weeks",
    projects: ["Task Manager App", "Social Media App", "Fitness Tracker"],
    level: "Intermediate",
  },
  {
    id: "fullstack",
    title: "Full‑Stack Development",
    icon: "🌐",
    description: "Combine everything — frontend, backend, and databases — to build complete, production‑ready applications.",
    technologies: ["React", "Next.js", "Node.js", "PostgreSQL", "Docker", "Vercel"],
    duration: "12–16 weeks",
    projects: ["Full‑Stack Marketplace", "SaaS Dashboard", "Mobile App + API"],
    level: "Advanced",
  },
];

export default function PathsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const filteredPaths = activeFilter === "all" ? paths : paths.filter((p) => p.level.toLowerCase() === activeFilter);
  const levels = ["all", "beginner", "intermediate", "advanced"];

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-6 md:py-8">
        <Navbar activePage="paths" />

        <section className="py-12 md:py-16 border-b-2 border-gray-200">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 inline-block">
              Learning Paths
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-4">
              Choose your <span className="text-red-600">path</span>
            </h1>
            <p className="text-lg text-gray-600 mt-4 max-w-lg">
              Structured, project‑based tracks designed to take you from absolute beginner to job‑ready developer.
            </p>
          </div>
        </section>

        <section className="py-6 border-b-2 border-gray-200">
          <div className="flex flex-wrap gap-3">
            {levels.map((level) => (
              <button
                key={level}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide transition ${
                  activeFilter === level ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveFilter(level)}
              >
                {level === "all" ? "All Paths" : level}
              </button>
            ))}
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPaths.map((path) => (
              <div key={path.id} className="bg-gray-50 border border-gray-200 p-6 md:p-8 hover:border-red-600 transition group">
                <div className="flex items-start justify-between">
                  <div className="text-4xl text-red-600 group-hover:scale-110 transition">{path.icon}</div>
                  <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 ${
                    path.level === "Beginner" ? "bg-green-100 text-green-700" :
                    path.level === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {path.level}
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight mt-4">{path.title}</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{path.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {path.technologies.map((tech) => (
                    <span key={tech} className="text-xs bg-white border border-gray-200 px-2 py-1 text-gray-600">{tech}</span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-4 text-gray-500">
                    <span className="flex items-center gap-1"><FaGraduationCap className="text-red-600" /> {path.duration}</span>
                    <span className="flex items-center gap-1"><FaCheckCircle className="text-red-600" /> {path.projects.length} projects</span>
                  </div>
                  <Link href="#" className="flex items-center gap-1 text-red-600 font-semibold hover:underline transition">
                    View path <FaArrowRight className="text-sm" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {filteredPaths.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No paths found for this level.</p>
            </div>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
}