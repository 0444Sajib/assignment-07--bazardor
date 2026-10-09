
"use client";

import { useEffect, useState } from "react";

export default function Hero() {
    const [today, setToday] = useState("");

    useEffect(() => {
        setToday(
            new Date().toLocaleDateString("bn-BD", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Asia/Dhaka",
            })
        );
    }, []);

    return (
        <section className="bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-10 px-4 py-10 md:py-14">
                {/* Left Content */}
                <div className="max-w-xl">
                    <p className="mb-3 inline-block rounded-full bg-[#E0F2E5] px-3 py-1 text-sm font-medium text-[#05893E]">
                        {today || "আজকের বাজারদর"}
                    </p>

                    <h2 className="text-3xl font-bold leading-tight text-[#1D271F] sm:text-4xl">
                        আজকের বাজারের দাম এক নজরে
                    </h2>

                    <p className="mt-4 text-base leading-7 text-gray-600">
                        চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও
                        অন্যান্য নিত্যপ্রয়োজনীয় পণ্যের আজকের
                        বাজার দর সহজেই জেনে নিন।
                    </p>

                    <a
                        href="#সব-পণ্য"
                        className="mt-6 inline-block rounded-lg bg-[#05893E] px-6 py-3 font-semibold text-white transition hover:bg-[#047533]"
                    >
                        সব পণ্য দেখুন
                    </a>
                </div>

                {/* Banner Image */}
                <div className="hidden shrink-0 md:block">
                    <img
                        src="/bazar-hero.png"
                        alt="বাজারের পণ্যের ঝুড়ি"
                        className="h-64 w-80 rounded-2xl object-contain lg:h-72 lg:w-96"
                    />
                </div>
            </div>
        </section>
    );
}
