# Supported inboxes: evidence review

Reviewed 14 September 2026. The page data and per-row citations are in `src/content/supported-inboxes.ts`.

## Classification

This table describes receiving/display behavior, not whether a service can generate a sender's DNS record. A directory's BIMI listing does not establish acceptance of either certificate type. Prefer receiver requirements; explicitly identify issuer compatibility evidence when used. Absence of CMC documentation is **unconfirmed**, unless the receiver explicitly requires a VMC. A certificate-free logo does not demonstrate that a receiver validates CMCs.

This was a documentation review, not a controlled delivery test using purchased certificates. We did not contact providers. Unknowns remain explicit.

## Findings and changes

| Inbox | Evidence and interpretation |
| --- | --- |
| Gmail | [Google setup requirements](https://knowledge.workspace.google.com/admin/security/set-up-bimi) explicitly accept VMC or CMC. A VMC adds the Gmail checkmark; CMC does not. No certificate-free path. |
| Apple Mail | [Apple's receiver integration requirements](https://developer.apple.com/support/bimi/) explicitly name VMCs and other evidence documents, but not CMCs. The receiving provider must be verified by Apple, validate evidence and supply BIMI headers. Therefore VMC = yes with conditions, CMC = unconfirmed, self-asserted/no evidence = no. Do not interpret generic “other evidence” as confirmed CMC acceptance or confuse Apple Business Connect branding with BIMI. |
| Yahoo / AOL | [Yahoo Sender Hub](https://senders.yahooinc.com/bimi/) permits certificate-free logos for qualifying bulk senders and uses a supplied VMC in eligibility. It does not explicitly describe CMC validation. CMC = unconfirmed; no certificate = yes. Certificate-free display does not establish a CMC-validation path. |
| Fastmail | [Receiver and sender guide](https://www.fastmail.help/hc/en-us/articles/7002542139663-Using-BIMI-in-Fastmail) supports certificate-free display and describes optional VMCs; [DigiCert's compatibility list](https://www.digicert.com/tls-ssl/verified-mark-certificates) also names Fastmail for VMCs. CMC = unconfirmed; no certificate = yes. CMC validation is not established by the receiver guide. |
| Zone Webmail | [Current receiver help](https://www.zone.ee/help/en/kb/bimi-en/), updated 11 May 2026, explicitly requires VMC **or** CMC and valid aligned authentication. Both certificate types = yes, no certificate = no. This is stronger and newer evidence than the July 2025 blog previously cited. |
| La Poste | [Postmaster requirements](https://postmaster.laposte.net/contents/ajouter-le-logo-de-votre-marque-aux-e-mails-que-vous-envoyez) accept VMC or require postmaster approval when no VMC is present. A CMC is not a VMC, so it does not establish an exemption from that approval. CMC and no certificate are shown as approval routes; this does not claim CMC verification. |
| Zoho Mail | [Zoho's VMC glossary](https://www.zoho.com/zeptomail/glossary/what-is-verified-mark-certificate.html) names its own inbox as requiring a VMC; DigiCert's compatibility list also names Zoho. CMC remains unconfirmed. [Admin Console setup](https://www.zoho.com/mail/help/adminconsole/bimi-configuration-zoho-mail.html), updated 14 August 2026, is primarily sender configuration, so its VMC-only form is not independently treated as proof that the receiving system rejects CMCs. Zoho's March 2026 Campaigns article discusses CMCs generally, not Zoho inbox acceptance. |
| au Mail | [KDDI's receiver launch notice](https://www.au.com/information/topic/mobile/2023-024/) describes receiver validation of VMCs and logo data. [March 2026 update](https://newsroom.kddi.com/news/detail/kddi_nr-966_4374.html) confirms ongoing BIMI operation. VMC = yes; CMC and self-asserted policy are not specified. |
| NTT docomo | [Receiver launch documentation](https://www.docomo.ne.jp/binary/pdf/info/news_release/topics_240522_00.pdf), pages 2 and 4–6, describes VMC verification and initial logo placement in message headers. VMC = yes; CMC/no-certificate behavior is not specified. Docomo's separate announcements about signing its own outgoing mail are not receiver-policy evidence. |
| Zoner / Zmail | [Operator's receiver requirements](https://napoveda.czechia.com/clanek/podpora-bimi-a-vmc-v-zmailu/) explicitly require a VMC as proof of logo rights and say no logo without it. VMC = yes, CMC/no certificate = no under the published policy. This replaces the old generic “confirm policy” entry. |
| Onet | [Onet receiver help](https://pomoc.poczta.onet.pl/bimi-or-brand-indicators-for-message-identification/bimi-w-onet-poczcie/dyeb0tz) confirms BIMI, and DigiCert's VMC compatibility list explicitly names Onet. Thus VMC = yes, attributed to the issuer; CMC/no certificate = unconfirmed. The separate logo marketing page does not specify certificate types. |
| GMX / WEB.DE | [BIMI Group directory](https://bimigroup.org/bimi-infographic/) lists both, but its linked trustedDialog/BIMI page returns 404. Current GMX postmaster material describes proprietary trustedDialog, which is not evidence of particular BIMI certificate acceptance. All certificate choices remain unconfirmed; the adoption listing is explicitly identified as such. |
| Comcast / Xfinity | [Xfinity migration policy](https://www.xfinity.com/support/articles/yahoo-email-migration-overview) says migrated accounts use Yahoo as the mail provider while keeping comcast.net addresses, with invitations rolling through 2026. Yahoo rules therefore apply to migrated accounts; this is an inference from the operator change. Legacy receiver certificate policy was not established. Each column says varies, rather than applying Yahoo rules to every comcast.net account. |
| Outlook / Microsoft 365 | BIMI Group explicitly lists Microsoft as not supporting BIMI. The previously cited Microsoft Dynamics article is about **sending**, and does not prove Outlook receiver behavior; replaced its citation with the adoption directory. Other sender-logo products are separate. |

## Directory scope and conflicting claims

The BIMI Group directory still labels Atmail, BT, mail.com, Nifty, Qualitia, Seznam.cz and Yahoo! Japan as considering BIMI, with no timelines. They appear in a compact note, not as confirmed supported inboxes. Cloudmark is mail-server software, so its certificate processing cannot establish display in a particular inbox.

The directory says “last updated May 2025”; do not assume its membership establishes current certificate requirements. Cross-check operator guidance above.

[SSL.com's CMC sales page](https://www.ssl.com/products/email-brand-trust/brand-trust/cmc/) claims Yahoo/Fastmail compatibility, but contains inconsistent Google/Apple statements and overstates automatic display. It was not used to override receiver requirements or turn Apple CMC into a definitive yes/no. DigiCert's VMC list was used only for explicitly named VMC compatibility, not generalized to CMCs.
