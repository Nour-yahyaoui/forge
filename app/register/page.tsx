// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaEye, FaEyeSlash, FaGoogle, FaGithub, FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation checks
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  const isFormValid = name.trim() && email.trim() && isPasswordValid && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Please meet all password requirements");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans antialiased px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-6 md:py-8">
        <Navbar />

        <section className="py-12 md:py-16 max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="text-gray-500 mt-2">Start building real projects today</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm rounded-xl mb-4">
                <FaTimesCircle className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Social Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 font-medium rounded-xl hover:bg-gray-50 transition"
              >
                <FaGoogle className="text-red-500 text-lg" /> Sign up with Google
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 font-medium rounded-xl hover:bg-gray-50 transition"
              >
                <FaGithub className="text-gray-800 text-lg" /> Sign up with GitHub
              </button>
            </div>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400">or continue with email</span></div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-500 outline-none transition bg-gray-50 rounded-xl text-sm"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-500 outline-none transition bg-gray-50 rounded-xl text-sm"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 focus:border-red-500 outline-none transition bg-gray-50 rounded-xl text-sm"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-3 space-y-1.5 text-xs">
                <p className="text-gray-500 font-medium mb-1">Password must contain:</p>
                <div className="flex flex-wrap gap-3">
                  <span className={`flex items-center gap-1 ${hasMinLength ? "text-green-600" : "text-gray-400"}`}>
                    {hasMinLength ? <FaCheckCircle /> : <FaTimesCircle className="text-gray-300" />} 8+ characters
                  </span>
                  <span className={`flex items-center gap-1 ${hasUpperCase ? "text-green-600" : "text-gray-400"}`}>
                    {hasUpperCase ? <FaCheckCircle /> : <FaTimesCircle className="text-gray-300" />} Uppercase
                  </span>
                  <span className={`flex items-center gap-1 ${hasLowerCase ? "text-green-600" : "text-gray-400"}`}>
                    {hasLowerCase ? <FaCheckCircle /> : <FaTimesCircle className="text-gray-300" />} Lowercase
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumber ? "text-green-600" : "text-gray-400"}`}>
                    {hasNumber ? <FaCheckCircle /> : <FaTimesCircle className="text-gray-300" />} Number
                  </span>
                  <span className={`flex items-center gap-1 ${hasSpecialChar ? "text-green-600" : "text-gray-400"}`}>
                    {hasSpecialChar ? <FaCheckCircle /> : <FaTimesCircle className="text-gray-300" />} Special char
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 focus:border-red-500 outline-none transition bg-gray-50 rounded-xl text-sm"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirmPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                </button>
              </div>
              {confirmPassword && (
                <p className={`text-xs mt-1.5 flex items-center gap-1 ${passwordsMatch ? "text-green-600" : "text-red-500"}`}>
                  {passwordsMatch ? <FaCheckCircle /> : <FaTimesCircle />}
                  {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                </p>
              )}
            </div>

            {/* Strength Indicator */}
            {password && (
              <div className="mt-2 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">Password strength:</span>
                  <span className={`text-xs font-semibold ${
                    password.length === 0 ? "text-gray-400" :
                    isPasswordValid ? "text-green-600" :
                    hasMinLength || hasUpperCase || hasLowerCase ? "text-yellow-600" :
                    "text-red-500"
                  }`}>
                    {password.length === 0 ? "" :
                     isPasswordValid ? "Strong" :
                     hasMinLength || hasUpperCase || hasLowerCase ? "Medium" :
                     "Weak"}
                  </span>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition ${
                        password.length === 0 ? "bg-gray-200" :
                        i < 2 ? (isPasswordValid ? "bg-green-500" : hasMinLength || hasUpperCase || hasLowerCase ? "bg-yellow-500" : "bg-red-500") :
                        i < 3 ? (isPasswordValid ? "bg-green-500" : "bg-gray-200") :
                        isPasswordValid ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-red-600 text-white py-3 font-bold rounded-xl hover:bg-red-700 transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-red-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </section>

        <Footer />
      </div>
    </div>
  );
}