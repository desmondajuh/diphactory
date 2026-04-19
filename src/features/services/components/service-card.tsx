"use client";
import Image from "next/image";
import { forwardRef } from "react";

interface ServiceCardProps {
  id: string;
  frontSrc: string;
  frontAlt: string;
  backText: string;
}

export const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ id, frontSrc, frontAlt, backText }, ref) => {
    return (
      <div
        id={id}
        ref={ref}
        className="service-card p-6 rounded-lg text-black w-60 h-90"
      >
        <div className="card-wrapper">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <Image
                src={frontSrc}
                alt={frontAlt}
                priority
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flip-card-back">
              <p>{backText}</p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ServiceCard.displayName = "ServiceCard";
