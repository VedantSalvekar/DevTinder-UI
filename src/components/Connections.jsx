import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Connections = () => {
  const dispatch = useDispatch();
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
      setError(err.response?.data?.message || "Failed to load connections. Please try again.");
    }
  }, [dispatch]);

  useEffect(() => {
    if (!connections) {
      fetchConnections();
    }
  }, [connections, fetchConnections]);

  if (!connections && !error) return <div className="flex justify-center my-10">Loading...</div>;

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
    <div>
      <ul className="list bg-base-300 rounded-box shadow-md mx-70 px-10 my-15 pb-4">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          Your Connections{" "}
        </li>

        {connections?.length > 0 ? (
          connections.map((connection) => (
            <li key={connection._id} className="list-row bg-cyan-950 m-2">
              <div>
                <img
                  className="size-10 rounded-box"
                  src={connection.photoUrl || "https://img.daisyui.com/images/profile/demo/1@94.webp"}
                  alt={connection.firstName}
                />
              </div>
              <div>
                <div>{connection.firstName + " " + (connection.lastName || "")}</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {connection.about}
                </div>
              </div>
              <button className="btn btn-square btn-ghost hover:bg-red-100 text-red-500">
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
              </button>
            </li>
          ))
        ) : (
          <li className="p-4 text-center">No connections yet!</li>
        )}
      </ul>
    </div>
  );
};

export default Connections;
