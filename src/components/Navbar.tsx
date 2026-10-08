
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
    slug: string;
    nameBn: string;
    icon?: string;
};

export default function Navbar() {
    const [date, setDate] = useState("");
    const [weekday, setWeekday] = useState("");

    const [categories, setCategories] = useState<Category[]>([]);

    const pathname = usePathname();

    // =========================
    // Bangla Date
    // =========================
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

    // =========================
    // Get Categories from API
    // =========================
    useEffect(() => {
        fetch(
            "https://api.api-store.workers.dev/api/bazardor/categories"
        )
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
            })
            .catch((error) => {
                console.error(
                    "Failed to fetch categories:",
                    error
                );
            });
    }, []);

    return (
        <nav className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-4">

                {/* =========================
                    Top Row
                ========================= */}
                <div className="flex items-center justify-between">

                    {/* =========================
                        Logo
                    ========================= */}
                    <div>
                        <Link href="/">
                            <h1 className="text-2xl font-bold">

                                {/* Cart Icon */}
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

                                {/* Logo Text */}
                                <span className="text-[#1D271F]">
                                    বাজার দর
                                </span>
                            </h1>
                        </Link>

                        {/* Date */}
                        <p className="mt-1 text-sm text-[#1D271F]">
                            {weekday} • {date}
                        </p>
                    </div>

                    {/* =========================
                        Auth Buttons
                    ========================= */}
                    <div className="flex items-center gap-3">

                        {/* Sign In */}
                        <Link
                            href="/signin"
                            className="rounded-lg px-4 py-2 text-[#1D271F] hover:bg-gray-100"
                        >
                            সাইন ইন
                        </Link>

                        {/* Sign Up */}
                        <Link
                            href="/signup"
                            className="rounded-lg bg-[#05893E] px-4 py-2 text-white hover:bg-[#047533]"
                        >
                            সাইন আপ
                        </Link>

                    </div>
                </div>

                {/* =========================
                    Dynamic Category Navigation
                ========================= */}
                <div className="mt-4 flex items-center gap-2 overflow-x-auto border-t border-gray-100 pt-3">
                    {/* =========================
                        All Products
                    ========================= */}


                    {/* =========================
                        Categories from API
                    ========================= */}
                    {categories.map((category) => {

                        const isActive =
                            pathname ===
                            `/category/${category.slug}`;

                        return (
                            <Link
                                key={category.slug}
                                href={`/category/${category.slug}`}
                                className={`whitespace-nowrap rounded-lg px-4 py-2 font-semibold ${isActive
                                        ? "bg-[#05893E] text-white"
                                        : "text-[#1D271F] hover:bg-gray-100 hover:text-[#05893E]"
                                    }`}
                            >
                                {/* Category Icon */}
                                {category.icon && (
                                    <span className="mr-1">
                                        {category.icon}
                                    </span>
                                )}

                                {/* Category Name */}
                                {category.nameBn}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}