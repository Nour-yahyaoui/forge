// app/faq/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaPlus, FaMinus } from "react-icons/fa";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    id: 1,
    question: "What is CodeForge?",
    answer: "CodeForge is a free, project‑based learning platform where students learn full‑stack development by building real applications. It's led by Nour Yahyaoui, a full‑stack developer with 4+ years of experience.",
  },
  {
    id: 2,
    question: "Who is this platform for?",
    answer: "Absolute beginners, university students, career changers, or anyone who wants to learn full‑stack development through real projects. No prior experience is needed.",
  },
  {
    id: 3,
    question: "Is it really free?",
    answer: "Yes — 100% free for students. No credit card required, no hidden fees, no time limits.",
  },
  {
    id: 4,
    question: "What technologies will I learn?",
    answer: "HTML, CSS, JavaScript, TypeScript, React, Next.js, React Native, Node.js, Express, Python, Django, PHP, SQL, PostgreSQL, Neon, AI integration, rate limiting, caching, and security.",
  },
  {
    id: 5,
    question: "How does mentorship work?",
    answer: "I review your code, provide detailed feedback on your projects, help with architecture decisions, and answer questions during weekly Q&A sessions.",
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-6 md:py-8">
        <Navbar activePage="faq" />

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
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="space-y-4">
            {faqItems.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className="border border-gray-200 bg-gray-50/30">
                  <button
                    className="w-full flex justify-between items-center p-4 md:p-5 text-left hover:bg-gray-100/50 transition"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                  >
                    <span className="font-semibold text-base md:text-lg">{item.question}</span>
                    <span className="text-red-600 text-xl flex-shrink-0 ml-4">
                      {isOpen ? <FaMinus /> : <FaPlus />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 md:px-5 pb-5 text-gray-600 text-sm md:text-base leading-relaxed border-t border-gray-200 pt-4">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}