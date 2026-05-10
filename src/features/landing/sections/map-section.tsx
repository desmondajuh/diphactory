"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const STUDIO_COORDS: [number, number] = [40.6892, -73.9857]; // [lat, lng]

export function MapSection() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return; // ← this also causes the issue, returns undefined

    let map: L.Map;

    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      map = L.map(mapContainer.current!, {
        center: STUDIO_COORDS,
        zoom: 15,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        attributionControl: false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd" },
      ).addTo(map);

      const goldIcon = L.divIcon({
        className: "",
        html: `<div style="
        width:24px; height:24px;
        background:#c9922a;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:2px solid #fff;
        box-shadow:0 2px 8px rgba(0,0,0,0.5);
      "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      L.marker(STUDIO_COORDS, { icon: goldIcon }).addTo(map);
      // ✅ Tell Leaflet to recalculate its container size
      setTimeout(() => map.invalidateSize(), 0);
    };

    init();

    // ✅ Cleanup must be returned synchronously, outside the async fn
    return () => {
      map?.remove();
    };
  }, []);

  return (
    <section className="w-full px-4 py-12">
      <div
        className="relative mx-auto max-w-7xl overflow-hidden rounded-xl border-2 border-accent-brand/20 flex h-60"
        // style={{
        //   height: "200px",
        // }}
      >
        {/* ── Left panel ── */}
        <div className="absolute left-6 top-6 z-1000 w-auto rounded-md border border-white/10 bg-black/80  backdrop-blur-md flex flex-col justify-between bg-accent-brand-950  p-4 min-w-70 border-r border-accent-brand">
          <div>
            <h2 className="font-heading uppercase font-bold text-accent-brand text-sm mb-3 tracking-widest">
              Visit My Studio
            </h2>
            <div className="w-8 h-0.5 bg-accent-brand mb-4" />

            <div className="flex items-start gap-4">
              <MapPin
                className="mt-1 h-5 w-5 text-accent-brand-800"
                strokeWidth={1.8}
              />
              <p className="text-sm mx-2 text-accent-brand-100">
                123 Creative Way, Studio 5B
                <br />
                Brooklyn, NY 11201
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            asChild
            className="rounded-md uppercase gap-2 border-2 border-accent-brand-500 text-accent-brand-500 hover:text-accent-brand-300 my-2 bg-transparent"
          >
            <Link
              href={`https://maps.google.com/?q=${STUDIO_COORDS[1]},${STUDIO_COORDS[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              // className="rounded-md w-fit uppercase gap-2 items-center border border-accent-brand text-accent-brand px-4 py-2.5 font-black text-sm inline-flex"
            >
              Get Directions
              <ExternalLink size={12} />
            </Link>
          </Button>
        </div>

        {/* ── Map ── */}
        <div
          className="relative w-full min-w-0 flex-1"
          ref={mapContainer}
          style={{ flex: 1, width: "100%", minWidth: 0 }}
        >
          <div className="flex m-4 bg-brand"></div>
        </div>
      </div>
    </section>
  );
}
