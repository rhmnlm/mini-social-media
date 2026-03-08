import { useState } from "react";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import LoginModal from "./components/LoginModal";
import FeedLayout from "./components/FeedLayout";
import PostDetailPage from "./components/PostDetailPage";
import PostDetailModal from "./components/PostDetailModal";

function App() {
  const [apiKey, setApiKey] = useState(sessionStorage.getItem("api-key") ?? "");
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      {!apiKey && <LoginModal onLogin={setApiKey} />}
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
