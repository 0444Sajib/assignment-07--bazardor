"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-[#F1F6F1] px-4">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#DCEBDD] border-t-[#05893E]" />
                    <p className="mt-4 text-sm text-[#1D271F]">
                        প্রোফাইল লোড হচ্ছে...
                    </p>
                </div>
            </main>
        );
    }

    if (!session?.user) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-[#F1F6F1] px-4 py-12">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E4F3E8]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#05893E"
                            strokeWidth="1.5"
                            className="h-8 w-8"
                        >
                            <circle cx="12" cy="8" r="4" />
                            <path d="M5 21a7 7 0 0 1 14 0" />
                        </svg>
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-[#1D271F]">
                        লগইন করা হয়নি
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        তোমার প্রোফাইল দেখতে প্রথমে অ্যাকাউন্টে লগইন করো।
                    </p>

                    <Link
                        href="/signin"
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#05893E] px-6 py-3 font-semibold text-white transition hover:bg-[#047533]"
                    >
                        সাইন ইন করো
                    </Link>

                    <div className="mt-4">
                        <Link
                            href="/"
                            className="text-sm text-gray-500 transition hover:text-[#05893E]"
                        >
                            হোম পেজে ফিরে যাও
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[70vh] bg-[#F1F6F1] px-4 py-8 sm:py-12">
            <div className="mx-auto max-w-4xl">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2 text-sm">
                    <Link
                        href="/"
                        className="text-gray-500 transition hover:text-[#05893E]"
                    >
                        হোম
                    </Link>

                    <span className="text-gray-400">/</span>

                    <span className="font-medium text-[#05893E]">
                        আমার প্রোফাইল
                    </span>
                </div>

                {/* Page Heading */}
                <div className="mb-7">
                    <p className="text-sm font-semibold tracking-wide text-[#05893E]">
                        BAZARDOR ACCOUNT
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-[#1D271F] sm:text-4xl">
                        আমার প্রোফাইল
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
                        তোমার অ্যাকাউন্টের তথ্য এখানে দেখতে পারবে।
                    </p>
                </div>

                {/* Profile Card */}
                <section className="overflow-hidden rounded-2xl border border-[#E5EDE5] bg-white shadow-sm">
                    <div className="h-3 bg-[#05893E]" />

                    {/* Profile Introduction */}
                    <div className="border-b border-gray-100 p-5 sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            {/* Profile Picture */}
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#E4F3E8] bg-[#E4F3E8]">
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt="প্রোফাইল ছবি"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#05893E"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-12 w-12"
                                    >
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M5 21a7 7 0 0 1 14 0" />
                                    </svg>
                                )}
                            </div>

                            {/* Name and Email */}
                            <div className="min-w-0 flex-1">
                                <span className="inline-flex items-center gap-2 rounded-full bg-[#E4F3E8] px-3 py-1 text-xs font-semibold text-[#05893E]">
                                    <span className="h-2 w-2 rounded-full bg-[#05893E]" />
                                    আমার অ্যাকাউন্ট
                                </span>

                                <h2 className="mt-3 break-words text-2xl font-bold text-[#1D271F]">
                                    {session.user.name || "ব্যবহারকারী"}
                                </h2>

                                <p className="mt-2 break-all text-sm text-gray-500">
                                    {session.user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="p-5 sm:p-8">
                        <h3 className="text-lg font-bold text-[#1D271F]">
                            অ্যাকাউন্টের তথ্য
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            তোমার অ্যাকাউন্টের সঙ্গে যুক্ত তথ্য।
                        </p>

                        <div className="mt-6 space-y-4">
                            {/* Name */}
                            <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-[#FAFCFA] p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#E4F3E8]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#05893E"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5"
                                    >
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M5 21a7 7 0 0 1 14 0" />
                                    </svg>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-500">
                                        পূর্ণ নাম
                                    </p>

                                    <p className="mt-1 break-words font-semibold text-[#1D271F]">
                                        {session.user.name || "নাম দেওয়া হয়নি"}
                                    </p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-[#FAFCFA] p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#E4F3E8]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#05893E"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5"
                                    >
                                        <rect
                                            x="3"
                                            y="5"
                                            width="18"
                                            height="14"
                                            rx="2"
                                        />
                                        <path d="m3 7 9 6 9-6" />
                                    </svg>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-500">
                                        ইমেইল ঠিকানা
                                    </p>

                                    <p className="mt-1 break-all font-semibold text-[#1D271F]">
                                        {session.user.email}
                                    </p>
                                </div>
                            </div>

                            {/* Verification Status */}
                            <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-[#FAFCFA] p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#E4F3E8]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#05893E"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5"
                                    >
                                        <path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3Z" />
                                        <path d="m9 12 2 2 4-4" />
                                    </svg>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-500">
                                        ইমেইল যাচাই
                                    </p>

                                    <p
                                        className={`mt-1 font-semibold ${
                                            session.user.emailVerified
                                                ? "text-[#05893E]"
                                                : "text-amber-600"
                                        }`}
                                    >
                                        {session.user.emailVerified
                                            ? "যাচাই করা হয়েছে"
                                            : "এখনো যাচাই করা হয়নি"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">
                            {/* Update Profile Button */}
                            <Link
                                href="/update-profile"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#05893E] px-5 py-3 font-semibold text-white transition hover:bg-[#047533] sm:w-auto"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                                </svg>

                                তথ্য আপডেট করুন
                            </Link>

                            {/* Back to Home */}
                            <Link
                                href="/"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-[#1D271F] transition hover:bg-gray-50 sm:w-auto"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="m15 18-6-6 6-6" />
                                    <path d="M9 12h12" />
                                </svg>

                                হোম পেজে ফিরে যাও
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}