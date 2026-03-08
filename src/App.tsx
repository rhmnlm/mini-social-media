import { useEffect, useRef, useState } from "react";
import "./App.css";
import { CommentIcon, HeartIcon, UploadImageIcon } from "./components/icons";
import { usePost, usePosts } from "./hooks/usePosts";
import { useComments } from "./hooks/useComments";
import { timeAgo } from "./utility/dateUtil";
import { generateAvatarUrl } from "./utility/avatarUtil";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { IconPhotoScan, IconPolaroidFilled } from "@tabler/icons-react";

const SIM_POST_ID = "00MM8J1IMQ53U26EW9YN8L12GJ";

function PostDetailContent({ id }: { id: string }) {
  const { data: post, isLoading: postLoading } = usePost(id);
  const { data: commentsData, isLoading: commentsLoading } = useComments(id);

  if (postLoading) return null;
  if (!post) return null;

  return (
    <div className="modal-body post-detail">
      <div className="post-detail-content">
        <img src={post.imageUrl} alt={post.imageUrl} />
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
          <div className="post-caption" style={{ margin: "8px 4px" }}>
            <div className="profile">
              <div className="profile-picture-wrapper">
                <img
                  className="profile-picture"
                  src={generateAvatarUrl(post.author)}
                  alt={`profile picture of ${post.author}`}
                />
              </div>
            </div>
            <div>
              <span className="author">{post.author}</span>
              <span>{post.caption}</span>
            </div>
          </div>
          {commentsLoading ? (
            <p className="comments-status">Loading comments...</p>
          ) : !commentsData || commentsData.items.length === 0 ? (
            <p className="comments-status">No comments yet.</p>
          ) : (
            commentsData.items.map((comment) => (
              <div
                key={comment.id}
                className="comment-item"
                style={{ margin: "8px 4px" }}
              >
                <div className="profile">
                  <div className="profile-picture-wrapper">
                    <img
                      className="profile-picture"
                      src={generateAvatarUrl(comment.author)}
                      alt={`profile picture of ${comment.author}`}
                    />
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div>
                    <span className="author">{comment.author}</span>
                    <span className="comment-text">{comment.text}</span>
                  </div>
                  <span className="date-posted">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function PostDetailModal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div id="postModal" className="modal" onClick={() => navigate("/")}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <PostDetailContent id={id ?? ""} />
      </div>
    </div>
  );
}

function PostDetailPage() {
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

function CreatePostPanel({ onClose }: { onClose?: () => void }) {
  const [fileName, setFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  }

  return (
    <div className="create-panel-content">
      <div className="create-panel-header">
        <h3 className="create-panel-title">Share What's Happening</h3>
      </div>
      <div className="create-post-form">
        {previewUrl && (
          <div className="create-post-preview">
            <img
              src={previewUrl}
              alt="preview"
              className="create-post-preview-img"
            />
          </div>
        )}
          <div className="upload-icon-container">
            <IconPolaroidFilled className="svg-2" size={64} stroke={2} color="#E63946"/>
            <IconPhotoScan className="svg-1" size={64} color="#E63946"/>
          </div>
          <div className="input-wrapper">
            <label
              htmlFor="post-image-upload"
              className={`create-post-file-label${fileName ? " has-file" : ""}`}
            >
              {fileName || "Choose image from your device"}
            </label>
            <input id="post-image-upload" className="create-post-file-input" type="file" accept="image/jpg, image/jpeg, image/png, image/webp"/>
          </div>
        {/* <div className="create-post-file-wrapper">
          <label
            htmlFor="post-image-upload"
            className={`create-post-file-label${fileName ? " has-file" : ""}`}
          >
            {fileName || "Choose image..."}
          </label>
          <input
            id="post-image-upload"
            type="file"
            accept="image/*"
            className="create-post-file-input"
            onChange={handleFileChange}
          />
        </div> */}
        {/* <button className="create-post-button">Share</button> */}
      </div>
    </div>
  );
}

function AppLogo() {
  return (
    <div className="logo">
      <img src="/logo.svg" alt="logo" width="28" height="28" />
      <span className="logo-text">a-poc</span>
    </div>
  );
}

function FeedLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [showMobileCreate, setShowMobileCreate] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage } = usePosts(true);
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

  if (isLoading) return <>fetching content...</>;

  return (
    <div className="app-layout">
      {/* Left sidebar - desktop only */}
      <aside className="sidebar">
        <AppLogo />
        <button
          className="create-post-button"
          onClick={() => setShowMobileCreate(true)}
        >
          <span style={{ marginRight: "4px" }}>What's happening?</span>
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
                  <img src={post.imageUrl} alt={post.imageUrl} />
                </div>
                <div className="post-analytic">
                  <div className="likes">
                    <div className="icon">
                      <HeartIcon stroke="black" />
                    </div>
                    <span className="likes-count">{post.likes}</span>
                  </div>
                  <div
                    className="comment"
                    onClick={() =>
                      navigate(`/posts/${post.id}`, {
                        state: { backgroundLocation: location },
                      })
                    }
                  >
                    <div className="icon">
                      <CommentIcon stroke="black" />
                    </div>
                  </div>
                </div>
                <div className="captions">
                  <span className="author">{post.author}</span>
                  <span>{post.caption}</span>
                </div>
              </div>
            ))
          )}
          <div ref={sentinelRef} style={{ height: 1 }} />
        </div>
      </main>

      {/* Right panel - desktop only */}
      <aside className="right-panel">{/* <CreatePostPanel /> */}</aside>

      {/* Mobile fixed footer */}
      <footer className="mobile-footer">
        <button
          className="mobile-create-button"
          onClick={() => setShowMobileCreate(true)}
        >
          + New Post
        </button>
      </footer>

      {/* Mobile create post modal */}
      {showMobileCreate && (
        <div className="modal" onClick={() => setShowMobileCreate(false)}>
          <div
            className="modal-content create-post-modal"
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

function App() {
  const [apiKey, setApiKey] = useState(sessionStorage.getItem("api-key") ?? "");
  const [inputValue, setInputValue] = useState("");
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  function handleLogin() {
    if (!inputValue.trim()) return;
    sessionStorage.setItem("api-key", inputValue);
    setApiKey(inputValue);
  }

  return (
    <>
      {!apiKey && (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <div className="modal-body">
              <p>Welcome! Insert your API Key to get started.</p>
              <input
                id="api-key"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <div>
                <button onClick={handleLogin}>Login</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {apiKey && (
        <>
          {/* Render feed at backgroundLocation, or the current route normally */}
          <Routes location={backgroundLocation || location}>
            <Route path="/" element={<FeedLayout />} />
            <Route path="posts/:id" element={<PostDetailPage />} />
          </Routes>
          {/* When navigated from feed, render modal overlay on top */}
          {backgroundLocation && (
            <Routes>
              <Route path="posts/:id" element={<PostDetailModal />} />
            </Routes>
          )}
        </>
      )}
    </>
  );
}

export default App;
