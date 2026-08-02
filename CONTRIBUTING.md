# Contributing to OpenBIMI

Thank you for helping make BIMI easier to understand and configure. Contributions of code, documentation, design, testing, and provider-specific knowledge are welcome.

## Before you start

- Search existing issues and discussions before opening a new one.
- Use an issue or discussion to propose substantial changes before investing in an implementation.
- Keep pull requests focused. Separate unrelated fixes into separate pull requests.
- Never commit credentials, private DNS exports, customer data, or other secrets.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Development setup

You need Node.js 24 and pnpm 11.

```bash
git clone https://github.com/suped-com/openbimi.git
cd openbimi
pnpm install
pnpm dev
```

If you do not have write access, fork the repository and clone your fork instead.

## Making a change

1. Create a short, descriptive branch from the latest `main`.
2. Make the smallest coherent change that solves the problem.
3. Add or update tests when the project area has test coverage.
4. Update documentation when behavior or user-facing guidance changes.
5. Run the full local validation suite.

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Pull requests

A good pull request:

- explains the problem and the chosen solution;
- links the relevant issue when one exists;
- includes screenshots for visible interface changes;
- describes how the change was verified;
- calls out follow-up work or known limitations; and
- passes all required checks.

Maintainers may ask for changes to keep the product accurate, accessible, privacy-conscious, and maintainable. Pull requests are squash-merged, so the pull request title should be a useful final commit message.

## Documentation and BIMI guidance

BIMI behavior differs across mailbox providers and changes over time. When contributing factual guidance:

- prefer primary sources such as specifications and official provider documentation;
- link the source near the claim;
- distinguish standards requirements from provider policy; and
- avoid promising that a valid record will cause a logo to display.

## Reporting security issues

Do not report vulnerabilities in a public issue. Follow the private reporting process in [SECURITY.md](SECURITY.md).
