import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const getFeed = async () => {
    try {
      if (feed) return;
      const res = await axios.get(BASE_URL + "feed", { withCredentials: true });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getFeed();
  }, []);
  if (!feed) return;

  return (
    <div className="flex flex-col items-center gap-4 my-5">
      {feed?.length > 0 ? (
        // feed.map((item) => (
        //   <UserCard key={item._id} user={item} isProfile={false} />
        // ))
        <UserCard user={feed[0]} isProfile={false} />
      ) : (
        <h1 className="text-2xl">No New Users found!</h1>
      )}
    </div>
  );
};

export default Feed;
