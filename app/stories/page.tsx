// app/stories/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaStar, FaArrowRight, FaGraduationCap, FaCalendarAlt } from "react-icons/fa";
import { FiX } from "react-icons/fi";

interface Story {
  id: number;
  name: string;
  role: string;
  quote: string;
  fullStory: string;
  initials: string;
  stars: number;
  before: string;
  after: string;
  path: string;
  image: string;
  date: string;
}

const stories: Story[] = [
  {
    id: 1,
    name: "Ahmed Ben Ali",
    role: "Now full‑stack developer",
    quote: "I went from knowing nothing to building a full‑stack app in 8 weeks. The mentorship was incredible.",
    fullStory: "Before joining CodeForge, I was a business student who had never written a line of code...",
    initials: "AB",
    stars: 5,
    before: "Business student, zero coding experience",
    after: "Full‑stack developer at a startup",
    path: "Full‑Stack Path",
    image: "/ahmed.jpg",
    date: "March 2025",
  },
  {
    id: 2,
    name: "Sara Mansour",
    role: "Now junior developer",
    quote: "The platform is structured so well. Every project taught me something real. I landed a job before graduation.",
    fullStory: "I was a computer science student, but university only taught me theory...",
    initials: "SM",
    stars: 5,
    before: "CS student, no practical experience",
    after: "Junior developer at a fintech company",
    path: "Full‑Stack Path",
    image: "/sara.jpg",
    date: "February 2025",
  },
  {
    id: 3,
    name: "Youssef Feki",
    role: "Now mobile developer",
    quote: "Nour's guidance on architecture and code quality changed how I think about development. Forever grateful.",
    fullStory: "I had some experience with web development, but I wanted to break into mobile...",
    initials: "YF",
    stars: 5,
    before: "Web developer, no mobile experience",
    after: "Mobile developer at a startup",
    path: "Mobile Path (React Native)",
    image: "/youssef.jpg",
    date: "January 2025",
  },
];

export default function StoriesPage() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-6 md:py-8">
        <Navbar activePage="stories" />

        <section className="py-12 md:py-16 border-b-2 border-gray-200">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 inline-block">
              Student Success Stories
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-4">
              Real students, <br />
              <span className="text-red-600">real results.</span>
            </h1>
            <p className="text-lg text-gray-600 mt-4 max-w-lg">
              Hear from students who went from zero to job‑ready through CodeForge's project‑based learning and mentorship.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div key={story.id} className="bg-gray-50 border border-gray-200 p-6 hover:border-red-600 transition cursor-pointer" onClick={() => setSelectedStory(story)}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full border-2 border-gray-200 overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image src={story.image} alt={story.name} width={56} height={56} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold">{story.name}</div>
                    <div className="text-sm text-gray-500">{story.role}</div>
                  </div>
                </div>
                <div className="flex text-red-600 text-sm mb-3">
                  {[...Array(story.stars)].map((_, i) => (<FaStar key={i} />))}
                </div>
                <blockquote className="font-serif text-lg leading-relaxed">“{story.quote}”</blockquote>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1"><FaGraduationCap className="text-red-600" /> {story.path}</span>
                  <span className="text-red-600 font-semibold flex items-center gap-1">Read more <FaArrowRight className="text-xs" /></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modal */}
        {selectedStory && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedStory(null)}>
            <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 md:p-10 relative" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setSelectedStory(null)}>
                <FiX />
              </button>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full border-2 border-gray-200 overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image src={selectedStory.image} alt={selectedStory.name} width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-xl font-bold">{selectedStory.name}</div>
                  <div className="text-sm text-gray-500">{selectedStory.role}</div>
                  <div className="flex text-red-600 text-sm mt-1">
                    {[...Array(selectedStory.stars)].map((_, i) => (<FaStar key={i} />))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                <div className="bg-gray-50 border border-gray-200 p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Before</div>
                  <div className="font-semibold">{selectedStory.before}</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">After</div>
                  <div className="font-semibold text-red-600">{selectedStory.after}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><FaGraduationCap className="text-red-600" /> {selectedStory.path}</span>
                <span className="flex items-center gap-1"><FaCalendarAlt className="text-red-600" /> {selectedStory.date}</span>
              </div>
              <blockquote className="font-serif text-xl italic leading-relaxed mb-4">“{selectedStory.quote}”</blockquote>
              <p className="text-gray-600 leading-relaxed">{selectedStory.fullStory}</p>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link href="#" className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 font-bold uppercase tracking-wide text-sm hover:bg-red-700 transition">
                  Join CodeForge <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}