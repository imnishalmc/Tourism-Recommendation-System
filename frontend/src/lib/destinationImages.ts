const IMAGE_DIRECTORY = "/images/destination_images";

function encodeImagePath(path: string): string {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function normaliseImageSources(
  imageUrl: string | string[] | null | undefined
): string[] {
  if (!imageUrl) {
    return [];
  }

  if (Array.isArray(imageUrl)) {
    return imageUrl.map(String).map((value) => value.trim()).filter(Boolean);
  }

  const value = String(imageUrl).trim();
  if (!value) {
    return [];
  }

  if (/^(data:)?image\/[a-z0-9.+-]+;base64,/i.test(value)) {
    return [value];
  }

  if (/^\[.*\]$/.test(value)) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(String).map((item) => item.trim()).filter(Boolean);
      }
    } catch {
      // Treat invalid JSON as a regular image path below.
    }
  }

  // Dataset fields use semicolons to separate image paths. The first path is
  // normally enough, so it becomes the first and fastest image request.
  return value.split(/[;|\n]+/).map((item) => item.trim()).filter(Boolean);
}

function toImageUrl(source: string): string {
  const normalised = source.replace(/\\/g, "/").trim();

  if (/^https?:\/\//i.test(normalised) || /^data:image\//i.test(normalised)) {
    return normalised;
  }

  if (/^image\/[a-z0-9.+-]+;base64,/i.test(normalised)) {
    return `data:${normalised}`;
  }

  const relativePath = normalised
    .replace(/^\/+/, "")
    .replace(/^images\/destination_images\//i, "");

  return `${IMAGE_DIRECTORY}/${encodeImagePath(relativePath)}`;
}

function fallbackImageUrls(destinationName?: string): string[] {
  const folder = destinationName?.trim();
  if (!folder) {
    return [];
  }

  // These are only used for older records whose image_url has not yet been
  // backfilled. Keep the list short so a missing image cannot cause dozens of
  // failed network requests.
  return ["download.jpeg", "download (1).jpeg"]
    .map((filename) => `${folder}/${filename}`)
    .map(toImageUrl);
}

export function buildImageUrlCandidates(
  imageUrl: string | string[] | null | undefined,
  destinationName?: string
): string[] {
  const exactImageUrls = normaliseImageSources(imageUrl).map(toImageUrl);

  return Array.from(new Set([
    ...exactImageUrls,
    ...fallbackImageUrls(destinationName),
  ]));
}

export function buildImageUrl(
  imageUrl: string | string[] | null | undefined,
  destinationName?: string
): string {
  return buildImageUrlCandidates(imageUrl, destinationName)[0] || "";
}