"use client";

import { useEffect, useState } from "react";

type Product = {
    id: number;
    nameBn: string;
    image: string;
    today: number;
    unit: string;
    change: {
        dir: "up" | "down";
        pct: number;
    };
};

export default function PriceTicker() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("https://api.abcz.workers.dev/api/bazardor/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => {
                console.error("Failed to fetch products:", error);
            });
    }, []);

    return (
        <div className="overflow-hidden border-y border-gray-200 bg-white">
            <div className="marquee flex w-max">

                {/* First List */}
                <div className="flex gap-8 px-4 py-3">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex items-center gap-2 whitespace-nowrap"
                        >
                            <span>{product.image}</span>

                            <span className="font-semibold text-[#1D271F]">
                                {product.nameBn}
                            </span>

                            <span className="text-gray-600">
                                {product.today} টাকা/{product.unit}
                            </span>

                            <span
                                className={
                                    product.change.dir === "up"
                                        ? "text-[#05893E]"
                                        : "text-red-500"
                                }
                            >
                                {product.change.dir === "up" ? "▲" : "▼"}{" "}
                                {product.change.pct}%
                            </span>
                        </div>
                    ))}
                </div>

                {/* Second List */}
                <div className="flex gap-8 px-4 py-3">
                    {products.map((product) => (
                        <div
                            key={`copy-${product.id}`}
                            className="flex items-center gap-2 whitespace-nowrap"
                        >
                            <span>{product.image}</span>

                            <span className="font-semibold text-[#1D271F]">
                                {product.nameBn}
                            </span>

                            <span className="text-gray-600">
                                {product.today} টাকা/{product.unit}
                            </span>

                            <span
                                className={
                                    product.change.dir === "up"
                                        ? "text-[#05893E]"
                                        : "text-red-500"
                                }
                            >
                                {product.change.dir === "up"
                                    ? "▲"
                                    : "▼"}{" "}
                                {product.change.pct}%
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}