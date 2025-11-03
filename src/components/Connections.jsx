import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const fetchConnections = async () => {
    try {
      if (connections) return;
      const res = await axios.get(BASE_URL + "user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data));
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div>
      <ul className="list bg-base-300 rounded-box shadow-md mx-70 px-10 my-15 pb-4">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          Your Connections{" "}
        </li>

        {connections?.map((connection) => (
          <li className="list-row  bg-cyan-950 ">
            <div>
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/profile/demo/1@94.webp"
              />
            </div>
            <div>
              <div>{connection.firstName}</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                {connection.about}
              </div>
            </div>
            {/* <p className="list-col-wrap text-xs">{connection.about}</p> */}
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

            {/* <button className="btn btn-square btn-ghost hover:bg-pink-100 text-pink-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44h.74C14.09 5.01 15.76 4 17.5 4 20 4 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Connections;
