import { createContext, useState, useEffect, useCallback } from "react";
import { auto_login, login, signup } from "../api/endpoints"; // ✅ Correct imports

// Create AuthContext
const AuthContext = createContext(null);

// Error Handling Function
const handleError = (error) => {
  if (error.response) {
    return error.response.data.error || "An error occurred";
  } else {
    return "Something went wrong. Please try again.";
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Auto-login when page refreshes
  useEffect(() => {
    if (!token) return; // Skip if no token

    console.log("Auto-Login Token:", token); // 🔍 Check token before request
    
    auto_login(token)
      .then((data) => {
        if (data.id) {
          setUser(data); // Store the user object properly
        } else {
          logout(); // Automatically log out if the token is invalid
        }
      })
      .catch(() => logout()); // Catch any errors and log out
  }, [token]);

  // Login function
  const handleLogin = useCallback(async (email, password) => {
    try {
      const data = await login(email, password);
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        return data; // Return success
      }
      throw new Error("Incorrect email or password.");
    } catch (error) {
      console.error("Login Error:", error);
      throw new Error(handleError(error));
    }
  }, []);

  // Signup function
  const handleSignup = useCallback(async (name, email, password) => {
    try {
      const data = await signup(name, email, password);
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
      } else {
        throw new Error("Signup failed");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      throw new Error(handleError(error));
    }
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token"); // Remove the token from local storage
    setUser(null);  // Reset user data in state
    setToken("");   // Clear token in state
  };

  return (
    <AuthContext.Provider value={{ user, token, login: handleLogin, signup: handleSignup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
