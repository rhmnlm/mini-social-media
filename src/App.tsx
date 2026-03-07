import { useState } from "react";
import "./App.css";
import { CommentIcon, HeartIcon } from "./components/icons";
import { usePosts } from "./hooks/usePosts";
import { useComments } from "./hooks/useComments";
import { timeAgo } from "./utility/dateUtil";
import type { Post } from "./types";

function App() {
  const [apiKey, setApiKey] = useState(sessionStorage.getItem("api-key") ?? "");
  const [inputValue, setInputValue] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  function handleLogin() {
    if (!inputValue.trim()) return;
    sessionStorage.setItem("api-key", inputValue);
    setApiKey(inputValue);
  }

  function clickComment(post: Post) {
    setSelectedPost(post);
  }

  const { data: paginatedPosts, isLoading, error } = usePosts(!!apiKey);
  const { data: commentsData, isLoading: commentsLoading } = useComments(selectedPost?.id ?? "");

  if (isLoading) {
    return <>fetching content...</>;
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
        <div className="content-layout">
          {!paginatedPosts || paginatedPosts.items.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            paginatedPosts.items.map((post) => (
              <div key={post.id} className="card">
                <div className="metadata">
                  <div className="profile-picture-wrapper">
                    <img
                      className="profile-picture"
                      src="src/assets/profile_picture.jpeg"
                      alt="profile picture of rhmnlm"
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
                  <div className="comment" onClick={() => clickComment(post)}>
                    <div className="icon">
                      <CommentIcon stroke="black" />
                    </div>
                    <span className="comments-count">14</span>
                  </div>
                </div>
                <div className="captions">
                  <span className="author">{post.author}</span>
                  <span>{post.caption}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedPost && (
        <div
          id="postModal"
          className="modal"
          onClick={() => setSelectedPost(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body post-detail">
              <div className="post-detail-content">
                <img src={selectedPost.imageUrl} alt={selectedPost.imageUrl} />
              </div>
              <div className="post-detail-metadata">
                <div className="author-section">
                  <div className="profile">
                    <div className="profile-picture-wrapper">
                      <img
                        className="profile-picture"
                        src="src/assets/profile_picture.jpeg"
                        alt="profile picture of rhmnlm"
                      />
                    </div>
                    <span className="author">{selectedPost.author}</span>
                  </div>

                  <div className="likes">
                    <div className="icon">
                      <HeartIcon stroke="black" />
                    </div>
                    <span className="likes-count">{selectedPost.likes}</span>
                  </div>
                </div>
                <div className="comment-section">
                  {commentsLoading ? (
                    <p className="comments-status">Loading comments...</p>
                  ) : !commentsData || commentsData.items.length === 0 ? (
                    <p className="comments-status">No comments yet.</p>
                  ) : (
                    commentsData.items.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <span className="author">{comment.author}</span>
                        <span className="comment-text">{comment.text}</span>
                        <span className="date-posted">{timeAgo(comment.createdAt)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
