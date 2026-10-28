/** Parses "1.0.10" into [1, 0, 10]; null for anything that isn't dotted non-negative integers. */
export function parseVersion(value: unknown): number[] | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!/^\d+(\.\d+){0,3}$/.test(trimmed)) return null;
  return trimmed.split('.').map(Number);
}

/** Numeric segment compare (1.0.9 < 1.0.10); null when either side is invalid. */
export function compareVersions(a: unknown, b: unknown): -1 | 0 | 1 | null {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (!pa || !pb) return null;
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff < 0 ? -1 : 1;
  }
  return 0;
}

/** True only when both versions are valid and installed is strictly older than required. */
export const isUpdateRequired = (installed: unknown, required: unknown) =>
  compareVersions(installed, required) === -1;

/** Accepts https links or Android's market:// scheme. */
export function isValidStoreUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  return /^(https:\/\/[^\s/]+\S*|market:\/\/\S+)$/i.test(url.trim());
}
