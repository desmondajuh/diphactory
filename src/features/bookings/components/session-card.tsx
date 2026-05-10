import { cn } from "@/lib/utils";

// features/bookings/components/session-card.tsx
import { BookingSessionType } from "@/lib/db/schema/bookings";

interface Props {
  session: BookingSessionType;
  selected: boolean;
  onSelect: () => void;
}

export function SessionCard({ session, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative rounded-2xl border p-5 text-left transition-all duration-200",
        selected
          ? "border-accent-brand bg-accent-brand/8"
          : "border-white/8 bg-white/3 hover:border-white/20",
      )}
    >
      <p className="text-sm font-bold text-white mb-1">{session.label}</p>
      <p className="text-xs text-white/40 leading-relaxed mb-4">
        {session.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/30">{session.duration}</span>
        <span className="text-sm font-black text-white">
          ${session.price.toLocaleString()}
        </span>
      </div>
    </button>
  );
}

// import { BookingSessionType } from "@/types/booking-form";

// export function SessionCard({
//   session,
//   selected,
//   onSelect,
// }: {
//   session: BookingSessionType;
//   selected: boolean;
//   onSelect: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onSelect}
//       className={cn(
//         "group relative w-full rounded-2xl border p-5 text-left transition-all duration-300",
//         selected
//           ? "border-accent-brand bg-accent-brand/8"
//           : "border-white/10 bg-white/4 hover:border-white/25 hover:bg-white/7",
//       )}
//     >
//       {/* Selected indicator */}
//       {selected && (
//         <div className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-accent-brand">
//           <svg
//             width="10"
//             height="10"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="white"
//             strokeWidth={3}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M5 13l4 4L19 7"
//             />
//           </svg>
//         </div>
//       )}

//       <div
//         className={cn(
//           "mb-3 transition-colors duration-200",
//           selected
//             ? "text-accent-brand"
//             : "text-white/50 group-hover:text-white/75",
//         )}
//       >
//         {session.icon}
//       </div>

//       <div className="mb-1 flex items-baseline justify-between gap-2">
//         <span className="text-base font-semibold text-white">
//           {session.label}
//         </span>
//         <span className="text-sm font-bold text-white">
//           ${session.price.toLocaleString()}
//         </span>
//       </div>

//       <p className="mb-3 text-xs leading-relaxed text-white/45">
//         {session.description}
//       </p>

//       <div className="flex items-center gap-1.5">
//         <svg
//           width="11"
//           height="11"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth={2}
//           className="text-white/35"
//         >
//           <circle cx="12" cy="12" r="10" />
//           <path strokeLinecap="round" d="M12 6v6l4 2" />
//         </svg>
//         <span className="text-[11px] text-white/40">{session.duration}</span>
//       </div>
//     </button>
//   );
// }
