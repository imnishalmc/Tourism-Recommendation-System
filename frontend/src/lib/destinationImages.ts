
export function buildImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) return "/images/placeholder.jpg";
    const parts = imageUrl.split("\\").map((p) => encodeURIComponent(p.trim()));
    return `/images/destination_images/${parts.join("/")}`;
}