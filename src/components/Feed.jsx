import React, { useEffect, useState, useCallback } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeFeedById } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { useSwipeable } from "react-swipeable";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
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

  const handleSwipeAction = useCallback(async (direction) => {
    if (!feed || feed.length === 0 || isAnimating) return;
    
    const currentUser = feed[0];
    const status = direction === "right" ? "interested" : "ignored";
    
    setIsAnimating(true);
    setSwipeDirection(direction);
    
    setTimeout(async () => {
      try {
        await axios.post(
          BASE_URL + "request/send/" + status + "/" + currentUser._id,
          {},
          { withCredentials: true }
        );
        dispatch(removeFeedById(currentUser._id));
      } catch (err) {
        console.error("Error sending request:", err);
        setError(err.response?.data?.message || "Failed to send request. Please try again.");
      } finally {
        setSwipeDirection(null);
        setIsAnimating(false);
      }
    }, 300);
  }, [feed, isAnimating, dispatch]);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipeAction("left"),
    onSwipedRight: () => handleSwipeAction("right"),
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 50
  });
  
  if (!feed && !error) {
    return (
      <div className="flex justify-center items-center my-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 my-10">
        <div className="alert alert-error max-w-md shadow-lg">
          <span>{error}</span>
        </div>
        <button className="btn btn-primary" onClick={getFeed}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-8">
      {feed?.length > 0 ? (
        <div {...handlers} className="relative">
          <UserCard 
            user={feed[0]} 
            swipeDirection={swipeDirection}
            onSwipeAction={handleSwipeAction}
          />
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">No New Users Found</h1>
          <p className="text-gray-500">Check back later for more profiles</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
