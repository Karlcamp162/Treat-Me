import React, { useEffect, useState } from "react";
import axios from "axios";
import MyNavbar from "../components/Navbar";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch current user data on component mount
    const token = localStorage.getItem("token"); // assuming you store the JWT in localStorage after login

    if (token) {
      axios
        .get("http://127.0.0.1:3000/api/v1/auto_login", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setError("Error fetching user data.");
        });
    } else {
      setError("No token found. Please log in.");
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-yellow-100">
        <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-md">
          {error}
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-yellow-100">
        <div className="text-lg text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <>
    <MyNavbar/>
    <div className="min-h-screen bg-yellow-100 flex justify-center items-center">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">Profile</h1>
        
        <div className="flex justify-center mb-6">
          <img
            src={userData.user_img || "https://via.placeholder.com/150"}
            alt="User profile"
            className="w-32 h-32 object-cover rounded-full border-4 border-red-600"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-gray-700">Name:</p>
            <p className="text-lg text-gray-900">{userData.user_name}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-lg font-semibold text-gray-700">Email:</p>
            <p className="text-lg text-gray-900">{userData.email}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-lg font-semibold text-gray-700">Phone:</p>
            <p className="text-lg text-gray-900">{userData.phone_num}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-lg font-semibold text-gray-700">Address:</p>
            <p className="text-lg text-gray-900">{userData.address}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-lg font-semibold text-gray-700">Gender:</p>
            <p className="text-lg text-gray-900">{userData.gender}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-lg font-semibold text-gray-700">Role:</p>
            <p className="text-lg text-gray-900">{userData.role}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
