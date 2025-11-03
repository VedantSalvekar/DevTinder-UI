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

  if (feed.length <= 0)
    return (
      <h1 className=" flex justify-center m-52 text-3xl">No more users!!!!</h1>
    );
  return (
    feed && (
      <div className="flex flex-col items-center gap-4 my-5">
        {feed && feed.map((user) => <UserCard key={user._id} user={user} />)}
        {/* <UserCard user={feed[0]} /> */}
      </div>
    )
  );
};

export default Feed;
