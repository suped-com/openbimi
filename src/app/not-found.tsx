import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="error-page">
      <div className="error-orbit" aria-hidden="true"><span>404</span></div>
      <h1>This record does not exist.</h1>
      <p>The page may have moved, or the address may contain a typo.</p>
      <Link className="button button--primary" href="/"><ArrowLeft size={16} aria-hidden="true" /> Back to OpenBIMI</Link>
    </main>
  );
}
