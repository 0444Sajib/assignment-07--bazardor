"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Market = {
    market: string;
    division: string;
    min: number;
    max: number;
};

type Product = {
    id: number;
    slug: string;
    nameBn: string;
    category: string;
    categoryNameBn: string;
    categoryIcon?: string;
    unit: string;
    image?: string;
    today: number;
    yesterday: number;
    lastWeek: number;
    lastMonth: number;
    change: {
        dir: "up" | "down";
        pct: number;
    };
    markets: Market[];
};

export default function ProductDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [slug, setSlug] = useState("");
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        params.then((data) => {
            setSlug(data.slug);
        });
    }, [params]);

    useEffect(() => {
        if (!slug) return;

        async function fetchProduct() {
            try {
                setLoading(true);

                const productsResponse = await fetch(
                    "https://api.abcz.workers.dev/api/bazardor/products"
                );

                const productsData: Product[] =
                    await productsResponse.json();

                const foundProduct = productsData.find(
                    (item) => item.slug === slug
                );

                if (!foundProduct) {
                    setProduct(null);
                    return;
                }

                const detailResponse = await fetch(
                    `https://api.abcz.workers.dev/api/bazardor/products/${foundProduct.id}`
                );

                const detailData: Product =
                    await detailResponse.json();

                setProduct(detailData);
            } catch (error) {
                console.error(
                    "Failed to fetch product:",
                    error
                );

                setProduct(null);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="h-10 w-40 animate-pulse rounded-lg bg-gray-200" />

                    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="h-96 animate-pulse rounded-2xl bg-white" />

                        <div className="space-y-5">
                            <div className="h-10 w-72 animate-pulse rounded-lg bg-white" />

                            <div className="h-6 w-48 animate-pulse rounded-lg bg-white" />

                            <div className="h-32 animate-pulse rounded-2xl bg-white" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-16">
                <div className="mx-auto max-w-2xl text-center">
                    <div className="text-6xl">😕</div>

                    <h1 className="mt-4 text-3xl font-bold text-[#1D271F]">
                        পণ্য পাওয়া যায়নি
                    </h1>

                    <p className="mt-3 text-gray-600">
                        আপনি যে পণ্যটি খুঁজছেন সেটি পাওয়া যায়নি।
                    </p>

                    <Link
                        href="/"
                        className="mt-6 inline-block rounded-lg bg-[#05893E] px-6 py-3 font-semibold text-white"
                    >
                        হোমে ফিরে যান
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="mx-auto max-w-6xl px-4">

                <Link
                    href={`/category/${product.category}`}
                    className="mb-8 inline-block text-sm font-semibold text-[#05893E] hover:underline"
                >
                    ← {product.categoryNameBn}
                </Link>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                    <div className="flex min-h-80 items-center justify-center rounded-2xl bg-white p-8 shadow-sm">
                        <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-gray-50 text-8xl">
                            {product.image || product.categoryIcon}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-[#05893E]">
                                {product.categoryIcon}{" "}
                                {product.categoryNameBn}
                            </span>
                        </div>

                        <h1 className="mt-5 text-3xl font-bold text-[#1D271F]">
                            {product.nameBn}
                        </h1>

                        <p className="mt-2 text-gray-500">
                            প্রতি {getUnitName(product.unit)}
                        </p>

                        <div className="mt-6 rounded-xl bg-gray-50 p-5">
                            <p className="text-sm text-gray-500">
                                আজকের বাজার দর
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <p className="text-4xl font-bold text-[#1D271F]">
                                    {toBanglaNumber(product.today)} টাকা
                                </p>

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
                                    {toBanglaNumber(
                                        product.change.pct
                                    )}
                                    %
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="mb-5 text-2xl font-bold text-[#1D271F]">
                        দামের তথ্য
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <PriceBox
                            title="গতকাল"
                            price={product.yesterday}
                        />

                        <PriceBox
                            title="গত সপ্তাহ"
                            price={product.lastWeek}
                        />

                        <PriceBox
                            title="গত মাস"
                            price={product.lastMonth}
                        />

                        <PriceBox
                            title="আজ"
                            price={product.today}
                        />
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="mb-5 text-2xl font-bold text-[#1D271F]">
                        বাজারভেদে দাম
                    </h2>

                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                        {product.markets.map((market, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="font-semibold text-[#1D271F]">
                                        {market.market}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {market.division}
                                    </p>
                                </div>

                                <p className="font-bold text-[#1D271F]">
                                    {toBanglaNumber(market.min)} -{" "}
                                    {toBanglaNumber(market.max)} টাকা
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
}

function PriceBox({
    title,
    price,
}: {
    title: string;
    price: number;
}) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
                {title}
            </p>

            <p className="mt-2 text-2xl font-bold text-[#1D271F]">
                {toBanglaNumber(price)} টাকা
            </p>
        </div>
    );
}

function getUnitName(unit: string) {
    if (unit === "kg") return "কেজি";
    if (unit === "liter") return "লিটার";
    if (unit === "dozen") return "ডজন";
    if (unit === "piece") return "পিস";

    return unit;
}

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
        .replace(
            /\d/g,
            (digit) => banglaDigits[Number(digit)]
        );
}