"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthClient } from "@/lib/auth";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { signUp } = useAuthClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { data, error } = await signUp(email, password, fullName);

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "Signup successful! Please check your email for a confirmation link (if enabled).",
      );
      // Optionally redirect after a short delay or if email confirmation is off
      if (data?.user && data?.session) {
        // If session is returned, email confirmation is likely off
        router.push("/account");
      } else {
        // If no session, email confirmation is likely on, user needs to verify email
        // You might want to redirect to a "check your email" page
        router.push("/auth/check-email");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="full_name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        {message && (
          <p className="text-green-500 text-xs italic mb-4">{message}</p>
        )}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
