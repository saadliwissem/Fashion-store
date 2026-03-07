import React, { createContext, useContext, useState, useEffect } from "react";
import { enigmaAPI, chronicleAPI } from "../services/api";

const MysteryContext = createContext();

export const useMystery = () => {
  const context = useContext(MysteryContext);
  if (!context) {
    throw new Error("useMystery must be used within a MysteryProvider");
  }
  return context;
};

export const MysteryProvider = ({ children }) => {
  const [enigmas, setEnigmas] = useState([]);
  const [chronicles, setChronicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all enigmas
  const fetchEnigmas = async (params = {}) => {
    setLoading(true);
    try {
      const response = await enigmaAPI.getAll(params);
      setEnigmas(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch enigmas");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all chronicles
  const fetchChronicles = async (params = {}) => {
    setLoading(true);
    try {
      const response = await chronicleAPI.getAll(params);
      setChronicles(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch chronicles");
    } finally {
      setLoading(false);
    }
  };

  // Get single enigma
  const getEnigma = async (id) => {
    try {
      const response = await enigmaAPI.getOne(id);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  // Get single chronicle
  const getChronicle = async (id) => {
    try {
      const response = await chronicleAPI.getOne(id);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  return (
    <MysteryContext.Provider
      value={{
        enigmas,
        chronicles,
        loading,
        error,
        fetchEnigmas,
        fetchChronicles,
        getEnigma,
        getChronicle,
      }}
    >
      {children}
    </MysteryContext.Provider>
  );
};
