const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;
type ImageExtension = typeof ALLOWED_EXTENSIONS[number];

export function validateImageFile(file: File): boolean {
    const ext = file.name.split(".").pop()?.toLowerCase();
    return ext !== undefined && ALLOWED_EXTENSIONS.includes(ext as ImageExtension);
}