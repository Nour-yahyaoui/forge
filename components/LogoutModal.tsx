// components/LogoutModal.tsx
"use client";

import { FaSignOutAlt, FaSpinner } from "react-icons/fa";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoggingOut: boolean;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  isLoggingOut,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
        {/* Content */}
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSignOutAlt className="text-2xl text-red-600" />
          </div>

          <h2 className="text-xl font-bold text-gray-900">Logout</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Are you sure you want to logout? You'll need to log in again to access your dashboard.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={isLoggingOut}
              className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoggingOut}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoggingOut ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Logging out...
                </>
              ) : (
                "Yes, Logout"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}