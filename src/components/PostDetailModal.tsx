import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEscKey } from "../hooks/useEscKey";
import PostDetailContent from "./PostDetailContent";

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

export default function PostDetailModal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const close = () => navigate("/");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEscKey(close);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
    focusable[0]?.focus();

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    dialog.addEventListener("keydown", handleTab);
    return () => dialog.removeEventListener("keydown", handleTab);
  }, []);

  return (
    <div id="postModal" className="modal" onClick={close}>
      <div
        ref={dialogRef}
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label="Post detail"
        onClick={(e) => e.stopPropagation()}
      >
        <PostDetailContent id={id ?? ""} />
      </div>
    </div>
  );
}
