// app/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaPhp,
  FaDatabase,
  FaBrain,
  FaShieldAlt,
  FaTwitter,
  FaGithub,
  FaDiscord,
  FaHeart,
} from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiExpress,
  SiDjango,
  SiPostgresql,
  SiNeon,
} from "react-icons/si";

// ============================================================
// TYPES
// ============================================================
interface StackItem {
  id: number;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: "frontend" | "backend" | "database" | "advanced";
}

interface Testimonial {
  id: number;
  initials: string;
  name: string;
  role: string;
  quote: string;
  stars: number;
}

// ============================================================
// DATA
// ============================================================
const stackItems: StackItem[] = [
  // Frontend
  { id: 1, name: "HTML5", icon: <FaHtml5 />, description: "Semantic markup, accessibility", category: "frontend" },
  { id: 2, name: "CSS3", icon: <FaCss3Alt />, description: "Flexbox, Grid, animations", category: "frontend" },
  { id: 3, name: "JavaScript", icon: <FaJs />, description: "ES6+, DOM, async/await", category: "frontend" },
  { id: 4, name: "TypeScript", icon: <SiTypescript />, description: "Type safety, interfaces, generics", category: "frontend" },
  { id: 5, name: "React", icon: <FaReact />, description: "Hooks, state, routing", category: "frontend" },
  { id: 6, name: "Next.js", icon: <SiNextdotjs />, description: "SSR, App Router, API routes", category: "frontend" },
  { id: 7, name: "React Native", icon: <FaReact />, description: "Mobile apps, cross-platform", category: "frontend" },
  
  // Backend
  { id: 8, name: "Node.js", icon: <FaNodeJs />, description: "Express, REST APIs", category: "backend" },
  { id: 9, name: "Express.js", icon: <SiExpress />, description: "Middleware, routing", category: "backend" },
  { id: 10, name: "Python", icon: <FaPython />, description: "Django, Flask, scripts", category: "backend" },
  { id: 11, name: "Django", icon: <SiDjango />, description: "ORM, admin, auth", category: "backend" },
  { id: 12, name: "PHP", icon: <FaPhp />, description: "Laravel, APIs, CMS", category: "backend" },
  
  // Database
  { id: 13, name: "SQL", icon: <FaDatabase />, description: "PostgreSQL, MySQL, queries", category: "database" },
  { id: 14, name: "PostgreSQL", icon: <SiPostgresql />, description: "Indexes, transactions, CTEs", category: "database" },
  { id: 15, name: "Neon", icon: <SiNeon />, description: "Serverless Postgres, branching", category: "database" },
  
  // Advanced
  { id: 16, name: "AI Integration", icon: <FaBrain />, description: "LLMs, embeddings, RAG", category: "advanced" },
  { id: 17, name: "Rate Limiting", icon: <FaShieldAlt />, description: "Redis, sliding window, per-IP", category: "advanced" },
  { id: 18, name: "Caching", icon: <FaDatabase />, description: "Redis, CDN, invalidation", category: "advanced" },
  { id: 19, name: "Security", icon: <FaShieldAlt />, description: "JWT, hashing, XSS, CSRF", category: "advanced" },
];

const frontendStack = stackItems.filter((item) => item.category === "frontend");
const backendStack = stackItems.filter((item) => item.category === "backend");
const databaseStack = stackItems.filter((item) => item.category === "database");
const advancedStack = stackItems.filter((item) => item.category === "advanced");

const testimonials: Testimonial[] = [
  {
    id: 1,
    initials: "AB",
    name: "Ahmed Ben Ali",
    role: "Now full‑stack dev",
    quote:
      "I went from knowing nothing to building a full‑stack app in 8 weeks. The mentorship was incredible.",
    stars: 5,
  },
  {
    id: 2,
    initials: "SM",
    name: "Sara Mansour",
    role: "Junior developer",
    quote:
      "The platform is structured so well. Every project taught me something real. I landed a job before graduation.",
    stars: 5,
  },
  {
    id: 3,
    initials: "YF",
    name: "Youssef Feki",
    role: "CS student",
    quote:
      "Nour’s guidance on architecture and code quality changed how I think about development. Forever grateful.",
    stars: 5,
  },
];

// ============================================================
// COMPONENT
// ============================================================
export default function Home() {
  const [activeCategory, setActiveCategory] = useState<"frontend" | "backend" | "database" | "advanced">("frontend");

  const categories = [
    { id: "frontend" as const, label: "Frontend", items: frontendStack, count: frontendStack.length },
    { id: "backend" as const, label: "Backend", items: backendStack, count: backendStack.length },
    { id: "database" as const, label: "Database", items: databaseStack, count: databaseStack.length },
    { id: "advanced" as const, label: "Advanced", items: advancedStack, count: advancedStack.length },
  ];

  const currentItems = categories.find((c) => c.id === activeCategory)?.items || [];

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto py-6 md:py-8">

        {/* ============================================================
        NAVBAR
        ============================================================ */}
        <Navbar activePage="home" />

        {/* ============================================================
        HERO
        ============================================================ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-12 lg:py-16 border-b-2 border-gray-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 inline-block">
              Led by Nour Yahyaoui
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mt-4">
              From <span className="bg-gray-100 px-2 text-red-600 italic">zero</span><br />
              to <span className="bg-gray-100 px-2 text-red-600 italic">full‑stack</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md mt-4">
              A free, project‑based platform where students build real applications,
              get honest code reviews, and master the full stack.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="#"
                className="bg-red-600 text-white px-8 py-3.5 font-bold uppercase tracking-wide text-sm hover:bg-red-700 transition hover:-translate-x-0.5 hover:-translate-y-0.5 shadow-[6px_6px_0_#e5e5e5] hover:shadow-[8px_8px_0_#d1d5db]"
              >
                Start Learning
              </Link>
              <Link
                href="/paths"
                className="border-2 border-gray-300 text-black px-8 py-3.5 font-semibold uppercase tracking-wide text-sm hover:bg-gray-100 transition"
              >
                Explore Paths
              </Link>
            </div>
          </div>

          <div className="border-l-2 border-gray-200 pl-6 lg:pl-10 flex flex-col gap-3">
            <blockquote className="text-2xl md:text-3xl font-serif italic leading-tight">
              “Build <span className="text-red-600 italic">real</span> things,<br /> not todo apps.”
            </blockquote>
            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <span className="flex-1 h-px bg-gray-200"></span>
              Nour Yahyaoui
            </div>
            <div className="flex gap-4 text-sm text-gray-500 mt-2">
              <span>✶ 100% free</span>
              <span>✶ No credit card</span>
            </div>
          </div>
        </section>

        {/* ============================================================
        STACK CARDS — INTERACTIVE TABS
        ============================================================ */}
        <section id="paths" className="py-12 md:py-16">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-gray-200 pb-3 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              The <span className="text-red-600">Full Stack</span>
            </h2>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{stackItems.length} technologies</span>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-6 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`pb-2 text-sm font-semibold uppercase tracking-wide transition whitespace-nowrap ${
                    activeCategory === cat.id
                      ? "border-b-2 border-red-600 text-red-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label} <span className="text-xs font-normal text-gray-400">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-200 p-3 md:p-4 text-center hover:border-red-600 hover:bg-gray-100 transition group"
              >
                <span className="text-2xl md:text-3xl block mb-1 text-gray-700 group-hover:text-red-600 transition">
                  {item.icon}
                </span>
                <h3 className="text-xs md:text-sm font-semibold tracking-tight">{item.name}</h3>
                <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6 text-xs text-gray-400">
            {currentItems.length} technologies in {categories.find(c => c.id === activeCategory)?.label}
          </div>
        </section>

        {/* ============================================================
        FEATURES
        ============================================================ */}
        <section id="features" className="py-12 md:py-16">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-gray-200 pb-3 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Why <span className="text-red-600">CodeForge?</span>
            </h2>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">core pillars</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-gray-50 border border-gray-200 p-5 md:p-6 hover:border-red-600 transition">
              <div className="text-3xl mb-2 text-red-500">⚡</div>
              <h4 className="text-lg font-bold tracking-tight">Real Projects</h4>
              <p className="text-sm text-gray-600 mt-1.5">Not todo apps. Build systems people actually use — portfolios, blogs, e‑commerce, POS, and more.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-5 md:p-6 hover:border-red-600 transition">
              <div className="text-3xl mb-2 text-purple-500">🧠</div>
              <h4 className="text-lg font-bold tracking-tight">Mentorship</h4>
              <p className="text-sm text-gray-600 mt-1.5">I review your code, guide architecture, and help you think like a senior engineer.</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-5 md:p-6 hover:border-red-600 transition">
              <div className="text-3xl mb-2 text-blue-500">🛡️</div>
              <h4 className="text-lg font-bold tracking-tight">Production Mindset</h4>
              <p className="text-sm text-gray-600 mt-1.5">Rate limiting, caching, security, and scalability — not just code that works.</p>
            </div>
          </div>
        </section>

        {/* ============================================================
        TESTIMONIALS
        ============================================================ */}
        <section id="testimonials" className="py-12 md:py-16">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-gray-200 pb-3 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Student <span className="text-red-600">Stories</span>
            </h2>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">real voices</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-200 p-5 md:p-6"
              >
                <div className="text-red-600 text-sm tracking-widest mb-2">
                  {"✦".repeat(item.stars)}
                </div>
                <blockquote className="font-serif text-base md:text-lg leading-relaxed">
                  “{item.quote}”
                </blockquote>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                  <div className="w-9 h-9 bg-gray-200 text-black font-bold flex items-center justify-center text-sm">
                    {item.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
        CTA
        ============================================================ */}
        <section className="border-t-2 border-b-2 border-gray-200 py-12 md:py-16 my-8 md:my-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                Ready to <span className="text-red-600 italic">build</span> your future?
              </h2>
              <p className="text-gray-600 text-base md:text-lg mt-2">
                Start learning today. Zero cost. Real projects. Real mentorship.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link
                href="#"
                className="bg-red-600 text-white px-8 py-3.5 font-bold uppercase tracking-wide text-sm hover:bg-red-700 transition"
              >
                Start Learning
              </Link>
              <Link
                href="#"
                className="border-2 border-gray-300 text-gray-600 px-8 py-3.5 font-semibold uppercase tracking-wide text-sm hover:bg-gray-100 transition"
              >
                Contact
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