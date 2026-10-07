"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
    const [date, setDate] = useState("");
    const [weekday, setWeekday] = useState("");

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

    return (
        <nav className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-4">
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <div>
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

                        <p className="mt-1 text-sm text-[#1D271F]">
                            {weekday} • {date}
                        </p>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">

                        <button className="rounded-lg px-4 py-2 text-[#1D271F] hover:bg-gray-100">
                            সাইন ইন
                        </button>

                        <button className="rounded-lg bg-[#05893E] px-4 py-2 text-white hover:bg-[#047533]">
                            সাইন আপ
                        </button>

                    </div>

                </div>
            </div>
        </nav>
    );
}