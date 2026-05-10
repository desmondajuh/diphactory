"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";

const STUDIO_COORDS: [number, number] = [40.6892, -73.9857];

export const StudioMapSection = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    // prevent double initialization
    if (!mapContainer.current || mapInstance.current) return;

    let mounted = true;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!mounted || !mapContainer.current) return;

      // Create map
      const map = L.map(mapContainer.current, {
        center: STUDIO_COORDS,
        zoom: 12,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        attributionControl: false,
      });

      mapInstance.current = map;

      // Dark cinematic tiles
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          subdomains: "abcd",
        },
      ).addTo(map);

      // Custom gold pin
      const goldIcon = L.divIcon({
        className: "",
        html: `
          <div style="
            position: relative;
            width: 28px;
            height: 28px;
          ">
            <div style="
              position:absolute;
              inset:0;
              border-radius:9999px;
              background:#c9922a;
              box-shadow:
                0 0 25px rgba(201,146,42,0.6),
                0 0 50px rgba(201,146,42,0.25);
              border:3px solid rgba(0,0,0,0.5);
            "></div>

            <div style="
              position:absolute;
              top:50%;
              left:50%;
              width:10px;
              height:10px;
              background:#000;
              border-radius:9999px;
              transform:translate(-50%,-50%);
            "></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker(STUDIO_COORDS, {
        icon: goldIcon,
      }).addTo(map);

      // fix sizing
      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    };

    initMap();

    return () => {
      mounted = false;

      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <section className="bg-background px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative h-105 overflow-hidden rounded-[28px] border border-white/10 bg-black">
          {/* MAP */}
          <div
            ref={mapContainer}
            className="h-full w-full brightness-[0.85] contrast-125 xsaturate-50"
          />

          {/* overlays */}
          {/* <div className="pointer-events-none absolute inset-0 bg-black/35" /> */}

          {/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)]" /> */}

          {/* top glow */}
          {/* <div className="pointer-events-none absolute left-1/2 top-0 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" /> */}

          {/* subtle grid */}
          {/* <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" /> */}

          {/* ADDRESS CARD */}
          <div className="absolute left-6 top-6 z-1000 w-[320px] rounded-[24px] border border-white/10 bg-black/80 p-8 backdrop-blur-md">
            <div className="w-fit">
              <h2 className="font-heading text-3xl uppercase tracking-wide text-primary">
                Visit My Studio
              </h2>

              <div className="mt-3 h-0.5 w-12 bg-primary" />
            </div>

            <div className="mt-8 flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 text-primary" strokeWidth={1.8} />

              <div className="space-y-1 text-lg leading-8 text-white/75">
                <p>123 Creative Way, Studio 5B</p>
                <p>Brooklyn, NY 11201</p>
              </div>
            </div>

            <Link
              href={`https://maps.google.com/?q=${STUDIO_COORDS[0]},${STUDIO_COORDS[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-10 inline-flex h-14 w-full items-center justify-center
                gap-3 rounded-xl border border-primary
                bg-primary/5 px-6
                font-heading text-lg uppercase tracking-wide
                text-primary
                transition duration-300
                hover:bg-primary hover:text-black
              "
            >
              Get Directions
              <ExternalLink className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
