
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setMessage(error.message || "লগইন করা যায়নি। আবার চেষ্টা করো।");
        return;
      }

      window.location.href = "/";
    } catch {
      setMessage("সমস্যা হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider: "google" | "github") {
    setMessage("");
    setSocialLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        setMessage(
          error.message || `${provider} দিয়ে লগইন করা যায়নি।`
        );
      }
    } catch {
      setMessage("সোশ্যাল লগইনে সমস্যা হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setSocialLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F1F6F1] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <Link
          href="/"
          className="text-sm text-[#05893E] hover:underline"
        >
          ← হোম পেজে ফিরে যাও
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-[#1D271F]">
          লগইন করো
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          বাজারদরের সব সুবিধা পেতে তোমার অ্যাকাউন্টে প্রবেশ করো।
        </p>

        <form onSubmit={handleSignIn} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium"
            >
              ইমেইল
            </label>

            <input
              id="email"
              type="email"
              autoComplete="off"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="তোমার ইমেইল"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#05893E]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              type="password"
              autoComplete="off"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="তোমার পাসওয়ার্ড"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#05893E]"
            />
          </div>

          {message && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || socialLoading}
            className="w-full rounded-lg bg-[#05893E] px-4 py-3 font-semibold text-white transition hover:bg-[#047533] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "লগইন হচ্ছে..." : "লগইন"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-500">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="space-y-3">
          <button
            type="button"
            disabled={loading || socialLoading}
            onClick={() => handleSocialSignIn("google")}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {socialLoading ? "অপেক্ষা করো..." : "Google দিয়ে লগইন"}
          </button>

          <button
            type="button"
            disabled={loading || socialLoading}
            onClick={() => handleSocialSignIn("github")}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {socialLoading ? "অপেক্ষা করো..." : "GitHub দিয়ে লগইন"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#05893E] hover:underline"
          >
            রেজিস্টার করো
          </Link>
        </p>
      </div>
    </main>
  );
}
