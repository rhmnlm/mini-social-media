export function HeartIcon({
  size = 24,
  fill = "none",
  stroke = "grey",
  strokeWidth = 2,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={fill === "none" ? stroke : "none"}
      strokeWidth={fill === "none" ? strokeWidth : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 20.5C12 20.5 2.5 14 2.5 8C2.5 5.015 4.515 2.5 7.5 2.5C9.5 2.5 11.2 3.6 12 5.1C12.8 3.6 14.5 2.5 16.5 2.5C19.485 2.5 21.5 5.015 21.5 8C21.5 14 12 20.5 12 20.5Z" />
    </svg>
  );
}

export function CommentIcon({
  size = 24,
  fill = "none",
  stroke = "grey",
  strokeWidth = 2,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={fill === "none" ? stroke : "none"}
      strokeWidth={fill === "none" ? strokeWidth : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 3H19C20.1 3 21 3.9 21 5V15C21 16.1 20.1 17 19 17H8.5L4 21V5C4 3.9 4.9 3 5 3Z" />
    </svg>
  );
}

export function UploadImageIcon({
  size = 24,
  fill = "none",
  stroke = "grey",
  strokeWidth = 2,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={fill}
      stroke={fill === "none" ? stroke : "none"}
      stroke-width={fill === "none" ? strokeWidth : 0}
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="2" y="6" width="16" height="15" rx="2" />

      <polyline points="2,17 6,12 9.5,16 12,13 18,17" />

      <circle cx="6.5" cy="10" r="1.2" fill="white" stroke="none" />

      <line x1="19" y1="1" x2="19" y2="9" stroke-width="2" />
      <line x1="15" y1="5" x2="23" y2="5" stroke-width="2" />
    </svg>
  );
}
