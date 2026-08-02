import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/",
  "/setup",
  "/check",
  "/tools/logo",
  "/tools/record",
  "/tools/headers",
  "/providers",
  "/learn",
  "/guides",
  "/guides/bimi-setup",
  "/open",
  "/status",
  "/costs",
  "/privacy",
  "/terms",
  "/security",
];

const checkResult = {
  domain: "example.com",
  organizationalDomain: "example.com",
  selector: "default",
  checkedAt: "2026-08-02T00:00:00.000Z",
  readiness: "technical",
  score: 85,
  summary: "The core BIMI setup is valid; provider evidence may still be required.",
  dmarc: {
    status: "pass",
    title: "DMARC enforcement",
    summary: "DMARC is enforced at reject.",
    record: "v=DMARC1; p=reject; pct=100",
    queryName: "_dmarc.example.com",
    issues: [],
    policy: "reject",
    subdomainPolicy: null,
    percentage: 100,
    usedFallback: false,
  },
  bimi: {
    status: "pass",
    title: "BIMI record",
    summary: "A valid BIMI assertion is published.",
    record: "v=BIMI1; l=https://example.com/bimi/logo.svg",
    queryName: "default._bimi.example.com",
    issues: [],
    location: "https://example.com/bimi/logo.svg",
    authority: null,
    avatarPreference: "brand",
    usedFallback: false,
  },
  logo: {
    status: "pass",
    summary: "The hosted logo is reachable and valid.",
    url: "https://example.com/bimi/logo.svg",
    contentType: "image/svg+xml",
    report: null,
    error: null,
  },
  authority: {
    status: "warning",
    summary: "No mark certificate is published.",
    url: null,
    reachable: false,
  },
  infrastructure: {
    hasSpf: true,
    hasMx: true,
    nameservers: ["alice.ns.cloudflare.com", "bob.ns.cloudflare.com"],
  },
};

async function mockCheck(page: Page) {
  await page.route("**/api/check**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(checkResult) });
  });
}

for (const route of routes) {
  test(`${route} renders without layout overflow`, async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.ok(), `${route} should return a successful response`).toBeTruthy();
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${route} should not scroll horizontally`).toBeLessThanOrEqual(1);
    expect(pageErrors).toEqual([]);
  });
}

test("guided setup completes all five steps", async ({ page }) => {
  await mockCheck(page);
  await page.goto("/setup");
  await page.getByRole("textbox", { name: "Sending domain" }).fill("example.com");
  await page.getByRole("button", { name: "Check and continue" }).click();
  await expect(page.getByRole("heading", { name: /Review email authentication/ })).toBeVisible();
  await page.getByRole("button", { name: /Prepare logo/ }).last().click();
  await expect(page.getByRole("heading", { name: /Prepare your BIMI logo/ })).toBeVisible();
  await page.getByRole("button", { name: /Build record/ }).click();
  await expect(page.getByRole("heading", { name: /Publish the DNS record/ })).toBeVisible();
  await page.getByRole("button", { name: /I’ve published it/ }).click();
  await expect(page.getByRole("heading", { name: /Verify the public setup/ })).toBeVisible();
  await page.getByRole("button", { name: "Verify setup now" }).click();
  await expect(page.getByText("Core setup is technically valid")).toBeVisible();
});

test("domain checker validates and displays a report", async ({ page }) => {
  await mockCheck(page);
  await page.goto("/check");
  await page.getByLabel("Domain to check").fill("example.com");
  await page.getByRole("button", { name: "Check domain" }).click();
  await expect(page.getByRole("heading", { name: "Core setup is valid" })).toBeVisible();
  await expect(page).toHaveURL(/\/check\?domain=example\.com/);
});

test("logo tool validates its example locally", async ({ page }) => {
  await page.goto("/tools/logo");
  await page.getByRole("button", { name: "Try an example" }).click();
  await expect(page.getByRole("heading", { name: /Ready for BIMI|Valid with warnings/ })).toBeVisible();
  await expect(page.getByAltText("Preview of the selected BIMI logo")).toBeVisible();
});

test("record builder enables verification only after valid inputs", async ({ page }) => {
  await page.goto("/tools/record");
  const checkLink = page.getByRole("link", { name: /Check published setup/ });
  await expect(checkLink).toHaveAttribute("aria-disabled", "true");
  await page.getByLabel("Sending domain").fill("example.com");
  await page.getByLabel("SVG URL").fill("https://example.com/bimi/logo.svg");
  await expect(checkLink).toHaveAttribute("aria-disabled", "false");
  await expect(checkLink).toHaveAttribute("href", /\/check\?domain=example\.com/);
});

test("header inspector parses its local example", async ({ page }) => {
  await page.goto("/tools/headers");
  await page.getByRole("button", { name: "Use example" }).click();
  await expect(page.getByRole("heading", { name: "example.com" })).toBeVisible();
  await expect(page.getByText("Aligned with From domain").first()).toBeVisible();
});

test("mobile navigation and provider cards are usable", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile-only behavior");
  await page.goto("/providers");
  await expect(page.locator(".provider-mobile-card")).toHaveCount(5);
  await expect(page.locator(".provider-table-wrap")).toBeHidden();
  await page.locator('summary[aria-label="Open navigation"]').click();
  await expect(page.locator('summary[aria-label="Close navigation"]')).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Setup", exact: true }).click();
  await expect(page).toHaveURL(/\/setup$/);
});

test("representative templates have no serious accessibility violations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "One engine is sufficient for deterministic axe rules");
  for (const route of ["/", "/setup", "/check", "/tools/logo", "/providers", "/privacy"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations, `${route}: ${results.violations.map((violation) => `${violation.id} (${violation.nodes.length})`).join(", ")}`).toEqual([]);
  }
});
