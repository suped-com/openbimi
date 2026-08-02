import type { ReactNode } from "react";

export function InfoPage({ eyebrow, title, intro, updated, children }: { eyebrow: string; title: ReactNode; intro: string; updated?: string; children: ReactNode }) {
  return (
    <main className="page-main info-page">
      <section className="info-hero">
        <div className="container narrow-container">
          <p className="eyebrow"><span /> {eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
          {updated && <span className="info-updated">Last updated {updated}</span>}
        </div>
      </section>
      <article className="info-body"><div className="container narrow-container">{children}</div></article>
    </main>
  );
}
