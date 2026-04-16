import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-0.5 text-xl font-black uppercase tracking-widest text-white ${className}`}
      aria-label="Diphactory Home"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <span>DIPHACTORY</span>
      <span className="text-accent-red text-2xl leading-none">*</span>
    </Link>
  );
}
