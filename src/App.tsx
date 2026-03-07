import { useState } from 'react'
import './App.css'
import { CommentIcon, HeartIcon } from './components/icons';

function App() {
  const [apiKey, setApiKey] = useState(sessionStorage.getItem("api-key") ?? "");
  const [inputValue, setInputValue] = useState("");

  function handleLogin() {
    if (!inputValue.trim()) return;
    sessionStorage.setItem("api-key", inputValue);
    setApiKey(inputValue);
  }

  const content  = [ 1 , 2, 3, 4]

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
      {apiKey && 
        <div className='content-layout'>
          {content.map((c)=> (
            <div key={c} className='card'>
              <div className='metadata'>
                <div className='profile-picture-wrapper'>
                  <img className='profile-picture' src='src/assets/profile_picture.jpeg' alt='profile picture of rhmnlm'/>
                </div>
                <span className='author'>rhmnlm</span>
                <span className='date-posted'>10h</span>
              </div>
              <div className='content'>
                content goes here
              </div>
              <div className='post-analytic'>
                <div className="likes">
                  <div className='icon'>
                    <HeartIcon stroke='black'/>
                  </div>
                  <span className='likes-count'>100</span>
                </div>
                <div className='comment'>
                  <div className='icon'>
                    <CommentIcon stroke='black'/>
                  </div>
                  <span className='comments-count'>14</span>
                </div>
              </div>
              <div className='captions'>
                <span className='author'>rhmnlm</span>
                <span>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>
              </div>
            </div>
          ))}
        </div>
      }
    </>
  )
}

export default App
