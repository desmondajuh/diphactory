import { ServiceCard } from "../components/service-card";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ServiceHero } from "../components/service-hero";
import { ServicesCTA } from "../components/services-cta";

gsap.registerPlugin(ScrollTrigger);

export const ServiceCards = () => {
  const container = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      if (!container.current) return;
      const cards = cardRefs.current;
      const totalScrollHeight = window.innerHeight * 3;
      const position = [14, 38, 62, 86];
      const rotation = [-15, -7.5, 7.5, 15];
      const cardsElement = container.current.querySelector(".cards");
      if (!cardsElement) return;

      // pin cards section

      ScrollTrigger.create({
        trigger: cardsElement,
        start: "top top",
        end: `+=${totalScrollHeight}`,
        pin: true,
        pinSpacing: true,
      });

      //   spread cards out and rotate on scroll
      cards.forEach((card, index) => {
        gsap.to(card, {
          left: `${position[index]}%`,
          rotation: `${rotation[index]}`,
          ease: "none",
          scrollTrigger: {
            trigger: cardsElement,
            start: "top top",
            end: `+=${totalScrollHeight}`,
            scrub: 0.5,
            id: `spread-${index}`,
          },
        });
      });

      //   flip cards and reset rotation with stagger
      cards.forEach((card, index) => {
        const frontEl = card.querySelector(".flip-card-front");
        const backEl = card.querySelector(".flip-card-back");
        // if (!frontEl || !backEl) return;

        const staggerOffset = index * 0.05; // stagger by 0.2 seconds
        const startOffset = 1 / 3 + staggerOffset; // start flipping after 1/3 of the scroll
        const endOffset = 2 / 3 + staggerOffset; // end flipping after 2/3 of the scroll

        ScrollTrigger.create({
          trigger: cardsElement,
          start: "top top",
          end: () => `+=${totalScrollHeight}`,
          scrub: 1,
          id: `rotate-flip-${index}`,
          onUpdate: (self) => {
            const progress = self.progress;
            if (progress >= startOffset && progress <= endOffset) {
              const animationProgress = (progress - startOffset) / (1 / 3);
              const frontRotation = -180 * animationProgress;
              const backRotation = 180 - 180 * animationProgress;
              const cardRotation = rotation[index] * (1 - animationProgress);

              gsap.to(frontEl, {
                rotationY: frontRotation,
                ease: "power1.out",
                // overwrite: "auto",
              });
              gsap.to(backEl, {
                rotationY: backRotation,
                ease: "power1.out",
                // overwrite: "auto",
              });
              gsap.to(card, {
                xPercent: -50, // move card slightly to the right as it flips
                yPercent: -50, // move card slightly up as it flips
                rotation: cardRotation,
                ease: "power1.out",
              });
            }
          },
        });
      });
    },
    {
      scope: container,
    },
  );

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="container h-[300vh]" ref={container}>
      <section className="cards relative w-screen h-screen">
        {[...Array(4)].map((_, index) => (
          <ServiceCard
            key={index}
            id={`service-card-${index}`}
            frontSrc={`/images/hero-bg2.jpg`}
            frontAlt={`Service ${index + 1}`}
            backText={`Description for Service ${index + 1}`}
            ref={(el) => {
              if (el) cardRefs.current[index] = el;
            }}
          />
        ))}
      </section>
    </div>
  );
};
