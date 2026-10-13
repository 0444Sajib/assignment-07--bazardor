

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 w-full bg-white">
      <div className="w-full border-t border-[#E1E9E1] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="text-center sm:text-left">
            <Link
              href="/"
              className="text-lg font-bold text-[#1D271F] transition-colors hover:text-[#05893E]"
            >
              বাজার দর
            </Link>

            <p className="mt-1 text-sm text-[#59635B]">
              প্রয়োজনীয় পণ্যের দাম এক নজরে।
            </p>
          </div>

          <p className="max-w-md text-center text-xs leading-6 text-[#59635B] sm:text-right sm:text-sm">
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </div>
    </footer>
  );
}
