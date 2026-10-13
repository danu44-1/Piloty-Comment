export function normalizeKeyword(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function isDuplicateKeyword(keywords: string[], value: string) {
  const normalized = value.trim().toLowerCase();
  return keywords.some((keyword) => keyword.toLowerCase() === normalized);
}
