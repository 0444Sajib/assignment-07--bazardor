
"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error";

type ToastProps = {
  message: string;
  type: ToastType;
  onClose: () => void;
};

export default function Toast({
  message,
  type,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3 rounded-xl border bg-white px-5 py-4 shadow-lg ${
        type === "success"
          ? "border-green-200"
          : "border-red-200"
      }`}
    >
      <span className="text-2xl" aria-hidden="true">
        {type === "success" ? "✅" : "❌"}
      </span>

      <p
        className={`text-sm font-semibold ${
          type === "success"
            ? "text-[#05893E]"
            : "text-red-600"
        }`}
      >
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="নোটিফিকেশন বন্ধ করো"
        className="ml-auto text-lg text-gray-500 hover:text-gray-800"
      >
        ×
      </button>
    </div>
  );
}
