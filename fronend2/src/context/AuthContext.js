import { createContext, useState, useEffect } from "react";
import { auto_login, login, signup } from "../api/endpoints"; // ✅ Correct imports

// Create AuthContext
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Auto-login on page load using token from localStorage
  useEffect(() => {
    if (!token) return; // Skip if no token
    console.log("Auto-Login Token:", token); // 🔍 Check token before request

    auto_login(token)
      .then((data) => {
        if (data.id) {
          setUser(data); // Store the user object properly
        } else {
          logout();
        }
      })
      .catch(() => logout());
  }, [token]);

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password);
      console.log("Login Response:", data); // Debugging

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        return data; // Return success
      } else {
        throw new Error("Incorrect email or password.");
      }
    } catch (error) {
      console.error("Login Error:", error);

      // Handle specific error response
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error("Incorrect email or password.");
        } else {
          throw new Error(error.response.data.error || "Login failed.");
        }
      } else {
        throw new Error("Something went wrong. Please try again.");
      }
    }
  };

  const handleSignup = async (name, email, password) => {
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
      throw new Error(error.response?.data?.error || "Signup failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, login: handleLogin, signup: handleSignup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
