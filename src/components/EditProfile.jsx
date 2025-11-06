import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstname] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [skills, setSkills] = useState(user?.skills || []);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log("EditProfile - Received user prop:", user);
  }, [user]);

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "profile/edit",
        { firstName, lastName, age, photoUrl, gender, about, skills },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err.response.data);
    }
  };
  return (
    <>
      <div className="flex justify-center  my-10 max ">
        <div className="flex justify-center mx-10 ">
          <div className="card bg-base-300 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">First Name</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Last Name</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Age</span>
                  </div>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">PhotoURL</span>
                  </div>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Gender</span>
                  </div>
                  <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn m-1">
                      {gender || "Select gender"}
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow"
                    >
                      <li>
                        <button onClick={() => setGender("Male")}>Male</button>
                      </li>
                      <li>
                        <button onClick={() => setGender("Female")}>
                          Female
                        </button>
                      </li>
                      <li>
                        <button onClick={() => setGender("Others")}>
                          Others
                        </button>
                      </li>
                    </ul>
                  </div>
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Skills (comma separated)</span>
                  </div>
                  <input
                    type="text"
                    value={Array.isArray(skills) ? skills.join(", ") : skills}
                    onChange={(e) => setSkills(e.target.value.split(",").map(s => s.trim()))}
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>

                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">About</span>
                  </div>
                  <textarea
                    placeholder="Bio"
                    type="text"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                  ></textarea>
                </label>
              </div>
              <p className="text-red-500 text-center">{error}</p>
              <div className="card-actions justify-center mt-2">
                <button className="btn btn-primary" onClick={saveProfile}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <UserCard
          user={{ firstName, lastName, photoUrl, about, age, gender, skills }}
          showActions={false}
        />
      </div>
      {showToast && (
        <div className="toast toast-top toast-center pt-20 ">
          <div className="alert alert-success">
            <span>Profile saved successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
