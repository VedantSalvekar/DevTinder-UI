import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const skillsDropdownRef = useRef(null);
  const dispatch = useDispatch();

  const techSkills = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "React",
    "Vue.js",
    "Angular",
    "Next.js",
    "Svelte",
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "Spring",
    "Laravel",
    "FastAPI",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "Firebase",
    "SQLite",
    "AWS",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "DevOps",
    "Azure",
    "GCP",
    "React Native",
    "Flutter",
    "iOS Development",
    "Android Development",
    "Machine Learning",
    "Data Science",
    "TensorFlow",
    "PyTorch",
    "Git",
    "Linux",
    "GraphQL",
    "REST API",
    "Microservices",
    "Blockchain",
    "Web3",
    "Solidity",
    "UI/UX Design",
    "Figma",
    "Tailwind CSS",
  ];

  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  useEffect(() => {
    if (user) {
      setFirstname(user.firstName || "");
      setLastName(user.lastName || "");
      setPhotoUrl(user.photoUrl || "");
      setAge(user.age || "");
      setGender(user.gender || "");
      setAbout(user.about || "");
      setSkills(user.skills || []);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        skillsDropdownRef.current &&
        !skillsDropdownRef.current.contains(event.target)
      ) {
        setSkillsDropdownOpen(false);
      }
    };

    if (skillsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [skillsDropdownOpen]);

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
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center my-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center my-10">
        <div className="flex justify-center mx-10">
          <div className="card bg-base-300 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center text-[#c9d1d9]">
                Edit Profile
              </h2>
              <div>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text text-[#c9d1d9]">
                      First Name
                    </span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="input input-bordered w-full max-w-xs bg-[#0d1117] border-[#30363d] text-[#c9d1d9]"
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text text-[#c9d1d9]">Last Name</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input input-bordered w-full max-w-xs bg-[#0d1117] border-[#30363d] text-[#c9d1d9]"
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text text-[#c9d1d9]">Age</span>
                  </div>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="input input-bordered w-full max-w-xs bg-[#0d1117] border-[#30363d] text-[#c9d1d9]"
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text text-[#c9d1d9]">Photo URL</span>
                  </div>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="input input-bordered w-full max-w-xs bg-[#0d1117] border-[#30363d] text-[#c9d1d9]"
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text text-[#c9d1d9]">Gender</span>
                  </div>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="select select-bordered w-full max-w-xs bg-[#0d1117] border-[#30363d] text-[#c9d1d9]"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text text-[#c9d1d9]">Skills</span>
                  </div>
                  <div className="relative w-full" ref={skillsDropdownRef}>
                    <button
                      type="button"
                      className="select select-bordered w-full max-w-xs bg-[#0d1117] border-[#30363d] text-[#c9d1d9] text-left"
                      onClick={() => setSkillsDropdownOpen(!skillsDropdownOpen)}
                    >
                      {skills.length > 0
                        ? `${skills.length} skill${
                            skills.length > 1 ? "s" : ""
                          } selected`
                        : "Select skills"}
                    </button>
                    {skillsDropdownOpen && (
                      <ul className="absolute z-10 w-full max-w-xs bg-[#0d1117] border border-[#30363d] rounded-lg mt-1 max-h-64 overflow-y-auto shadow-lg">
                        {techSkills.map((skill) => (
                          <li
                            key={skill}
                            className={`px-4 py-2 cursor-pointer ${
                              skills.includes(skill)
                                ? "bg-[#238636] text-white"
                                : "text-[#c9d1d9] hover:bg-[#21262d]"
                            }`}
                            onClick={() => toggleSkill(skill)}
                          >
                            <div className="flex items-center justify-between">
                              <span>{skill}</span>
                              {skills.includes(skill) && (
                                <span className="text-white">✓</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </label>

                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text text-[#c9d1d9]">About</span>
                  </div>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="textarea textarea-bordered w-full max-w-xs bg-[#0d1117] border-[#30363d] text-[#c9d1d9]"
                    rows="3"
                  />
                </label>
              </div>
              {error && (
                <p className="text-[#ff7b72] text-center text-sm">{error}</p>
              )}
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
        <div className="toast toast-top toast-center pt-20">
          <div className="alert alert-success">
            <span>Profile saved successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
