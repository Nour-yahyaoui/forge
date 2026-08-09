// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import LogoutModal from "./LogoutModal";

interface User {
  id: number;
  email: string;
  name: string;
}

interface NavbarProps {
  activePage?: "home" | "paths" | "about" | "stories" | "faq";
}

export default function Navbar({ activePage = "home" }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const cachedUser = sessionStorage.getItem("codeforge_user");

    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          const userData = data.data.user;
          setUser(userData);
          sessionStorage.setItem("codeforge_user", JSON.stringify(userData));
        } else {
          setUser(null);
          sessionStorage.removeItem("codeforge_user");
        }
      } catch {
        setUser(null);
        sessionStorage.removeItem("codeforge_user");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const res = await fetch("/api/auth", {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null);
        sessionStorage.removeItem("codeforge_user");
        setShowLogoutModal(false);
        router.push("/");
        router.refresh();
      } else {
        // Still clear local state
        setUser(null);
        sessionStorage.removeItem("codeforge_user");
        setShowLogoutModal(false);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      sessionStorage.removeItem("codeforge_user");
      setShowLogoutModal(false);
      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { href: "/paths", label: "Paths", key: "paths" },
    { href: "/about", label: "About", key: "about" },
    { href: "/stories", label: "Stories", key: "stories" },
    { href: "/faq", label: "FAQ", key: "faq" },
  ];

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

          {!isLoading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="hover:text-red-600 transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="flex items-center gap-1.5 text-red-600 hover:text-red-700 transition font-semibold"
                  >
                    <FiLogOut className="text-sm" />
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

          {!isLoading && (
            <>
              {user ? (
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
                      setShowLogoutModal(true);
                    }}
                    className="flex items-center gap-1.5 text-red-600 hover:text-red-700 transition py-1 text-left"
                  >
                    <FiLogOut className="text-sm" />
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
            </>
          )}
        </div>
      )}

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => !isLoggingOut && setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
}