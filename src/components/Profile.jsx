import React from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((store) => store.user);

  console.log("Profile - User data:", user);

  // if (!user) {
  //   return (
  //     <div className="flex justify-center my-10">
  //       <div className="alert alert-warning max-w-md">
  //         <span>No user data found. Please login again.</span>
  //       </div>
  //     </div>
  //   );
  // }

  // Force EditProfile to remount when user data changes by using key
  return (
    <div>
      <EditProfile user={user} />
    </div>
  );
};

export default Profile;
