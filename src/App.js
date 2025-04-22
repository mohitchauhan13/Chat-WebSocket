import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const socket = new WebSocket(
  "wss://ec2-15-206-125-183.ap-south-1.compute.amazonaws.com"
);

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    fetch(
      "https://ec2-15-206-125-183.ap-south-1.compute.amazonaws.com/messages"
    )
      .then((res) => res.json())
      .then((data) => setMessages(data.reverse()));

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;
    const message = { username, text };
    socket.send(JSON.stringify(message));
    setText("");
  };

  return (
    <div className="App">
      <h1>Chat App Updated</h1>
      <input
        placeholder="Your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <b>{msg.username}:</b> {msg.text}
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
