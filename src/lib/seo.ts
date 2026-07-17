const DEFAULT_DESCRIPTION_LENGTH = 160;

export function createDescription(
  markdown: string,
  fallback: string,
  maxLength = DEFAULT_DESCRIPTION_LENGTH,
): string {
  const plainText = markdown
    .replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/{%[\s\S]*?%}/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s*\[[^\]]+\]:\s*\S+.*$/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$([^$\n]+)\$/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/==([^=]+)==/g, "$1")
    .replace(/^\s*[-*_]{3,}\s*$/gm, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[>*_~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const description = plainText || fallback.trim();

  if (description.length <= maxLength) {
    return description;
  }

  return `${description.slice(0, maxLength - 1).trimEnd()}…`;
}
