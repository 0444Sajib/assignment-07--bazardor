"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }

    if (session?.user?.name) {
      setName((currentName) => currentName || session.user.name);
    }
  }, [isPending, session, router]);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setIsError(true);
      setMessage("আপনার নাম লিখুন।");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        setIsError(true);
        setMessage(
          result.error.message || "নাম আপডেট করা যায়নি। আবার চেষ্টা করুন।"
        );
        return;
      }

      setIsError(false);
      setMessage("আপনার নাম সফলভাবে আপডেট হয়েছে!");

      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch {
      setIsError(true);
      setMessage("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F1F6F1]">
        <span className="loading loading-spinner loading-lg text-[#05893E]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F1F6F1] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1D271F]">
            আমার প্রোফাইল
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* Profile summary */}
        <div className="mb-5 flex flex-col gap-4 rounded-xl border border-[#E3EBE4] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#E5F3E9] text-2xl font-semibold text-[#05893E]">
              {session.user.name?.charAt(0)?.toUpperCase() || "👤"}
            </div>

            <div className="min-w-0">
              <h2 className="truncate font-semibold text-[#1D271F]">
                {session.user.name}
              </h2>

              <p className="truncate text-sm text-gray-500">
                {session.user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              document.getElementById("update-name")?.focus()
            }
            className="shrink-0 self-start rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:self-center"
          >
            ♧ তথ্য আপডেট
          </button>
        </div>

        {/* Update form */}
        <div className="rounded-xl border border-[#E3EBE4] bg-white p-5 sm:p-6">
          <h2 className="mb-5 font-semibold text-[#1D271F]">
            তথ্য
          </h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label
                htmlFor="update-name"
                className="mb-2 block text-sm text-gray-600"
              >
                নাম
              </label>

              <input
                id="update-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                required
                maxLength={100}
                className="w-full rounded-lg border border-[#E1E9E2] bg-white px-3 py-2.5 text-sm text-[#1D271F] outline-none transition focus:border-[#05893E] focus:ring-2 focus:ring-[#05893E]/10"
              />
            </div>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className={`rounded-lg px-3 py-2 text-sm ${
                  isError
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full rounded-lg bg-[#05893E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#047533] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

