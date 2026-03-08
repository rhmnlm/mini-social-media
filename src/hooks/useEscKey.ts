import { useEffect } from "react";

export function useEscKey(callback: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") callback();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [callback, enabled]);
}
