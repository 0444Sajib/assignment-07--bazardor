
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
        dir: "up" | "down" | "flat";
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
        params.then((data) => setSlug(data.slug));
    }, [params]);

    useEffect(() => {
        if (!slug) return;

        async function fetchProduct() {
            try {
                setLoading(true);

                const response = await fetch(
                    "https://api.abcz.workers.dev/api/bazardor/products"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const products: Product[] = await response.json();
                const found = products.find((item) => item.slug === slug);

                if (!found) {
                    setProduct(null);
                    return;
                }

                const detailResponse = await fetch(
                    `https://api.abcz.workers.dev/api/bazardor/products/${found.id}`
                );

                if (!detailResponse.ok) {
                    throw new Error("Failed to fetch product details");
                }

                const detail: Product = await detailResponse.json();
                setProduct(detail);
            } catch (error) {
                console.error("Failed to fetch product:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#F0F5F0] px-4 py-6">
                <div className="mx-auto max-w-7xl animate-pulse space-y-5">
                    <div className="h-4 w-48 rounded bg-gray-200" />
                    <div className="h-32 rounded-xl bg-white" />
                    <div className="h-36 rounded-xl bg-white" />
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-[#F0F5F0] px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-[#1D271F]">
                    পণ্য পাওয়া যায়নি
                </h1>
                <Link
                    href="/"
                    className="mt-5 inline-block font-semibold text-[#05893E]"
                >
                    হোমে ফিরে যান
                </Link>
            </main>
        );
    }

    const difference = product.today - product.yesterday;

    const percent =
        product.yesterday > 0
            ? Math.abs((difference / product.yesterday) * 100)
            : 0;

    const marketPrices = product.markets ?? [];

    const lowest = marketPrices.length
        ? Math.min(...marketPrices.map((market) => market.min))
        : product.today;

    const highest = marketPrices.length
        ? Math.max(...marketPrices.map((market) => market.max))
        : product.today;

    const average = marketPrices.length
        ? marketPrices.reduce(
              (total, market) => total + (market.min + market.max) / 2,
              0
          ) / marketPrices.length
        : product.today;

    return (
        <main className="min-h-screen bg-[#F0F5F0] px-3 py-4 sm:px-5 sm:py-6">
            <div className="mx-auto max-w-7xl">
                {/* Breadcrumb */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[#657067] sm:text-sm"
                >
                    <Link href="/" className="hover:text-[#05893E]">
                        হোম
                    </Link>
                    <span>›</span>
                    <Link
                        href={`/category/${product.category}`}
                        className="hover:text-[#05893E]"
                    >
                        {product.categoryNameBn}
                    </Link>
                    <span>›</span>
                    <span className="text-[#465149]">{product.nameBn}</span>
                </nav>

                {/* Product summary */}
                <section className="flex flex-col justify-between gap-4 rounded-xl border border-[#E2EAE2] bg-[#FAFCFA] p-4 sm:flex-row sm:items-center sm:px-5 sm:py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F0] text-3xl">
                            {product.image || product.categoryIcon || "🛒"}
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-xl font-bold text-[#1D271F] sm:text-2xl">
                                {product.nameBn}
                            </h1>

                            <p className="mt-1 text-xs text-[#69736B]">
                                প্রতি {getUnitName(product.unit)} ·{" "}
                                {product.categoryNameBn}
                            </p>

                            <p className="mt-2 text-xs text-[#465149] sm:text-sm">
                                {difference > 0
                                    ? "গতকালের তুলনায় আজ দাম বেড়েছে"
                                    : difference < 0
                                    ? "গতকালের তুলনায় আজ দাম কমেছে"
                                    : "গতকালের তুলনায় আজ দাম অপরিবর্তিত"}
                                {" · "}
                                {difference !== 0
                                    ? `${toBanglaNumber(Math.abs(difference))} টাকা`
                                    : "কোনো পরিবর্তন নেই"}
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-5 rounded-xl bg-[#F0F5F0] px-4 py-3 sm:min-w-28 sm:flex-col sm:gap-0 sm:text-center">
                        <div>
                            <p className="text-[11px] text-[#758078]">
                                আজকের বাজার দর
                            </p>
                            <p className="mt-1 text-2xl font-bold text-[#1D271F]">
                                {toBanglaNumber(product.today)}
                            </p>
                            <p className="text-[11px] text-[#758078]">
                                টাকা / {getUnitName(product.unit)}
                            </p>
                        </div>

                        <span
                            className={`text-xs font-bold ${
                                difference > 0
                                    ? "text-red-500"
                                    : difference < 0
                                    ? "text-[#05893E]"
                                    : "text-gray-500"
                            }`}
                        >
                            {difference > 0
                                ? "▲"
                                : difference < 0
                                ? "▼"
                                : "—"}{" "}
                            {toBanglaNumber(Number(percent.toFixed(1)))}%
                        </span>
                    </div>
                </section>

                {/* Price summary */}
                <section className="mt-4 rounded-xl border border-[#E2EAE2] bg-[#FAFCFA] p-3 sm:p-4">
                    <h2 className="mb-3 text-sm font-bold text-[#1D271F]">
                        দামের সারসংক্ষেপ
                    </h2>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <SummaryCard
                            title="সর্বনিম্ন দাম"
                            price={lowest}
                            description="সবচেয়ে কম দামের বাজার"
                            color="green"
                        />

                        <SummaryCard
                            title="সর্বোচ্চ দাম"
                            price={highest}
                            description="সবচেয়ে বেশি দামের বাজার"
                            color="red"
                        />

                        <SummaryCard
                            title="গড় দাম"
                            price={Math.round(average)}
                            description="প্রতি বাজারের গড় দাম"
                            color="green"
                        />
                    </div>
                </section>

                {/* Price history */}
                <section className="mt-5 rounded-xl border border-[#E2EAE2] bg-[#FAFCFA] p-4">
                    <h2 className="mb-3 text-sm font-bold text-[#1D271F]">
                        দামের তথ্য
                    </h2>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <HistoryCard title="গতকাল" price={product.yesterday} />
                        <HistoryCard title="গত সপ্তাহ" price={product.lastWeek} />
                        <HistoryCard title="গত মাস" price={product.lastMonth} />
                        <HistoryCard title="আজ" price={product.today} />
                    </div>
                </section>

                {/* Market prices */}
                <section className="mt-5 rounded-xl border border-[#E2EAE2] bg-[#FAFCFA] p-4">
                    <h2 className="mb-3 text-sm font-bold text-[#1D271F]">
                        বাজারভেদে দাম
                    </h2>

                    <div className="divide-y divide-[#E7ECE7]">
                        {marketPrices.map((market, index) => (
                            <div
                                key={`${market.market}-${index}`}
                                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-[#1D271F]">
                                        {market.market}
                                    </p>
                                    <p className="mt-1 text-xs text-[#758078]">
                                        {market.division}
                                    </p>
                                </div>

                                <p className="text-sm font-bold text-[#1D271F]">
                                    {toBanglaNumber(market.min)} –{" "}
                                    {toBanglaNumber(market.max)} টাকা
                                </p>
                            </div>
                        ))}

                        {marketPrices.length === 0 && (
                            <p className="py-3 text-sm text-gray-500">
                                বাজারের তথ্য পাওয়া যায়নি।
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

function SummaryCard({
    title,
    price,
    description,
    color,
}: {
    title: string;
    price: number;
    description: string;
    color: "green" | "red";
}) {
    return (
        <div className="rounded-xl border border-[#E2EAE2] px-4 py-3">
            <p className="text-[11px] text-[#667168]">{title}</p>
            <p
                className={`mt-1 text-lg font-bold ${
                    color === "red" ? "text-red-500" : "text-[#05893E]"
                }`}
            >
                {toBanglaNumber(price)} টাকা
            </p>
            <p className="mt-1 text-[10px] text-[#69736B]">
                {description}
            </p>
        </div>
    );
}

function HistoryCard({
    title,
    price,
}: {
    title: string;
    price: number;
}) {
    return (
        <div className="rounded-xl border border-[#E2EAE2] p-3">
            <p className="text-xs text-[#69736B]">{title}</p>
            <p className="mt-2 text-lg font-bold text-[#1D271F]">
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
        "০", "১", "২", "৩", "৪",
        "৫", "৬", "৭", "৮", "৯",
    ];

    return value
        .toString()
        .replace(/\d/g, (digit) => banglaDigits[Number(digit)]);
}
