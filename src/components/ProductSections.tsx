
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
    id: number;
    slug: string;
    nameBn: string;
    image: string;
    today: number;
    unit: string;
    change: {
        dir: "up" | "down";
        pct: number;
    };
};

export default function ProductSections() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch(
            "https://api.api-store.workers.dev/api/bazardor/products"
        )
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => {
                console.error(
                    "Failed to fetch products:",
                    error
                );
            });
    }, []);

    // দাম বেড়েছে
    const risers = products
        .filter((product) => product.change.dir === "up")
        .sort((a, b) => b.change.pct - a.change.pct)
        .slice(0, 6);

    // দাম কমেছে
    const fallers = products
        .filter((product) => product.change.dir === "down")
        .sort((a, b) => b.change.pct - a.change.pct)
        .slice(0, 6);

    return (
        <section className="bg-gray-50 py-12">

            <div className="mx-auto max-w-6xl px-4">

                {/* =========================
                    Section A - Risers
                ========================= */}
                <div className="mb-12">

                    <h2 className="mb-2 text-2xl font-bold text-[#1D271F]">
                        আজ দাম বেড়েছে ▲
                    </h2>

                    <p className="mb-6 text-gray-600">
                        যেসব পণ্যের দাম আজ বেড়েছে
                    </p>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {risers.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>

                </div>

                {/* =========================
                    Section B - Fallers
                ========================= */}
                <div className="mb-12">

                    <h2 className="mb-2 text-2xl font-bold text-[#1D271F]">
                        আজ দাম কমেছে ▼
                    </h2>

                    <p className="mb-6 text-gray-600">
                        যেসব পণ্যের দাম আজ কমেছে
                    </p>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {fallers.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>

                </div>

                {/* =========================
                    Section C - All Products
                ========================= */}
                <div id="সব-পণ্য">

                    <h2 className="mb-2 text-2xl font-bold text-[#1D271F]">
                        সব পণ্য
                    </h2>

                    <p className="mb-6 text-gray-600">
                        প্রতিদিনের প্রয়োজনীয় পণ্যের আজকের বাজার দর
                    </p>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>

                </div>

            </div>
        </section>
    );
}


// =========================
// Product Card
// =========================

function ProductCard({
    product,
}: {
    product: Product;
}) {
    return (
        <Link
            href={`/product/${product.slug}`}
            className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >

            {/* Product Image / Emoji */}
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-xl bg-gray-50 text-5xl">
                {product.image}
            </div>

            {/* Product Name */}
            <h3 className="text-lg font-bold text-[#1D271F]">
                {product.nameBn}
            </h3>

            {/* Unit */}
            <p className="mt-1 text-sm text-gray-500">
                প্রতি {getUnitName(product.unit)}
            </p>

            {/* Price */}
            <div className="mt-4 flex items-center justify-between">

                <div>
                    <p className="text-sm text-gray-500">
                        আজকের দাম
                    </p>

                    <p className="text-xl font-bold text-[#1D271F]">
                        {toBanglaNumber(product.today)} টাকা
                    </p>
                </div>

                {/* Change */}
                <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        product.change.dir === "up"
                            ? "bg-green-50 text-[#05893E]"
                            : "bg-red-50 text-red-500"
                    }`}
                >
                    {product.change.dir === "up"
                        ? "▲"
                        : "▼"}{" "}
                    {toBanglaNumber(product.change.pct)}%
                </span>

            </div>

        </Link>
    );
}


// =========================
// Unit Name
// =========================

function getUnitName(unit: string) {
    if (unit === "kg") return "কেজি";
    if (unit === "liter") return "লিটার";
    if (unit === "dozen") return "ডজন";
    if (unit === "piece") return "পিস";

    return unit;
}


// =========================
// English Number → Bangla Number
// =========================

function toBanglaNumber(value: number) {
    const banglaDigits = [
        "০",
        "১",
        "২",
        "৩",
        "৪",
        "৫",
        "৬",
        "৭",
        "৮",
        "৯",
    ];

    return value
        .toString()
        .replace(/\d/g, (digit) => banglaDigits[Number(digit)]);
}