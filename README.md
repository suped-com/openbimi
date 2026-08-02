# OpenBIMI

[![CI](https://github.com/suped-com/openbimi/actions/workflows/ci.yml/badge.svg)](https://github.com/suped-com/openbimi/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![OpenBIMI](https://img.shields.io/badge/openbimi.com-live-2f6bff)](https://openbimi.com)

OpenBIMI is a free, open-source way to set up, validate, and understand Brand Indicators for Message Identification (BIMI)—without an account or a paid setup tool.

> **Project status:** V1 is live at [openbimi.com](https://openbimi.com). The BIMI specification remains an active Internet-Draft, so validation rules and provider guidance will continue to evolve.

## What is included

OpenBIMI helps domain owners move from “What is BIMI?” to a valid, testable configuration:

- **Domain checker:** inspects DMARC enforcement, BIMI DNS, the hosted SVG, and mark certificate availability.
- **SVG validator:** checks SVG Tiny PS requirements locally and safely repairs common metadata problems.
- **Record generator:** produces the exact TXT host and value for any DNS provider.
- **Setup guides:** explains DMARC, BIMI records, SVG requirements, VMCs, and CMCs using primary sources.
- **Shareable reports:** creates a direct URL for repeating or sharing a public domain check.

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
pnpm test
pnpm build
```

## Project structure

```text
src/app/            Pages, API route, metadata, and global styles
src/components/     Interactive checkers, generators, and shared UI
src/lib/            DNS discovery, record parsing, and SVG validation
src/content/        Source-linked setup guides
.github/            CI and project automation
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

Licensed under the [MIT License](LICENSE).
