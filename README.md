# OpenBIMI

[![CI](https://github.com/suped-com/openbimi/actions/workflows/ci.yml/badge.svg)](https://github.com/suped-com/openbimi/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
[![OpenBIMI](https://img.shields.io/badge/openbimi.com-live-2f6bff)](https://openbimi.com)

OpenBIMI is a free, open-source way to set up, validate, and understand Brand Indicators for Message Identification (BIMI)—without an account or a paid setup tool.

> **Project status:** Early development. The application scaffold and production infrastructure are live; the setup and validation tools are being built in public.

## What we are building

OpenBIMI will help domain owners move from “What is BIMI?” to a valid, testable configuration:

- inspect BIMI, DMARC, and related DNS records;
- explain prerequisites and provider-specific limitations in plain language;
- validate logos against BIMI's SVG requirements;
- generate records with copy-and-paste instructions;
- guide users through setup without storing credentials or requiring an account; and
- provide open documentation that remains useful even if the hosted service disappears.

## Principles

- **Open by default.** Source, documentation, and decisions belong in the public repository.
- **Free to use.** The core setup and validation experience will not require payment.
- **Privacy-conscious.** Prefer browser-side processing and public DNS lookups; collect as little data as possible.
- **Honest results.** Explain uncertainty and provider differences instead of promising inbox logo display.
- **Portable knowledge.** Guidance should be understandable and usable without vendor lock-in.

## Local development

### Prerequisites

- [Node.js 24](https://nodejs.org/)
- [pnpm 11](https://pnpm.io/)

```bash
git clone https://github.com/suped-com/openbimi.git
cd openbimi
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

Run the same checks used by CI before opening a pull request:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Project structure

```text
src/app/            Next.js application routes, layouts, and styles
.github/            CI, issue forms, and project automation
```

The project uses Next.js, React, TypeScript, Tailwind CSS, and the pnpm package manager. Pull requests receive Vercel preview deployments; merges to `main` deploy to production.

## Contributing and support

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

- Ask usage and design questions in [GitHub Discussions](https://github.com/suped-com/openbimi/discussions).
- Report reproducible bugs with the [bug report form](https://github.com/suped-com/openbimi/issues/new?template=bug_report.yml).
- Request features with the [feature request form](https://github.com/suped-com/openbimi/issues/new?template=feature_request.yml).
- Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## BIMI notice

OpenBIMI is an independent open-source project. It is not affiliated with or endorsed by the AuthIndicators Working Group or the BIMI Group. A technically valid BIMI configuration does not guarantee that every mailbox provider will display a logo; provider policies and certification requirements vary.

## License

Licensed under the [Apache License 2.0](LICENSE).
