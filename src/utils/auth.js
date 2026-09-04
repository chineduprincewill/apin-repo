import axios from "axios";

// Authentication token management
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Get stored token
export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

// Get stored user
export const getUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Store token and user
export const setAuth = (token, user) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Clear auth
export const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getToken() !== null;
};

// Mock login function (replace with actual API call)
/**export const login = async (
  email,
  password
) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        const mockToken = `jwt_${Date.now()}_${Math.random()}`;
        const mockUser = {
          id: "user_123",
          email,
          name: email.split("@")[0],
          directorate: "Laboratory Services"
        };
        resolve({ token: mockToken, user: mockUser });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 800);
  });
};
*/

export const login = async (email, password) => {
  const API_BASE = import.meta.env.VITE_BASE_URL || "https://api.example.com"; // update to your backend
  const url = `${API_BASE}/login`;

  try {
    const response = await axios.post(
      url,
      { email, password },
      {
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        // withCredentials: true, // enable if your API uses cookies
      }
    );

    const data = response.data;
    const token = data?.token;
    const user = data?.user;

    if (!token || !user) {
      throw new Error("Malformed response from server");
    }

    return { token, user };
  } catch (err) {
    // axios error handling: prefer server message when available
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      `Request failed`;
    throw new Error(message);
  }
};

// Mock logout function (replace with actual API call if needed)
export const logout = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      clearAuth();
      resolve();
    }, 300);
  });
};


export const signup = async (fullname, email, password, confirm_password) => {
  const API_BASE = import.meta.env.VITE_BASE_URL || "https://api.example.com"; // update to your backend
  const url = `${API_BASE}/signup`;

  try {
    const response = await axios.post(
      url,
      { fullname, email, password, confirm_password },
      {
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        // withCredentials: true, // enable if your API uses cookies
      }
    );

    const data = response.data;

    return { data };
  } catch (err) {
    // axios error handling: prefer server message when available
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      `Request failed`;
    throw new Error(message);
  }
};
