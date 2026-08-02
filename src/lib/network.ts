import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const MAX_REDIRECTS = 3;

function isPrivateIpv4(address: string) {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return true;
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

function isPrivateIpv6(address: string) {
  const normalized = address.toLowerCase();
  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    /^fe[89ab]/.test(normalized) ||
    normalized.startsWith("::ffff:127.") ||
    normalized.startsWith("::ffff:10.") ||
    normalized.startsWith("::ffff:192.168.")
  );
}

async function assertPublicUrl(value: string) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    url.hostname === "localhost" ||
    url.hostname.endsWith(".local")
  ) {
    throw new Error("Only public HTTPS URLs on the default port are supported.");
  }

  const literalType = isIP(url.hostname);
  const addresses = literalType
    ? [{ address: url.hostname, family: literalType }]
    : await lookup(url.hostname, { all: true, verbatim: true });

  if (!addresses.length) throw new Error("The host does not resolve.");
  for (const result of addresses) {
    const blocked =
      result.family === 4
        ? isPrivateIpv4(result.address)
        : isPrivateIpv6(result.address);
    if (blocked) throw new Error("Private and local network addresses are not supported.");
  }
  return url;
}

async function fetchWithRedirects(value: string, init: RequestInit, redirects = 0): Promise<Response> {
  const url = await assertPublicUrl(value);
  const response = await fetch(url, {
    ...init,
    redirect: "manual",
    headers: {
      "User-Agent": "OpenBIMI/1.0 (+https://openbimi.com)",
      Accept: "image/svg+xml, application/pem-certificate-chain, text/plain;q=0.8, */*;q=0.2",
      ...init.headers,
    },
  });

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (!location) throw new Error("The server returned a redirect without a destination.");
    if (redirects >= MAX_REDIRECTS) throw new Error("The server returned too many redirects.");
    return fetchWithRedirects(new URL(location, url).toString(), init, redirects + 1);
  }
  return response;
}

export async function fetchSmallText(value: string, limit = 128 * 1024) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetchWithRedirects(value, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`The server returned HTTP ${response.status}.`);
    if (!response.body) throw new Error("The server returned an empty response.");

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value: chunk } = await reader.read();
      if (done) break;
      length += chunk.byteLength;
      if (length > limit) {
        await reader.cancel();
        throw new Error(`The file is larger than ${Math.round(limit / 1024)} KB.`);
      }
      chunks.push(chunk);
    }

    const body = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }

    return {
      text: new TextDecoder().decode(body),
      contentType: response.headers.get("content-type"),
      finalUrl: response.url || value,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The server took too long to respond.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkReachable(value: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    let response = await fetchWithRedirects(value, {
      method: "HEAD",
      signal: controller.signal,
      cache: "no-store",
    });
    if (response.status === 405) {
      response = await fetchWithRedirects(value, {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
        headers: { Range: "bytes=0-1023" },
      });
    }
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
