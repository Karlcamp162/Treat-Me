import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const MyNavbar = () => {
  const { user, logout } = useContext(AuthContext); // Get user data and logout function from AuthContext
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility

  // Toggle the dropdown visibility
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="bg-gray-800 text-white p-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold text-white">
          Treat Me
        </Link>

        {/* Navbar Links */}
        <div className="flex items-center space-x-6">
          <Link to="/aboutus" className="text-white hover:text-yellow-400">About Us</Link>
          <Link to="/menu" className="text-white hover:text-yellow-400">Menu</Link>
          <Link to="/ordereditems" className="text-white hover:text-yellow-400">Ordered Items</Link>

          {/* Profile section with user image or Login link */}
          {!user ? (
            <Link to="/login" className="text-white hover:text-yellow-400">Login</Link>
          ) : (
            <div className="relative">
              {/* Profile image */}
              <button onClick={toggleDropdown} className="flex items-center space-x-2">
                <img
                  src={user.user_img || "default-profile.jpg"} // Use the user's image or a default one if not available
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded-md z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-600">Profile</Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;
