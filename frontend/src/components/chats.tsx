"use client";
import { useState } from "react";
import "./css/chatinterface.css";
import Image from "next/image";
import Dropdown from "./utility/dropdown";

export default function ChatInterface() {
  const [input, setInput]: any = useState("");
  const [messages, setMessages]: any = useState([]);

  const suggestedQuestions = [
    "What are your services?",
    "How can I contact support?",
    "Tell me about your pricing.",
  ];

  const options = ["Option 1", "Option 2", "Option 3"];

  const sendMessage = (message: any) => {
    if (!message.trim()) return;
    setMessages([...messages, { text: message, sender: "user" }]);
    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="flex flex-col gap-2 items-start">
          <h3 className="section-header">Insights</h3>
          <div className="flex justify-center items-center">
            <Dropdown
              options={options}
              onSelect={(value: any) => alert(`Selected: ${value}`)}
            />
          </div>
        </div>
      </div>
      <div className="chat-body">
        <div className="chat-header-text-box">
          <p className="chat-title">Hi, John</p>
          <p className="chat-title">How can I help you?</p>
        </div>
        <div className="chat-suggestions">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => sendMessage(question)}
              className="chat-suggestion-button"
            >
              {question}
            </button>
          ))}
        </div>
        <div className="flex items-center chat-input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about the group conversations!"
            className="chat-textarea"
          />
          <button
            onClick={() => sendMessage(input)}
            className="chat-send-button"
          >
            <Image
              className="send-image"
              src="/assets/chat/send.png"
              alt="Notif"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
