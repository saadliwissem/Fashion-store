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

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        // Optionally validate token with backend
      } catch (err) {
        console.error("Error parsing user data:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // const response = await authAPI.login({ email, password });

      // Mock API response
      setTimeout(() => {
        // const mockUser = {
        //   id: "1",
        //   email,
        //   firstName: "Ahmed",
        //   lastName: "Ben Ali",
        //   role: "customer",
        //   avatar: null,
        //   createdAt: new Date().toISOString(),
        // };
        const mockUser = {
          id: "1",
          email,
          firstName: "Ahmed",
          lastName: "Ben Ali",
          role: "admin", // Change from 'customer' to 'admin' for testing
          avatar: null,
          createdAt: new Date().toISOString(),
        };

        const mockToken = "mock-jwt-token";

        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);

        toast.success("Welcome back!");
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast.error("Invalid email or password");
      setLoading(false);
      throw err;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // const response = await authAPI.register(userData);

      // Mock API response
      setTimeout(() => {
        const mockUser = {
          id: "2",
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: "customer",
          avatar: null,
          createdAt: new Date().toISOString(),
        };

        const mockToken = "mock-jwt-token-register";

        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);

        toast.success("Account created successfully!");
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      toast.error("Registration failed. Please try again.");
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      // In a real app, this would be an API call
      // await authAPI.logout();

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const updateProfile = async (data) => {
    try {
      // In a real app, this would be an API call
      // const response = await authAPI.updateProfile(data);

      const updatedUser = { ...user, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
      toast.error("Failed to update profile");
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      // In a real app, this would be an API call
      // await authAPI.forgotPassword(email);

      toast.success("Password reset link sent to your email");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
      toast.error("Failed to send reset email");
      throw err;
    }
  };

  const resetPassword = async (data) => {
    try {
      // In a real app, this would be an API call
      // await authAPI.resetPassword(data);

      toast.success("Password reset successfully");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      toast.error("Failed to reset password");
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
