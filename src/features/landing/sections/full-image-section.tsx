import Image from "next/image";
// import { motion } from "motion/react";

export const FullImageSection = () => {
  return (
    // h-screen fills the sticky 100vh container exactly
    // overflow-hidden prevents zoomed image spilling outside
    <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      <Image
        src="/images/bg/parallax-bg-transparent.png"
        alt="Diphactory – digital designer and 3D renderer"
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />

      {/* Foreground content sits above the image */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-5">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-white text-shadow-lg">
          Visual Direction
        </p>
        <h1
          className="font-black text-white leading-none tracking-tight text-shadow-lg"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.5rem, 9vw, 9rem)",
          }}
        >
          DIP<span className="text-accent-red">*</span>
        </h1>
        <p className="max-w-md text-base text-white leading-relaxed  text-shadow-lg">
          Digital designer & 3D renderer with over a decade of crafting visuals
          that move people.
        </p>
      </div>
    </div>
  );
};

export const FullImageSection2 = () => {
  return (
    <div className="relative h-[120vh] w-full flex flex-col items-center justify-center gap-6 bg-white">
      <Image
        src="/images/bg/parallax-bg-1.jpg"
        alt="Diphactory – digital designer and 3D renderer"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover object-center"
        style={{
          height: "48px",
          animation: "scrollPulse 1.8s ease-in-out infinite",
        }}
      />
      <p
        className="text-sm font-semibold tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        Visual Direction
      </p>
      <h1
        className="font-black  leading-none tracking-tight"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(3.5rem, 9vw, 9rem)",
        }}
      >
        Clivelle<span style={{ color: "var(--color-accent-red)" }}>*</span>
      </h1>
      <p
        className="max-w-md text-base leading-relaxed"
        style={{ color: "rgba(255,255,255,0.60)" }}
      >
        Digital designer & 3D renderer with over a decade of crafting visuals
        that move people.
      </p>
      <div className="flex flex-col items-center gap-2 mt-4 opacity-50">
        <span className="text-xs tracking-widest uppercase ">Scroll</span>
        <div
          className="w-px bg-white"
          style={{
            height: "48px",
            animation: "scrollPulse 1.8s ease-in-out infinite",
          }}
        />
      </div>
      <style>{`
        @keyframes scrollPulse {
          0%,100% { opacity:0.2; transform:scaleY(0.4); transform-origin:top; }
          50%      { opacity:1;   transform:scaleY(1);   transform-origin:top; }
        }
      `}</style>
    </div>
  );
};
