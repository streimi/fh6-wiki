import { ArrowRight, Map } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
    return (
        <div
            className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
            id="overview"
        >
            {/* Background Image - Retains dark theme appearance for visual impact */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105"
            // style={{
            //   backgroundImage:
            //     'url("https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2000&q=80")',
            // }}
            >
                <Image src="/img/dlcc6xx-5379ed67-d386-40aa-9fee-099bba1bb728.jpg"
                    className="object-cover"
                    alt="Background"
                    fill
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent z-10 transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/50 to-transparent z-10" />
            </div>

            {/* Massive background Katakana */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-10 pointer-events-none select-none opacity-[0.03]">
                <span className="text-[15rem] md:text-[20rem] font-black text-white whitespace-nowrap">
                    ホライゾン
                </span>
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left pt-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold mb-6 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Releasing May 19, 2026
                </div>

                <p className="text-red-500 font-bold tracking-[0.4em] mb-2 text-sm md:text-base drop-shadow-md">
                    フォルツァ ホライゾン 6
                </p>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase mb-2 drop-shadow-lg">
                    Forza Horizon{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                        6
                    </span>
                </h1>

                <p className="mt-4 max-w-2xl text-lg md:text-2xl text-neutral-200 font-light drop-shadow-md">
                    Welcome to Japan. Experience the stunning contrasts of rural and urban
                    in the largest, most dense Horizon map ever created.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">

                    {/* OLD STYLE: Vehicles button */}
                    <Link href="/vehicles">
                        <button className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-sm uppercase tracking-wider transition-all flex items-center gap-2 transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-red-600/30 duration-300 cursor-pointer">
                            Explore Vehicles <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>

                    {/* NEW STYLE: Map button (icon reveal) */}
                    <Link
                        href="/map"
                        className="group flex items-center bg-neutral-800/80 hover:bg-neutral-700 text-white font-bold rounded-sm uppercase tracking-wider backdrop-blur-sm border border-neutral-700 overflow-hidden transition-all duration-500 active:scale-95"
                    >
                        {/* Icon */}
                        <div className="px-4 py-3 flex items-center justify-center">
                            <Map className="w-5 h-5" />
                        </div>

                        {/* Animated Text */}
                        <span className="overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-[160px] transition-[max-width] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]">
                            <span className="inline-block pr-6 translate-x-[-8px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-400 ease-[cubic-bezier(.2,.8,.2,1)]">
                                View Map
                            </span>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;