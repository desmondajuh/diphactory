import { MapPin, Phone, Mail } from "lucide-react";

export const Sidebar = () => {
  return (
    <aside className="space-y-8 border-b border-border p-6 md:border-b-0 md:border-r md:p-10">
      <div>
        <p className="mb-4 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          Get in touch
        </p>
        {[
          { Icon: Mail, label: "Email", value: "hello@diphactory.com" },
          { Icon: Phone, label: "Phone", value: "+1 810 000 0000" },
          { Icon: MapPin, label: "Studio", value: "Texas, USA" },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="mb-5 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
              <Icon className="h-3.5 w-3.5 text-accent-red" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                {label}
              </p>
              <p className="text-sm">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          Follow the work
        </p>
        <div className="flex flex-wrap gap-2">
          {["Instagram", "YouTube", "LinkedIn"].map((s) => (
            <button
              key={s}
              className="rounded-full border border-border bg-muted px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent-red hover:text-accent-red"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          Availability
        </p>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted p-3.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.15)]" />
          <div>
            <p className="text-sm font-medium">Currently accepting bookings</p>
            <p className="text-[11px] text-muted-foreground">
              Next available: May 2026
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
