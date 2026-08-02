export default function Home() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <span className="wordmark">OpenBIMI</span>
        <a
          className="github-link"
          href="https://github.com/suped-com/openbimi"
        >
          GitHub
        </a>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">Open source · No account required</p>
        <h1 id="hero-title">
          BIMI, <span>made open.</span>
        </h1>
        <p className="lede">
          Free, open tools to set up, validate, and understand BIMI are being
          built here.
        </p>
        <div className="status" role="status">
          <span aria-hidden="true" />
          Initial platform scaffold is live
        </div>
      </section>

      <footer>
        <span>OpenBIMI</span>
        <span>Open tools for an open email standard.</span>
      </footer>
    </main>
  );
}
