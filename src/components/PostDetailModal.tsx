import { useParams, useNavigate } from "react-router-dom";
import { useEscKey } from "../hooks/useEscKey";
import PostDetailContent from "./PostDetailContent";

export default function PostDetailModal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const close = () => navigate("/");

  useEscKey(close);

  return (
    <div id="postModal" className="modal" onClick={close}>
      <div
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
