import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CircleHelp } from "lucide-react";
import { ProviderGuide } from "@/components/provider-guide";
import { ProviderLogo } from "@/components/provider-logo";
import {
  additionalProviders,
  consideringProviders,
  directorySource,
} from "@/content/providers";
import "./providers.css";

export const metadata: Metadata = {
  title: "BIMI provider coverage: VMC, CMC or no certificate?",
  description:
    "Compare BIMI logo and checkmark coverage for Gmail, Apple Mail, Yahoo, Outlook and regional providers. Explore VMC, CMC and certificate-free inbox previews.",
};

export default function ProvidersPage() {
  return (
    <main className="page-main coverage-page">
      <ProviderGuide />
      <section
        className="coverage-directory-section"
        aria-labelledby="coverage-directory-title"
      >
        <div className="container">
          <div className="coverage-section-heading">
            <div>
              <p className="eyebrow">
                <span /> 03 / Beyond the big inboxes
              </p>
              <h2 id="coverage-directory-title">
                The rest of the provider map.
              </h2>
            </div>
            <p>
              The BIMI Group also lists these services as supporting BIMI. Their
              inclusion alone doesn’t establish which certificates they accept.
            </p>
          </div>
          <div className="coverage-directory">
            {additionalProviders.map((provider) => (
              <article key={provider.name}>
                <ProviderLogo file={provider.logo} />
                <div>
                  <h3>{provider.name}</h3>
                  <p>{provider.context}</p>
                </div>
                <span>
                  <CircleHelp size={14} aria-hidden="true" /> Confirm
                  certificate policy
                </span>
              </article>
            ))}
          </div>
          <div className="coverage-directory-note">
            <p>
              <strong>Check before you buy.</strong> For these services, confirm
              VMC, CMC or certificate-free acceptance with the operator.
              Cloudmark is mail infrastructure; a deployment’s support depends
              on the mailbox operator.
            </p>
            <a href={directorySource} target="_blank" rel="noreferrer">
              BIMI Group provider directory{" "}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="coverage-considering">
            <div>
              <h3>On the watch list</h3>
              <p>
                Listed as considering BIMI. Don’t count these as live coverage.
              </p>
            </div>
            <ul>
              {consideringProviders.map((provider) => (
                <li key={provider.name}>
                  <ProviderLogo file={provider.logo} />
                  <span>{provider.name}</span>
                </li>
              ))}
            </ul>
            <p>
              Yahoo! Japan is separate from Yahoo Mail / AOL. Adoption listings
              can lag launches; follow the operator’s current policy.
            </p>
          </div>
        </div>
      </section>
      <section className="container coverage-next-step">
        <div>
          <p className="eyebrow">
            <span /> Make it happen
          </p>
          <h2>
            Know your audience.
            <br />
            <em>Then choose your certificate.</em>
          </h2>
          <p>
            Start with the inboxes your customers use. Check your domain’s
            foundation before buying a certificate.
          </p>
        </div>
        <div>
          <Link className="button button--primary" href="/check">
            Check your domain <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link className="text-link" href="/setup">
            Walk through setup <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <div className="container coverage-footnote">
        <p>
          Provider names and logos belong to their respective owners. No
          affiliation or endorsement is implied.
        </p>
        <a
          href="https://github.com/suped-com/openbimi/issues/new?template=bug_report.yml"
          target="_blank"
          rel="noreferrer"
        >
          Spotted a policy change? Suggest a correction{" "}
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
    </main>
  );
}
