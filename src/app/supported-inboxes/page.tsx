import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Minus,
  Shuffle,
} from "lucide-react";
import {
  adoptionSource,
  consideringInboxes,
  reviewedOn,
  supportedInboxes,
  type EvidenceSource,
  type Support,
} from "@/content/supported-inboxes";
import "./supported-inboxes.css";

export const metadata: Metadata = {
  title: "Supported inboxes — BIMI, VMC and CMC support",
  description:
    "A source-linked table of BIMI inbox support: VMC, CMC and certificate-free logo display, including provider requirements and unconfirmed policies.",
  alternates: { canonical: "/supported-inboxes" },
};

const supportStyles = {
  yes: { label: "Yes", Icon: Check },
  no: { label: "No", Icon: Minus },
  unconfirmed: { label: "Unconfirmed", Icon: CircleHelp },
  approval: { label: "Approval", Icon: Clock3 },
  varies: { label: "Varies", Icon: Shuffle },
};

function SupportIndicator({ value }: { value: Support }) {
  const { label, Icon } = supportStyles[value];
  return (
    <span className={`inbox-support inbox-support--${value}`} title={label}>
      <Icon size={17} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

function Sources({
  sources,
  name,
}: {
  sources: EvidenceSource[];
  name: string;
}) {
  return (
    <span className="inbox-sources">
      {sources.map((source) => (
        <a
          key={source.url}
          href={source.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${name}: ${source.label} source`}
        >
          {source.label}
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      ))}
    </span>
  );
}

export default function SupportedInboxesPage() {
  return (
    <main className="page-main inboxes-page">
      <div className="container inboxes-container">
        <header className="inboxes-heading">
          <div>
            <h1>Supported inboxes</h1>
            <p>BIMI logo display with a VMC, CMC or no certificate.</p>
          </div>
          <span className="inboxes-reviewed">Checked {reviewedOn}</span>
        </header>
        <div className="inboxes-key" aria-label="Table key">
          <span>
            <Check size={15} aria-hidden="true" /> Yes
          </span>
          <span>
            <Minus size={15} aria-hidden="true" /> No
          </span>
          <span>
            <CircleHelp size={15} aria-hidden="true" /> Unconfirmed
          </span>
          <span>
            <Clock3 size={15} aria-hidden="true" /> Approval needed
          </span>
          <span>
            <Shuffle size={15} aria-hidden="true" /> Varies by account
          </span>
        </div>
        <div className="inboxes-table-wrap">
          <table className="inboxes-table">
            <caption className="sr-only">
              BIMI support by receiving inbox, certificate type and provider
              requirements
            </caption>
            <colgroup>
              <col className="inbox-name-column" />
              <col className="inbox-support-column" />
              <col className="inbox-support-column" />
              <col className="inbox-support-column" />
              <col className="inbox-notes-column" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Inbox</th>
                <th scope="col">
                  <abbr title="Verified Mark Certificate">VMC</abbr>
                </th>
                <th scope="col">
                  <abbr title="Common Mark Certificate">CMC</abbr>
                </th>
                <th scope="col">No certificate</th>
                <th scope="col" className="inbox-notes-cell">
                  Requirements & sources
                </th>
              </tr>
            </thead>
            {supportedInboxes.map((inbox) => (
              <tbody key={inbox.id}>
                <tr id={`inbox-${inbox.id}`}>
                  <th scope="row">
                    <div className="inbox-identity">
                      <span className="inbox-logo">
                        <Image
                          src={`/inbox-logos/${inbox.logo}`}
                          alt=""
                          width={64}
                          height={36}
                          sizes="(max-width: 640px) 34px, 64px"
                        />
                      </span>
                      <span>
                        <strong>{inbox.name}</strong>
                        <small>{inbox.detail}</small>
                      </span>
                    </div>
                  </th>
                  <td>
                    <SupportIndicator value={inbox.vmc} />
                  </td>
                  <td>
                    <SupportIndicator value={inbox.cmc} />
                  </td>
                  <td>
                    <SupportIndicator value={inbox.noCertificate} />
                  </td>
                  <td className="inbox-notes-cell">
                    <p>{inbox.note}</p>
                    <Sources sources={inbox.sources} name={inbox.name} />
                  </td>
                </tr>
                <tr className="inbox-mobile-notes">
                  <td colSpan={4}>
                    <details>
                      <summary>
                        Requirements & sources
                        <span className="sr-only"> for {inbox.name}</span>
                        <ChevronDown size={13} aria-hidden="true" />
                      </summary>
                      <p>{inbox.note}</p>
                      <Sources sources={inbox.sources} name={inbox.name} />
                    </details>
                  </td>
                </tr>
              </tbody>
            ))}
            <tfoot>
              <tr>
                <td colSpan={5}>
                  <strong>Not confirmed live:</strong>{" "}
                  {consideringInboxes.join(", ")}. Listed as considering BIMI in
                  the{" "}
                  <a href={adoptionSource} target="_blank" rel="noreferrer">
                    BIMI Group directory
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                  . Cloudmark is a mail-server platform; display depends on its
                  mailbox operator.
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="inboxes-footnotes">
          <p>
            <strong>VMC</strong> = Verified Mark Certificate.{" "}
            <strong>CMC</strong> = Common Mark Certificate. “Yes” means eligible
            for a logo, subject to authentication, logo and sender requirements.
          </p>
          <p>
            <strong>Unconfirmed</strong> means no explicit public policy was
            found, not “No”. Certificate-free display does not confirm CMC
            validation.{" "}
            <a
              href="https://bimigroup.org/implementation-guide/"
              target="_blank"
              rel="noreferrer"
            >
              BIMI requirements
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
