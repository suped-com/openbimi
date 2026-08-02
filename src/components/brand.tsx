import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`brand${inverse ? " brand--inverse" : ""}`} href="/" aria-label="OpenBIMI home">
      <span className="brand-mark" aria-hidden="true">
        <BrandMark cutoutColor={inverse ? "#151819" : "white"} />
      </span>
      <span className="brand-name">OpenBIMI</span>
    </Link>
  );
}
