
"use client";

import { Suspense, useCallback, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Toast, { type ToastType } from "@/components/Toast";

function SignInForm() {
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(false);

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

    async function handleSignIn(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();
        setMessage("");
        setToast(null);
        setLoading(true);

        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                console.error("Sign in error:", error);

                const errorMessage =
                    error.message || "লগইন করা যায়নি। আবার চেষ্টা করো।";

                setMessage(errorMessage);
                setToast({
                    message: errorMessage,
                    type: "error",
                });
                return;
            }

            setToast({
                message: "লগইন সফল হয়েছে!",
                type: "success",
            });

            await new Promise((resolve) => setTimeout(resolve, 700));
            window.location.href = returnTo;
        } catch (error) {
            console.error("Sign in failed:", error);

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

    async function handleSocialSignIn(
        provider: "google" | "github"
    ) {
        setMessage("");
        setToast(null);
        setSocialLoading(true);

        try {
            const { error } = await authClient.signIn.social({
                provider,
                callbackURL: returnTo,
            });

            if (error) {
                const errorMessage =
                    error.message ||
                    `${provider} দিয়ে লগইন করা যায়নি।`;

                setMessage(errorMessage);
                setToast({
                    message: errorMessage,
                    type: "error",
                });
                setSocialLoading(false);
            }
        } catch (error) {
            console.error("Social sign in failed:", error);

            const errorMessage =
                "সোশ্যাল লগইনে সমস্যা হয়েছে। আবার চেষ্টা করো।";

            setMessage(errorMessage);
            setToast({
                message: errorMessage,
                type: "error",
            });
            setSocialLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#F1F6F1] px-4 py-6">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}

            <header className="mb-4 w-full max-w-[360px] text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[#1D271F]">
                    অ্যাকাউন্ট তৈরি করুন
                </h1>

                <p className="mt-1 text-xs leading-5 text-gray-600">
                    বাজারদরের সব সুবিধা পেতে তোমার অ্যাকাউন্টে প্রবেশ করো।
                </p>
            </header>

            <section className="w-full max-w-[360px] rounded-xl border border-[#E3EAE3] bg-white/90 p-4 shadow-sm sm:p-5">
                <form onSubmit={handleSignIn} className="space-y-3">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-xs font-medium text-[#303A31]"
                        >
                            ইমেইল
                        </label>

                        <input
                            id="email"
                            name="signin-email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="তোমার ইমেইল"
                            className="h-9 w-full rounded-md border border-[#E0E8E0] bg-[#FBFCFB] px-2.5 text-xs outline-none transition placeholder:text-[#8B938B] focus:border-[#05893E] focus:ring-2 focus:ring-[#05893E]/10"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-xs font-medium text-[#303A31]"
                        >
                            পাসওয়ার্ড
                        </label>

                        <input
                            id="password"
                            name="signin-password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="তোমার পাসওয়ার্ড"
                            className="h-9 w-full rounded-md border border-[#E0E8E0] bg-[#FBFCFB] px-2.5 text-xs outline-none transition placeholder:text-[#8B938B] focus:border-[#05893E] focus:ring-2 focus:ring-[#05893E]/10"
                        />
                    </div>

                    {message && (
                        <p
                            role="alert"
                            className="rounded-md bg-red-50 p-2.5 text-xs text-red-600"
                        >
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || socialLoading}
                        className="h-9 w-full rounded-md bg-[#078B40] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#067735] focus:outline-none focus:ring-2 focus:ring-[#05893E]/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "লগইন হচ্ছে..." : "লগইন"}
                    </button>
                </form>

                <div className="my-3 flex items-center gap-2.5">
                    <div className="h-px flex-1 bg-[#E5EAE5]" />
                    <span className="text-[11px] text-gray-500">
                        অথবা
                    </span>
                    <div className="h-px flex-1 bg-[#E5EAE5]" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        disabled={loading || socialLoading}
                        onClick={() => handleSocialSignIn("google")}
                        className="flex h-9 min-w-0 items-center justify-center gap-1 rounded-md border border-[#E0E8E0] bg-[#FBFCFB] px-1.5 text-[11px] font-medium text-[#303A31] transition hover:bg-[#F1F6F1] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 48 48"
                            className="h-3.5 w-3.5 shrink-0"
                        >
                            <path
                                fill="#EA4335"
                                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                                transform="translate(0 3)"
                            />
                            <path
                                fill="#4285F4"
                                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.72 5.99c4.5-4.17 7.07-10.3 7.07-17.64Z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z"
                                transform="translate(0 3)"
                            />
                            <path
                                fill="#34A853"
                                d="M24 48c6.47 0 11.9-2.13 15.87-5.81l-7.72-5.99c-2.14 1.44-4.89 2.3-8.15 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                                transform="translate(0 -3)"
                            />
                        </svg>

                        <span className="truncate">
                            {socialLoading
                                ? "অপেক্ষা করো..."
                                : "Google দিয়ে লগইন"}
                        </span>
                    </button>

                    <button
                        type="button"
                        disabled={loading || socialLoading}
                        onClick={() => handleSocialSignIn("github")}
                        className="flex h-9 min-w-0 items-center justify-center gap-1 rounded-md border border-[#E0E8E0] bg-[#FBFCFB] px-1.5 text-[11px] font-medium text-[#303A31] transition hover:bg-[#F1F6F1] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5 shrink-0 fill-current"
                        >
                            <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.07c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.59 1.21 3.22.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.3-2.61 5.24-5.1 5.52.4.35.75 1.02.75 2.06V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" />
                        </svg>

                        <span className="truncate">
                            {socialLoading
                                ? "অপেক্ষা করো..."
                                : "GitHub দিয়ে লগইন"}
                        </span>
                    </button>
                </div>

                <p className="mt-3 text-center text-[11px] text-gray-600">
                    অ্যাকাউন্ট নেই?{" "}
                    <Link
                        href={`/signup${returnTo !== "/"
                                ? `?callbackURL=${encodeURIComponent(returnTo)}`
                                : ""
                            }`}
                        className="font-semibold text-[#05893E] hover:underline"
                    >
                        রেজিস্টার করো
                    </Link>
                </p>
            </section>

            <Link
                href="/"
                className="mt-4 text-[11px] text-[#7A857B] transition hover:text-[#05893E]"
            >
                ← হোম পেজে ফিরে যাও
            </Link>
        </main>
    );
}

export default function SignInPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center bg-[#F1F6F1] px-4">
                    <p className="text-sm text-[#05893E]">লোড হচ্ছে...</p>
                </main>
            }
        >
            <SignInForm />
        </Suspense>
    );
}



