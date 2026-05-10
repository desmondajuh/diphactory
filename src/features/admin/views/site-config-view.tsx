// features/admin/site-config/views/site-config-view.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import NextImage from "next/image";
import { client } from "@/lib/orpc";
import { SiteConfig } from "@/lib/db/schema/site-config";
import { useUploadThing } from "@/lib/uploadthing-client";
import { cn } from "@/lib/utils";

interface Props {
  initialConfig: SiteConfig;
}

type Tab = "brand" | "contact" | "social" | "seo" | "settings";

const TABS: { id: Tab; label: string }[] = [
  { id: "brand", label: "Brand" },
  { id: "contact", label: "Contact" },
  { id: "social", label: "Social" },
  { id: "seo", label: "SEO" },
  { id: "settings", label: "Settings" },
];

export function SiteConfigView({ initialConfig }: Props) {
  const [config, setConfig] = useState(initialConfig);
  const [activeTab, setActiveTab] = useState<Tab>("brand");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const { startUpload } = useUploadThing("galleryUploader");

  const [form, setForm] = useState({
    businessName: config.businessName,
    shortName: config.shortName,
    tagline: config.tagline ?? "",
    description: config.description ?? "",
    logoUrl: config.logoUrl ?? "",
    logoUtKey: config.logoUtKey ?? "",
    iconUrl: config.iconUrl ?? "",
    iconUtKey: config.iconUtKey ?? "",
    email: config.email ?? "",
    phone: config.phone ?? "",
    whatsapp: config.whatsapp ?? "",
    address: config.address ?? "",
    city: config.city ?? "",
    country: config.country ?? "",
    instagram: config.instagram ?? "",
    facebook: config.facebook ?? "",
    twitter: config.twitter ?? "",
    youtube: config.youtube ?? "",
    tiktok: config.tiktok ?? "",
    linkedin: config.linkedin ?? "",
    metaTitle: config.metaTitle ?? "",
    metaDescription: config.metaDescription ?? "",
    ogImage: config.ogImage ?? "",
    ogImageUtKey: config.ogImageUtKey ?? "",
    maintenanceMode: config.maintenanceMode,
  });

  const setField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleAssetUpload = async (
    urlField: "logoUrl" | "iconUrl" | "ogImage",
    keyField: "logoUtKey" | "iconUtKey" | "ogImageUtKey",
    file: File,
  ) => {
    setUploadingField(urlField);
    try {
      const results = await startUpload([file]);
      if (results?.[0]) {
        setForm((prev) => ({
          ...prev,
          [urlField]: results[0].ufsUrl,
          [keyField]: results[0].key,
        }));
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const updated = await client.siteConfig.update({
        ...form,
        tagline: form.tagline || null,
        description: form.description || null,
        logoUrl: form.logoUrl || null,
        logoUtKey: form.logoUtKey || null,
        iconUrl: form.iconUrl || null,
        iconUtKey: form.iconUtKey || null,
        email: form.email || null,
        phone: form.phone || null,
        whatsapp: form.whatsapp || null,
        address: form.address || null,
        city: form.city || null,
        country: form.country || null,
        instagram: form.instagram || null,
        facebook: form.facebook || null,
        twitter: form.twitter || null,
        youtube: form.youtube || null,
        tiktok: form.tiktok || null,
        linkedin: form.linkedin || null,
        metaTitle: form.metaTitle || null,
        metaDescription: form.metaDescription || null,
        ogImage: form.ogImage || null,
        ogImageUtKey: form.ogImageUtKey || null,
      });
      setConfig(updated);
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Site Settings</h1>
          <p className="text-sm text-white/35 mt-1">
            Manage your business info, contact details and social links
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="rounded-full bg-white text-[#0e0e0e] px-6 py-2.5 text-sm font-bold hover:bg-white/90 disabled:opacity-50 transition-all"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-8 border-b border-white/8 pb-0">
        {TABS.map((tab) => (
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

      {/* ── Brand ── */}
      {activeTab === "brand" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Business name">
              <input
                value={form.businessName}
                onChange={(e) => setField("businessName", e.target.value)}
                className={inputCls}
                placeholder="DIP Image Phactory"
              />
            </Field>
            <Field label="Short name">
              <input
                value={form.shortName}
                onChange={(e) => setField("shortName", e.target.value)}
                className={inputCls}
                placeholder="DIPHACTORY"
              />
            </Field>
          </div>
          <Field label="Tagline">
            <input
              value={form.tagline}
              onChange={(e) => setField("tagline", e.target.value)}
              className={inputCls}
              placeholder="Every frame tells a story"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Short description of your business..."
            />
          </Field>

          {/* Logo */}
          <AssetUploadField
            label="Logo"
            previewUrl={form.logoUrl}
            uploading={uploadingField === "logoUrl"}
            onUpload={(f) => handleAssetUpload("logoUrl", "logoUtKey", f)}
            isImage
          />

          {/* Icon / Favicon */}
          <AssetUploadField
            label="Icon / Favicon"
            previewUrl={form.iconUrl}
            uploading={uploadingField === "iconUrl"}
            onUpload={(f) => handleAssetUpload("iconUrl", "iconUtKey", f)}
            isImage
            square
          />
        </div>
      )}

      {/* ── Contact ── */}
      {activeTab === "contact" && (
        <div className="space-y-4">
          <Field label="Email">
            <input
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className={inputCls}
              type="email"
              placeholder="info@diphactory.com"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone">
              <input
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                className={inputCls}
                placeholder="+1 555 000 0000"
              />
            </Field>
            <Field label="WhatsApp">
              <input
                value={form.whatsapp}
                onChange={(e) => setField("whatsapp", e.target.value)}
                className={inputCls}
                placeholder="+1 555 000 0000"
              />
            </Field>
          </div>
          <Field label="Address">
            <input
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              className={inputCls}
              placeholder="123 Studio Street"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="City">
              <input
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                className={inputCls}
                placeholder="New York"
              />
            </Field>
            <Field label="Country">
              <input
                value={form.country}
                onChange={(e) => setField("country", e.target.value)}
                className={inputCls}
                placeholder="United States"
              />
            </Field>
          </div>
        </div>
      )}

      {/* ── Social ── */}
      {activeTab === "social" && (
        <div className="space-y-4">
          {[
            {
              key: "instagram" as const,
              label: "Instagram",
              placeholder: "https://instagram.com/yourhandle",
            },
            {
              key: "facebook" as const,
              label: "Facebook",
              placeholder: "https://facebook.com/yourpage",
            },
            {
              key: "twitter" as const,
              label: "Twitter / X",
              placeholder: "https://x.com/yourhandle",
            },
            {
              key: "youtube" as const,
              label: "YouTube",
              placeholder: "https://youtube.com/@yourchannel",
            },
            {
              key: "tiktok" as const,
              label: "TikTok",
              placeholder: "https://tiktok.com/@yourhandle",
            },
            {
              key: "linkedin" as const,
              label: "LinkedIn",
              placeholder: "https://linkedin.com/in/yourprofile",
            },
          ].map(({ key, label, placeholder }) => (
            <Field key={key} label={label}>
              <input
                value={form[key]}
                onChange={(e) => setField(key, e.target.value)}
                className={inputCls}
                placeholder={placeholder}
              />
            </Field>
          ))}
        </div>
      )}

      {/* ── SEO ── */}
      {activeTab === "seo" && (
        <div className="space-y-4">
          <Field label="Meta title">
            <input
              value={form.metaTitle}
              onChange={(e) => setField("metaTitle", e.target.value)}
              className={inputCls}
              placeholder="DIP Image Phactory — Photography Studio"
            />
          </Field>
          <Field label="Meta description">
            <textarea
              value={form.metaDescription}
              onChange={(e) => setField("metaDescription", e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Describe your site for search engines..."
            />
          </Field>
          <AssetUploadField
            label="OG Image (social share preview)"
            hint="Recommended: 1200×630px"
            previewUrl={form.ogImage}
            uploading={uploadingField === "ogImage"}
            onUpload={(f) => handleAssetUpload("ogImage", "ogImageUtKey", f)}
            isImage
            wide
          />
        </div>
      )}

      {/* ── Settings ── */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  Maintenance mode
                </p>
                <p className="text-xs text-white/35 mt-1">
                  When enabled, visitors see a maintenance page instead of your
                  site.
                </p>
              </div>
              <button
                onClick={() =>
                  setField("maintenanceMode", !form.maintenanceMode)
                }
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200",
                  form.maintenanceMode ? "bg-accent-brand" : "bg-white/15",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                    form.maintenanceMode ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom save */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="rounded-full bg-white text-[#0e0e0e] px-8 py-3 text-sm font-bold hover:bg-white/90 disabled:opacity-50 transition-all"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

// ── Helpers ──

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-white/20";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-white/20">{hint}</p>}
    </div>
  );
}

function AssetUploadField({
  label,
  hint,
  previewUrl,
  uploading,
  onUpload,
  isImage,
  square,
  wide,
}: {
  label: string;
  hint?: string;
  previewUrl: string;
  uploading: boolean;
  onUpload: (f: File) => void;
  isImage?: boolean;
  square?: boolean;
  wide?: boolean;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-4">
        {previewUrl && isImage && (
          <div
            className={cn(
              "relative overflow-hidden rounded-xl border border-white/10 shrink-0",
              square ? "w-12 h-12" : wide ? "w-32 h-16" : "w-24 h-12",
            )}
          >
            <NextImage
              src={previewUrl}
              alt={label}
              fill
              className="object-contain p-1"
            />
          </div>
        )}
        <label
          className={cn(
            "flex-1 flex items-center justify-center rounded-xl border border-dashed border-white/10 px-4 py-3 text-xs text-white/30 hover:border-white/25 hover:text-white/60 transition-all cursor-pointer",
            uploading && "animate-pulse pointer-events-none",
          )}
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
            : previewUrl
              ? `Replace ${label.toLowerCase()}`
              : `Upload ${label.toLowerCase()}`}
        </label>
      </div>
    </Field>
  );
}
