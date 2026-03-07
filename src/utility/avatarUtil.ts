const COLORS = [
  "#e57373", "#f06292", "#ba68c8", "#9575cd",
  "#7986cb", "#64b5f6", "#4dd0e1", "#4db6ac",
  "#81c784", "#aed581", "#ffb74d", "#ff8a65",
];

function hashUsername(username: string): number {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash * 31 + username.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getInitials(username: string): string {
  const parts = username.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}

export function generateAvatarUrl(username: string): string {
  const hash = hashUsername(username);
  const bg = COLORS[hash % COLORS.length];
  const initials = getInitials(username);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="${bg}" rx="50"/>
      <text x="50" y="50" dy="0.35em"
        text-anchor="middle"
        font-family="sans-serif"
        font-size="38"
        font-weight="600"
        fill="white">${initials}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
