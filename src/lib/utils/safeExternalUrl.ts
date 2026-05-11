export function getSafeExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

export function openSafeExternalUrl(url: string | null | undefined): void {
  const safeUrl = getSafeExternalUrl(url);
  if (!safeUrl) return;

  window.open(safeUrl, '_blank', 'noopener,noreferrer');
}
