/* eslint-disable @next/next/no-img-element */
// features/admin/sections/components/section-form-modal.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/lib/orpc";
import { SectionWithItems } from "@/lib/db/schema";
import { useUploadThing } from "@/lib/uploadthing-client";
import { cn } from "@/lib/utils";

type SectionType = "hero" | "about" | "stats" | "features" | "cta";

interface StatRow {
  id?: string;
  value: string;
  label: string;
  sortOrder: number;
}
interface FeatureRow {
  id?: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  imageUtKey: string;
  ctaText: string;
  ctaLink: string;
  sortOrder: number;
}

interface Props {
  section: SectionWithItems | null;
  onClose: () => void;
  onSaved: () => void;
}

export function SectionFormModal({ section, onClose, onSaved }: Props) {
  const isEditing = !!section;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const { startUpload } = useUploadThing("galleryUploader");

  const [form, setForm] = useState({
    pageSlug: section?.pageSlug ?? "",
    sectionType: (section?.sectionType ?? "hero") as SectionType,
    sectionName: section?.sectionName ?? "",
    slug: section?.slug ?? "",
    badge: section?.badge ?? "",
    title: section?.title ?? "",
    subtitle: section?.subtitle ?? "",
    description: section?.description ?? "",
    image: section?.image ?? "",
    imageUtKey: section?.imageUtKey ?? "",
    imageAlt: section?.imageAlt ?? "",
    bgImage: section?.bgImage ?? "",
    bgImageUtKey: section?.bgImageUtKey ?? "",
    ctaText: section?.ctaText ?? "",
    ctaLink: section?.ctaLink ?? "",
    ctaSecondaryText: section?.ctaSecondaryText ?? "",
    ctaSecondaryLink: section?.ctaSecondaryLink ?? "",
    isActive: section?.isActive ?? true,
  });

  const [stats, setStats] = useState<StatRow[]>(
    section?.statItems.map((s) => ({
      id: s.id,
      value: s.value,
      label: s.label,
      sortOrder: s.sortOrder,
    })) ?? [],
  );

  const [featureUploading, setFeatureUploading] = useState<number | null>(null);

  const [features, setFeatures] = useState<FeatureRow[]>(
    section?.featureItems.map((f) => ({
      id: f.id,
      icon: f.icon ?? "",
      title: f.title,
      description: f.description ?? "",
      image: f.image ?? "",
      imageUtKey: f.imageUtKey ?? "",
      ctaText: f.ctaText ?? "",
      ctaLink: f.ctaLink ?? "",
      sortOrder: f.sortOrder,
    })) ?? [],
  );

  const setField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = async (
    field: "image" | "bgImage",
    utKeyField: "imageUtKey" | "bgImageUtKey",
    file: File,
  ) => {
    setUploadingField(field);
    try {
      const results = await startUpload([file]);
      //   if (results?.[0]) setField(field, results[0].ufsUrl);
      if (results?.[0]) {
        setForm((prev) => ({
          ...prev,
          [field]: results[0].ufsUrl,
          [utKeyField]: results[0].key, // ← save the key
        }));
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingField(null);
    }
  };

  const handleFeatureImageUpload = async (index: number, file: File) => {
    setFeatureUploading(index);
    try {
      const results = await startUpload([file]);
      if (results?.[0]) {
        setFeatures((prev) =>
          prev.map((f, j) =>
            j === index
              ? { ...f, image: results[0].ufsUrl, imageUtKey: results[0].key }
              : f,
          ),
        );
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setFeatureUploading(null);
    }
  };

  const handleSubmit = async () => {
    if (!form.pageSlug || !form.sectionName || !form.slug) {
      toast.error("Page, name and slug are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        imageUtKey: form.imageUtKey || null,
        bgImageUtKey: form.bgImageUtKey || null,
        statItems: form.sectionType === "stats" ? stats : undefined,
        featureItems: form.sectionType === "features" ? features : undefined,
      };

      if (isEditing) {
        await client.sections.update({ id: section.id, ...payload });
        toast.success("Section updated");
      } else {
        await client.sections.create(payload);
        toast.success("Section created");
      }
      onSaved();
    } catch {
      toast.error("Failed to save section");
    } finally {
      setIsSubmitting(false);
    }
  };

  const needsImage = ["hero", "about", "features"].includes(form.sectionType);
  const needsBgImage = ["hero", "cta"].includes(form.sectionType);
  const needsStats = form.sectionType === "stats";
  const needsFeatures = form.sectionType === "features";
  const needsCta = ["hero", "about", "cta", "features"].includes(
    form.sectionType,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0e0e0e] p-6 space-y-6 my-auto">
        <p className="text-base font-semibold text-white">
          {isEditing ? "Edit section" : "New section"}
        </p>

        {/* Base fields */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Page slug" placeholder="home, about, services">
            <input
              value={form.pageSlug}
              onChange={(e) => setField("pageSlug", e.target.value)}
              className={inputCls}
              placeholder="home"
            />
          </Field>
          <Field label="Section type">
            <select
              value={form.sectionType}
              onChange={(e) =>
                setField("sectionType", e.target.value as SectionType)
              }
              className={cn(inputCls, "text-accent-red")}
            >
              {["hero", "about", "stats", "features", "cta"].map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Section name (internal)">
            <input
              value={form.sectionName}
              onChange={(e) => setField("sectionName", e.target.value)}
              className={inputCls}
              placeholder="Home Hero"
            />
          </Field>
          <Field label="Slug (unique)">
            <input
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              className={inputCls}
              placeholder="home-hero"
            />
          </Field>
        </div>

        {/* Content fields */}
        <div className="space-y-4">
          <Field label="Badge">
            <input
              value={form.badge}
              onChange={(e) => setField("badge", e.target.value)}
              className={inputCls}
              placeholder="Section badge"
            />
          </Field>
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className={inputCls}
              placeholder="Section headline"
            />
          </Field>
          <Field label="Subtitle">
            <input
              value={form.subtitle}
              onChange={(e) => setField("subtitle", e.target.value)}
              className={inputCls}
              placeholder="Small label above title"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Supporting text..."
            />
          </Field>
        </div>

        {/* Image uploads */}
        {needsImage && (
          <ImageUploadField
            label="Image"
            value={form.image}
            altValue={form.imageAlt}
            onAltChange={(v) => setField("imageAlt", v)}
            onUpload={(f) => handleImageUpload("image", "imageUtKey", f)}
            uploading={uploadingField === "image"}
          />
        )}
        {needsBgImage && (
          <ImageUploadField
            label="Background image"
            value={form.bgImage}
            onUpload={(f) => handleImageUpload("bgImage", "bgImageUtKey", f)}
            uploading={uploadingField === "bgImage"}
          />
        )}

        {/* CTA fields */}
        {needsCta && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="CTA text">
              <input
                value={form.ctaText}
                onChange={(e) => setField("ctaText", e.target.value)}
                className={inputCls}
                placeholder="Book now"
              />
            </Field>
            <Field label="CTA link">
              <input
                value={form.ctaLink}
                onChange={(e) => setField("ctaLink", e.target.value)}
                className={inputCls}
                placeholder="/bookings"
              />
            </Field>
            <Field label="Secondary CTA text">
              <input
                value={form.ctaSecondaryText}
                onChange={(e) => setField("ctaSecondaryText", e.target.value)}
                className={inputCls}
                placeholder="View work"
              />
            </Field>
            <Field label="Secondary CTA link">
              <input
                value={form.ctaSecondaryLink}
                onChange={(e) => setField("ctaSecondaryLink", e.target.value)}
                className={inputCls}
                placeholder="/gallery"
              />
            </Field>
          </div>
        )}

        {/* Stat items */}
        {needsStats && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Stat items
              </p>
              <button
                onClick={() =>
                  setStats((prev) => [
                    ...prev,
                    { value: "", label: "", sortOrder: prev.length },
                  ])
                }
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                + Add stat
              </button>
            </div>
            {stats.map((stat, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
              >
                <input
                  value={stat.value}
                  onChange={(e) =>
                    setStats((prev) =>
                      prev.map((s, j) =>
                        j === i ? { ...s, value: e.target.value } : s,
                      ),
                    )
                  }
                  className={inputCls}
                  placeholder="500+"
                />
                <input
                  value={stat.label}
                  onChange={(e) =>
                    setStats((prev) =>
                      prev.map((s, j) =>
                        j === i ? { ...s, label: e.target.value } : s,
                      ),
                    )
                  }
                  className={inputCls}
                  placeholder="Projects"
                />
                <button
                  onClick={() =>
                    setStats((prev) => prev.filter((_, j) => j !== i))
                  }
                  className="text-white/20 hover:text-red-400 transition-colors text-xs px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Feature items */}
        {needsFeatures && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Feature cards
              </p>
              <button
                onClick={() =>
                  setFeatures((prev) => [
                    ...prev,
                    {
                      icon: "",
                      title: "",
                      description: "",
                      image: "",
                      imageUtKey: "",
                      ctaText: "",
                      ctaLink: "",
                      sortOrder: prev.length,
                    },
                  ])
                }
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                + Add card
              </button>
            </div>
            {features.map((feature, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/8 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/30">Card {i + 1}</p>
                  <button
                    onClick={() =>
                      setFeatures((prev) => prev.filter((_, j) => j !== i))
                    }
                    className="text-white/20 hover:text-red-400 transition-colors text-xs"
                  >
                    ✕ Remove
                  </button>
                </div>

                {/* Image upload */}
                <div className="flex items-center gap-3">
                  {feature.image && (
                    <img
                      src={feature.image}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                  )}
                  <label
                    className={`flex-1 flex items-center justify-center rounded-xl border border-dashed border-white/10 px-4 py-2.5 text-xs text-white/30 hover:border-white/25 hover:text-white/60 transition-all cursor-pointer ${featureUploading === i ? "animate-pulse" : ""}`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFeatureImageUpload(i, f);
                      }}
                    />
                    {featureUploading === i
                      ? "Uploading..."
                      : feature.image
                        ? "Replace image"
                        : "Upload image"}
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={feature.icon}
                    onChange={(e) =>
                      setFeatures((prev) =>
                        prev.map((f, j) =>
                          j === i ? { ...f, icon: e.target.value } : f,
                        ),
                      )
                    }
                    className={inputCls}
                    placeholder="Icon (emoji or name)"
                  />
                  <input
                    value={feature.title}
                    onChange={(e) =>
                      setFeatures((prev) =>
                        prev.map((f, j) =>
                          j === i ? { ...f, title: e.target.value } : f,
                        ),
                      )
                    }
                    className={inputCls}
                    placeholder="Card title"
                  />
                </div>
                <textarea
                  value={feature.description}
                  onChange={(e) =>
                    setFeatures((prev) =>
                      prev.map((f, j) =>
                        j === i ? { ...f, description: e.target.value } : f,
                      ),
                    )
                  }
                  className={`${inputCls} resize-none`}
                  rows={2}
                  placeholder="Description..."
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={feature.ctaText}
                    onChange={(e) =>
                      setFeatures((prev) =>
                        prev.map((f, j) =>
                          j === i ? { ...f, ctaText: e.target.value } : f,
                        ),
                      )
                    }
                    className={inputCls}
                    placeholder="Link text"
                  />
                  <input
                    value={feature.ctaLink}
                    onChange={(e) =>
                      setFeatures((prev) =>
                        prev.map((f, j) =>
                          j === i ? { ...f, ctaLink: e.target.value } : f,
                        ),
                      )
                    }
                    className={inputCls}
                    placeholder="/services"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setField("isActive", e.target.checked)}
            className="h-4 w-4 accent-red-500"
          />
          <span className="text-sm text-white/50">Live on site</span>
        </label>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="rounded-full border border-white/12 px-5 py-2 text-sm font-medium text-white/50 hover:text-white hover:border-white/25 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-full bg-white px-6 py-2 text-sm font-bold text-[#0e0e0e] hover:bg-white/90 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-white/20";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
        {label}
      </label>
      {children}
    </div>
  );
}

function ImageUploadField({
  label,
  value,
  altValue,
  onAltChange,
  onUpload,
  uploading,
}: {
  label: string;
  value: string;
  altValue?: string;
  onAltChange?: (v: string) => void;
  onUpload: (f: File) => void;
  uploading: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
        {label}
      </p>
      <div className="flex items-center gap-3">
        {value && (
          <img
            src={value}
            alt=""
            className="w-16 h-16 rounded-lg object-cover border border-white/10"
          />
        )}
        <label
          className={`flex-1 flex items-center justify-center rounded-xl border border-dashed border-white/10 px-4 py-3 text-xs text-white/30 hover:border-white/25 hover:text-white/60 transition-all cursor-pointer ${uploading ? "animate-pulse" : ""}`}
        >
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
            }}
          />
          {uploading
            ? "Uploading..."
            : value
              ? "Replace image"
              : "Upload image"}
        </label>
      </div>
      {altValue !== undefined && onAltChange && (
        <input
          value={altValue}
          onChange={(e) => onAltChange(e.target.value)}
          className={inputCls}
          placeholder="Alt text for accessibility"
        />
      )}
    </div>
  );
}
