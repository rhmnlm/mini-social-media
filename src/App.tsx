import { useEffect, useRef, useState } from "react";
import "./App.css";
import { CommentIcon, HeartIcon, UploadImageIcon } from "./components/icons";
import { usePost, usePosts, useUploadPost } from "./hooks/usePosts";
import { useEscKey } from "./hooks/useEscKey";
import { useQueryClient } from "@tanstack/react-query";
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
import { IconMoodSmile, IconPhotoScan, IconPolaroidFilled, IconMessageCircle } from "@tabler/icons-react";

// Pinned demo post — guaranteed to have comments for detail view demonstration
const SIM_POST_ID = "00MM8J1IMQ53U26EW9YN8L12GJ";

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

function PostDetailContent({ id }: { id: string }) {
  const { data: post, isLoading: postLoading } = usePost(id);
  const { data: commentsData, isLoading: commentsLoading } = useComments(id);

  if (postLoading) return null;
  if (!post) return null;

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

const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 1_000_000;

const EMOJI_CATEGORIES = [
  { label: "😀", emojis: ["😀","😂","🥰","😍","🤣","😊","😇","🙂","😉","😅","😆","🤩","🥳","😎","😴","🤗","🤔","😬","😤","😭","😱","🫡","😏","🥺","🤭"] },
  { label: "🌸", emojis: ["🌸","🌺","🌻","🌹","🌷","🍀","☘️","🌿","🌱","🌲","🌙","☀️","🌈","⭐","❄️","🔥","🌊","🌴","🦋","🐶","🐱","🐻","🦊","🐼","🐨"] },
  { label: "🍕", emojis: ["🍕","🍔","🍟","🌮","🍜","🍣","🎂","🍰","🧁","🍩","🍪","☕","🍵","🍷","🥤","🍎","🍓","🫐","🍉","🍇"] },
  { label: "⚽", emojis: ["⚽","🏀","🎮","🎵","🎨","📷","🏆","🎯","🏋️","🎭","🎬","🎸","🎤","✈️","🚀","🌍","🏖️","🏔️"] },
  { label: "❤️", emojis: ["❤️","💙","💚","💛","🧡","💜","🖤","🤍","💔","❣️","💕","💗","💓","💖","💘","💝","🩷","🩵","✨","🔥","💯","🙌","👏","🫶","💪"] },
];

function EmojiPickerPopover({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="emoji-popover">
      <div className="emoji-tabs">
        {EMOJI_CATEGORIES.map((cat, i) => (
          <button
            key={i}
            className={`emoji-tab${i === activeTab ? " active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="emoji-grid">
        {EMOJI_CATEGORIES[activeTab].emojis.map((emoji) => (
          <button key={emoji} className="emoji-item" onClick={() => onSelect(emoji)}>
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

function CreatePostPanel({ onClose }: { onClose?: () => void }) {
  const username = sessionStorage.getItem("username") ?? "";
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const { mutate: uploadPost, isPending } = useUploadPost();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!showEmoji) return;
    function handleClickOutside(e: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ACCEPTED_MIME_TYPES.includes(selected.type)) {
      setError("Only png, jpg, jpeg, and webp images are accepted.");
      e.target.value = "";
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setError("File is too large. We can only process images up to 1 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  function handleRemove() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setFile(null);
    setCaption("");
    setError("");
    setShowEmoji(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function insertEmoji(emoji: string) {
    const textarea = textareaRef.current;
    setShowEmoji(false);
    if (!textarea) {
      setCaption((prev) => prev + emoji);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = caption.slice(0, start) + emoji + caption.slice(end);
    if (next.length <= 2200) {
      setCaption(next);
      requestAnimationFrame(() => {
        textarea.selectionStart = start + emoji.length;
        textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      });
    }
  }

  function handlePost() {
    if (!file || !caption.trim()) return;
    setUploadProgress(0);
    uploadPost(
      {
        author: username,
        caption: caption.trim(),
        image: file,
        onUploadProgress: setUploadProgress,
      },
      {
        onSuccess: () => {
          handleRemove();
          onClose?.();
        },
        onError: (error) => {
          setUploadProgress(null);
          const status =
            error && typeof error === "object" && "response" in error
              ? (error as { response?: { status?: number } }).response?.status
              : undefined;
          if (status === 413) setError("Image is too large for the server. Try a smaller file.");
          else if (status === 415) setError("This image format isn't supported by the server.");
          else if (status === 401) setError("Session expired. Please refresh and log in again.");
          else if (status && status >= 500) setError("Server error. Please try again later.");
          else if (!status) setError("Network error. Check your connection and try again.");
          else setError("Failed to post. Please try again.");
        },
      }
    );
  }

  return (
    <div className="create-panel-content">
      <div className="create-panel-header">
        <h3 className="create-panel-title">Share What's Happening</h3>
      </div>
      {!previewUrl ? (
        <div className="upload-empty-state">
          <div className="upload-icons-wrapper">
            <IconPolaroidFilled className="svg-2" size={64} stroke={2} color="#E63946" />
            <IconPhotoScan className="svg-1" size={64} color="#E63946" />
          </div>
          <label htmlFor="post-image-upload" className="select-file-btn">
            Select from your device
          </label>
          <input
            ref={fileInputRef}
            id="post-image-upload"
            type="file"
            accept="image/jpg,image/jpeg,image/png,image/webp"
            className="create-post-file-input-hidden"
            onChange={handleFileChange}
          />
          {error && <p className="upload-error">{error}</p>}
        </div>
      ) : (
        <div className="create-post-with-preview">
          <div className="preview-col">
            <img src={previewUrl} alt="preview" className="create-post-preview-img" />
            <button className="remove-preview-btn" onClick={handleRemove} aria-label="Remove image">
              ✕
            </button>
          </div>
          <div className="caption-col">
            <div className="caption-author-row">
              <img
                className="caption-avatar"
                src={generateAvatarUrl(username)}
                alt={username}
              />
              <span className="caption-username">{username}</span>
            </div>
            <textarea
              ref={textareaRef}
              className="create-post-textarea"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={2200}
            />
            <div className="caption-toolbar">
              <div className="emoji-wrapper" ref={emojiRef}>
                <button
                  className="emoji-trigger-btn"
                  onClick={() => setShowEmoji((v) => !v)}
                  aria-label="Add emoji"
                  title="Add emoji"
                >
                  <IconMoodSmile size={20} stroke={1.5} />
                </button>
                {showEmoji && <EmojiPickerPopover onSelect={insertEmoji} />}
              </div>
              <span className="caption-char-count">{caption.length} / 2200</span>
            </div>
            {error && <p className="upload-error">{error}</p>}
            {isPending && uploadProgress !== null && (
              <div className="upload-progress-wrapper">
                <div className="upload-progress-track">
                  <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
                </div>
                <span className="upload-progress-label">
                  {uploadProgress < 100 ? `Uploading… ${uploadProgress}%` : "Processing…"}
                </span>
              </div>
            )}
            <button
              className="post-submit-btn"
              disabled={!caption.trim() || isPending}
              onClick={handlePost}
            >
              {isPending ? <span className="spinner" /> : "Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AppLogo() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleLogoClick() {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }

  return (
    <div className="logo" onClick={handleLogoClick}>
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
      <main className="feed-column">
        <div className="content-layout feed-error">
          <p>Something went wrong. Check your API key and try again.</p>
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

function App() {
  const [apiKey, setApiKey] = useState(sessionStorage.getItem("api-key") ?? "");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  const canLogin = apiKeyInput.trim().length > 0 && usernameInput.trim().length >= 2;

  function handleLogin() {
    if (!canLogin) return;
    sessionStorage.setItem("api-key", apiKeyInput.trim());
    sessionStorage.setItem("username", usernameInput.trim());
    setApiKey(apiKeyInput.trim());
  }

  return (
    <>
      {!apiKey && (
        <div id="myModal" className="modal">
          <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="login-title">
            <div className="modal-body login-modal-body">
              <p id="login-title" className="login-title">Welcome to a-poc</p>
              <p className="login-subtitle">Enter your details to get started.</p>
              <div className="login-field">
                <label htmlFor="login-username">Username</label>
                <input
                  id="login-username"
                  type="text"
                  placeholder="e.g. alice"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div className="login-field">
                <label htmlFor="login-api-key">API Key</label>
                <input
                  id="login-api-key"
                  type="text"
                  placeholder="Your API key"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <button className="login-btn" onClick={handleLogin} disabled={!canLogin}>
                Get started
              </button>
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
