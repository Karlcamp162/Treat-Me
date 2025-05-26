import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";


const Login = () => {
  const { login } = useContext(AuthContext); // Get the login function from AuthContext
  const [email, setEmail] = useState(""); // State to store email input
  const [password, setPassword] = useState(""); // State to store password input
  const [error, setError] = useState(""); // State to store any error message
  const [loading, setLoading] = useState(false); // State to track loading status
  const navigate = useNavigate();


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset any previous errors
  
    try {
      // Attempt to login with email and password
      await login(email, password);
      setLoading(false); // Reset loading state on success
  
      // Redirect to About page after successful login
      navigate('/aboutus');
    } catch (error) {
      setLoading(false); // Reset loading state on failure
      setError(error.message); // Set the error message if login fails
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-300 to-yellow-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Display error message if any */}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <Link to="/signup" className="text-gray-700 hover:text-yellow-600">Don't have an account? Sign Up</Link>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500'}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
