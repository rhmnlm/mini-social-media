import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePost, usePosts } from "../hooks/usePosts";
import { useEscKey } from "../hooks/useEscKey";
import { generateAvatarUrl } from "../utility/avatarUtil";
import { timeAgo } from "../utility/dateUtil";
import { CommentIcon, HeartIcon, UploadImageIcon } from "./icons";
import { IconAlertTriangle } from "@tabler/icons-react";
import AppLogo from "./AppLogo";
import CreatePostPanel from "./CreatePostPanel";
import CaptionText from "./CaptionText";

// Pinned demo post — guaranteed to have comments for detail view demonstration
const SIM_POST_ID = "00MM8J1IMQ53U26EW9YN8L12GJ";

export default function FeedLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [showMobileCreate, setShowMobileCreate] = useState(false);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = usePosts(true);
  useEscKey(() => setShowMobileCreate(false), showMobileCreate);
  const { data: simPost } = usePost(SIM_POST_ID);

  const posts = data?.pages.flatMap((p) => p.items) ?? [];
  const allPosts = simPost
    ? [simPost, ...posts.filter((p) => p.id !== SIM_POST_ID)]
    : posts;

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  if (isError) return (
    <div className="app-layout">
      <aside className="sidebar"><AppLogo /></aside>
      <main className="feed-column feed-column--centered">
        <div className="feed-error">
          <IconAlertTriangle size={40} stroke={1.5} color="#ccc" />
          <p className="feed-error-title">Something went wrong</p>
          <p className="feed-error-sub">Check your API key and try again.</p>
        </div>
      </main>
    </div>
  );

  if (isLoading) return (
    <div className="app-layout">
      <aside className="sidebar">
        <AppLogo />
        <button className="create-post-button" disabled>
          <span>What's happening?</span>
          <UploadImageIcon stroke="white" />
        </button>
      </aside>
      <header className="mobile-header">
        <AppLogo />
      </header>
      <main className="feed-column">
        <div className="content-layout">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card skeleton-card">
              <div className="metadata">
                <div className="skeleton skeleton-avatar" />
                <div className="skeleton-meta">
                  <div className="skeleton skeleton-text" style={{ width: 100 }} />
                  <div className="skeleton skeleton-text" style={{ width: 60 }} />
                </div>
              </div>
              <div className="skeleton skeleton-image" />
              <div className="post-analytic">
                <div className="skeleton skeleton-icon" />
                <div className="skeleton skeleton-icon" />
              </div>
              <div className="captions">
                <div className="skeleton skeleton-text" style={{ width: 80 }} />
                <div className="skeleton skeleton-text" style={{ width: "60%" }} />
              </div>
            </div>
          ))}
        </div>
      </main>
      <aside className="right-panel" />
      <footer className="mobile-footer" />
    </div>
  );

  return (
    <div className="app-layout">
      {/* Left sidebar - desktop only */}
      <aside className="sidebar">
        <AppLogo />
        <button
          className="create-post-button"
          onClick={() => setShowMobileCreate(true)}
        >
          <span>What's happening?</span>
          <UploadImageIcon stroke="white" />
        </button>
      </aside>

      {/* Mobile fixed header */}
      <header className="mobile-header">
        <AppLogo />
      </header>

      {/* Center feed */}
      <main className="feed-column">
        <div className="content-layout">
          {allPosts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            allPosts.map((post) => (
              <div key={post.id} className="card">
                <div className="metadata">
                  <div className="profile-picture-wrapper">
                    <img
                      className="profile-picture"
                      src={generateAvatarUrl(post.author)}
                      alt={`profile picture of ${post.author}`}
                    />
                  </div>
                  <span className="author">{post.author}</span>
                  <span className="date-posted">{timeAgo(post.createdAt)}</span>
                </div>
                <div className="content">
                  <img src={post.imageUrl} alt={`Post by ${post.author}`} loading="lazy" />
                </div>
                <div className="post-analytic">
                  <div className="likes">
                    <div className="icon">
                      <HeartIcon stroke="black" />
                    </div>
                    <span className="likes-count">{post.likes}</span>
                  </div>
                  <button
                    className="comment"
                    aria-label="View comments"
                    onClick={() =>
                      navigate(`/posts/${post.id}`, {
                        state: { backgroundLocation: location },
                      })
                    }
                  >
                    <div className="icon">
                      <CommentIcon stroke="black" />
                    </div>
                  </button>
                </div>
                <div className="captions">
                  <span className="author">{post.author}</span>
                  <CaptionText text={post.caption} />
                </div>
              </div>
            ))
          )}
          <div ref={sentinelRef} style={{ height: 1 }} />
          {isFetchingNextPage && (
            <div className="feed-bottom-status">
              <span className="spinner" />
            </div>
          )}
          {!hasNextPage && !isLoading && allPosts.length > 0 && (
            <div className="feed-bottom-status">
              <span className="feed-end-text">That's all for now.</span>
            </div>
          )}
        </div>
      </main>

      {/* Right panel - desktop only */}
      <aside className="right-panel" />

      {/* Mobile fixed footer */}
      <footer className="mobile-footer">
        <button
          className="mobile-create-button"
          onClick={() => setShowMobileCreate(true)}
        >
          New Post
        </button>
      </footer>

      {/* Mobile create post modal */}
      {showMobileCreate && (
        <div className="modal" onClick={() => setShowMobileCreate(false)}>
          <div
            className="modal-content create-post-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Create post"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-body">
              <CreatePostPanel onClose={() => setShowMobileCreate(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
