import { useEffect, useState } from "react";
import { postApi } from "../api/posts";

interface Props {
  onLogin: (apiKey: string) => void;
}

export default function LoginModal({ onLogin }: Props) {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    if (!isValidating) { setShowSlowMessage(false); return; }
    const timer = setTimeout(() => setShowSlowMessage(true), 5000);
    return () => clearTimeout(timer);
  }, [isValidating]);

  const canSubmit = apiKeyInput.trim().length > 0 && usernameInput.trim().length >= 2 && !isValidating;

  async function handleLogin() {
    if (!canSubmit) return;
    const key = apiKeyInput.trim();
    const username = usernameInput.trim();

    setIsValidating(true);
    setValidationError("");

    // Temporarily set so the axios interceptor can attach it to the validation request
    sessionStorage.setItem("api-key", key);

    try {
      await postApi.list({ limit: 1 });
      sessionStorage.setItem("username", username);
      onLogin(key);
    } catch (err) {
      sessionStorage.removeItem("api-key");
      const status =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
      if (status === 401 || status === 403) {
        setValidationError("Invalid API key. Please check and try again.");
      } else {
        setValidationError("Network error. Check your connection and try again.");
      }
    } finally {
      setIsValidating(false);
    }
  }

  return (
    <div id="myModal" className="modal">
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <div className="modal-body login-modal-body">
          <img src="/logo.svg" alt="a-poc logo" className="login-logo" />
          <p id="login-title" className="login-title">Welcome back</p>
          <p className="login-subtitle">Sign in to continue.</p>
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
              type="password"
              placeholder="Your API key"
              value={apiKeyInput}
              onChange={(e) => { setApiKeyInput(e.target.value); setValidationError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          {validationError && <p className="login-error" role="alert">{validationError}</p>}
          {showSlowMessage && !validationError && (
            <p className="login-slow-message" role="status">This is taking longer than expected…</p>
          )}
          <button className="login-btn" onClick={handleLogin} disabled={!canSubmit}>
            {isValidating ? <span className="spinner login-spinner" /> : "Get started"}
          </button>
        </div>
      </div>
    </div>
  );
}
