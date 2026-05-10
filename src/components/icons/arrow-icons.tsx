import * as React from "react";

type LogoIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};

export const ArrowLeft = ({
  size = 14,
  color = "currentColor", //#b9862b
  ...props
}: LogoIconProps) => (
  <svg width={size} height={size} fill="none" {...props}>
    <path
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 2.5 4.5 7 9 11.5"
    />
  </svg>
);

export const ArrowRight = ({
  size = 14,
  color = "currentColor", //#b9862b
  ...props
}: LogoIconProps) => (
  <svg width={size} height={size} fill="none" {...props}>
    <path
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 2.5L9.5 7 5 11.5"
    />
  </svg>
);

export const ArrowRight2 = ({
  size = 14,
  color = "currentColor", //#b9862b
  ...props
}: LogoIconProps) => (
  <svg width={size} height={size} fill="none" {...props}>
    <path
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7h8M7.5 3.5L11 7l-3.5 3.5"
    />
  </svg>
);
