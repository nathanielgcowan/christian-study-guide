"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [tradition, setTradition] = useState("overview");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "forgot") {
        if (!email) {
          setMessage({
            type: "error",
            text: "Email is required",
          });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/account/update-password`,
        });
        if (error) throw error;
        setMessage({
          type: "success",
          text: "Password reset link sent! Check your email (including spam folder).",
        });
      } else if (mode === "signup") {
        if (!email || !password || !fullName) {
          setMessage({
            type: "error",
            text: "All fields are required",
          });
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setMessage({
            type: "error",
            text: "Passwords do not match",
          });
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setMessage({
            type: "error",
            text: "Password must be at least 6 characters",
          });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              tradition: tradition,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage({
          type: "success",
          text: "Check your email to confirm your account!",
        });
      } else {
        if (!email || !password) {
          setMessage({
            type: "error",
            text: "Email and password are required",
          });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ type: "success", text: "Signed in successfully!" });
        setTimeout(onClose, 1200);
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center p-4 pt-16 sm:pt-24"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
        style={{
          maxWidth: "28rem",
          width: "100%",
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === "signin" && "Welcome Back"}
              {mode === "signup" && "Create Your Account"}
              {mode === "forgot" && "Reset Your Password"}
            </h2>
            <p className="text-gray-600 text-sm">
              {mode === "signin" && "Sign in to continue your faith journey"}
              {mode === "signup" && "Join our community of Bible study"}
              {mode === "forgot" && "We'll send you a reset link"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            {(mode === "signin" || mode === "signup") && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {mode === "signup" && (
                  <p className="text-xs text-gray-500">
                    Must be at least 6 characters long
                  </p>
                )}
              </div>
            )}

            {/* Confirm Password for Signup */}
            {mode === "signup" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Full Name for Signup */}
            {mode === "signup" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Your full name"
                  />
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            )}

            {/* Tradition Selection for Signup */}
            {mode === "signup" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Theological Tradition
                </label>
                <select
                  value={tradition}
                  onChange={(e) => setTradition(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                >
                  <option value="overview">Broad Christian Overview</option>
                  <option value="protestant">Protestant</option>
                  <option value="baptist">Baptist</option>
                  <option value="reformed">Reformed</option>
                  <option value="non-denominational">Non-denominational</option>
                </select>
                <p className="text-xs text-gray-500">
                  This helps tailor the AI mentor and study tools to your
                  perspective.
                </p>
              </div>
            )}

            {/* Message */}
            {message && (
              <div
                className={`p-3 rounded-lg text-sm text-center ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {mode === "forgot"
                    ? "Send Reset Link"
                    : mode === "signin"
                      ? "Sign In"
                      : "Create Account"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center mt-6 space-y-3">
            {mode === "signin" && (
              <>
                <button
                  onClick={() => setMode("forgot")}
                  className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
                >
                  Forgot your password?
                </button>
                <div className="text-gray-500 text-sm">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setMode("signup")}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {mode === "signup" && (
              <div className="text-gray-500 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Sign in
                </button>
              </div>
            )}

            {mode === "forgot" && (
              <button
                onClick={() => setMode("signin")}
                className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
              >
                ← Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
