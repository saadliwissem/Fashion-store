import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        validateToken(token);
      } catch (err) {
        console.error("Error parsing user data:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      await authAPI.getProfile();
      setLoading(false);
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      toast.success("Welcome back!");
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registering = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      toast.success("Account created successfully!");
      return newUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully");
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      const updatedUser = response.data.user;

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Profile updated successfully");
      return updatedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Update failed";
      toast.error(errorMessage);
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await authAPI.forgotPassword(email);
      toast.success("Password reset link sent to your email");
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send reset email";
      toast.error(errorMessage);
      throw err;
    }
  };

  const resetPassword = async (data) => {
    try {
      const response = await authAPI.resetPassword(data);
      const { token, message } = response.data;

      if (token) {
        localStorage.setItem("token", token);
      }

      toast.success(message || "Password reset successfully");
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
      throw err;
    }
  };

  const getProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      const userData = response.data.user;

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      console.error("Error fetching profile:", err);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    setUser, // Keep this for GoogleCallback
    login,
    registering,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    getProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    // REMOVED: handleGoogleAuth - we don't need it for redirect flow
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
