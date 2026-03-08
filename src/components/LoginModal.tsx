import { useState } from "react";

interface Props {
  onLogin: (apiKey: string) => void;
}

export default function LoginModal({ onLogin }: Props) {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");

  const canLogin = apiKeyInput.trim().length > 0 && usernameInput.trim().length >= 2;

  function handleLogin() {
    if (!canLogin) return;
    sessionStorage.setItem("api-key", apiKeyInput.trim());
    sessionStorage.setItem("username", usernameInput.trim());
    onLogin(apiKeyInput.trim());
  }

  return (
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
  );
}
