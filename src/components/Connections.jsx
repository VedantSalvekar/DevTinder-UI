import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Link, useNavigate } from "react-router";

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connections = useSelector((store) => store.connections);
  const [error, setError] = useState("");

  const fetchConnections = useCallback(async () => {
    try {
      setError("");
      const res = await axios.get(BASE_URL + "user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data));
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching connections:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load connections. Please try again."
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (!connections) {
      fetchConnections();
    }
  }, [connections, fetchConnections]);

  if (!connections && !error) {
    return (
      <div className="flex justify-center items-center my-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 my-10">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
        <button className="btn btn-primary" onClick={fetchConnections}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Your Connections</h1>
        <p className="text-sm opacity-70 mt-2">
          {connections?.length || 0}{" "}
          {connections?.length === 1 ? "connection" : "connections"}
        </p>
      </div>

      {connections?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => (
            <div
              key={connection._id}
              className="card bg-base-300 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="card-body p-6">
                {/* Profile Image and Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={
                          connection.photoUrl ||
                          "https://img.daisyui.com/images/profile/demo/1@94.webp"
                        }
                        alt={connection.firstName}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="card-title text-lg">
                      {connection.firstName} {connection.lastName || ""}
                    </h2>
                    {connection.age && (
                      <p className="text-sm opacity-70">
                        {connection.age} years old
                        {connection.gender && ` • ${connection.gender}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* About */}
                {connection.about && (
                  <p className="text-sm opacity-80 mb-3 line-clamp-2">
                    {connection.about}
                  </p>
                )}

                {/* Skills */}
                {connection.skills && connection.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {connection.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="badge badge-primary badge-sm"
                        >
                          {skill}
                        </span>
                      ))}
                      {connection.skills.length > 3 && (
                        <span className="badge badge-ghost badge-sm">
                          +{connection.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="card-actions justify-end mt-4 pt-4 border-t border-base-100">
                  <Link to={"/chat/" + connection._id}>
                    <button className="btn btn-primary btn-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Chat
                    </button>
                  </Link>

                  <button className="btn btn-ghost btn-sm text-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card bg-base-300 shadow-xl max-w-md mx-auto">
          <div className="card-body items-center text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 opacity-30 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-xl font-bold mb-2">No Connections Yet</h3>
            <p className="opacity-70 mb-6">
              Start swiping to make connections with other developers!
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/feed")}
            >
              Go to Feed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connections;
