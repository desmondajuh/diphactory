/* ── Inline SVG Globe Icon ── */
export function GlobeIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white/60"
    >
      <circle
        cx="22"
        cy="22"
        r="20.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <ellipse
        cx="22"
        cy="22"
        rx="10"
        ry="20.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <line
        x1="1.5"
        y1="22"
        x2="42.5"
        y2="22"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <line
        x1="22"
        y1="1.5"
        x2="22"
        y2="42.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {/* CLV text inside */}
      <text
        x="22"
        y="25.5"
        textAnchor="middle"
        fontSize="6"
        fontWeight="700"
        fill="currentColor"
        fontFamily="sans-serif"
        letterSpacing="0.5"
      >
        CLV
      </text>
    </svg>
  );
}
