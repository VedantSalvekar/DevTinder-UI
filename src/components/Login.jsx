import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("vedant@gmail.com");
  const [password, setPassword] = useState("Admin@11");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:7777/login",
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(res.data));
      return navigate("/feed");
    } catch (err) {
      setError(err?.response?.data);
    }
  };
  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "signup",
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res);
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (error) {
      setError(error.response.data);
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center py-20">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">
          {isLoginForm ? "Login" : "Signup"}
        </legend>

        {!isLoginForm && (
          <>
            <label className="label">First Name</label>
            <input
              type="text"
              value={firstName}
              className="input"
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label className="label">Last Name</label>
            <input
              type="text"
              value={lastName}
              className="input"
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </>
        )}

        <label className="label">Email</label>
        <input
          type="email"
          value={emailId}
          className="input"
          placeholder="Email"
          onChange={(e) => setEmailId(e.target.value)}
        />

        <label className="label">Password</label>
        <input
          type="password"
          value={password}
          className="input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <a className="text-red-500">{error}</a>
        <button
          className="btn btn-neutral mt-4"
          onClick={isLoginForm ? handleLogin : handleSignUp}
        >
          {isLoginForm ? "Login" : "Signup"}
        </button>
        <p
          className=" text-center cursor-pointer py-2"
          onClick={() => setIsLoginForm((value) => !value)}
        >
          {isLoginForm
            ? "New user ? signup here"
            : "Existing User ? Login here"}
        </p>
      </fieldset>
    </div>
  );
};

export default Login;
