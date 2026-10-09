
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type Category = {
    slug: string;
    nameBn: string;
    icon?: string;
};

export default function Navbar() {
    const [date, setDate] = useState("");
    const [weekday, setWeekday] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [loggingOut, setLoggingOut] = useState(false);

    const pathname = usePathname();

    // Logged-in user session
    const { data: session, isPending } = authClient.useSession();

    // Bengali date and weekday
    useEffect(() => {
        const today = new Date();

        setDate(
            today.toLocaleDateString("bn-BD", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
        );

        setWeekday(
            today.toLocaleDateString("bn-BD", {
                weekday: "long",
            })
        );
    }, []);

    // Fetch categories from API
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch(
                    "https://api.abcz.workers.dev/api/bazardor/categories"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }

                const data: Category[] = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        }

        fetchCategories();
    }, []);

    // Sign out
    async function handleSignOut() {
        setLoggingOut(true);

        try {
            const { error } = await authClient.signOut();

            if (error) {
                console.error("Sign out failed:", error);
                setLoggingOut(false);
                return;
            }

            window.location.href = "/signin";
        } catch (error) {
            console.error("Sign out failed:", error);
            setLoggingOut(false);
        }
    }

    return (
        <nav className="sticky top-0 z-50 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-4">
                {/* Top Row */}
                <div className="flex items-center justify-between gap-4">
                    {/* Logo and Date */}
                    <div className="shrink-0">
                        <Link href="/">
                            <h1 className="text-2xl font-bold">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#05893E"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-1 inline-block h-6 w-6"
                                >
                                    <circle cx="9" cy="20" r="1" />
                                    <circle cx="19" cy="20" r="1" />
                                    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
                                </svg>

                                <span className="text-[#1D271F]">
                                    বাজার দর
                                </span>
                            </h1>
                        </Link>

                        <p className="mt-1 text-sm text-[#1D271F]">
                            {weekday} • {date}
                        </p>
                    </div>

                    {/* Authentication */}
                    <div className="flex min-w-0 items-center justify-end">
                        {isPending ? (
                            <span className="text-sm text-gray-500">
                                অপেক্ষা করো...
                            </span>
                        ) : session?.user ? (
                            /* Logged-in user profile */
                            <div className="flex items-center gap-3">
                                {/* Profile picture on the left */}
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E4F3E8]">
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
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-9 w-9"
                                        >
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M5 21a7 7 0 0 1 14 0" />
                                        </svg>
                                    )}
                                </div>

                                {/* User details stacked vertically */}
                                <div className="flex min-w-0 flex-col items-start gap-1">
                                    <p className="max-w-[180px] break-words text-sm font-semibold text-[#1D271F]">
                                        {session.user.name}
                                    </p>

                                    <p className="max-w-[180px] break-all text-xs text-gray-500">
                                        {session.user.email}
                                    </p>

                                    <Link
                                        href="/profile"
                                        className="text-sm font-medium text-[#05893E] hover:underline"
                                    >
                                        আমার প্রোফাইল
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        disabled={loggingOut}
                                        className="mt-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loggingOut
                                            ? "লগআউট হচ্ছে..."
                                            : "লগআউট"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Not logged in */
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link
                                    href="/signin"
                                    className="rounded-lg px-3 py-2 text-sm text-[#1D271F] transition hover:bg-gray-100 sm:px-4"
                                >
                                    সাইন ইন
                                </Link>

                                <Link
                                    href="/signup"
                                    className="rounded-lg bg-[#05893E] px-3 py-2 text-sm text-white transition hover:bg-[#047533] sm:px-4"
                                >
                                    সাইন আপ
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dynamic Category Navigation */}
                <div className="mt-4 flex items-center gap-2 overflow-x-auto border-t border-gray-100 pt-3">
                    {categories.map((category) => {
                        const isActive =
                            pathname === `/category/${category.slug}`;

                        return (
                            <Link
                                key={category.slug}
                                href={`/category/${category.slug}`}
                                className={`whitespace-nowrap rounded-lg px-4 py-2 font-semibold transition ${
                                    isActive
                                        ? "bg-[#05893E] text-white"
                                        : "text-[#1D271F] hover:bg-gray-100 hover:text-[#05893E]"
                                }`}
                            >
                                {category.icon && (
                                    <span className="mr-1">
                                        {category.icon}
                                    </span>
                                )}

                                {category.nameBn}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
