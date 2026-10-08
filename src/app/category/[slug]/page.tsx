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

export default function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [slug, setSlug] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    // Sort state
    const [sort, setSort] = useState("default");

    useEffect(() => {
        params.then((data) => {
            setSlug(data.slug);
        });
    }, [params]);

    useEffect(() => {
        if (!slug) return;

        async function fetchData() {
            try {
                setLoading(true);

                const [productsResponse, categoriesResponse] =
                    await Promise.all([
                        fetch(
                            `https://api.abcz.workers.dev/api/bazardor/products?category=${slug}`
                        ),
                        fetch(
                            "https://api.abcz.workers.dev/api/bazardor/categories"
                        ),
                    ]);

                const productsData = await productsResponse.json();
                const categoriesData = await categoriesResponse.json();

                setProducts(productsData);

                const foundCategory = categoriesData.find(
                    (item: Category) => item.slug === slug
                );

                setCategory(foundCategory || null);
            } catch (error) {
                console.error("Failed to fetch category:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [slug]);

    // Sort products by today's price
    const sortedProducts = [...products].sort((a, b) => {
        if (sort === "asc") {
            return a.today - b.today;
        }

        if (sort === "desc") {
            return b.today - a.today;
        }

        return 0;
    });

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200" />

                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="h-64 animate-pulse rounded-2xl bg-white"
                            />
                        ))}
                    </div>
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
                        আপনি যে ক্যাটাগরিটি খুঁজছেন সেটি পাওয়া যায়নি।
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
                {/* Category Header */}
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">
                                {category.icon}
                            </span>

                            <h1 className="text-3xl font-bold text-[#1D271F]">
                                {category.nameBn}
                            </h1>
                        </div>

                        <p className="mt-2 text-gray-600">
                            {category.nameBn} বিভাগের আজকের বাজার দর
                        </p>
                    </div>

                    {/* Sort Dropdown */}
                    <div>
                        <label
                            htmlFor="sort"
                            className="mb-2 block text-sm font-semibold text-[#1D271F]"
                        >
                            সাজান
                        </label>

                        <select
                            id="sort"
                            value={sort}
                            onChange={(event) =>
                                setSort(event.target.value)
                            }
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-[#1D271F] outline-none focus:border-[#05893E]"
                        >
                            <option value="default">
                                ডিফল্ট
                            </option>

                            <option value="asc">
                                দাম কম → বেশি
                            </option>

                            <option value="desc">
                                দাম বেশি → কম
                            </option>
                        </select>
                    </div>
                </div>

                {/* Products */}
                {products.length === 0 ? (
                    <div className="rounded-2xl bg-white px-6 py-16 text-center">
                        <div className="text-5xl">📦</div>

                        <h2 className="mt-4 text-2xl font-bold text-[#1D271F]">
                            কোনো পণ্য পাওয়া যায়নি
                        </h2>

                        <p className="mt-2 text-gray-600">
                            এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।
                        </p>
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
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-xl bg-gray-50 text-5xl">
                {product.image || product.categoryIcon}
            </div>

            <h2 className="text-lg font-bold text-[#1D271F]">
                {product.nameBn}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                প্রতি {getUnitName(product.unit)}
            </p>

            <div className="mt-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        আজকের দাম
                    </p>

                    <p className="text-xl font-bold text-[#1D271F]">
                        {toBanglaNumber(product.today)} টাকা
                    </p>
                </div>

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
        .replace(/\d/g, (digit) => banglaDigits[Number(digit)]);
}