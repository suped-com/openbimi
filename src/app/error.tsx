"use client";

import { RefreshCw } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="error-page">
      <div className="error-orbit error-orbit--small" aria-hidden="true"><span>!</span></div>
      <h1>Something interrupted the check.</h1>
      <p>No data was changed. Try the page again, or return in a moment.</p>
      <button className="button button--primary" type="button" onClick={reset}><RefreshCw size={16} aria-hidden="true" /> Try again</button>
    </main>
  );
}
