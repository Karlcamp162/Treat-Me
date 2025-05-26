import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { signup } = useContext(AuthContext); // Get the signup function from AuthContext
  const navigate = useNavigate(); // For redirecting after signup

  // State for form inputs (consolidating form data into a single object)
  const [formData, setFormData] = useState({
    email: "",
    user_name: "",
    age: "",
    gender: "Male",
    password: "",
    phone_num: "",
    address: "",
    userImg: null,
  });
  const [error, setError] = useState(""); // State to store any error message
  const [loading, setLoading] = useState(false); // State to track loading status

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file change (for user image)
  const handleImageChange = (e) => {
    setFormData({ ...formData, userImg: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSubmit.append(key, formData[key]);
    });

    try {
      await signup(formDataToSubmit); // Pass FormData to signup
      setLoading(false);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-300 to-yellow-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Display error message if any */}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left Column: Email, user_name, Age */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Right Column: Gender, Phone Number, Address */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label htmlFor="phone_num" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              id="phone_num"
              name="phone_num"
              value={formData.phone_num}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Image Upload Section */}
          <div className="col-span-2">
            <label htmlFor="userImg" className="block text-sm font-medium text-gray-700">Profile Image</label>
            <input
              type="file"
              id="userImg"
              name="userImg"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Section */}
          <div className="col-span-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`col-span-2 w-full p-3 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500'}`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
