// features/admin/bookings/views/bookings-admin-view.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/orpc";
import { cn } from "@/lib/utils";
import type { Outputs } from "@/orpc/routers";
import { authClient } from "@/lib/auth-client";

type Booking = Outputs["bookings"]["list"][number];
type SessionType = Outputs["bookings"]["listAllSessionTypes"][number];
type TimeSlot = Outputs["bookings"]["listAllTimeSlots"][number];

type Tab = "bookings" | "sessions" | "slots";

interface Props {
  initialBookings: Booking[];
  initialSessionTypes: SessionType[];
  initialTimeSlots: TimeSlot[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-green-500/10 text-green-400",
  completed: "bg-blue-500/10 text-blue-400",
  cancelled: "bg-red-500/10 text-red-400",
};

export function BookingsAdminView({
  initialBookings,
  initialSessionTypes,
  initialTimeSlots,
}: Props) {
  // ── Role gate ──
  const { data: session } = authClient.useSession();
  const isSuperAdmin = session?.user?.role === "super_admin";

  const [activeTab, setActiveTab] = useState<Tab>("bookings");
  const [bookings, setBookings] = useState(initialBookings);
  const [sessionTypes, setSessionTypes] = useState(initialSessionTypes);
  const [timeSlots, setTimeSlots] = useState(initialTimeSlots);

  // ── session type form state ──
  const [sessionForm, setSessionForm] = useState({
    label: "",
    description: "",
    duration: "",
    price: "",
  });
  const [editingSession, setEditingSession] = useState<SessionType | null>(
    null,
  );

  // ── time slot form state ──
  const [slotForm, setSlotForm] = useState({ time: "" });

  const refreshBookings = async () => setBookings(await client.bookings.list());
  const refreshSessionTypes = async () =>
    setSessionTypes(await client.bookings.listAllSessionTypes());
  const refreshTimeSlots = async () =>
    setTimeSlots(await client.bookings.listAllTimeSlots());

  const handleStatusChange = async (
    bookingId: string,
    status: Booking["status"],
  ) => {
    try {
      await client.bookings.updateStatus({ bookingId, status });
      toast.success("Status updated");
      await refreshBookings();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleSaveSession = async () => {
    if (!sessionForm.label || !sessionForm.duration || !sessionForm.price) {
      toast.error("Label, duration and price are required");
      return;
    }
    try {
      if (editingSession) {
        await client.bookings.updateSessionType({
          id: editingSession.id,
          label: sessionForm.label,
          description: sessionForm.description || null,
          duration: sessionForm.duration,
          price: Number(sessionForm.price),
        });
        toast.success("Session type updated");
        setEditingSession(null);
      } else {
        await client.bookings.createSessionType({
          label: sessionForm.label,
          description: sessionForm.description || null,
          duration: sessionForm.duration,
          price: Number(sessionForm.price),
        });
        toast.success("Session type created");
      }
      setSessionForm({ label: "", description: "", duration: "", price: "" });
      await refreshSessionTypes();
    } catch {
      toast.error("Failed to save session type");
    }
  };

  const handleDeleteSession = async (id: string) => {
    // console.log("clicked");
    try {
      await client.bookings.deleteSessionType({ id });
      toast.success("Deleted");
      await refreshSessionTypes();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggleSession = async (s: SessionType) => {
    try {
      await client.bookings.updateSessionType({
        id: s.id,
        isActive: !s.isActive,
      });
      await refreshSessionTypes();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleSaveSlot = async () => {
    if (!slotForm.time.trim()) {
      toast.error("Time is required");
      return;
    }
    try {
      await client.bookings.createTimeSlot({
        time: slotForm.time,
        sortOrder: timeSlots.length,
      });
      toast.success("Time slot added");
      setSlotForm({ time: "" });
      await refreshTimeSlots();
    } catch {
      toast.error("Failed to add slot");
    }
  };

  const handleToggleSlot = async (slot: TimeSlot) => {
    try {
      await client.bookings.updateTimeSlot({
        id: slot.id,
        isActive: !slot.isActive,
      });
      await refreshTimeSlots();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      await client.bookings.deleteTimeSlot({ id });
      toast.success("Deleted");
      await refreshTimeSlots();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-white/20";

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Bookings</h1>
          <p className="text-sm text-white/35 mt-1">
            {bookings.length} total bookings
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-8 border-b border-white/8">
        {(
          [
            { id: "bookings", label: "Bookings" },
            { id: "sessions", label: "Session Types" },
            { id: "slots", label: "Time Slots" },
          ] as { id: Tab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-white text-white"
                : "border-transparent text-white/30 hover:text-white/60",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Bookings tab ── */}
      {activeTab === "bookings" && (
        <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="custom-input h-full rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        STATUS_COLORS[booking.status],
                      )}
                    >
                      {booking.status}
                    </span>
                    <span className="text-xs text-white/30">
                      {booking.sessionType}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {booking.firstName} {booking.lastName}
                  </p>
                  <p className="text-xs text-white/35">{booking.email}</p>
                  <p className="text-xs text-white/25">
                    {booking.preferredDate} · {booking.timeSlot}
                  </p>
                </div>

                <select
                  value={booking.status}
                  onChange={(e) =>
                    handleStatusChange(
                      booking.id,
                      e.target.value as Booking["status"],
                    )
                  }
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-accent-brand outline-none focus:border-white/25 shrink-0"
                >
                  {["pending", "confirmed", "completed", "cancelled"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ),
                  )}
                </select>
              </div>
              {booking.notes && (
                <p className="text-xs text-white/30 italic border-t border-white/6 pt-3 line-clamp-2">
                  &quot;{booking.notes}&quot;
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Session types tab ── */}
      {activeTab === "sessions" && (
        <div className="space-y-6">
          {/* Form */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">
              {editingSession ? "Edit session type" : "New session type"}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <input
                value={sessionForm.label}
                onChange={(e) =>
                  setSessionForm((p) => ({ ...p, label: e.target.value }))
                }
                className={inputCls}
                placeholder="Label (e.g. Portrait)"
              />
              <input
                value={sessionForm.duration}
                onChange={(e) =>
                  setSessionForm((p) => ({ ...p, duration: e.target.value }))
                }
                className={inputCls}
                placeholder="Duration (e.g. 2 hrs)"
              />
            </div>
            <textarea
              value={sessionForm.description}
              onChange={(e) =>
                setSessionForm((p) => ({ ...p, description: e.target.value }))
              }
              className={`${inputCls} resize-none`}
              rows={2}
              placeholder="Description..."
            />
            <div className="flex items-center gap-4">
              <input
                value={sessionForm.price}
                onChange={(e) =>
                  setSessionForm((p) => ({ ...p, price: e.target.value }))
                }
                className={cn(inputCls, "flex-1")}
                placeholder="Price (USD)"
                type="number"
              />
              <button
                onClick={handleSaveSession}
                className="rounded-full bg-white text-[#0e0e0e] px-6 py-2.5 text-sm font-bold hover:bg-white/90 transition-all shrink-0"
              >
                {editingSession ? "Update" : "Add"}
              </button>
              {editingSession && (
                <button
                  onClick={() => {
                    setEditingSession(null);
                    setSessionForm({
                      label: "",
                      description: "",
                      duration: "",
                      price: "",
                    });
                  }}
                  className="text-xs text-white/30 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            {sessionTypes.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-white/8 bg-white/3 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        {s.label}
                      </p>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          s.isActive
                            ? "bg-green-500/10 text-green-400"
                            : "bg-white/8 text-white/30",
                        )}
                      >
                        {s.isActive ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <p className="text-xs text-white/35 truncate">
                      {s.description}
                    </p>
                    <p className="text-xs text-white/25">
                      {s.duration} · ${s.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingSession(s);
                        setSessionForm({
                          label: s.label,
                          description: s.description ?? "",
                          duration: s.duration,
                          price: String(s.price),
                        });
                      }}
                      className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-white/50 hover:text-white hover:border-white/25 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleSession(s)}
                      className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
                    >
                      {s.isActive ? "Hide" : "Show"}
                    </button>
                    <button
                      disabled={!isSuperAdmin}
                      onClick={() => handleDeleteSession(s.id)}
                      className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-red-400/50 hover:text-red-400 transition-colors  disabled:text-gray-500 disabled:cursor-not-allowed "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Time slots tab ── */}
      {activeTab === "slots" && (
        <div className="space-y-6">
          {/* Add form */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">
              Add time slot
            </p>
            <div className="flex gap-3">
              <input
                value={slotForm.time}
                onChange={(e) => setSlotForm({ time: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSaveSlot()}
                className={cn(inputCls, "flex-1")}
                placeholder="e.g. 8:00 AM"
              />
              <button
                onClick={handleSaveSlot}
                className="rounded-full bg-white text-[#0e0e0e] px-6 py-2.5 text-sm font-bold hover:bg-white/90 transition-all shrink-0"
              >
                Add
              </button>
            </div>
          </div>

          {/* Slot list */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {timeSlots.map((slot) => (
              <div
                key={slot.id}
                className={cn(
                  "rounded-xl border p-4 space-y-3 transition-all",
                  slot.isActive
                    ? "border-white/8 bg-white/3"
                    : "border-white/4 bg-white/1 opacity-50",
                )}
              >
                <p className="text-sm font-semibold text-white">{slot.time}</p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleToggleSlot(slot)}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    {slot.isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="text-xs text-red-400/50 hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
