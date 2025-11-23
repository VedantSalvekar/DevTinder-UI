import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeFeedById } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constants";

const UserCard = ({ user, showActions = true, swipeDirection, onSwipeAction }) => {
  const { _id, firstName, age, gender, about, photoUrl, skills } =
    user;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendRequest = async (status, _id) => {
    try {
      setLoading(true);
      setError("");
      await axios.post(
        BASE_URL + "request/send/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeFeedById(_id));
    } catch (err) {
      console.error("Error sending request:", err);
      setError(err.response?.data?.message || "Failed to send request. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const getSwipeClass = () => {
    if (swipeDirection === "left") return "swipe-left";
    if (swipeDirection === "right") return "swipe-right";
    return "";
  };

  return (
    <div className={`card bg-[#161b22] w-[380px] shadow-2xl overflow-hidden relative border border-[#30363d] ${getSwipeClass()}`}>
      {swipeDirection && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/20">
          {swipeDirection === "left" && (
            <div className="bg-red-500/90 text-white px-8 py-4 rounded-xl text-3xl font-extrabold rotate-[-15deg] border-4 border-white shadow-2xl backdrop-blur-sm">
              IGNORE
            </div>
          )}
          {swipeDirection === "right" && (
            <div className="bg-green-500/90 text-white px-8 py-4 rounded-xl text-3xl font-extrabold rotate-15 border-4 border-white shadow-2xl backdrop-blur-sm">
              REQUEST
            </div>
          )}
        </div>
      )}
      
      <figure className="h-[350px] overflow-hidden">
        <img 
          src={photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} 
          alt={firstName || "Profile"}
          className="w-full h-full object-cover"
        />
      </figure>
      
      <div className="p-4">
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-2xl font-bold text-[#c9d1d9]">{firstName}</h2>
          {age && <span className="text-lg text-[#8b949e]">{age}</span>}
        </div>
        
        {gender && (
          <p className="text-[#8b949e] capitalize text-sm mb-3">{gender}</p>
        )}
        
        {about && (
          <p className="text-sm text-[#c9d1d9] leading-relaxed mb-3">
            {about}
          </p>
        )}
        
        {skills && skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 6).map((skill, index) => (
                <span
                  key={index}
                  className="badge badge-primary badge-sm"
                >
                  {skill.trim()}
                </span>
              ))}
              {skills.length > 6 && (
                <span className="badge badge-ghost badge-sm">
                  +{skills.length - 6}
                </span>
              )}
            </div>
          </div>
        )}
        
        {error && (
          <div className="alert alert-error text-xs py-2 shadow-lg mb-3 bg-[#161b22] border-[#da3633] text-[#ff7b72]">
            <span>{error}</span>
          </div>
        )}
        
        {showActions && (
          <div className="flex justify-center gap-8 mt-4">
            <button
              className="btn btn-circle btn-lg btn-error hover:scale-110 transition-transform"
              onClick={() => {
                if (onSwipeAction) {
                  onSwipeAction("left");
                } else {
                  handleSendRequest("ignored", _id);
                }
              }}
              disabled={loading}
            >
              {loading ? "..." : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
            <button
              className="btn btn-circle btn-lg btn-success hover:scale-110 transition-transform"
              onClick={() => {
                if (onSwipeAction) {
                  onSwipeAction("right");
                } else {
                  handleSendRequest("interested", _id);
                }
              }}
              disabled={loading}
            >
              {loading ? "..." : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
