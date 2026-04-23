import Image from "next/image";
import { ChevronRight } from "lucide-react";

const AboutSection = () => {
  return (
    <div
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      id="map"
    >
      {/* Vertical Japanese Text Decoration */}
      <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 text-neutral-800/40 text-[8rem] font-black uppercase tracking-[0.2em] whitespace-nowrap z-0 select-none pointer-events-none [writing-mode:vertical-rl] transition-colors">
        日本の祭り
      </div>

      <div className="flex flex-col lg:flex-row gap-16 items-center relative z-10">
        <div className="w-full lg:w-1/2">
          {/* Proxy image for Japanese rural/mountain roads */}
          <div className="relative rounded-2xl overflow-hidden group border border-neutral-800 shadow-2xl">
            {/* <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay group-hover:bg-transparent transition-all z-10 duration-500"></div> */}
            <Image
              src="/img/ss_ffea3efe4e67b24ceb6f9bd0919b1ebac344b61b.1920x1080.jpg"
              width={400}
              height={400}
              alt="Japanese Mountain Roads"
              className="w-full h-auto object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 z-20 bg-neutral-950/90 backdrop-blur px-4 py-2 rounded-lg border border-red-500/30 flex items-center gap-3">
              <span className="text-red-500 font-bold text-sm tracking-widest uppercase">
                Touge Routes
              </span>
              <span className="text-neutral-500 text-xs font-medium">峠道</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-12 bg-red-500"></span>
            <h2 className="text-red-500 font-bold tracking-widest uppercase text-sm">
              The Festival Returns{" "}
              <span className="ml-2 text-neutral-500 text-xs">祭りの帰還</span>
            </h2>
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            The Ultimate <br />{" "}
            <span className="text-red-500">
              Japan {" "}
            </span>
             Experience
          </h3>
          <p className="text-neutral-400 text-lg leading-relaxed">
            Forza Horizon 6 brings the festival to Japan, a highly requested
            location full of contrast. From the dense, neon-lit streets of{" "}
            <strong>Tokyo</strong>—which is five times larger than any previous
            urban area—to the serene cherry blossoms and winding mountain passes
            of Mount Fuji.
          </p>
          <ul className="space-y-4 pt-4">
            {[
              "Largest open world map in franchise history.",
              "Deep Japanese car culture including Daikoku car meets.",
              "Dynamic seasonal changes affecting the landscape heavily.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <ChevronRight className="w-6 h-6 text-red-500 shrink-0" />
                <span className="text-neutral-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;