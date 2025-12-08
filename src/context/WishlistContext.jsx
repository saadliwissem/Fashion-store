import React, { createContext, useState, useContext, useEffect } from "react";
import { wishlistAPI } from "../services/api";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        setWishlist(parsedWishlist);
      } catch (err) {
        console.error("Error parsing wishlist data:", err);
        localStorage.removeItem("wishlist");
      }
    }
  }, []);

  // Update localStorage when wishlist changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setLoading(true);

    try {
      // Check if product is already in wishlist
      const existingItem = wishlist.find((item) => item.id === product.id);

      if (existingItem) {
        toast("Item is already in your wishlist", {
          icon: "⭐",
          duration: 3000,
        });
        return;
      }

      const wishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        rating: product.rating,
        addedAt: new Date().toISOString(),
      };

      setWishlist((prev) => [...prev, wishlistItem]);
      toast.success("Added to wishlist!");
    } catch (err) {
      toast.error("Failed to add to wishlist");
      console.error("Add to wishlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (productId) => {
    setLoading(true);

    try {
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove from wishlist");
      console.error("Remove from wishlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  const moveToCart = (product, quantity = 1) => {
    // This function will be integrated with CartContext
    removeFromWishlist(product.id);
    // CartContext will handle adding to cart
    return { product, quantity };
  };

  const clearWishlist = () => {
    setLoading(true);

    try {
      setWishlist([]);
      localStorage.removeItem("wishlist");
      toast.success("Wishlist cleared");
    } catch (err) {
      toast.error("Failed to clear wishlist");
      console.error("Clear wishlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
