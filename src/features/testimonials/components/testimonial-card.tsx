"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  name: string;
  role: string;
  image: string;
  quote: string;
}

export function TestimonialCard({
  name,
  role,
  image,
  quote,
}: TestimonialCardProps) {
  return (
    <Card className="bg-foreground/5 backdrop-blur-xl border-border/50 rounded-2xl shadow-lg">
      <CardContent className="p-6 space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          “{quote}”
        </p>

        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image src={image} alt={name} fill className="object-cover" />
          </div>

          <div>
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
