"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthGate } from "@/context/AuthGateContext";

export default function AuthGateModal() {
  const { isOpen, closeAuthGate } = useAuthGate();
  const router = useRouter();

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuthGate();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, closeAuthGate]);

  if (!isOpen) return null;

  const goToLogin = () => {
    closeAuthGate();
    router.push("/auth/signin");
  };

  const goToSignup = () => {
    closeAuthGate();
    router.push("/auth/signup");
  };

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.65)" }}
        onClick={closeAuthGate}
      >
        {/* ── Modal Card ── */}
        <div
          className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-authgate-in"
          style={{
            background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative gradient top strip */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{ background: "linear-gradient(90deg, #f97316, #ec4899, #8b5cf6)" }}
          />

          {/* Close button */}
          <button
            onClick={closeAuthGate}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8 pt-9">
            {/* Logo */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}>
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Join CreatorCMS</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sign in to unlock the full experience — write, engage, and connect with creators.
              </p>
            </div>

            {/* Feature list */}
            <ul className="space-y-3 mb-8">
              {[
                { icon: "❤️", text: "Like and save your favourite blogs" },
                { icon: "💬", text: "Join conversations with comments" },
                { icon: "✍️", text: "Publish your own stories" },
                { icon: "🤝", text: "Follow creators and build your feed" },
              ].map((f) => (
                <li key={f.text} className="flex items-center space-x-3">
                  <span className="text-base flex-shrink-0">{f.icon}</span>
                  <span className="text-gray-300 text-sm">{f.text}</span>
                </li>
              ))}
            </ul>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={goToSignup}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}
              >
                Create Free Account
              </button>

              <button
                onClick={goToLogin}
                className="w-full py-3 rounded-xl font-semibold text-sm text-gray-200 transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
                style={{ border: "1px solid rgba(255,255,255,0.15)" }}
              >
                Sign In
              </button>
            </div>

            {/* Footer note */}
            <p className="text-center text-gray-600 text-xs mt-5">
              By joining, you agree to our{" "}
              <span className="text-orange-500 cursor-pointer hover:underline">Terms of Service</span>
              {" "}and{" "}
              <span className="text-orange-500 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes authgate-in {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-authgate-in {
          animation: authgate-in 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
      `}</style>
    </>
  );
}
