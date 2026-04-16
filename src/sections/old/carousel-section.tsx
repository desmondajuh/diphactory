import Image from "next/image";
import { cn } from "@/lib/utils";
import { CarouselTitle } from "@/features/landing/components/carousel-title";
// import { CarouselTitle } from "@/components/home/carousel-title";

interface ImageCard {
  src: string;
  alt: string;
  skewY: number;
  scale: number;
  translateY: number;
  rotateY: number;
  translateX?: number;
  width: string | number;
  height?: number;
  negativeMargin?: number;
  mxValue?: string;
  clipLeft?: boolean;
  clipRight?: boolean;
  zIndex?: number;
}

const FAN_CARDS: ImageCard[] = [
  {
    src: "/images/gallery/1.jpg",
    alt: "Portrait – man in coat 1",
    mxValue: "mx-6",
    rotateY: 77.5,
    skewY: 7.5,
    scale: 2,
    translateY: -10,
    zIndex: 1,
    width: "105px",
    height: 420,
    clipLeft: true,
  },
  {
    src: "/images/gallery/2.jpg",
    alt: "Product – perfume bottle on dark silk 2",
    mxValue: "mx-4",
    rotateY: 57.5,
    skewY: 5,
    scale: 1.55,
    translateY: 0,
    zIndex: 97.5,
    width: "115px",
    height: 320,
  },
  {
    src: "/images/gallery/3.jpg",
    alt: "Automotive – car front close-up 3",
    mxValue: "mx-3",
    rotateY: 37.5,
    skewY: 3,
    scale: 1.3,
    translateY: 5,
    zIndex: 3,
    width: "125px",
    height: 300,
  },
  {
    src: "/images/gallery/4.jpg",
    alt: "Beauty – woman with hands on face 4",
    mxValue: "mx-2",
    rotateY: 20.5,
    skewY: 1.5,
    scale: 1.1,
    translateY: 5,
    zIndex: 4,
    width: "135px",
    height: 280,
  },
  {
    src: "/images/gallery/5.jpg",
    alt: "Beauty – woman center image 5",
    mxValue: "mx-2",
    rotateY: 0,
    skewY: 0,
    scale: 1,
    translateY: 5,
    zIndex: 98.5,
    width: "125px",
    height: 280,
  },
  {
    src: "/images/gallery/6.jpg",
    alt: "Product – wine bottle on dark draped silk 6",
    mxValue: "mx-2",
    rotateY: -20.5,
    skewY: -1.5,
    scale: 1.1,
    translateY: 5,
    zIndex: 4,
    width: "135px",
    height: 280,
  },
  {
    src: "/images/gallery/7.jpg",
    alt: "Automotive – car front close-up 7",
    mxValue: "mx-3",
    rotateY: -37.5,
    skewY: -3,
    scale: 1.3,
    translateY: 5,
    zIndex: 3,
    width: "125px",
    height: 300,
  },
  {
    src: "/images/gallery/8.jpg",
    alt: "Automotive – car front close-up 8",
    mxValue: "mx-4",
    rotateY: -57.5,
    skewY: -5,
    scale: 1.55,
    translateY: 0,
    zIndex: 3,
    width: "115px",
    height: 300,
  },
  {
    src: "/images/gallery/9.jpg",
    alt: "Automotive – car front close-up 9",
    mxValue: "mx-6",
    rotateY: -77.5,
    skewY: -7.5,
    scale: 2,
    translateY: -10,
    zIndex: 3,
    width: "105px",
    height: 300,
  },
];

export const CarouselSection = () => {
  return (
    <section className="relative overflow-hidden py-20 min-h-[80vh]">
      <CarouselTitle />
      <div className="mt-16 flex justify-center items-end gap-3 perspective-[1200px]">
        {FAN_CARDS.map((card, i) => {
          return (
            <div
              key={i}
              className={cn(
                "relative h-[200px] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transition-transform duration-500 hover:scale-105",
                card.mxValue,
              )}
              style={{
                width: card.width,
                transform: `
                  perspective(1200px)
                  rotateY(${card.rotateY}deg) 
                  skewY(${card.skewY}deg)
                  scale(${card.scale})
                  translateY(${card.translateY}px) 
                        `,
                zIndex: card.zIndex,
                transformStyle: "preserve-3d",
              }}
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                sizes={`${card.width}px`}
                className="w-full h-full object-cover"
                priority={i >= 2 && i <= 4}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
