// app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    setError(`${provider} registration coming soon!`);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-6 md:py-8">
        <Navbar />

        <section className="py-12 md:py-16 max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="text-gray-600 mt-2">Start building real projects today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button type="button" onClick={() => handleSocialRegister("Google")} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3 font-semibold hover:bg-gray-50 transition">
                <FaGoogle className="text-red-500 text-lg" /> Sign up with Google
              </button>
              <button type="button" onClick={() => handleSocialRegister("GitHub")} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3 font-semibold hover:bg-gray-50 transition">
                <FaGithub className="text-gray-800 text-lg" /> Sign up with GitHub
              </button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">or continue with email</span></div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition bg-gray-50" placeholder="Your name" minLength={2} />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition bg-gray-50" placeholder="you@example.com" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition bg-gray-50" placeholder="Min 8 characters" minLength={8} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition bg-gray-50" placeholder="Confirm your password" minLength={8} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 font-bold uppercase tracking-wide hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Already have an account? <Link href="/login" className="text-red-600 font-semibold hover:underline">Log in</Link>
          </p>
        </section>

        <Footer />
      </div>
    </div>
  );
}