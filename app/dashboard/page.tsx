// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { FaHeart, FaSignOutAlt, FaUser, FaCalendarAlt, FaCode, FaRocket } from "react-icons/fa";

interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setUser(data.data.user);
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black font-sans antialiased px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-6 md:py-8">
          <Navbar />
          <div className="py-20 text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-6 md:py-8">

        <Navbar />

        <section className="py-8 md:py-12">
          <div className="bg-gray-50 border border-gray-200 p-6 md:p-8">
            {/* User Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-600 text-white flex items-center justify-center text-2xl font-bold rounded-full">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Welcome, {user.name}!</h1>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                  <FaCalendarAlt className="text-red-600" /> Joined {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 p-4 bg-white">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaCode className="text-red-600" /> Progress
                </div>
                <div className="font-semibold text-xl mt-1">0%</div>
                <div className="w-full h-1.5 bg-gray-200 mt-2 rounded-full overflow-hidden">
                  <div className="w-0 h-full bg-red-600 rounded-full"></div>
                </div>
              </div>
              <div className="border border-gray-200 p-4 bg-white">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaRocket className="text-red-600" /> Projects
                </div>
                <div className="font-semibold text-xl mt-1">0</div>
                <p className="text-xs text-gray-400 mt-1">Start your first project</p>
              </div>
              <div className="border border-gray-200 p-4 bg-white">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaUser className="text-red-600" /> Account
                </div>
                <div className="font-semibold text-xl mt-1">Active</div>
                <p className="text-xs text-gray-400 mt-1">Email verified</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/paths"
                className="bg-red-600 text-white px-6 py-2 font-semibold hover:bg-red-700 transition"
              >
                Browse Paths
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 border-2 border-gray-300 text-gray-600 px-6 py-2 font-semibold hover:bg-gray-100 transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </section>

        <div className="border-t border-gray-200 pt-6 mt-4 text-center text-xs text-gray-400">
          <span>&copy; {new Date().getFullYear()} CodeForge. Built with </span>
          <FaHeart className="inline-block text-red-600 mx-1" />
          <span> by Nour Yahyaoui.</span>
        </div>

      </div>
    </div>
  );
}