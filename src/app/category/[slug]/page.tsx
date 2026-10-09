
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
    id: number;
    slug: string;
    nameBn: string;
    image?: string;
    categoryIcon?: string;
    today: number;
    unit: string;
    change: {
        dir: "up" | "down";
        pct: number;
    };
};

type Category = {
    slug: string;
    nameBn: string;
    icon?: string;
};

type SortOption = "default" | "asc" | "desc";

const API_URL = "https://api.abcz.workers.dev/api/bazardor";

export default function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [slug, setSlug] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState<SortOption>("default");
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        params.then((data) => {
            if (!cancelled) {
                setSlug(data.slug);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [params]);

    useEffect(() => {
        if (!slug) return;

        const controller = new AbortController();

        async function fetchData() {
            try {
                setLoading(true);
                setError(false);

                const [productsResponse, categoriesResponse] =
                    await Promise.all([
                        fetch(
                            `${API_URL}/products?category=${encodeURIComponent(slug)}`,
                            { signal: controller.signal }
                        ),
                        fetch(`${API_URL}/categories`, {
                            signal: controller.signal,
                        }),
                    ]);

                if (!productsResponse.ok || !categoriesResponse.ok) {
                    throw new Error("API request failed");
                }

                const productsData: Product[] =
                    await productsResponse.json();

                const categoriesData: Category[] =
                    await categoriesResponse.json();

                const foundCategory = categoriesData.find(
                    (item) => item.slug === slug
                );

                setProducts(
                    Array.isArray(productsData) ? productsData : []
                );
                setCategory(foundCategory || null);
            } catch (err) {
                if (
                    err instanceof Error &&
                    err.name === "AbortError"
                ) {
                    return;
                }

                console.error("Failed to fetch category:", err);
                setError(true);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            controller.abort();
        };
    }, [slug]);

    // Sort products using numeric prices.
    const sortedProducts = [...products].sort((a, b) => {
        if (sort === "asc") {
            return Number(a.today) - Number(b.today);
        }

        if (sort === "desc") {
            return Number(b.today) - Number(a.today);
        }

        return 0;
    });

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200" />

                    <div className="mt-4 h-5 w-64 animate-pulse rounded bg-gray-200" />

                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="h-64 animate-pulse rounded-2xl border border-gray-100 bg-white"
                            />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-16">
                <div className="mx-auto max-w-2xl text-center">
                    <div className="text-5xl">⚠️</div>

                    <h1 className="mt-4 text-2xl font-bold text-[#1D271F]">
                        পণ্য লোড করা যায়নি
                    </h1>

                    <p className="mt-3 text-gray-600">
                        ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করো।
                    </p>

                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-6 rounded-lg bg-[#05893E] px-6 py-3 font-semibold text-white transition hover:bg-[#047533]"
                    >
                        আবার চেষ্টা করো
                    </button>
                </div>
            </main>
        );
    }

    if (!category) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-16">
                <div className="mx-auto max-w-2xl text-center">
                    <div className="text-6xl">😕</div>

                    <h1 className="mt-4 text-3xl font-bold text-[#1D271F]">
                        ক্যাটাগরি পাওয়া যায়নি
                    </h1>

                    <p className="mt-3 text-gray-600">
                        তুমি যে ক্যাটাগরিটি খুঁজছ, সেটি পাওয়া যায়নি।
                    </p>

                    <Link
                        href="/"
                        className="mt-6 inline-block rounded-lg bg-[#05893E] px-6 py-3 font-semibold text-white transition hover:bg-[#047533]"
                    >
                        হোমে ফিরে যাও
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="mx-auto max-w-6xl px-4">
                {/* Category Header */}
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">
                                {category.icon || "🛒"}
                            </span>

                            <h1 className="text-3xl font-bold text-[#1D271F]">
                                {category.nameBn}
                            </h1>
                        </div>

                        <p className="mt-2 text-gray-600">
                            {category.nameBn} বিভাগের আজকের বাজার দর
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            মোট {toBanglaNumber(products.length)}টি পণ্য
                        </p>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="w-full sm:w-auto">
                        <label
                            htmlFor="sort"
                            className="mb-2 block text-sm font-semibold text-[#1D271F]"
                        >
                            দামের ভিত্তিতে সাজান
                        </label>

                        <select
                            id="sort"
                            value={sort}
                            onChange={(event) =>
                                setSort(event.target.value as SortOption)
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[#1D271F] outline-none transition focus:border-[#05893E] focus:ring-2 focus:ring-green-100 sm:min-w-56"
                        >
                            <option value="default">ডিফল্ট</option>
                            <option value="asc">দাম: কম থেকে বেশি</option>
                            <option value="desc">দাম: বেশি থেকে কম</option>
                        </select>
                    </div>
                </div>

                {/* Products */}
                {sortedProducts.length === 0 ? (
                    <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center">
                        <div className="text-5xl">📦</div>

                        <h2 className="mt-4 text-2xl font-bold text-[#1D271F]">
                            কোনো পণ্য পাওয়া যায়নি
                        </h2>

                        <p className="mt-2 text-gray-600">
                            এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।
                        </p>

                        <Link
                            href="/"
                            className="mt-6 inline-block font-semibold text-[#05893E] hover:underline"
                        >
                            সব পণ্য দেখো
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {sortedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

function ProductCard({ product }: { product: Product }) {
    const isUp = product.change?.dir === "up";

    return (
        <Link
            href={`/product/${product.slug}`}
            className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
        >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-xl bg-gray-50 text-5xl">
                {product.image || product.categoryIcon || "🛒"}
            </div>

            <h2 className="text-lg font-bold text-[#1D271F]">
                {product.nameBn}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                প্রতি {getUnitName(product.unit)}
            </p>

            <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm text-gray-500">আজকের দাম</p>

                    <p className="text-xl font-bold text-[#1D271F]">
                        {toBanglaNumber(product.today)} টাকা
                    </p>
                </div>

                {product.change && (
                    <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold ${
                            isUp
                                ? "bg-green-50 text-[#05893E]"
                                : "bg-red-50 text-red-500"
                        }`}
                    >
                        {isUp ? "▲" : "▼"}{" "}
                        {toBanglaNumber(product.change.pct)}%
                    </span>
                )}
            </div>

            <p className="mt-4 text-sm font-semibold text-[#05893E]">
                বিস্তারিত দেখো →
            </p>
        </Link>
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

    return Number(value)
        .toString()
        .replace(/\d/g, (digit) => banglaDigits[Number(digit)]);
}
