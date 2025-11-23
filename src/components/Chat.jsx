import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);

  const fetchChat = useCallback(async () => {
    try {
      const res = await axios.get(BASE_URL + "chat/" + targetUserId, {
        withCredentials: true,
      });
      const chatMessages = res?.data?.data?.messages.map((msg) => {
        return {
          firstName: msg?.senderId?.firstName,
          lastName: msg?.senderId?.lastName,
          text: msg?.text,
        };
      });
      setMessages(chatMessages || []);
    } catch (err) {
      console.error("Error fetching chat:", err);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  useEffect(() => {
    if (!user?._id) return;
    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId: user?._id,
      targetUserId,
    });
    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id, user?.firstName, targetUserId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user?._id,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#161b22] p-4 border-b border-[#30363d]">
          <h2 className="text-xl font-bold text-[#c9d1d9]">Chat</h2>
        </div>

        <div className="p-4 h-[500px] overflow-y-auto bg-[#0d1117]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                "chat " +
                (user.firstName === message.firstName
                  ? "chat-end"
                  : "chat-start")
              }
            >
              <div className="chat-header text-[#8b949e] mb-1">
                {`${message.firstName} ${message.lastName || ""}`}
                {message.timestamp && (
                  <time className="text-xs opacity-50 ml-2">
                    {message.timestamp}
                  </time>
                )}
              </div>
              <div className={`chat-bubble ${user.firstName === message.firstName ? 'bg-[#238636] text-white' : 'bg-[#21262d] text-[#c9d1d9]'}`}>
                {message.text}
              </div>
              {message.status && (
                <div className="chat-footer opacity-50 text-[#8b949e]">
                  {message.status}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-[#161b22] p-4 border-t border-[#30363d] flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Type a message..."
            className="input input-bordered flex-1 bg-[#0d1117] border-[#30363d] text-[#c9d1d9] placeholder:text-[#6e7681]"
          />
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
