import Link from "next/link";
import { ArrowUpRight, Code2 } from "lucide-react";
import { Brand } from "@/components/brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-intro">
          <Brand inverse />
          <p>Open tools for an open email standard. No account, no paywall, no lock-in.</p>
        </div>
        <div className="footer-column">
          <p className="footer-label">Tools</p>
          <Link href="/setup">Setup wizard</Link>
          <Link href="/check">Domain checker</Link>
          <Link href="/tools/logo">Logo converter</Link>
          <Link href="/tools/record">Record builder</Link>
          <Link href="/tools/headers">Header inspector</Link>
        </div>
        <div className="footer-column">
          <p className="footer-label">Learn</p>
          <Link href="/learn">BIMI guides</Link>
          <Link href="/providers">Provider matrix</Link>
          <a href="https://bimigroup.org/implementation-guide/" target="_blank" rel="noreferrer">
            BIMI Group <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <a href="https://datatracker.ietf.org/doc/html/draft-brand-indicators-for-message-identification" target="_blank" rel="noreferrer">
            Current draft <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-column">
          <p className="footer-label">Project</p>
          <a href="https://github.com/suped-com/openbimi" target="_blank" rel="noreferrer">
            <Code2 size={14} aria-hidden="true" /> GitHub
          </a>
          <a href="https://github.com/suped-com/openbimi/discussions">Discussions</a>
          <a href="https://github.com/suped-com/openbimi/blob/main/LICENSE">Apache 2.0 license</a>
          <Link href="/open">Open project</Link>
          <Link href="/status">Status</Link>
          <Link href="/costs">Costs</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} OpenBIMI contributors</span>
        <span className="footer-legal"><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms and conditions</Link><Link href="/security">Security</Link></span>
      </div>
    </footer>
  );
}
