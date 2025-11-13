import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);

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
      console.log(firstName + " :  " + text);
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
      <div className="card bg-base-300 shadow-xl">
        <div className="card-body p-0">
          <div className="bg-base-200 p-4 border-b border-base-100">
            <h2 className="text-xl font-bold">Chat</h2>
          </div>

          <div className="p-4 h-96 overflow-y-auto">
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
                <div className="chat-header">
                  {`${message.firstName} ${message.lastName}`}
                  <time className="text-xs opacity-50 ml-2">
                    {message.timestamp}
                  </time>
                </div>
                <div className="chat-bubble">{message.text}</div>
                <div className="chat-footer opacity-50">{message.status}</div>
              </div>
            ))}
          </div>

          <div className="bg-base-200 p-4 border-t border-base-100 flex gap-2 ">
            {/* <form onSubmit={handleSendMessage} className="flex gap-2"> */}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="input input-bordered flex-1"
            />
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSendMessage}
            >
              Send
            </button>
            {/* </form> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
