// features/admin/sections/views/sections-admin-view.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/orpc";
import { SectionWithItems } from "@/lib/db/schema";
import { SectionFormModal } from "../components/section-form-modal";
import { SectionDeleteModal } from "../components/section-delete-modal";

const TYPE_LABELS: Record<string, string> = {
  hero: "Hero",
  about: "About",
  stats: "Stats",
  features: "Features",
  cta: "CTA Banner",
};

interface Props {
  initialSections: SectionWithItems[];
}

export function SectionsAdminView({ initialSections }: Props) {
  const [sections, setSections] = useState(initialSections);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<SectionWithItems | null>(null);
  const [deleting, setDeleting] = useState<SectionWithItems | null>(null);

  // group by page
  const grouped = sections.reduce<Record<string, SectionWithItems[]>>(
    (acc, s) => {
      acc[s.pageSlug] = acc[s.pageSlug] ?? [];
      acc[s.pageSlug].push(s);
      return acc;
    },
    {},
  );

  const refresh = async () => {
    const data = await client.sections.listAll();
    setSections(data);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await client.sections.remove({ id: deleting.id });
      toast.success("Section deleted");
      setDeleting(null);
      await refresh();
    } catch {
      toast.error("Failed to delete section");
    }
  };

  const handleToggle = async (section: SectionWithItems) => {
    try {
      await client.sections.toggleActive({
        id: section.id,
        isActive: !section.isActive,
      });
      await refresh();
    } catch {
      toast.error("Failed to update section");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Page Sections</h1>
          <p className="text-sm text-white/35 mt-1">
            {sections.length} sections across {Object.keys(grouped).length}{" "}
            pages
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="rounded-full bg-white text-[#0e0e0e] px-6 py-2.5 text-sm font-bold hover:bg-white/90 transition-all"
        >
          + New section
        </button>
      </div>

      {/* Grouped by page */}
      <div className="space-y-10">
        {Object.entries(grouped).map(([pageSlug, pageSections]) => (
          <div key={pageSlug}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/25 mb-4">
              /{pageSlug}
            </p>
            <div className="space-y-3">
              {pageSections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-2xl border border-white/8 bg-white/3 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                          {TYPE_LABELS[section.sectionType]}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            section.isActive
                              ? "bg-green-500/10 text-green-400"
                              : "bg-white/8 text-white/30"
                          }`}
                        >
                          {section.isActive ? "Live" : "Hidden"}
                        </span>
                        <span className="text-[10px] text-white/20 font-mono">
                          /{section.slug}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white truncate">
                        {section.sectionName}
                      </p>
                      {section.title && (
                        <p className="text-xs text-white/35 truncate">
                          {section.title}
                        </p>
                      )}
                      {/* Item counts for stats/features */}
                      {section.sectionType === "stats" &&
                        section.statItems.length > 0 && (
                          <p className="text-[11px] text-white/25">
                            {section.statItems.length} stat items
                          </p>
                        )}
                      {section.sectionType === "features" &&
                        section.featureItems.length > 0 && (
                          <p className="text-[11px] text-white/25">
                            {section.featureItems.length} feature cards
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditing(section)}
                        className="rounded-full border border-white/12 px-4 py-1.5 text-xs font-medium text-white/50 hover:text-white hover:border-white/25 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(section)}
                        className="rounded-full border border-red-500/20 px-4 py-1.5 text-xs font-medium text-red-400/70 hover:border-red-500/40 hover:text-red-400 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                    <button
                      onClick={() => handleToggle(section)}
                      className="text-xs text-white/30 hover:text-white/60 transition-colors"
                    >
                      {section.isActive ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <SectionFormModal
          section={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={async () => {
            setCreating(false);
            setEditing(null);
            await refresh();
          }}
        />
      )}

      {deleting && (
        <SectionDeleteModal
          section={deleting}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
