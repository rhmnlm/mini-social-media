import { useParams, useNavigate } from "react-router-dom";
import PostDetailContent from "./PostDetailContent";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="post-detail-page">
      <div className="post-detail-page-header">
        <button className="back-button" onClick={() => navigate("/")}>
          Back to feed
        </button>
      </div>
      <div className="post-detail-page-body">
        <PostDetailContent id={id ?? ""} />
      </div>
    </div>
  );
}
