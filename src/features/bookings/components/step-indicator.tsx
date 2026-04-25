import { BOOKING_STEPS } from "@/datas/bookings";
import { cn } from "@/lib/utils";

export function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-3">
      {BOOKING_STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300",
                i < current
                  ? "bg-accent-red text-white"
                  : i === current
                    ? "bg-white text-[#0e0e0e]"
                    : "border border-white/20 text-white/30",
              )}
            >
              {i < current ? (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={cn(
                "hidden text-xs font-medium tracking-wide sm:block transition-colors duration-300",
                i === current
                  ? "text-white"
                  : i < current
                    ? "text-white/60"
                    : "text-white/25",
              )}
            >
              {label}
            </span>
          </div>
          {i < total - 1 && (
            <div
              className={cn(
                "h-px w-6 transition-colors duration-300",
                i < current ? "bg-accent-red" : "bg-white/15",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
