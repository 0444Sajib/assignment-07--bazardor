
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16">
            <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
                <div className="text-7xl" aria-hidden="true">
                    🔎
                </div>

                <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[#05893E]">
                    Error 404
                </p>

                <h1 className="mt-3 text-3xl font-bold text-[#1D271F] sm:text-4xl">
                    পেজটি খুঁজে পাওয়া যায়নি!
                </h1>

                <p className="mt-4 leading-7 text-gray-600">
                    দুঃখিত! তুমি যে পেজটি খুঁজছ, সেটি হয়তো সরিয়ে ফেলা হয়েছে
                    অথবা ঠিকানাটি ভুল হয়েছে।
                </p>

                <Link
                    href="/"
                    className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#05893E] px-6 py-3 font-semibold text-white transition hover:bg-[#047533]"
                >
                    ← হোম পেজে ফিরে যাও
                </Link>
            </div>
        </main>
    );
}
