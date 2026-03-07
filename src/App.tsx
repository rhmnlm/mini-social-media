import { useEffect, useRef, useState } from "react";
import "./App.css";
import { CommentIcon, HeartIcon } from "./components/icons";
import { usePost, usePosts } from "./hooks/usePosts";
import { useComments } from "./hooks/useComments";
import { timeAgo } from "./utility/dateUtil";
import { Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";

const SIM_POST_ID = "00MM8J1IMQ53U26EW9YN8L12GJ";

function PostDetailModal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading: postLoading } = usePost(id ?? "");
  const { data: commentsData, isLoading: commentsLoading } = useComments(id ?? "");

  if (postLoading) return null;
  if (!post) return null;

  return (
    <div
      id="postModal"
      className="modal"
      onClick={() => navigate("/")}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                    src="src/assets/profile_picture.jpeg"
                    alt="profile picture of rhmnlm"
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
  );
}

function FeedLayout() {
  const navigate = useNavigate();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fetchNextPage, hasNextPage } = usePosts(true);
  const { data: simPost } = usePost(SIM_POST_ID);

  const posts = data?.pages.flatMap((p) => p.items) ?? [];
  const allPosts = simPost ? [simPost, ...posts.filter((p) => p.id !== SIM_POST_ID)] : posts;

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) fetchNextPage(); },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) return <>fetching content...</>;

  return (
    <>
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
                <div className="comment" onClick={() => navigate(`/posts/${post.id}`)}>
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
      {/* Modal renders on top of the feed when on /posts/:id */}
      <Outlet />
    </>
  );
}

function App() {
  const [apiKey, setApiKey] = useState(sessionStorage.getItem("api-key") ?? "");
  const [inputValue, setInputValue] = useState("");

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
        <Routes>
          <Route path="/" element={<FeedLayout />}>
            <Route path="posts/:id" element={<PostDetailModal />} />
          </Route>
        </Routes>
      )}
    </>
  );
}

export default App;
