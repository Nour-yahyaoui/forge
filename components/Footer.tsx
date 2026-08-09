// components/FooterSimple.tsx
import Link from "next/link";
import { FaHeart } from "react-icons/fa";

export default function FooterSimple() {
  return (
    <footer className="border-t border-gray-200 pt-6 mt-4 text-center text-xs text-gray-400">
      <span>&copy; {new Date().getFullYear()} CodeForge. Built with </span>
      <FaHeart className="inline-block text-red-600 mx-1" />
      <span> by Nour Yahyaoui.</span>
    </footer>
  );
}