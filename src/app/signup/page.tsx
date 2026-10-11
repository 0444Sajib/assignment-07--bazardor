
"use client";

import { Suspense, useCallback, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Toast, { type ToastType } from "@/components/Toast";

function SignUpForm() {
    const searchParams = useSearchParams();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState<{
        message: string;
        type: ToastType;
    } | null>(null);

    const closeToast = useCallback(() => {
        setToast(null);
    }, []);

    const callbackURL = searchParams.get("callbackURL");

    const returnTo =
        callbackURL?.startsWith("/") &&
        !callbackURL.startsWith("//") &&
        !callbackURL.includes("\\")
            ? callbackURL
            : "/";

    async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage("");
        setToast(null);
        setLoading(true);

        try {
            const { error } = await authClient.signUp.email({
                name,
                email,
                password,
                callbackURL: returnTo,
            });

            if (error) {
                console.error("Signup error:", error);
                console.error("Error message:", error.message);
                console.error("Error status:", error.status);
                console.error("Error statusText:", error.statusText);

                const errorMessage =
                    error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।";

                setMessage(errorMessage);
                setToast({
                    message: errorMessage,
                    type: "error",
                });
                return;
            }

            setToast({
                message: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!",
                type: "success",
            });

            await new Promise((resolve) => setTimeout(resolve, 700));
            window.location.href = returnTo;
        } catch (error) {
            console.error("Signup failed:", error);

            const errorMessage = "সমস্যা হয়েছে। আবার চেষ্টা করো।";

            setMessage(errorMessage);
            setToast({
                message: errorMessage,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F1F6F1] px-4 py-10">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                <Link
                    href="/"
                    className="text-sm text-[#05893E] hover:underline"
                >
                    ← হোম পেজে ফিরে যাও
                </Link>

                <h1 className="mt-6 text-3xl font-bold text-[#1D271F]">
                    অ্যাকাউন্ট তৈরি করো
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                    BazarDor ব্যবহার করতে তোমার তথ্য দিয়ে রেজিস্টার করো।
                </p>

                <form onSubmit={handleSignUp} className="mt-6 space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium"
                        >
                            তোমার নাম
                        </label>

                        <input
                            id="name"
                            name="signup-name"
                            type="text"
                            autoComplete="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="তোমার নাম লিখো"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#05893E]"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium"
                        >
                            ইমেইল
                        </label>

                        <input
                            id="email"
                            name="signup-email"
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
                            name="signup-password"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="কমপক্ষে ৮ অক্ষর"
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
                        disabled={loading}
                        className="w-full rounded-lg bg-[#05893E] px-4 py-3 font-semibold text-white transition hover:bg-[#047533] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "রেজিস্টার করো"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    আগে থেকেই অ্যাকাউন্ট আছে?{" "}
                    <Link
                        href={`/signin${
                            returnTo !== "/"
                                ? `?callbackURL=${encodeURIComponent(returnTo)}`
                                : ""
                        }`}
                        className="font-semibold text-[#05893E] hover:underline"
                    >
                        লগইন করো
                    </Link>
                </p>
            </div>
        </main>
    );
}

export default function SignUpPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center bg-[#F1F6F1] px-4">
                    <p className="text-[#05893E]">লোড হচ্ছে...</p>
                </main>
            }
        >
            <SignUpForm />
        </Suspense>
    );
}
