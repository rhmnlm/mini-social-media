import { useState } from 'react'
import './App.css'

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
      {!apiKey &&
        <div id="myModal" className="modal">
          <div className="modal-content">
            <div className="modal-body">
              <p>Welcome! Insert your API Key to get started.</p>
              <input
                id='api-key'
                type='text'
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
      }
      {apiKey && <p>Hello~</p>}
    </>
  )
}

export default App
