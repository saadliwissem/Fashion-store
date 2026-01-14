import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [primaryColor, setPrimaryColor] = useState("purple");
  const [fontSize, setFontSize] = useState("medium");

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedPrimaryColor = localStorage.getItem("primaryColor") || "yellow";
    const savedFontSize = localStorage.getItem("fontSize") || "medium";

    setTheme(savedTheme);
    setPrimaryColor(savedPrimaryColor);
    setFontSize(savedFontSize);

    // Apply theme to document
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.setAttribute("data-color", savedPrimaryColor);
    document.documentElement.setAttribute("data-font-size", savedFontSize);
  }, []);

  // Update document when theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-color", primaryColor);
    localStorage.setItem("primaryColor", primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    document.documentElement.setAttribute("data-font-size", fontSize);
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setPrimaryColorScheme = (color) => {
    const validColors = ["purple", "blue", "green", "red", "orange"];
    if (validColors.includes(color)) {
      setPrimaryColor(color);
    }
  };

  const setFontSizeScheme = (size) => {
    const validSizes = ["small", "medium", "large"];
    if (validSizes.includes(size)) {
      setFontSize(size);
    }
  };

  const value = {
    theme,
    primaryColor,
    fontSize,
    toggleTheme,
    setPrimaryColor: setPrimaryColorScheme,
    setFontSize: setFontSizeScheme,
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
