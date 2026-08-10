// app/dashboard/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  FaSignOutAlt,
  FaUser,
  FaHome,
  FaProjectDiagram,
  FaUsers,
  FaBlog,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import LogoutModal from "@/components/LogoutModal";

interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth", { credentials: "include" });
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
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth", { method: "DELETE", credentials: "include" });
      sessionStorage.removeItem("codeforge_user");
      setShowLogoutModal(false);
      router.push("/");
      router.refresh();
    } catch {
      sessionStorage.removeItem("codeforge_user");
      setShowLogoutModal(false);
      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { href: "/dashboard/projects", label: "Projects", icon: <FaProjectDiagram /> },
    { href: "/dashboard/students", label: "Students", icon: <FaUsers /> },
    { href: "/dashboard/blogs", label: "Blogs", icon: <FaBlog /> },
    { href: "/dashboard/settings", label: "Settings", icon: <FaCog /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50 flex justify-around items-center">
        {menuItems.slice(0, 4).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 min-h-[44px] min-w-[44px] rounded-lg ${
              isActive(item.href) ? "text-red-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 min-h-[44px] min-w-[44px] rounded-lg text-gray-500 hover:text-gray-700"
        >
          <FaBars className="text-lg" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>

      {/* Mobile drawer */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 md:hidden max-h-[80vh] overflow-y-auto p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center text-sm font-bold rounded-full">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FaTimes className="text-xl text-gray-500" />
              </button>
            </div>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition min-h-[48px] ${
                    isActive(item.href) ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => { setIsSidebarOpen(false); setShowLogoutModal(true); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition min-h-[48px]"
              >
                <FaSignOutAlt className="text-lg" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:min-h-screen md:bg-white md:border-r md:border-gray-200 md:fixed md:inset-y-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Code<span className="text-red-600">Forge</span>
            </Link>
          </div>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center text-sm font-bold rounded-full">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition min-h-[44px] ${
                  isActive(item.href) ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition min-h-[44px]"
            >
              <FaSignOutAlt className="text-lg" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden">
          <button
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg min-h-[44px] min-w-[44px]"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars className="text-xl text-gray-500" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:inline">{user.email}</span>
            <div className="w-8 h-8 bg-red-600 text-white flex items-center justify-center text-xs font-bold rounded-full">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </main>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => !isLoggingOut && setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </div>
  );
}