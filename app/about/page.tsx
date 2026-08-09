// app/about/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import {
  FaTwitter,
  FaGithub,
  FaDiscord,
  FaHeart,
  FaCode,
  FaLaptopCode,
  FaUsers,
  FaRocket,
  FaBriefcase,
  FaGraduationCap,
  FaCalendarAlt,
  FaLightbulb,
  FaQuoteLeft,
} from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-6 md:py-8">

        {/* ============================================================
        NAVBAR
        ============================================================ */}
        <Navbar activePage="about" />

        {/* ============================================================
        HERO
        ============================================================ */}
        <section className="py-12 md:py-16 border-b-2 border-gray-200">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 inline-block">
              About CodeForge
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-4">
              Built by a developer, <br />
              <span className="text-red-600">for students.</span>
            </h1>
            <p className="text-lg text-gray-600 mt-4 max-w-lg">
              CodeForge was created to bridge the gap between academic knowledge and real‑world engineering — by someone who's been where you are.
            </p>
          </div>
        </section>

        {/* ============================================================
        STORY
        ============================================================ */}
        <section className="py-12 md:py-16 border-b-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold tracking-tight mb-4">
                My name is <span className="text-red-600">Nour Yahyaoui</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  I'm a <strong>19‑year‑old full‑stack developer</strong> from Tunisia with over <strong>4 years of experience</strong> and <strong>40+ projects</strong> shipped — ranging from frontend websites to enterprise‑level POS systems and mobile applications.
                </p>
                <p>
                  I started CodeForge because I've seen too many students graduate with degrees but without the <strong>practical skills</strong> needed to build real software. University taught me theory. Building real projects taught me engineering.
                </p>
                <p>
                  This platform is my way of giving back — a free, project‑based learning environment where students build <strong>real applications</strong>, get <strong>honest code reviews</strong>, and learn to think like engineers, not just coders.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6 h-fit">
              <div className="mb-4 border-2 border-gray-200 overflow-hidden">
                <Image
                  src="/port.png"
                  alt="Nour Yahyaoui"
                  width={400}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              <div className="text-xl font-bold">Nour Yahyaoui</div>
              <div className="text-sm text-gray-500">Full‑Stack Developer · Mentor</div>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2"><FaCalendarAlt className="text-red-600" /> 4+ years experience</div>
                <div className="flex items-center gap-2"><FaCode className="text-red-600" /> 40+ projects shipped</div>
                <div className="flex items-center gap-2"><FaGraduationCap className="text-red-600" /> 19 years old</div>
                <div className="flex items-center gap-2"><FaBriefcase className="text-red-600" /> Full‑stack · Mobile</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
        MISSION & VALUES
        ============================================================ */}
        <section className="py-12 md:py-16 border-b-2 border-gray-200">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            What <span className="text-red-600">drives</span> this platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 border border-gray-200 p-6">
              <FaRocket className="text-3xl text-red-600 mb-3" />
              <h3 className="text-lg font-bold tracking-tight">Real Projects</h3>
              <p className="text-sm text-gray-600 mt-2">
                No todo apps. You build systems people actually use — e‑commerce, POS, marketplaces, and AI‑powered tools.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6">
              <FaLightbulb className="text-3xl text-red-600 mb-3" />
              <h3 className="text-lg font-bold tracking-tight">Mentorship</h3>
              <p className="text-sm text-gray-600 mt-2">
                I review your code, guide architecture decisions, and help you think like a senior engineer.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6">
              <FaUsers className="text-3xl text-red-600 mb-3" />
              <h3 className="text-lg font-bold tracking-tight">Community</h3>
              <p className="text-sm text-gray-600 mt-2">
                Learn with peers, collaborate on projects, and grow together in a supportive environment.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================
        STATS
        ============================================================ */}
        <section className="py-12 md:py-16 border-b-2 border-gray-200">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            The <span className="text-red-600">impact</span> so far
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 border border-gray-200 bg-gray-50">
              <div className="text-3xl font-bold text-red-600">40+</div>
              <div className="text-sm text-gray-500 mt-1">Projects Built</div>
            </div>
            <div className="text-center p-6 border border-gray-200 bg-gray-50">
              <div className="text-3xl font-bold text-red-600">120+</div>
              <div className="text-sm text-gray-500 mt-1">Students</div>
            </div>
            <div className="text-center p-6 border border-gray-200 bg-gray-50">
              <div className="text-3xl font-bold text-red-600">100%</div>
              <div className="text-sm text-gray-500 mt-1">Success Rate</div>
            </div>
            <div className="text-center p-6 border border-gray-200 bg-gray-50">
              <div className="text-3xl font-bold text-red-600">4</div>
              <div className="text-sm text-gray-500 mt-1">Years Experience</div>
            </div>
          </div>
        </section>

        {/* ============================================================
        TESTIMONIAL
        ============================================================ */}
        <section className="py-12 md:py-16">
          <div className="bg-gray-50 border border-gray-200 p-8 md:p-12">
            <FaQuoteLeft className="text-4xl text-red-600 mb-4" />
            <blockquote className="text-xl md:text-2xl font-serif italic leading-relaxed">
              “The goal isn't just to teach you to code — it's to teach you to <span className="text-red-600">think</span> like an engineer, to <span className="text-red-600">ship</span> like a professional, and to <span className="text-red-600">build</span> things that matter.”
            </blockquote>
            <div className="mt-4 text-sm text-gray-500">— Nour Yahyaoui</div>
          </div>
        </section>

        {/* ============================================================
        CTA
        ============================================================ */}
        <section className="border-t-2 border-b-2 border-gray-200 py-12 md:py-16 my-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Ready to <span className="text-red-600">build</span> your future?
              </h2>
              <p className="text-gray-600 mt-2">
                Join a community of students learning by building real projects.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link href="#" className="bg-red-600 text-white px-8 py-3 font-bold uppercase tracking-wide text-sm hover:bg-red-700 transition">
                Join Free
              </Link>
              <Link href="/paths" className="border-2 border-gray-300 text-gray-600 px-8 py-3 font-semibold uppercase tracking-wide text-sm hover:bg-gray-100 transition">
                View Paths
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