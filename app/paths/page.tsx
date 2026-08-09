// app/paths/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  FaTwitter,
  FaGithub,
  FaDiscord,
  FaHeart,
  FaCheckCircle,
  FaArrowRight,
  FaLaptopCode,
  FaServer,
  FaDatabase,
  FaShieldAlt,
  FaMobileAlt,
  FaLayerGroup,
  FaGraduationCap,
} from "react-icons/fa";

// ============================================================
// TYPES
// ============================================================
interface Path {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  technologies: string[];
  duration: string;
  projects: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
}

// ============================================================
// DATA
// ============================================================
const paths: Path[] = [
  {
    id: "frontend",
    title: "Frontend Development",
    icon: <FaLaptopCode />,
    description:
      "Build beautiful, responsive, and interactive user interfaces from scratch. Master the art of crafting pixel‑perfect web experiences.",
    technologies: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js"],
    duration: "8–10 weeks",
    projects: ["Portfolio Website", "Blog Platform", "E‑Commerce Store", "Dashboard UI"],
    level: "Beginner",
  },
  {
    id: "backend",
    title: "Backend Development",
    icon: <FaServer />,
    description:
      "Build robust, scalable APIs and services that power modern web and mobile applications. Learn to handle data, authentication, and business logic.",
    technologies: ["Node.js", "Express.js", "Python", "Django", "PHP"],
    duration: "8–10 weeks",
    projects: ["REST API", "Authentication System", "File Upload Service", "Payment Integration"],
    level: "Intermediate",
  },
  {
    id: "database",
    title: "Database & Storage",
    icon: <FaDatabase />,
    description:
      "Design, query, and optimize databases for real‑world applications. Learn everything from basic CRUD to advanced indexing and serverless databases.",
    technologies: ["SQL", "PostgreSQL", "Neon", "Prisma", "Drizzle"],
    duration: "4–6 weeks",
    projects: ["E‑Commerce Database", "Analytics Dashboard", "Inventory Management"],
    level: "Intermediate",
  },
  {
    id: "advanced",
    title: "Advanced & Production",
    icon: <FaShieldAlt />,
    description:
      "Take your skills to the next level with production‑ready techniques: AI integration, caching, rate limiting, security, and performance optimisation.",
    technologies: ["AI Integration", "Rate Limiting", "Caching", "Security", "Redis", "WebSockets"],
    duration: "6–8 weeks",
    projects: ["AI‑Powered Chatbot", "Real‑Time Dashboard", "Secure API Gateway"],
    level: "Advanced",
  },
  {
    id: "mobile",
    title: "Mobile Development",
    icon: <FaMobileAlt />,
    description:
      "Build cross‑platform mobile applications for iOS and Android. Learn to create smooth, native‑like experiences with modern frameworks.",
    technologies: ["React Native", "Flutter", "Mobile APIs", "Push Notifications"],
    duration: "6–8 weeks",
    projects: ["Task Manager App", "Social Media App", "Fitness Tracker"],
    level: "Intermediate",
  },
  {
    id: "fullstack",
    title: "Full‑Stack Development",
    icon: <FaLayerGroup />,
    description:
      "Combine everything — frontend, backend, and databases — to build complete, production‑ready applications from scratch.",
    technologies: ["React", "Next.js", "Node.js", "PostgreSQL", "Docker", "Vercel"],
    duration: "12–16 weeks",
    projects: ["Full‑Stack Marketplace", "SaaS Dashboard", "Mobile App + API"],
    level: "Advanced",
  },
];

// ============================================================
// COMPONENT
// ============================================================
export default function PathsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredPaths =
    activeFilter === "all" ? paths : paths.filter((p) => p.level.toLowerCase() === activeFilter);

  const levels = ["all", "beginner", "intermediate", "advanced"];

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-6 md:py-8">

        {/* ============================================================
        NAVBAR
        ============================================================ */}
        <Navbar activePage="paths" />

        {/* ============================================================
        HERO
        ============================================================ */}
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

        {/* ============================================================
        FILTER
        ============================================================ */}
        <section className="py-6 border-b-2 border-gray-200">
          <div className="flex flex-wrap gap-3">
            {levels.map((level) => (
              <button
                key={level}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide transition ${
                  activeFilter === level
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveFilter(level)}
              >
                {level === "all" ? "All Paths" : level}
              </button>
            ))}
          </div>
        </section>

        {/* ============================================================
        PATHS GRID
        ============================================================ */}
        <section className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPaths.map((path) => (
              <div
                key={path.id}
                className="bg-gray-50 border border-gray-200 p-6 md:p-8 hover:border-red-600 transition group"
              >
                <div className="flex items-start justify-between">
                  <div className="text-4xl text-red-600 group-hover:scale-110 transition">
                    {path.icon}
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 ${
                      path.level === "Beginner"
                        ? "bg-green-100 text-green-700"
                        : path.level === "Intermediate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {path.level}
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-tight mt-4">{path.title}</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{path.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {path.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-white border border-gray-200 px-2 py-1 text-gray-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-4 text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaGraduationCap className="text-red-600" /> {path.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCheckCircle className="text-red-600" /> {path.projects.length} projects
                    </span>
                  </div>
                  <Link
                    href="#"
                    className="flex items-center gap-1 text-red-600 font-semibold hover:underline transition"
                  >
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

        {/* ============================================================
        CTA
        ============================================================ */}
        <section className="border-t-2 border-b-2 border-gray-200 py-12 md:py-16 my-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Ready to <span className="text-red-600">start</span> your journey?
              </h2>
              <p className="text-gray-600 mt-2">
                Pick a path and begin building real projects today.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link href="#" className="bg-red-600 text-white px-8 py-3 font-bold uppercase tracking-wide text-sm hover:bg-red-700 transition">
                Join Free
              </Link>
              <Link href="/about" className="border-2 border-gray-300 text-gray-600 px-8 py-3 font-semibold uppercase tracking-wide text-sm hover:bg-gray-100 transition">
                About
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================
        FOOTER
        ============================================================ */}
        <footer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-8 md:py-12 border-t-2 border-gray-200 mt-8">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              Code<span className="text-red-600">Forge</span>
            </Link>
            <p className="text-sm text-gray-500 mt-2 max-w-xs">
              A student‑led platform to learn full‑stack development through real projects and mentorship.
            </p>
            <div className="flex gap-3 mt-4 text-gray-500 text-xl">
              <a href="#" className="hover:text-red-600 transition"><FaTwitter /></a>
              <a href="#" className="hover:text-red-600 transition"><FaGithub /></a>
              <a href="#" className="hover:text-red-600 transition"><FaDiscord /></a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Paths</h4>
            <div className="space-y-1.5 text-sm text-gray-600">
              <Link href="/paths" className="block hover:text-red-600 transition">Frontend</Link>
              <Link href="/paths" className="block hover:text-red-600 transition">Backend</Link>
              <Link href="/paths" className="block hover:text-red-600 transition">Database</Link>
              <Link href="/paths" className="block hover:text-red-600 transition">Advanced</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Resources</h4>
            <div className="space-y-1.5 text-sm text-gray-600">
              <a href="#" className="block hover:text-red-600 transition">Documentation</a>
              <a href="#" className="block hover:text-red-600 transition">Projects</a>
              <a href="#" className="block hover:text-red-600 transition">Community</a>
              <Link href="/faq" className="block hover:text-red-600 transition">FAQ</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Connect</h4>
            <div className="space-y-1.5 text-sm text-gray-600">
              <Link href="/about" className="block hover:text-red-600 transition">About Nour</Link>
              <a href="#" className="block hover:text-red-600 transition">YouTube</a>
              <a href="#" className="block hover:text-red-600 transition">LinkedIn</a>
              <a href="#" className="block hover:text-red-600 transition">Contact</a>
            </div>
          </div>
        </footer>

        <div className="border-t border-gray-200 pt-6 mt-4 text-center text-xs text-gray-400">
          <span>&copy; {new Date().getFullYear()} CodeForge. Built with </span>
          <FaHeart className="inline-block text-red-600 mx-1" />
          <span> by Nour Yahyaoui.</span>
        </div>

      </div>
    </div>
  );
}