import type { CSSProperties } from "react";

type BrandMarkProps = {
  className?: string;
  cutoutColor?: string;
  style?: CSSProperties;
  title?: string;
};

/** The approved circular OpenBIMI B brandmark. */
export function BrandMark({ className, cutoutColor = "white", style, title }: BrandMarkProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <circle cx="32" cy="32" r="30" fill="currentColor" />
      <path d="M32 8A24 24 0 0 0 32 56Z" fill={cutoutColor} />
      <rect x="30.5" y="8" width="3" height="48" fill="currentColor" />
      <path
        d="M32 8C45 8 52.5 13.2 52.5 21.5C52.5 28 48.2 31.3 42.2 32C49.8 32.8 55.5 37.2 55.5 44C55.5 52 47.5 56 32 56"
        fill="none"
        stroke={cutoutColor}
        strokeWidth="4.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
