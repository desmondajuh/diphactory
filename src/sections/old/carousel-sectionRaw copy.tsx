import Image from "next/image";
import { SectionBadge } from "@/components/shared/section-badge";
import { ArrowRight, CameraIcon } from "lucide-react";

const CarouselTitle = () => {
  return (
    <div className="max-w-5xl mx-auto text-center relative z-10">
      {/* Badge */}
      <SectionBadge icon={<CameraIcon />} label="Photography" />

      <h1
        className="text-6xl font-bold tracking-tight mb-4"
        style={{
          fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
        }}
      >
        Every Pixel Clicked.
      </h1>

      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        Capturing moments, creating memories. Through my lens, I capture
        stunning visuals that bring your brand to life with clarity, emotion,
        and impact.
      </p>

      <button className="bg-white shadow-md px-3 py-3 rounded-full flex items-center gap-3 mx-auto hover:shadow-lg transition">
        <span className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
          <ArrowRight size={16} />
        </span>
        Book an appointment
      </button>
    </div>
  );
};

// interface ImageCard {
//   src: string;
//   alt: string;
//   skewY: number;
//   scale: number;
//   translateY: number;
//   rotateY: number;
//   translateX?: number;
//   width: string | number;
//   height?: number;
//   negativeMargin?: number;
//   mxValue?: string;
//   clipLeft?: boolean;
//   clipRight?: boolean;
//   zIndex?: number;
// }

// const FAN_CARDS: ImageCard[] = [
//   {
//     src: "/images/gallery/2.jpg",
//     alt: "Portrait – man in coat",
//     mxValue: "mx-6",
//     rotateY: 77.5,
//     skewY: 7.5,
//     scale: 2,
//     translateY: -10,
//     zIndex: 1,
//     width: "105px",
//     height: 420,
//     clipLeft: true,
//   },
//   {
//     src: "/images/gallery/1.jpg",
//     alt: "Product – perfume bottle on dark silk",
//     mxValue: "mx-4",
//     rotateY: 57.5,
//     skewY: 5,
//     scale: 1.55,
//     translateY: 0,
//     zIndex: 2,
//     width: "115px",
//     height: 320,
//   },
//   {
//     src: "/images/gallery/2.jpg",
//     alt: "Automotive – car front close-up",
//     mxValue: "mx-3",
//     rotateY: 37.5,
//     skewY: 3,
//     scale: 1.3,
//     translateY: 5,
//     zIndex: 3,
//     width: "125px",
//     height: 300,
//   },
//   {
//     src: "/images/gallery/2.jpg",
//     alt: "Beauty – woman with hands on face",
//     mxValue: "mx-2",
//     rotateY: 20.5,
//     skewY: 1.5,
//     scale: 1.1,
//     translateY: 5,
//     zIndex: 4,
//     width: "135px",
//     height: 280,
//   },
//   {
//     src: "/images/gallery/2.jpg",
//     alt: "Beauty – woman center image",
//     mxValue: "mx-2",
//     rotateY: 0,
//     skewY: 1,
//     scale: 1,
//     translateY: 5,
//     zIndex: 98.5,
//     width: "125px",
//     height: 280,
//   },
// ];

export const CarouselView = () => {
  return (
    <section className="relative overflow-hidden py-20 min-h-[80vh]">
      <CarouselTitle />
      <div className="mt-16 flex justify-center items-end gap-3 perspective-distant">
        <div
          className="relative h-50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-6 xtransition-transform  hover:scale-105"
          style={{
            width: "105px",
            transform: `
              perspective(1200px)
          rotateY(77.5deg)
          skewY(7.5deg)
          scale(2)
          translateY(-10px)`,
            zIndex: 97.5,
          }}
        >
          <Image
            fill
            src="/images/gallery/2.jpg"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        <div
          className="relative h-50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-4"
          style={{
            width: "115px",
            transform: `
            perspective(1200px)
            rotateY(57.5deg)
            skewY(5deg)
            scale(1.55)
            translateY(0px)
          `,
            zIndex: 97.5,
          }}
        >
          <Image
            fill
            src="/images/gallery/1.jpg"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        <div
          className="relative h-50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-3"
          style={{
            width: "125px",
            transform: `
            perspective(1200px)
            rotateY(37.5deg)
            skewY(3deg)
            scale(1.3)
            translateY(5px)
            `,
            zIndex: 98.5,
          }}
        >
          <Image
            fill
            src="/images/gallery/2.jpg"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        <div
          className="relative h-50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-2"
          style={{
            width: "135px",
            transform: `
              perspective(1200px)
          rotateY(20.5deg)
          skewY(1.5deg)
          scale(1.1)
          translateY(5px)`,
            zIndex: 99.5,
          }}
        >
          <Image
            fill
            src="/images/gallery/2.jpg"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div
          className="relative h-50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 -mx-2"
          style={{
            width: "125px",
            transform: `
            perspective(1200px)
            rotateY(0deg)
            skewY(0deg)
            scale(1)
            translateY(5px)
            `,
            zIndex: 98.5,
          }}
        >
          <Image
            fill
            src="/images/gallery/2.jpg"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div
          className="relative h-50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-2"
          style={{
            width: "135px",
            transform: `
              perspective(1200px)
          rotateY(-20.5deg)
          skewY(-1.5deg)
          scale(1.1)
          translateY(5px)`,
            zIndex: 99.5,
          }}
        >
          <Image
            fill
            src="/images/gallery/2.jpg"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div
          className="relative h-50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-3"
          style={{
            width: "125px",
            transform: `
              perspective(1200px)
          rotateY(-37.5deg)
          skewY(-3deg)
          scale(1.3)
          translateY(5px)`,
            zIndex: 98.5,
          }}
        >
          <Image
            fill
            src="/images/gallery/1.jpg"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div
          className="relative h-50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-4"
          style={{
            width: "115px",
            transform: `
              perspective(1200px)
          rotateY(-57.5deg)
          skewY(-5deg)
          scale(1.55)
          translateY(0px)`,
            zIndex: 97.5,
          }}
        >
          <Image
            fill
            src="/images/gallery/2.jpg"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div
          className="relative h-50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-6"
          style={{
            width: "105px",
            transform: `
              perspective(1200px)
          rotateY(-77.5deg)
          skewY(-7.5deg)
          scale(2)
          translateY(-10px)`,
            zIndex: 97.5,
          }}
        >
          <Image
            fill
            src="/images/gallery/2.jpg"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
      </div>
    </section>
  );
};

// export const CarouselView = () => {
//   return (
//     <section className="relative overflow-hidden py-20 min-h-[80vh]">
//       <CarouselTitle />
//       <div className="mt-16 flex justify-center items-end gap-3 perspective-[1200px]">
//         {/* 4th to left image */}
//         <div
//           className="relative h-[200px] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-6 transition-transform duration-500 hover:scale-105"
//           style={{
//             width: "105px",
//             transform: `
//               perspective(1200px)
//           rotateY(77.5deg)
//           skewY(7.5deg)
//           scale(2)
//           translateY(-10px)`,
//             zIndex: 97.5,
//           }}
//         >
//           <Image
//             fill
//             src="/images/gallery/2.jpg"
//             className="w-full h-full object-cover"
//             alt=""
//           />
//         </div>

//         <div
//           className="relative h-[200px] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-4"
//           style={{
//             width: "115px",
//             transform: `
//             perspective(1200px)
//             rotateY(57.5deg)
//             skewY(5deg)
//             scale(1.55)
//             translateY(0px)
//           `,
//             zIndex: 97.5,
//           }}
//         >
//           <Image
//             fill
//             src="/images/gallery/1.jpg"
//             className="w-full h-full object-cover"
//             alt=""
//           />
//         </div>

//         <div
//           className="relative h-[200px] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-3"
//           style={{
//             width: "125px",
//             transform: `
//             perspective(1200px)
//             rotateY(37.5deg)
//             skewY(3deg)
//             scale(1.3)
//             translateY(5px)
//             `,
//             zIndex: 98.5,
//           }}
//         >
//           <Image
//             fill
//             src="/images/gallery/2.jpg"
//             className="w-full h-full object-cover"
//             alt=""
//           />
//         </div>

//         <div
//           className="relative h-[200px] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-2"
//           style={{
//             width: "135px",
//             transform: `
//               perspective(1200px)
//           rotateY(20.5deg)
//           skewY(1.5deg)
//           scale(1.1)
//           translateY(5px)`,
//             zIndex: 99.5,
//           }}
//         >
//           <Image
//             fill
//             src="/images/gallery/2.jpg"
//             className="w-full h-full object-cover"
//             alt=""
//           />
//         </div>

//         {/* middle image */}
//         <div
//           className="relative h-[200px] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 -mx-2"
//           style={{
//             width: "125px",
//             transform: `
//             perspective(1200px)
//             rotateY(0deg)
//             skewY(0deg)
//             scale(1)
//             translateY(5px)
//             `,
//             zIndex: 98.5,
//           }}
//         >
//           <Image
//             fill
//             src="/images/gallery/2.jpg"
//             className="w-full h-full object-cover"
//             alt=""
//           />
//         </div>

//         {/* 1st to right image */}
//         <div
//           className="relative h-[200px] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-2"
//           style={{
//             width: "135px",
//             transform: `
//               perspective(1200px)
//           rotateY(-20.5deg)
//           skewY(-1.5deg)
//           scale(1.1)
//           translateY(5px)`,
//             zIndex: 99.5,
//           }}
//         >
//           <Image
//             fill
//             src="/images/gallery/2.jpg"
//             className="w-full h-full object-cover"
//             alt=""
//           />
//         </div>

//         {/* 2nd to right image */}
//         <div
//           className="relative h-[200px] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-3"
//           style={{
//             width: "125px",
//             transform: `
//               perspective(1200px)
//           rotateY(-37.5deg)
//           skewY(-3deg)
//           scale(1.3)
//           translateY(5px)`,
//             zIndex: 98.5,
//           }}
//         >
//           <Image
//             fill
//             src="/images/gallery/1.jpg"
//             className="w-full h-full object-cover"
//             alt=""
//           />
//         </div>

//         {/* 3rd to right image */}
//         <div
//           className="relative h-[200px] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-4"
//           style={{
//             width: "115px",
//             transform: `
//               perspective(1200px)
//           rotateY(-57.5deg)
//           skewY(-5deg)
//           scale(1.55)
//           translateY(0px)`,
//             zIndex: 97.5,
//           }}
//         >
//           <Image
//             fill
//             src="/images/gallery/2.jpg"
//             className="w-full h-full object-cover"
//             alt=""
//           />
//         </div>

//         {/* 4th to right image */}
//         <div
//           className="relative h-[200px] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 mx-6"
//           style={{
//             width: "105px",
//             transform: `
//               perspective(1200px)
//           rotateY(-77.5deg)
//           skewY(-7.5deg)
//           scale(2)
//           translateY(-10px)`,
//             zIndex: 97.5,
//           }}
//         >
//           <Image
//             fill
//             src="/images/gallery/2.jpg"
//             className="w-full h-full object-cover"
//             alt=""
//           />
//         </div>
//       </div>
//     </section>
//   );
// };
