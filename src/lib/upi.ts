export function normalizeUpi(value: string): string {
  return value.trim().replace(/\s+/g, "");
}

export function isValidUpi(value: string): boolean {
  const normalized = normalizeUpi(value);
  if (!normalized) return true;
  if (/^\d{10}$/.test(normalized)) return true;
  return /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(normalized);
}

