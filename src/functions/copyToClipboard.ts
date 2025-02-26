export function copyToClipboard(textToCopy: string | number): void {
    navigator.clipboard.writeText(textToCopy.toString())
        .catch(err => console.error("Failed to copy text:", err));
}
