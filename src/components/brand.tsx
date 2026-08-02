import Link from "next/link";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`brand${inverse ? " brand--inverse" : ""}`} href="/" aria-label="OpenBIMI home">
      <span className="brand-mark" aria-hidden="true">
        <span>B</span>
      </span>
      <span className="brand-name">OpenBIMI</span>
    </Link>
  );
}
