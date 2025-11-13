import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequestsById } from "../utils/requestSlice";
import { useNavigate } from "react-router";

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const requests = useSelector((store) => store.requests);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const reviewRequest = async (status, _id) => {
    try {
      setLoading(_id);
      const res = await axios.post(
        BASE_URL + "request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequestsById(_id));
      console.log(res.data);
    } catch (err) {
      console.error("Error reviewing request:", err);
      alert(
        err.response?.data?.message ||
          "Failed to review request. Please try again."
      );
    } finally {
      setLoading("");
    }
  };

  const fetchRequests = useCallback(async () => {
    try {
      setError("");
      const res = await axios.get(BASE_URL + "user/request/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load requests. Please try again."
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (!requests) {
      fetchRequests();
    }
  }, [requests, fetchRequests]);

  if (!requests && !error) {
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
        <button className="btn btn-primary" onClick={fetchRequests}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Connection Requests</h1>
        <p className="text-sm opacity-70 mt-2">
          {requests?.length || 0} pending{" "}
          {requests?.length === 1 ? "request" : "requests"}
        </p>
      </div>

      {requests?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => {
            const user = request.fromUserId;
            return (
              <div
                key={request._id}
                className="card bg-base-300 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="card-body p-6">
                  {/* Profile Image and Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                        <img
                          src={
                            user?.photoUrl ||
                            "https://img.daisyui.com/images/profile/demo/1@94.webp"
                          }
                          alt={user?.firstName || "User"}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="card-title text-lg">
                        {user?.firstName || "Unknown"}{" "}
                        {user?.lastName || ""}
                      </h2>
                      {user?.age && (
                        <p className="text-sm opacity-70">
                          {user.age} years old
                          {user.gender && ` • ${user.gender}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* About */}
                  {user?.about && (
                    <p className="text-sm opacity-80 mb-3 line-clamp-2">
                      {user.about}
                    </p>
                  )}

                  {/* Skills */}
                  {user?.skills && user.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {user.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="badge badge-secondary badge-sm"
                          >
                            {skill}
                          </span>
                        ))}
                        {user.skills.length > 3 && (
                          <span className="badge badge-ghost badge-sm">
                            +{user.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="card-actions justify-center gap-2 mt-4 pt-4 border-t border-base-100">
                    <button
                      className="btn btn-error btn-sm flex-1"
                      onClick={() => reviewRequest("rejected", request._id)}
                      disabled={loading === request._id}
                    >
                      {loading === request._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <>
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
                          Reject
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-success btn-sm flex-1"
                      onClick={() => reviewRequest("accepted", request._id)}
                      disabled={loading === request._id}
                    >
                      {loading === request._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44h.74C14.09 5.01 15.76 4 17.5 4 20 4 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          Accept
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
              />
            </svg>
            <h3 className="text-xl font-bold mb-2">No Pending Requests</h3>
            <p className="opacity-70 mb-6">
              When someone shows interest in you, you'll see them here!
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

export default Requests;
