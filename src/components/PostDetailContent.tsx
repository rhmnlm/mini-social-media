import { usePost } from "../hooks/usePosts";
import { useComments } from "../hooks/useComments";
import { generateAvatarUrl } from "../utility/avatarUtil";
import { timeAgo } from "../utility/dateUtil";
import { HeartIcon } from "./icons";
import CaptionText from "./CaptionText";
import { IconAlertTriangle, IconMessageCircle } from "@tabler/icons-react";

export default function PostDetailContent({ id }: { id: string }) {
  const { data: post, isLoading: postLoading, isError: postError, error: postErr } = usePost(id);
  const { data: commentsData, isLoading: commentsLoading } = useComments(id);

  if (postLoading) return <div className="post-detail-loading"><span className="spinner" /></div>;
  if (postError || !post) {
    const status = (postErr as { response?: { status?: number } })?.response?.status;
    const is404 = status === 404;
    return (
      <div className="post-detail-error">
        <div className="feed-error">
          <IconAlertTriangle size={40} stroke={1.5} color="#ccc" />
          <p className="feed-error-title">{is404 ? "Post not found" : "Something went wrong"}</p>
          <p className="feed-error-sub">{is404 ? "This post may have been deleted." : "Check your connection and try again."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-body post-detail">
      <div className="post-detail-content">
        <img src={post.imageUrl} alt={`Post by ${post.author}`} loading="lazy" />
      </div>
      <div className="post-detail-metadata">
        <div className="author-section">
          <div className="profile">
            <div className="profile-picture-wrapper">
              <img
                className="profile-picture"
                src={generateAvatarUrl(post.author)}
                alt={`profile picture of ${post.author}`}
              />
            </div>
            <span className="author">{post.author}</span>
          </div>
          <div className="likes">
            <div className="icon">
              <HeartIcon stroke="black" />
            </div>
            <span className="likes-count">{post.likes}</span>
          </div>
        </div>
        <div className="comment-section">
          <div className="post-caption">
            <div className="profile-picture-wrapper">
              <img
                className="profile-picture"
                src={generateAvatarUrl(post.author)}
                alt={`profile picture of ${post.author}`}
              />
            </div>
            <div>
              <span className="author">{post.author}</span>
              <CaptionText text={post.caption} />
              <span className="date-posted">{timeAgo(post.createdAt)}</span>
            </div>
          </div>
          {commentsLoading ? (
            <div className="comments-loading">
              <span className="spinner comments-spinner" />
            </div>
          ) : !commentsData || commentsData.items.length === 0 ? (
            <div className="comments-empty-state">
              <IconMessageCircle size={32} stroke={1.5} color="#ccc" />
              <p className="comments-empty-title">No comments yet</p>
            </div>
          ) : (
            commentsData.items.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="profile-picture-wrapper">
                  <img
                    className="profile-picture"
                    src={generateAvatarUrl(comment.author)}
                    alt={`profile picture of ${comment.author}`}
                  />
                </div>
                <div>
                  <div>
                    <span className="author">{comment.author}</span>
                    <span className="comment-text">{comment.text}</span>
                  </div>
                  <span className="date-posted">{timeAgo(comment.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
