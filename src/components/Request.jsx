import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequestsById } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
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
      alert(err.response?.data?.message || "Failed to review request. Please try again.");
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
      setError(err.response?.data?.message || "Failed to load requests. Please try again.");
    }
  }, [dispatch]);

  useEffect(() => {
    if (!requests) {
      fetchRequests();
    }
  }, [requests, fetchRequests]);

  if (!requests && !error) return <div className="flex justify-center my-10">Loading...</div>;

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
    <div>
      <ul className="list bg-base-300 rounded-box shadow-md mx-70 px-10 my-15 pb-4">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          Your Requests{" "}
        </li>

        {requests?.length > 0 ? (
          requests.map((request) => (
            <li key={request._id} className="list-row bg-cyan-950 m-2">
              <div>
                <img
                  className="size-10 rounded-box"
                  src={request.fromUserId?.photoUrl || "https://img.daisyui.com/images/profile/demo/1@94.webp"}
                  alt={request.fromUserId?.firstName}
                />
              </div>
              <div>
                <div>
                  {request.fromUserId?.firstName || "Unknown"} {request.fromUserId?.lastName || ""}
                </div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {request.fromUserId?.about || ""}
                </div>
              </div>
              <button
                className="btn btn-square btn-ghost hover:bg-red-100 text-red-500"
                onClick={() => reviewRequest("rejected", request._id)}
                disabled={loading === request._id}
              >
                {loading === request._id ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>

              <button
                className="btn btn-square btn-ghost hover:bg-pink-100 text-pink-700"
                onClick={() => reviewRequest("accepted", request._id)}
                disabled={loading === request._id}
              >
                {loading === request._id ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44h.74C14.09 5.01 15.76 4 17.5 4 20 4 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                )}
              </button>
            </li>
          ))
        ) : (
          <li className="p-4 text-center">No requests yet!</li>
        )}
      </ul>
    </div>
  );
};

export default Requests;
