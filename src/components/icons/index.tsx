export function HeartIcon({ size = 24, fill = "none", stroke = "grey", strokeWidth = 2 }) {
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
  
  export function CommentIcon({ size = 24, fill = "none", stroke = "grey", strokeWidth = 2 }) {
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