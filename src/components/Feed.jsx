import React, { useEffect, useState, useCallback } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  
  const getFeed = useCallback(async () => {
    try {
      setError("");
      const res = await axios.get(BASE_URL + "feed", { withCredentials: true });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError(err.response?.data?.message || "Failed to load feed. Please try again later.");
    }
  }, [dispatch]);
  
  useEffect(() => {
    if (!feed) {
      getFeed();
    }
  }, [feed, getFeed]);
  
  if (!feed && !error) return <div className="flex justify-center my-10">Loading...</div>;

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 my-10">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
        <button className="btn btn-primary" onClick={getFeed}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 my-5">
      {feed?.length > 0 ? (
        <UserCard user={feed[0]} />
      ) : (
        <h1 className="text-2xl">No New Users found!</h1>
      )}
    </div>
  );
};

export default Feed;
