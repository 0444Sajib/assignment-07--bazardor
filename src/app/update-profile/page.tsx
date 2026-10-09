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

      // Updated name দেখতে Profile পেজে ফিরে যাবে
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
      <main className="flex min-h-[60vh] items-center justify-center bg-[#F1F6F1]">
        <span className="loading loading-spinner loading-lg text-[#05893E]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F1F6F1] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-xl overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="h-2 bg-[#05893E]" />

        <div className="p-6 sm:p-10">
          <p className="mb-2 text-sm text-gray-500">
            হোম পেজ / আমার প্রোফাইল / তথ্য আপডেট
          </p>

          <h1 className="mb-2 text-2xl font-bold text-[#1D271F] sm:text-3xl">
            তথ্য আপডেট করুন
          </h1>

          <p className="mb-8 text-gray-600">
            আপনার অ্যাকাউন্টের নাম পরিবর্তন করতে নিচের ফর্মটি পূরণ করুন।
          </p>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block font-medium text-[#1D271F]"
              >
                আপনার নাম
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                required
                maxLength={100}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[#1D271F] outline-none transition focus:border-[#05893E] focus:ring-2 focus:ring-[#05893E]/20"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-[#1D271F]">
                ইমেইল
              </label>

              <input
                type="email"
                value={session.user.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
              />

              <p className="mt-1 text-xs text-gray-500">
                এই ফর্ম থেকে শুধু নাম পরিবর্তন করা যাবে।
              </p>
            </div>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className={`rounded-lg px-4 py-3 text-sm ${
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
              className="w-full rounded-xl bg-[#05893E] px-5 py-3 font-semibold text-white transition hover:bg-[#047533] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="w-full rounded-xl border border-gray-300 px-5 py-3 font-medium text-[#1D271F] transition hover:bg-gray-50"
            >
              ফিরে যান
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}