"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

interface BlockRevealAnimeProps {
  children: React.ReactNode;
  className?: string;
  animateOnScroll?: boolean;
  delay?: number;
  blockColor?: string;
  stagger?: number;
  duration?: number;
}

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function BlockRevealAnime({
  children,
  className,
  animateOnScroll = true,
  delay = 0,
  blockColor = "currentColor",
  stagger = 0.15,
  duration = 0.75,
}: BlockRevealAnimeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRefs = useRef<SplitText[]>([]);
  const lines = useRef<Element[]>([]);
  const blocks = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      splitRefs.current = [];
      lines.current = [];
      blocks.current = [];

      let elements = [];

      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      elements.forEach((el, index) => {
        const split = SplitText.create(el, {
          type: "lines",
          linesClass: `block-line++${index}`,
          lineThreshold: 0.1,
        });

        splitRefs.current.push(split);

        split.lines.forEach((line) => {
          const wrapper = document.createElement("div");
          wrapper.style.display = "block-line-wrapper";
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);

          const block = document.createElement("div");
          block.className = "block-revealer";
          block.style.backgroundColor = blockColor;
          wrapper.appendChild(block);

          lines.current.push(line);
          blocks.current.push(block);
        });
      });

      gsap.set(lines.current, { opacity: 0 });
      gsap.set(blocks.current, { scaleX: 0, transformOrigin: "left center" });

      const createBlockRevealAnimation = (
        block: HTMLDivElement,
        line: Element,
        index: number,
      ): gsap.core.Timeline => {
        const tl = gsap.timeline({ delay: delay + index * stagger });
        tl.to(block, { scaleX: 1, duration: duration, ease: "power4.inOut" });
        tl.to(line, { opacity: 1, duration: 0.01 }, `-=${duration * 0.5}`);
        tl.to(block, { transformOrigin: "right center" });
        tl.to(block, { scaleX: 0, duration: duration, ease: "power4.inOut" });

        return tl;
      };

      if (animateOnScroll) {
        blocks.current.forEach((block, index) => {
          const tl = createBlockRevealAnimation(
            block,
            lines.current[index],
            index,
          );
          tl.pause();

          ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 90%",
            once: true,
            onEnter: () => tl.play(),
          });
        });
      } else {
        blocks.current.forEach((block, index) => {
          createBlockRevealAnimation(block, lines.current[index], index);
        });
      }
      return () => {
        splitRefs.current.forEach((split) => split?.revert());

        const wrappers = containerRef.current?.querySelectorAll(
          ".block-line-wrapper",
        );
        wrappers?.forEach((wrapper) => {
          if (wrapper.parentNode && wrapper.firstChild) {
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
            wrapper.remove();
          }
        });
      };
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay, blockColor, stagger, duration],
    },
  );

  return (
    <div
      ref={containerRef}
      data-copy-wrapper="true"
      className={cn("relative inline-block", className)}
    >
      {children}
    </div>
  );
}
