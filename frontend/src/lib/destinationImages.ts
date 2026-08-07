// No global placeholder fallback — prefer no image over a generic hero.

const DESTINATION_IMAGE_FILENAMES = [
  "download.jpeg",
  "download.jpg",
  "download (1).jpeg",
  "download (1).jpg",
  "download (2).jpeg",
  "download (2).jpg",
  "download (3).jpeg",
  "download (3).jpg",
  "download (4).jpeg",
  "download (4).jpg",
  "download (5).jpeg",
  "download (5).jpg",
  "download (6).jpeg",
  "download (6).jpg",
  "download (7).jpeg",
  "download (7).jpg",
  "images.jpeg",
  "images.jpg",
  "image.jpeg",
  "image.jpg",
  "image (1).jpeg",
  "image (1).jpg",
  "photo.jpeg",
  "photo.jpg",
  "photo (1).jpeg",
  "photo (1).jpg",
  "cover.jpeg",
  "cover.jpg",
  "cover (1).jpeg",
  "cover (1).jpg",
  "thumb.jpeg",
  "thumb.jpg",
  "thumbnail.jpeg",
  "thumbnail.jpg",
];

function encodePathSegment(text: string): string {
  return encodeURIComponent(text);
}

function titleCaseDestinationName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(^|[^A-Za-z])([a-z])/g, (_, prefix, char) =>
      `${prefix}${char.toUpperCase()}`
    );
}

function buildDestinationNameCandidates(destinationName: string): string[] {
  const normalizedName = titleCaseDestinationName(destinationName);
  const explicitCandidates = [
    `${normalizedName}.jpeg`,
    `${normalizedName}.jpg`,
    `${normalizedName} 1.jpeg`,
    `${normalizedName} 1.jpg`,
    `${normalizedName} 1.1.jpeg`,
    `${normalizedName} 1.1.jpg`,
    `${normalizedName}1.1.jpeg`,
    `${normalizedName}1.1.jpg`,
  ];

  const numberedCandidates = Array.from({ length: 10 }, (_, index) => {
    const number = index + 1;
    return [
      `${normalizedName} ${number}.jpeg`,
      `${normalizedName} ${number}.jpg`,
      `${normalizedName}${number}.jpeg`,
      `${normalizedName}${number}.jpg`,
    ];
  }).flat();

  return [...new Set([...explicitCandidates, ...numberedCandidates])];
}

function buildFolderCandidates(folder: string): string[] {
  const encodedFolder = folder
    .split("/")
    .map((segment) => encodePathSegment(segment))
    .join("/");

  const destinationName = folder
    .split("/")
    .map((segment) => segment.trim())
    .join("/");
  const destinationCandidates = buildDestinationNameCandidates(destinationName);
  const titleCaseFolder = titleCaseDestinationName(destinationName);
  const folderVariants = Array.from(new Set([folder, titleCaseFolder]));
  const encodedFolderVariants = folderVariants.map((variant) =>
    variant
      .split("/")
      .map((segment) => encodePathSegment(segment))
      .join("/")
  );
  const candidateUrls = [
    ...destinationCandidates.flatMap((candidate) => {
      const encodedCandidate = encodePathSegment(candidate);
      return folderVariants.flatMap((folderVariant, index) => [
        `/images/destination_images/${folderVariant}/${candidate}`,
        `/images/destination_images/${encodedFolderVariants[index]}/${encodedCandidate}`,
      ]);
    }),
    ...DESTINATION_IMAGE_FILENAMES.flatMap((filename) => {
      const encodedFilename = encodePathSegment(filename);
      return folderVariants.flatMap((folderVariant, index) => [
        `/images/destination_images/${folderVariant}/${filename}`,
        `/images/destination_images/${encodedFolderVariants[index]}/${encodedFilename}`,
      ]);
    }),
  ];

  return Array.from(new Set(candidateUrls));
}

export function buildImageUrl(
  imageUrl: string | string[] | null | undefined,
  destinationName?: string
): string {
  return buildImageUrlCandidates(imageUrl, destinationName)[0] || "";
}

function normalizeImageUrlSources(
  imageUrl: string | string[] | null | undefined
): string[] {
  if (!imageUrl) {
    return [];
  }

  if (Array.isArray(imageUrl)) {
    return imageUrl.map((item) => String(item).trim()).filter(Boolean);
  }

  const rawValue = String(imageUrl).trim();
  if (!rawValue) {
    return [];
  }

  if (/^\[.*\]$/.test(rawValue)) {
    try {
      const parsed = JSON.parse(rawValue);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // ignore invalid JSON and fall back to delimiter parsing
    }
  }

  return rawValue
    .split(/[,;|\n]+/)
    .map((item) => String(item).trim())
    .filter(Boolean);
}

export function buildImageUrlCandidates(
  imageUrl: string | string[] | null | undefined,
  destinationName?: string
): string[] {
  const sources = normalizeImageUrlSources(imageUrl);

  const candidates: string[] = [];

  for (const source of sources) {
    const normalizedSource = source.replace(/\\/g, "/").trim();
    if (!normalizedSource) {
      continue;
    }

    if (/^https?:\/\//i.test(normalizedSource)) {
      candidates.push(normalizedSource);
      const parts = normalizedSource
        .split(/[/\\]+/)
        .map((p) => encodeURIComponent(p.trim()));
      const folder = parts.slice(0, -1).join("/");
      candidates.push(...buildFolderCandidates(folder));
      continue;
    }

    if (normalizedSource.startsWith("/")) {
      candidates.push(normalizedSource);
      continue;
    }

    if (normalizedSource.includes("/")) {
      const normalized = normalizedSource
        .split(/[/\\]+/)
        .map((p) => p.trim())
        .join("/");
      candidates.push(`/images/destination_images/${normalized}`);
      const folder = normalized.split("/").slice(0, -1).join("/");
      candidates.push(...buildFolderCandidates(folder));
      continue;
    }

    candidates.push(`/images/destination_images/${normalizedSource}`);
  }

  const folder = destinationName
    ?.trim()
    .split(/[/\\]+/)
    .map((p) => p.trim())
    .join("/");

  if (folder) {
    candidates.push(...buildFolderCandidates(folder));
  }

  return Array.from(new Set(candidates.filter(Boolean)));
}
