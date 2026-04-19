/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const serviceImageRows = [
  {
    left: "/images/gallery/1.jpg",
    right: "/images/gallery/2.jpg",
  },
  {
    left: "/images/gallery/3.jpg",
    right: "/images/gallery/4.jpg",
  },
  {
    left: "/images/gallery/5.jpg",
    right: "/images/gallery/6.jpg",
  },
];

export const ServicesCTA = () => {
  useEffect(() => {
    const scrollTriggerSettings = {
      trigger: ".sc-main",
      start: "top 45%",
      toggleActions: "play reverse play reverse",
    };

    const leftXValues = [-800, -900, -400];
    const rightXValues = [800, 900, 400];
    const leftRotationValues = [-30, -20, -35];
    const rightRotationValues = [30, 20, 35];
    const yValues = [100, -150, -400];

    gsap.utils.toArray(".sc-row").forEach((row, index) => {
      const cardLeft = (row as HTMLElement).querySelector(".card-left");
      const cardRight = (row as HTMLElement).querySelector(".card-right");

      gsap.to(cardLeft, {
        x: leftXValues[index],
        y: yValues[index],
        rotation: leftRotationValues[index],
        scrollTrigger: {
          trigger: ".sc-main",
          start: "top center",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      gsap.to(cardRight, {
        x: rightXValues[index],
        y: yValues[index],
        rotation: rightRotationValues[index],
        scrollTrigger: {
          trigger: ".sc-main",
          start: "top center",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      // gsap.to([cardLeft, cardRight], {
      //   scrollTrigger: {
      //     trigger: ".sc-main",
      //     start: "top center",
      //     end: "150% bottom",
      //     scrub: true,
      //   },
      //   onUpdate(self) {
      //     const progress = self.progress;

      //     gsap.set(cardLeft, {
      //       x: progress * leftXValues[index],
      //       y: progress * yValues[index],
      //       rotation: progress * leftRotationValues[index],
      //     });

      //     gsap.set(cardRight, {
      //       x: progress * rightXValues[index],
      //       y: progress * yValues[index],
      //       rotation: progress * rightRotationValues[index],
      //     });
      //   },
      // });
    });

    gsap.to(".sc-logo", {
      scale: 1,
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: scrollTriggerSettings,
    });

    gsap.to(".sc-line p", {
      y: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: {
        trigger: ".sc-main",
        start: "50% bottom",
        toggleActions: "play reverse play reverse",
      },
    });

    gsap.to(".sc-button", {
      y: 0,
      opacity: 1,
      delay: 0.25,
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: {
        trigger: ".sc-main",
        start: "50% bottom",
        toggleActions: "play reverse play reverse",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const generateRows = () => {
    return serviceImageRows.map((imageRow, index) => {
      return (
        <div className="sc-row" key={index}>
          <div className="sc-card rounded-3xl w-2/5 h-90 card-left">
            <img
              src={imageRow.left}
              alt={`Service showcase ${index * 2 + 1}`}
            />
          </div>
          <div className="sc-card rounded-3xl w-2/5 h-90 card-right">
            <img
              src={imageRow.right}
              alt={`Service showcase ${index * 2 + 2}`}
            />
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <section className="sc-main relative py-24 bg-gray-500/20">
        <div className="sc-main-content">
          <div className="sc-logo">
            <img src="images/icon.png" alt="" />
          </div>

          <div className="sc-copy">
            <div className="sc-line">
              <p>building a brand, capturing a moment, or telling a story</p>
            </div>
            <div className="sc-line">
              <p>your vision deserves to be executed at the highest level.</p>
            </div>
            <div className="sc-line">
              <p>Let’s Create Something Exceptional</p>
            </div>
          </div>

          <div className="btn">
            <Button
              size="lg"
              variant="outline"
              className="sc-button rounded-full cursor-pointer bg-transparent text-accent-red text-lg border-current"
            >
              Book a Session
            </Button>
          </div>
        </div>

        {generateRows()}
      </section>
    </>
  );
};
