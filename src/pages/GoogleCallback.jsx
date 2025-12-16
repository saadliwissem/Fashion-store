import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");
        const error = params.get("error");
        const state = params.get("state");

        if (error) {
          toast.error(`Google authentication failed: ${error}`);
          navigate(state === "register" ? "/register" : "/login");
          return;
        }

        if (!code) {
          toast.error("No authorization code received");
          navigate(state === "register" ? "/register" : "/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/auth/google/callback",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to authenticate with Google");
        }

        if (data.success) {
          // Store authentication data
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);

          // Get redirect path
          const redirectPath =
            localStorage.getItem("redirectAfterLogin") ||
            (state === "register" ? "/dashboard" : "/");
          localStorage.removeItem("redirectAfterLogin");

          toast.success("Successfully logged in with Google!");
          navigate(redirectPath);
        } else {
          toast.error(data.message || "Authentication failed");
          navigate(state === "register" ? "/register" : "/login");
        }
      } catch (error) {
        console.error("Google callback error:", error);

        // Specific error handling
        if (
          error.message.includes("invalid_grant") ||
          error.message.includes("Bad Request")
        ) {
          toast.error("Authorization expired. Please try signing in again.");
        } else {
          toast.error("Authentication failed. Please try again.");
        }

        // Check state to redirect appropriately
        const params = new URLSearchParams(location.search);
        const state = params.get("state");
        navigate(state === "register" ? "/register" : "/login");
      }
    };

    handleGoogleCallback();
  }, [location, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">
          Completing Google Authentication...
        </h2>
        <p className="text-gray-600 mt-2">Please wait while we sign you in.</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
