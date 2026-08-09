// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

interface NavbarProps {
  activePage?: "home" | "paths" | "about" | "stories" | "faq";
}

export default function Navbar({ activePage = "home" }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const navLinks = [
    { href: "/paths", label: "Paths", key: "paths" },
    { href: "/about", label: "About", key: "about" },
    { href: "/stories", label: "Stories", key: "stories" },
    { href: "/faq", label: "FAQ", key: "faq" },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Desktop Nav */}
      <nav className="flex justify-between items-center py-4 border-b-2 border-gray-200 flex-wrap gap-3">
        <Link href="/" className="text-2xl md:text-3xl font-bold tracking-tight">
          Code<span className="text-red-600">Forge</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold uppercase tracking-wide text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`hover:text-red-600 transition ${
                activePage === link.key ? "text-red-600" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          {loading ? (
            <span className="text-gray-400">Loading...</span>
          ) : isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-red-600 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-red-600 transition"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-2xl text-gray-700 hover:text-red-600 transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 border-b border-gray-200 py-4 px-2 flex flex-col gap-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`hover:text-red-600 transition py-1 ${
                activePage === link.key ? "text-red-600" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {loading ? (
            <span className="text-gray-400 py-1">Loading...</span>
          ) : isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-red-600 transition py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="text-red-600 hover:text-red-700 transition py-1 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-red-600 transition py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-red-600 text-white px-4 py-2 text-center hover:bg-red-700 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}