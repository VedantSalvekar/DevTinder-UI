import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeFeedById } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constants";

const UserCard = ({ user, showActions = true }) => {
  const { _id, firstName, lastName, age, gender, about, photoUrl, skills } =
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
  return (
    <div className="card grid-rows-1 bg-base-300 w-96 h-150 shadow-xl p-3">
      <figure>
        <img 
          src={photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} 
          alt={firstName || "Profile"} 
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + (lastName || "")}</h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about || ""}</p>
        {skills && skills.length > 0 && (
          <div>
            <h3 className="font-semibold">Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-200 text-blue-700 px-2 py-1 rounded-lg text-sm"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
        {error && (
          <div className="alert alert-error text-sm mt-2">
            <span>{error}</span>
          </div>
        )}
        {showActions && (
          <div className="card-actions justify-center my-4">
            <button
              className="btn btn-accent"
              onClick={() => {
                handleSendRequest("ignored", _id);
              }}
              disabled={loading}
            >
              {loading ? "..." : "Ignore"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                handleSendRequest("interested", _id);
              }}
              disabled={loading}
            >
              {loading ? "..." : "Interested"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
