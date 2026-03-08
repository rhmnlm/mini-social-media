import { memo, useEffect, useRef, useState } from "react";

function CaptionText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) setClamped(el.scrollHeight > el.clientHeight);
  }, [text]);

  return (
    <span className="caption-text-wrapper">
      <span
        ref={ref}
        className={`caption-text${expanded ? "" : " caption-text-clamped"}`}
      >
        {text}
      </span>
      {clamped && !expanded && (
        <button className="caption-see-more" onClick={() => setExpanded(true)}>
          ...see more
        </button>
      )}
    </span>
  );
}

export default memo(CaptionText);
