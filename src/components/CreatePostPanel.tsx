import { useCallback, useEffect, useRef, useState } from "react";
import { useUploadPost } from "../hooks/usePosts";
import { generateAvatarUrl } from "../utility/avatarUtil";
import EmojiPickerPopover from "./EmojiPickerPopover";
import { IconMoodSmile, IconPhotoScan, IconPolaroidFilled } from "@tabler/icons-react";

const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 1_000_000;

export default function CreatePostPanel({ onClose }: { onClose?: () => void }) {
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

  // useCallback with stable deps so memo(EmojiPickerPopover) skips re-renders on caption keystrokes.
  // Functional setCaption updater avoids stale-closure on caption state.
  const insertEmoji = useCallback((emoji: string) => {
    const textarea = textareaRef.current;
    setShowEmoji(false);
    if (!textarea) {
      setCaption((prev) => prev + emoji);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    setCaption((prev) => {
      const next = prev.slice(0, start) + emoji + prev.slice(end);
      if (next.length > 2200) return prev;
      requestAnimationFrame(() => {
        textarea.selectionStart = start + emoji.length;
        textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      });
      return next;
    });
  }, []);

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
          {error && <p className="upload-error" role="alert">{error}</p>}
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
            {error && <p className="upload-error" role="alert">{error}</p>}
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
