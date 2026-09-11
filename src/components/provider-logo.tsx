import Image from "next/image";

export function ProviderLogo({ file }: { file: string }) {
  return (
    <span className="coverage-brand-image">
      <Image
        src={`/providers/${file}`}
        alt=""
        width={80}
        height={44}
        sizes="80px"
      />
    </span>
  );
}
