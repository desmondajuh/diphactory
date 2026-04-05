"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const LAUNCH_DATE = new Date(Date.now() + 17 * 24 * 60 * 60 * 1000);

interface TimeLeft {
  d: number;
  h: number;
  m: number;
  s: number;
}

function useCountdown(target: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  });

  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

interface TickProps {
  value: number;
  label: string;
}

function Tick({ value, label }: TickProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <div
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(2.8rem, 7vw, 5rem)",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: "#f0ece4",
          lineHeight: 1,
          minWidth: "2ch",
          textAlign: "center",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "0.65rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#9c8e7a",
          fontWeight: 400,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <span
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "clamp(2rem, 5vw, 3.5rem)",
        fontWeight: 200,
        color: "#5a4e3f",
        lineHeight: 1,
        marginBottom: "1.5rem",
        alignSelf: "flex-start",
        paddingTop: "0.15em",
      }}
    >
      ·
    </span>
  );
}

export default function ComingSoon() {
  const { d, h, m, s } = useCountdown(LAUNCH_DATE);
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = () => {
    if (email && email.includes("@")) setSubmitted(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget as HTMLButtonElement).style.background =
      "rgba(200,170,110,0.22)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget as HTMLButtonElement).style.background =
      "rgba(200,170,110,0.12)";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: #5a4e3f; }
        body { margin: 0; padding: 0; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#1a1510",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(2rem, 6vw, 5rem) 1.5rem",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}
      >
        {/* Grain texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            pointerEvents: "none",
          }}
        />

        {/* Ambient light top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60vw",
            height: "35vh",
            background:
              "radial-gradient(ellipse at top, rgba(200,170,110,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Corner accents */}
        <div
          style={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            width: "40px",
            height: "40px",
            borderTop: "1px solid rgba(200,170,110,0.3)",
            borderLeft: "1px solid rgba(200,170,110,0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "2rem",
            right: "2rem",
            width: "40px",
            height: "40px",
            borderTop: "1px solid rgba(200,170,110,0.3)",
            borderRight: "1px solid rgba(200,170,110,0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "2rem",
            width: "40px",
            height: "40px",
            borderBottom: "1px solid rgba(200,170,110,0.3)",
            borderLeft: "1px solid rgba(200,170,110,0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            right: "2rem",
            width: "40px",
            height: "40px",
            borderBottom: "1px solid rgba(200,170,110,0.3)",
            borderRight: "1px solid rgba(200,170,110,0.3)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "720px",
            width: "100%",
          }}
        >
          {/* Logo placeholder */}
          <div
            style={{
              width: "88px",
              height: "88px",
              border: "1px solid rgba(200,170,110,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "2.5rem",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "6px",
                border: "1px solid rgba(200,170,110,0.15)",
              }}
            />
            {/* Replace this with your <Image> component */}
            {/* <span
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#7a6e5e",
              }}
            >
              logo
            </span> */}
            <Image
              alt=""
              src="/images/icon.jpg"
              width={62}
              height={62}
              className="object-cover"
            />
          </div>

          {/* Brand name */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.8rem, 10vw, 6.5rem)",
              fontWeight: 300,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#f0ece4",
              margin: 0,
              lineHeight: 1,
            }}
          >
            Diphactory
          </h1>

          {/* Divider */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background:
                "linear-gradient(to right, transparent, rgba(200,170,110,0.4), transparent)",
              margin: "1.8rem 0",
            }}
          />

          {/* Tagline */}
          <p
            style={{
              fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#9c8e7a",
              margin: "0 0 3.5rem",
              fontWeight: 400,
              textAlign: "center",
            }}
          >
            Photography · Art Prints · Multimedia
          </p>

          {/* Countdown */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "clamp(0.8rem, 3vw, 2rem)",
              marginBottom: "4rem",
            }}
          >
            <Tick value={d} label="Days" />
            <Divider />
            <Tick value={h} label="Hours" />
            <Divider />
            <Tick value={m} label="Minutes" />
            <Divider />
            <Tick value={s} label="Seconds" />
          </div>

          {/* Email capture */}
          {!submitted ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.2rem",
                width: "100%",
              }}
            >
              <p
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "#7a6e5e",
                  margin: 0,
                }}
              >
                Be the first to know
              </p>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  maxWidth: "420px",
                  border: "1px solid rgba(200,170,110,0.25)",
                }}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    padding: "0.85rem 1.2rem",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "0.95rem",
                    color: "#d4cec4",
                    letterSpacing: "0.04em",
                  }}
                />
                <button
                  onClick={handleSubmit}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    background: "rgba(200,170,110,0.12)",
                    border: "none",
                    borderLeft: "1px solid rgba(200,170,110,0.25)",
                    padding: "0.85rem 1.4rem",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#c8aa6e",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  Notify me
                </button>
              </div>
            </div>
          ) : (
            <p
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#c8aa6e",
                margin: 0,
              }}
            >
              ✦ &nbsp; Thank you — we&apos;ll be in touch &nbsp; ✦
            </p>
          )}

          {/* Footer */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background:
                "linear-gradient(to right, transparent, rgba(200,170,110,0.2), transparent)",
              margin: "4rem 0 1.5rem",
            }}
          />
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#5a4e3f",
              margin: 0,
            }}
          >
            © 2026 Diphactory &nbsp;·&nbsp; All rights reserved
          </p>
        </div>
      </div>
    </>
  );
}
