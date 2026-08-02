import type { CSSProperties } from "react";

const topBowl = "M55 7C68 7 77 12.5 77 20C77 27.5 68 33 55 33C62 29.5 65.5 25.3 65.5 20C65.5 14.7 62 10.5 55 7Z";
const bottomBowl = "M55 31C68 31 77 36.5 77 44C77 51.5 68 57 55 57C62 53.5 65.5 49.3 65.5 44C65.5 38.7 62 34.5 55 31Z";

type BrandMarkProps = {
  className?: string;
  style?: CSSProperties;
  title?: string;
};

/** The approved I3.2 “Orbit B Final” OpenBIMI brandmark. */
export function BrandMark({ className, style, title }: BrandMarkProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 80 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <circle cx="30.5" cy="32" r="23.5" stroke="currentColor" strokeWidth="9.5" />
      <path d={topBowl} fill="currentColor" />
      <path d={bottomBowl} fill="currentColor" />
    </svg>
  );
}
