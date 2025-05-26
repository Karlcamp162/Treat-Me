// src/api/endpoints.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/api/v1/";

const LOGIN_URL = `${BASE_URL}login`;
const SIGNUP_URL = `${BASE_URL}signup`;
const AUTOLOGIN_URL = `${BASE_URL}auto_login`;

// ✅ Create a token-aware Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Automatically attach token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await axios.post(LOGIN_URL, { email, password });
  return response.data;
};

export const signup = async (formDataToSubmit) => {
  const response = await axios.post(SIGNUP_URL, formDataToSubmit, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const auto_login = async (token) => {
  try {
    const response = await axios.get(AUTOLOGIN_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Auto-Login Error:", error);
    throw new Error("Failed to auto-login");
  }
};

// ✅ Export token-aware axios instance for general use
export default api;
