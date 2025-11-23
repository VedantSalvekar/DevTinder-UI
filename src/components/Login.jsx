import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Validation
    if (!emailId || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        BASE_URL + "login",
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const userData = res.data;
      dispatch(addUser(userData));

      if (isProfileIncomplete(userData)) {
        return navigate("/profile");
      }
      return navigate("/feed");
    } catch (err) {
      setError(err?.response?.data || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleSignUp = async () => {
    // Validation
    if (!firstName || !lastName || !emailId || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
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

      const userData = res.data.data;
      dispatch(addUser(userData));

      setTimeout(() => {
        if (isProfileIncomplete(userData)) {
          navigate("/profile");
        } else {
          navigate("/feed");
        }
      }, 100);
    } catch (error) {
      setError(error?.response?.data || "Signup failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isProfileIncomplete = (userData) => {
    if (!userData) return true;
    return (
      !userData.photoUrl ||
      !userData.age ||
      !userData.gender ||
      !userData.about ||
      !userData.skills ||
      userData.skills.length === 0
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-12 px-4 min-h-[80vh]">
      <div className="w-full md:w-1/2 max-w-md">
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-[#3fb950]">Git</span>
            <span className="text-[#c9d1d9]">Together</span>
          </h1>
          <p className="text-[#8b949e] text-lg mb-6">
            Connect with developers, find your coding partner, and build amazing
            projects together.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-[#ba31dc] text-xl mt-1">/</div>
              <div>
                <h3 className="text-[#c9d1d9] font-semibold mb-1">
                  Find Developers
                </h3>
                <p className="text-[#8b949e] text-sm">
                  Discover developers with matching skills and interests
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-[#ba31dc] text-xl mt-1">/</div>
              <div>
                <h3 className="text-[#c9d1d9] font-semibold mb-1">
                  Build Connections
                </h3>
                <p className="text-[#8b949e] text-sm">
                  Connect with like-minded developers for collaboration
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-[#ba31dc] text-xl mt-1">/</div>
              <div>
                <h3 className="text-[#c9d1d9] font-semibold mb-1">
                  Grow Your Network
                </h3>
                <p className="text-[#8b949e] text-sm">
                  Expand your professional network in the tech community
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 max-w-sm">
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#c9d1d9]">
            {isLoginForm ? "Login" : "Signup"}
          </h2>

          {!isLoginForm && (
            <>
              <label className="label">
                <span className="label-text text-[#c9d1d9]">First Name</span>
              </label>
              <input
                type="text"
                value={firstName}
                className="input input-bordered w-full mb-3 bg-[#0d1117] border-[#30363d] text-[#c9d1d9]"
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label className="label">
                <span className="label-text text-[#c9d1d9]">Last Name</span>
              </label>
              <input
                type="text"
                value={lastName}
                className="input input-bordered w-full mb-3 bg-[#0d1117] border-[#30363d] text-[#c9d1d9]"
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
              />
            </>
          )}

          <label className="label">
            <span className="label-text text-[#c9d1d9]">Email</span>
          </label>
          <input
            type="email"
            value={emailId}
            className="input input-bordered w-full mb-3 bg-[#0d1117] border-[#30363d] text-[#c9d1d9]"
            placeholder="Email"
            onChange={(e) => setEmailId(e.target.value)}
          />

          <label className="label">
            <span className="label-text text-[#c9d1d9]">Password</span>
          </label>
          <input
            type="password"
            value={password}
            className="input input-bordered w-full mb-3 bg-[#0d1117] border-[#30363d] text-[#c9d1d9]"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="alert alert-error text-sm mt-2 mb-3 bg-[#161b22] border-[#da3633] text-[#ff7b72]">
              <span>{error}</span>
            </div>
          )}

          <button
            className="btn btn-primary w-full mt-4"
            onClick={isLoginForm ? handleLogin : handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : isLoginForm ? (
              "Login"
            ) : (
              "Signup"
            )}
          </button>

          <p
            className="text-center text-sm cursor-pointer py-4 text-[#8b949e] hover:text-[#3fb950]"
            onClick={() => {
              setIsLoginForm((value) => !value);
              setError("");
            }}
          >
            {isLoginForm
              ? "New user? Signup here"
              : "Existing User? Login here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
