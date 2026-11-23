export function resolveImageAlt(
  alt: string | null | undefined,
  fallback: string,
): string {
  const trimmed = alt?.trim();
  if (trimmed) return trimmed;
  const fallbackTrimmed = fallback.trim();
  return fallbackTrimmed || 'Image';
}