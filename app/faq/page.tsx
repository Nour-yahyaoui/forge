// app/faq/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  FaTwitter,
  FaGithub,
  FaDiscord,
  FaHeart,
  FaBook,
  FaBrain,
  FaChalkboardTeacher,
  FaLaptopCode,
  FaBullseye,
  FaUsers,
  FaLock,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

// ============================================================
// TYPES
// ============================================================
interface FaqCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  questions: FaqItem[];
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

// ============================================================
// DATA
// ============================================================
const faqData: FaqCategory[] = [
  {
    id: "general",
    label: "General",
    icon: <FaBook className="text-2xl" />,
    questions: [
      {
        id: 1,
        question: "What is CodeForge?",
        answer:
          "CodeForge is a free, project‑based learning platform where students learn full‑stack development by building real applications. It's led by Nour Yahyaoui, a full‑stack developer with 4+ years of experience.",
      },
      {
        id: 2,
        question: "Who is this platform for?",
        answer:
          "Absolute beginners, university students, career changers, or anyone who wants to learn full‑stack development through real projects. No prior experience is needed — we start from the very basics.",
      },
      {
        id: 3,
        question: "Is it really free?",
        answer:
          "Yes — 100% free for students. No credit card required, no hidden fees, no time limits. The platform is funded by mentorship and community support.",
      },
      {
        id: 4,
        question: "How is CodeForge different from other coding bootcamps?",
        answer:
          "We focus on building real projects from day one, with personalised code reviews and direct mentorship — not just video tutorials. You learn by building, not by watching.",
      },
      {
        id: 5,
        question: "Do I get a certificate at the end?",
        answer:
          "Yes — you'll receive a certificate of completion for each learning path, plus a portfolio of real projects you can show to employers.",
      },
    ],
  },
  {
    id: "curriculum",
    label: "Curriculum & Learning",
    icon: <FaBrain className="text-2xl" />,
    questions: [
      {
        id: 6,
        question: "What technologies will I learn?",
        answer:
          "A complete full‑stack curriculum: HTML, CSS, JavaScript, TypeScript, React, Next.js, React Native, Node.js, Express, Python, Django, PHP, SQL, PostgreSQL, Neon, AI integration, rate limiting, caching, and security.",
      },
      {
        id: 7,
        question: "How long does it take to complete?",
        answer:
          "It depends on your pace. Most students complete the core curriculum in 4‑6 months (studying 10‑15 hours per week). You can go faster or slower — it's self‑paced.",
      },
      {
        id: 8,
        question: "Do I need to know programming before joining?",
        answer:
          "Not at all. The platform is designed for absolute beginners — we start from HTML and CSS and gradually build up to advanced topics.",
      },
      {
        id: 9,
        question: "Can I choose which technologies to learn?",
        answer:
          "Yes — you can follow the full path or pick specific tracks that match your goals (e.g., frontend only, backend only, mobile).",
      },
      {
        id: 10,
        question: "Is there a fixed schedule?",
        answer:
          "No — everything is self‑paced. However, we hold weekly live Q&A sessions that you can attend at your convenience.",
      },
      {
        id: 11,
        question: "What kind of projects will I build?",
        answer:
          "Real applications: portfolio websites, blogs, e‑commerce stores, POS systems, mobile apps, AI‑powered tools, and more — all production‑ready.",
      },
      {
        id: 12,
        question: "Can I see examples of past student projects?",
        answer:
          "Yes — we have a showcase section where students share their finished projects. You can also browse our GitHub organisation to see real code.",
      },
    ],
  },
  {
    id: "mentorship",
    label: "Mentorship & Support",
    icon: <FaChalkboardTeacher className="text-2xl" />,
    questions: [
      {
        id: 13,
        question: "How does mentorship work?",
        answer:
          "I review your code, provide detailed feedback on your projects, help with architecture decisions, and answer questions during weekly Q&A sessions.",
      },
      {
        id: 14,
        question: "How often do you review code?",
        answer:
          "Every student gets code reviews on all major projects. The turnaround is usually 24‑48 hours, depending on the volume.",
      },
      {
        id: 15,
        question: "Can I ask questions outside of Q&A sessions?",
        answer:
          "Yes — you can ask questions anytime in our Discord community. I'm also available for direct messages for urgent issues.",
      },
      {
        id: 16,
        question: "Do you offer 1‑on‑1 sessions?",
        answer:
          "Yes — for students who need extra help, I offer limited 1‑on‑1 mentoring sessions. Priority is given to active students.",
      },
      {
        id: 17,
        question: "What if I get stuck on a project?",
        answer:
          "You'll have access to community support, detailed documentation, and you can always reach out to me directly. We'll work through it together.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    icon: <FaLaptopCode className="text-2xl" />,
    questions: [
      {
        id: 18,
        question: "What tools do I need to get started?",
        answer:
          "A computer (Windows, macOS, or Linux), a code editor (VS Code recommended), and an internet connection. Everything else is free and open source.",
      },
      {
        id: 19,
        question: "Do I need to install anything?",
        answer:
          "Yes — but we provide step‑by‑step setup guides for Node.js, Python, PostgreSQL, and all the tools you'll need. It's beginner‑friendly.",
      },
      {
        id: 20,
        question: "Can I use CodeForge on my phone?",
        answer:
          "The platform is web‑based and works on mobile browsers, but for coding, we highly recommend using a computer with a proper keyboard and screen.",
      },
      {
        id: 21,
        question: "Do you provide hosting for student projects?",
        answer:
          "Yes — we help you deploy your projects on Vercel, Railway, or Neon (all have generous free tiers). You'll have a live URL to share.",
      },
      {
        id: 22,
        question: "What if I don't have a GitHub account?",
        answer:
          "We'll help you set one up — it's free and essential for version control, collaboration, and building your portfolio.",
      },
    ],
  },
  {
    id: "career",
    label: "Career & Outcomes",
    icon: <FaBullseye className="text-2xl" />,
    questions: [
      {
        id: 23,
        question: "Will this help me get a job?",
        answer:
          "Yes. You'll graduate with a strong portfolio of real projects, GitHub contributions, and team experience — everything employers look for.",
      },
      {
        id: 24,
        question: "Do you help with job applications?",
        answer:
          "Yes — we offer CV reviews, portfolio feedback, interview preparation, and job search strategies. I also share job opportunities when I hear about them.",
      },
      {
        id: 25,
        question: "What kind of jobs can I apply for after completing?",
        answer:
          "Junior full‑stack developer, frontend developer, backend developer, mobile developer, or software engineer — depending on your chosen path.",
      },
      {
        id: 26,
        question: "How many students have gotten jobs?",
        answer:
          "100% of our active students who completed the full path have landed developer roles or internships within 3 months of finishing.",
      },
    ],
  },
  {
    id: "community",
    label: "Community",
    icon: <FaUsers className="text-2xl" />,
    questions: [
      {
        id: 27,
        question: "Is there a community?",
        answer:
          "Yes — we have an active Discord server where students help each other, share projects, ask questions, and celebrate wins together.",
      },
      {
        id: 28,
        question: "Can I collaborate with other students?",
        answer:
          "Yes — we encourage pair programming, group projects, and code reviews between peers. It's a great way to learn and build connections.",
      },
      {
        id: 29,
        question: "Are there live events?",
        answer:
          "Weekly Q&A sessions, occasional hackathons, coding challenges, and guest talks from industry professionals.",
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy & Security",
    icon: <FaLock className="text-2xl" />,
    questions: [
      {
        id: 30,
        question: "Is my data safe?",
        answer:
          "Yes — we follow industry best practices for data protection. Your personal information is never shared with third parties.",
      },
      {
        id: 31,
        question: "Do you store my code?",
        answer:
          "Your code is stored securely on GitHub (which you control) and on our platform for review purposes. You own all your code.",
      },
      {
        id: 32,
        question: "Can I delete my account and data?",
        answer:
          "Yes — you can request account deletion at any time. All your data will be permanently removed from our systems within 30 days.",
      },
    ],
  },
];

// ============================================================
// COMPONENT
// ============================================================
export default function FAQPage() {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>("general");
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);

  const toggleCategory = (id: string) => {
    setOpenCategoryId(openCategoryId === id ? null : id);
  };

  const toggleQuestion = (id: number) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  const totalQuestions = faqData.reduce((acc, cat) => acc + cat.questions.length, 0);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-6 md:py-8">

        {/* NAVBAR */}
        <Navbar activePage="faq" />

        {/* HERO */}
        <section className="py-12 md:py-16 border-b-2 border-gray-200">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 inline-block">
              Frequently Asked Questions
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-4">
              Got questions? <br />
              <span className="text-red-600">We've got answers.</span>
            </h1>
            <p className="text-lg text-gray-600 mt-4 max-w-lg">
              Everything you need to know about CodeForge — from how it works to what you'll learn.
            </p>
            <div className="flex gap-6 mt-4 text-sm text-gray-500">
              <span>{faqData.length} categories</span>
              <span>·</span>
              <span>{totalQuestions} questions</span>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-8 md:py-12">
          <div className="space-y-4">
            {faqData.map((category) => {
              const isOpen = openCategoryId === category.id;
              const openCount = category.questions.filter(q => openQuestionId === q.id).length;

              return (
                <div
                  key={category.id}
                  className="border border-gray-200 bg-gray-50/30"
                >
                  {/* Category Header */}
                  <button
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-100/50 transition"
                    onClick={() => toggleCategory(category.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-700">{category.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold tracking-tight">{category.label}</h3>
                        <span className="text-xs text-gray-400">
                          {category.questions.length} questions
                          {openCount > 0 && ` · ${openCount} open`}
                        </span>
                      </div>
                    </div>
                    <span className="text-2xl text-red-600">
                      {isOpen ? <FaMinus /> : <FaPlus />}
                    </span>
                  </button>

                  {/* Category Content */}
                  {isOpen && (
                    <div className="border-t border-gray-200 divide-y divide-gray-200">
                      {category.questions.map((item) => {
                        const isQuestionOpen = openQuestionId === item.id;

                        return (
                          <div key={item.id} className="bg-white">
                            <button
                              className="w-full flex justify-between items-center p-4 md:p-5 text-left hover:bg-gray-50 transition"
                              onClick={() => toggleQuestion(item.id)}
                              aria-expanded={isQuestionOpen}
                            >
                              <span className="font-semibold text-sm md:text-base pr-4">
                                {item.question}
                              </span>
                              <span className="text-red-600 text-xl flex-shrink-0 ml-4">
                                {isQuestionOpen ? <FaMinus /> : <FaPlus />}
                              </span>
                            </button>

                            {isQuestionOpen && (
                              <div className="px-4 md:px-5 pb-5 text-gray-600 text-sm md:text-base leading-relaxed">
                                {item.answer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* STILL HAVE QUESTIONS? */}
        <section className="border-t-2 border-b-2 border-gray-200 py-12 md:py-16 my-8">
          <div className="text-center max-w-2xl mx-auto">
            <FaChalkboardTeacher className="text-5xl mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Still have questions?
            </h2>
            <p className="text-gray-600 mt-3">
              Can't find what you're looking for? Reach out directly — I'm happy to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <Link
                href="#"
                className="bg-red-600 text-white px-8 py-3 font-bold uppercase tracking-wide text-sm hover:bg-red-700 transition"
              >
                Contact Me
              </Link>
              <Link
                href="/"
                className="border-2 border-gray-300 text-gray-600 px-8 py-3 font-semibold uppercase tracking-wide text-sm hover:bg-gray-100 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
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