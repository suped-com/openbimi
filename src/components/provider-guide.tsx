"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Mail,
  Minus,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import {
  certificateOptions,
  coverageLabels,
  providers,
  type Certificate,
  type Coverage,
  type Provider,
} from "@/content/providers";
import { ProviderLogo } from "@/components/provider-logo";

function CoverageResult({ value }: { value: Coverage }) {
  const Icon =
    value === "verified"
      ? BadgeCheck
      : value === "logo"
        ? Check
        : value === "approval"
          ? Clock3
          : value === "unknown"
            ? CircleHelp
            : Minus;
  return (
    <span className={`coverage-result coverage-result--${value}`}>
      <Icon size={17} aria-hidden="true" />
      <span>{coverageLabels[value]}</span>
    </span>
  );
}

function ProviderIdentity({ provider }: { provider: Provider }) {
  return (
    <div className="coverage-identity">
      <ProviderLogo file={provider.logo} />
      <div>
        <strong>{provider.name}</strong>
        <span>{provider.context}</span>
      </div>
    </div>
  );
}

function ProviderPolicy({ provider }: { provider: Provider }) {
  return (
    <details className="coverage-policy">
      <summary>
        Display rules<span className="sr-only"> for {provider.name}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </summary>
      <p>
        {provider.note}{" "}
        <a href={provider.source} target="_blank" rel="noreferrer">
          Provider source <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </p>
    </details>
  );
}

const previewProviders = providers.filter(({ id }) =>
  ["gmail", "yahoo", "outlook"].includes(id),
);

function InboxPreview({
  certificate,
  onCertificateChange,
}: {
  certificate: Certificate;
  onCertificateChange: (value: Certificate) => void;
}) {
  const [providerId, setProviderId] = useState("gmail");
  const provider = previewProviders.find(({ id }) => id === providerId)!;
  const result = provider.coverage[certificate];
  const showsLogo = result === "logo" || result === "verified";
  const description =
    providerId === "gmail"
      ? certificate === "vmc"
        ? "Your brand logo, plus Gmail’s blue verification checkmark."
        : certificate === "cmc"
          ? "Your brand logo appears. The blue checkmark is reserved for VMCs."
          : "Gmail requires a VMC or CMC to display a BIMI logo."
      : providerId === "yahoo"
        ? "Eligible senders can show a logo without a certificate. Reputation and engagement still matter."
        : "Outlook does not display BIMI logos, whichever certificate you choose.";

  return (
    <div className="coverage-preview">
      <div className="coverage-preview-top">
        <span>
          <Sparkles size={16} aria-hidden="true" /> See the difference
        </span>
        <span>Illustrative preview</span>
      </div>
      <fieldset className="coverage-mailbox-picker">
        <legend className="sr-only">Preview mailbox</legend>
        {previewProviders.map((item) => (
          <label key={item.id}>
            <input
              type="radio"
              name="preview-mailbox"
              value={item.id}
              checked={providerId === item.id}
              onChange={() => setProviderId(item.id)}
            />
            <span>
              {item.id === "yahoo"
                ? "Yahoo"
                : item.id === "outlook"
                  ? "Outlook"
                  : "Gmail"}
            </span>
          </label>
        ))}
      </fieldset>
      <div
        className="coverage-inbox"
        role="region"
        aria-label={`${provider.name} example message`}
      >
        <div className="coverage-inbox-toolbar">
          <Mail size={18} aria-hidden="true" />
          <span>Inbox</span>
          <span>1 new message</span>
        </div>
        <div className="coverage-message">
          <div
            className={`coverage-avatar${showsLogo ? " coverage-avatar--brand" : ""}`}
            role="img"
            aria-label={
              showsLogo ? "Example brand logo" : "Generic sender initial"
            }
          >
            {showsLogo ? (
              <Star size={27} fill="currentColor" aria-hidden="true" />
            ) : (
              "N"
            )}
          </div>
          <div className="coverage-message-content">
            <div className="coverage-sender">
              <strong>Northstar</strong>
              {result === "verified" ? (
                <BadgeCheck
                  className="coverage-blue-check"
                  size={20}
                  aria-label="Gmail verified checkmark"
                />
              ) : null}
              <time>9:41 AM</time>
            </div>
            <strong>Your next adventure starts here</strong>
            <p>A little inspiration for your next escape.</p>
            <span>
              to me <ChevronDown size={12} aria-hidden="true" />
            </span>
          </div>
        </div>
        <div className="coverage-email-art" aria-hidden="true">
          <Star fill="currentColor" />
          <span>
            Go somewhere
            <br />
            <em>good.</em>
          </span>
          <div className="coverage-art-sun" />
        </div>
      </div>
      <fieldset className="coverage-preview-certificates">
        <legend className="sr-only">Preview certificate</legend>
        {certificateOptions.map((option) => (
          <label key={option.id}>
            <input
              type="radio"
              name="preview-certificate"
              value={option.id}
              checked={certificate === option.id}
              onChange={() => onCertificateChange(option.id)}
            />
            <span>{option.name}</span>
          </label>
        ))}
      </fieldset>
      <div
        className="coverage-preview-outcome"
        role="status"
        aria-live="polite"
      >
        <CoverageResult value={result} />
        <p>{description}</p>
      </div>
      <p className="coverage-preview-caption">
        Example brand and layout. Actual appearance varies by app, message and
        sender eligibility.
      </p>
    </div>
  );
}

export function ProviderGuide() {
  const [certificate, setCertificate] = useState<Certificate>("vmc");

  return (
    <>
      <section className="coverage-hero">
        <div className="container coverage-hero-grid">
          <div className="coverage-hero-copy">
            <p className="eyebrow">
              <span /> The inbox guide
            </p>
            <h1>
              Your logo.
              <br />
              Which <em>inboxes?</em>
            </h1>
            <p className="coverage-lede">
              A logo in Yahoo. A blue check in Gmail. Nothing from BIMI in
              Outlook. Here’s what each certificate actually unlocks.
            </p>
            <a className="button button--primary" href="#compare-coverage">
              Compare your options <ArrowDown size={16} aria-hidden="true" />
            </a>
            <p className="coverage-reviewed">
              Checked 11 September 2026 · Sources linked below
            </p>
          </div>
          <InboxPreview
            certificate={certificate}
            onCertificateChange={setCertificate}
          />
        </div>
      </section>

      <section
        className="container coverage-options-section"
        id="compare-coverage"
        aria-labelledby="coverage-options-title"
      >
        <div className="coverage-section-heading">
          <div>
            <p className="eyebrow">
              <span /> 01 / Choose your route
            </p>
            <h2 id="coverage-options-title">Three options. Different reach.</h2>
          </div>
          <p>
            Select an option to update the preview and highlight its coverage
            below.
          </p>
        </div>
        <fieldset className="coverage-options">
          <legend className="sr-only">Certificate option</legend>
          {certificateOptions.map((option) => (
            <label className="coverage-option" key={option.id}>
              <input
                type="radio"
                name="certificate"
                value={option.id}
                checked={certificate === option.id}
                onChange={() => setCertificate(option.id)}
                aria-label={option.name}
              />
              <span className="coverage-option-inner">
                <span className="coverage-option-top">
                  <strong>{option.name}</strong>
                  <span className="coverage-radio-mark" aria-hidden="true">
                    {certificate === option.id ? <Check size={14} /> : null}
                  </span>
                </span>
                <span className="coverage-option-fullname">
                  {option.fullName}
                </span>
                <span className="coverage-option-headline">
                  {option.headline}
                </span>
                <span className="coverage-option-description">
                  {option.description}
                </span>
                <span className="coverage-option-takeaway">
                  {option.takeaway}
                </span>
              </span>
            </label>
          ))}
        </fieldset>
        <div className="coverage-baseline">
          <ShieldCheck size={22} aria-hidden="true" />
          <p>
            <strong>Every route starts with the same foundation.</strong>{" "}
            Enforced DMARC, authenticated mail, a compliant SVG logo and a valid
            BIMI record. A certificate alone never guarantees display.
          </p>
          <a
            href="https://bimigroup.org/implementation-guide/"
            target="_blank"
            rel="noreferrer"
          >
            Requirements <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section
        className="container coverage-comparison"
        aria-labelledby="coverage-comparison-title"
      >
        <div className="coverage-section-heading">
          <div>
            <p className="eyebrow">
              <span /> 02 / See the coverage
            </p>
            <h2 id="coverage-comparison-title">What lands in each inbox.</h2>
          </div>
          <p>
            “Logo” means eligible for display, subject to the provider’s rules.
            Open a row’s display rules for the details.
          </p>
        </div>
        <div className="coverage-table-wrap">
          <table className="coverage-table">
            <caption className="sr-only">
              BIMI logo coverage by mailbox provider and certificate type
            </caption>
            <thead>
              <tr>
                <th scope="col">Receiving mailbox</th>
                {certificateOptions.map((option) => (
                  <th
                    scope="col"
                    key={option.id}
                    className={certificate === option.id ? "is-selected" : ""}
                  >
                    {option.name}
                    <span>
                      {option.id === "vmc"
                        ? "Verified mark"
                        : option.id === "cmc"
                          ? "Common mark"
                          : "Self-asserted"}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id}>
                  <th scope="row">
                    <ProviderIdentity provider={provider} />
                    <ProviderPolicy provider={provider} />
                  </th>
                  {certificateOptions.map((option) => (
                    <td
                      key={option.id}
                      className={certificate === option.id ? "is-selected" : ""}
                    >
                      <CoverageResult value={provider.coverage[option.id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="coverage-mobile-list">
          {providers.map((provider) => (
            <article
              className="coverage-mobile-card"
              key={provider.id}
              aria-label={provider.name}
            >
              <ProviderIdentity provider={provider} />
              <dl>
                {certificateOptions.map((option) => (
                  <div
                    key={option.id}
                    className={certificate === option.id ? "is-selected" : ""}
                  >
                    <dt>{option.name}</dt>
                    <dd>
                      <CoverageResult value={provider.coverage[option.id]} />
                    </dd>
                  </div>
                ))}
              </dl>
              <ProviderPolicy provider={provider} />
            </article>
          ))}
        </div>
        <div className="coverage-legend">
          <p>
            <CircleHelp size={16} aria-hidden="true" />
            <strong>Check policy:</strong> public guidance doesn’t confirm this
            option. It does not mean unsupported.
          </p>
          <p>
            <Clock3 size={16} aria-hidden="true" />
            <strong>Approval needed:</strong> contact the provider before
            expecting a logo.
          </p>
        </div>
        <p className="coverage-certificate-note">
          Where certificates are optional, the logo can qualify independently of
          the certificate.{" "}
          <a
            href="https://bimigroup.org/understanding-bimi-certificate-types/"
            target="_blank"
            rel="noreferrer"
          >
            More about certificate types{" "}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </p>
      </section>
    </>
  );
}
