export default function Hero() {
    return (
        <section className="bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-10 px-4 py-16">

                {/* Left Content */}
                <div className="max-w-xl">

                    <p className="mb-3 text-sm font-semibold text-[#05893E]">
                        প্রতিদিনের বাজারের সর্বশেষ খবর
                    </p>

                    <h2 className="text-4xl font-bold leading-tight text-[#1D271F]">
                        বাজারের সঠিক দাম,
                        <br />
                        এক নজরে
                    </h2>

                    <p className="mt-4 text-lg text-gray-600">
                        আপনার প্রয়োজনীয় পণ্যের আজকের বাজার দর
                        সহজেই জেনে নিন।
                    </p>

                    <button className="mt-6 rounded-lg bg-[#05893E] px-6 py-3 font-semibold text-white hover:bg-[#047533]">
                        সব পণ্য দেখুন
                    </button>

                </div>

                {/* Banner Image */}
                <div className="hidden md:block">
                    <img
                        src="/bazar-hero.png"
                        alt="বাজার দর"
                        className="h-72 w-96 rounded-2xl object-cover"
                    />
                </div>

            </div>
        </section>
    );
}