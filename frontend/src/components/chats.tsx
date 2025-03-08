"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "./css/chatinterface.css";
import Image from "next/image";
import Dropdown from "./utility/dropdown";
import { APIConstants } from "@/app/api.constants";

export default function ChatInterface({ userDetails, groups }: any) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [typingMessage, setTypingMessage]: any = useState([]);
  const [options, setOptions]: any = useState([]);
  const [dataset, setDataset]: any = useState();

  const suggestedQuestions = [
    "What are your services?",
    "How can I contact support?",
    "Tell me about your pricing.",
  ];

  useEffect(() => {
    let tempOptions = ["All Groups"];
    console.log(groups);
    groups.forEach((group: any) => {
      console.log(group.GroupName);
      tempOptions.push(group.GroupName);
    });
    tempOptions.push("Tasks");
    tempOptions.push("Escalations");
    setOptions(tempOptions);
  }, []);

  const simulateTyping = (text, callback) => {
    let index = 0;
    setTypingMessage([]);
    const lines = text.split("\n");
    const interval = setInterval(() => {
      if (index < lines.length) {
        setTypingMessage((prev) => [...prev, lines[index]]);
        index++;
      } else {
        clearInterval(interval);
        callback();
      }
    }, 500);
  };
  const sendMessage = async (message) => {
    if (!message.trim()) return;

    setHasStartedChat(true);
    const updatedMessages = [
      ...messages,
      {
        content: message,
        role: "user",
        time: new Date().toLocaleTimeString(),
      },
    ];
    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await axios.post(APIConstants.CHATS, {
        data: dataset,
        message,
        history: updatedMessages.map(({ content, role }) => ({
          content,
          role,
        })),
      });

      if (response.data) {
        simulateTyping(response.data, () => {
          setMessages([
            ...updatedMessages,
            {
              content: response.data,
              role: "system",
              time: new Date().toLocaleTimeString(),
            },
          ]);
          setTypingMessage([]);
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="flex flex-col gap-2 items-start">
          <h3 className="section-header">Insights</h3>
          <div className="flex justify-center items-center">
            <Dropdown
              options={options}
              onSelect={(value) => setDataset(value)}
            />
          </div>
        </div>
      </div>
      <div className="chat-body">
        {!hasStartedChat && (
          <div className="chat-header-text-box">
            <p className="chat-title">Hi, John</p>
            <p className="chat-title">How can I help you?</p>
          </div>
        )}
        {!hasStartedChat && (
          <div className="chat-suggestions">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(question);
                  setHasStartedChat(true);
                }}
                className="chat-suggestion-button"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              <Image
                src={
                  msg.role === "user"
                    ? `https://avatar.iran.liara.run/public/boy?username=${userDetails?.email}`
                    : "/assets/chat/bot.png"
                }
                alt={msg.role}
                width={30}
                height={30}
                className="chat-avatar"
                unoptimized
              />
              <div className="chat-bubble">
                {msg.content.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                <span className="chat-time">{msg.time}</span>
              </div>
            </div>
          ))}
          {typingMessage.length > 0 && (
            <div className="chat-message system">
              <Image
                src="/assets/chat/bot.png"
                alt="system"
                width={30}
                height={30}
                className="chat-avatar"
                unoptimized
              />
              <div className="chat-bubble">
                {typingMessage.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          )}
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
              alt="Send"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
