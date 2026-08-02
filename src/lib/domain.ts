export function normalizeDomain(input: string): string {
  let value = input.trim().toLowerCase();

  if (value.includes("@") && !value.includes("://")) {
    value = value.slice(value.lastIndexOf("@") + 1);
  }

  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    value = url.hostname;
  } catch {
    value = value.split(/[/?#]/, 1)[0] ?? value;
  }

  return value.replace(/^\[|\]$/g, "").replace(/\.$/, "");
}

export function isValidDomain(domain: string): boolean {
  if (domain.length < 3 || domain.length > 253 || !domain.includes(".")) {
    return false;
  }

  const labels = domain.split(".");
  return labels.every(
    (label) =>
      label.length > 0 &&
      label.length <= 63 &&
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label),
  );
}

export function isValidSelector(selector: string): boolean {
  return (
    selector.length > 0 &&
    selector.length <= 63 &&
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(selector)
  );
}

export function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password &&
      !url.port
    );
  } catch {
    return false;
  }
}
