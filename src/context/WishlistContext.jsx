import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
  const [initialized, setInitialized] = useState(false);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Get auth header
  const getAuthHeader = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!getAuthToken();
  };

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    if (!isAuthenticated()) {
      // If not authenticated, use localStorage as fallback
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
      setInitialized(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/wishlist`, {
        headers: getAuthHeader(),
      });

      // Transform backend data to frontend format
      const transformedWishlist =
        response.data.wishlist?.items?.map((item) => ({
          id: item.product?._id,
          _id: item._id,
          name: item.product?.name,
          price: item.product?.price,
          originalPrice: item.product?.originalPrice,
          image: item.product?.images?.[0] || item.product?.image,
          category: item.product?.category?.name || item.product?.category,
          rating: item.product?.rating || item.product?.averageRating,
          addedAt: item.addedAt,
          slug: item.product?.slug,
          status: item.product?.status,
        })) || [];

      setWishlist(transformedWishlist);
    } catch (err) {
      console.error("Error fetching wishlist:", err);

      // If unauthorized, clear token and fallback to localStorage
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
          try {
            const parsedWishlist = JSON.parse(savedWishlist);
            setWishlist(parsedWishlist);
          } catch (parseErr) {
            console.error("Error parsing wishlist data:", parseErr);
            localStorage.removeItem("wishlist");
          }
        }
      } else {
        toast.error("Failed to load wishlist");
      }
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  // Initialize wishlist on component mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  // Sync localStorage with backend for authenticated users
  useEffect(() => {
    if (isAuthenticated() && wishlist.length > 0) {
      // Save a copy to localStorage as backup
      localStorage.setItem("wishlist_backup", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  // Merge local wishlist with backend when user logs in
  const mergeWishlists = async () => {
    if (!isAuthenticated()) return;

    const localWishlist = localStorage.getItem("wishlist");
    if (!localWishlist) return;

    try {
      const parsedLocalWishlist = JSON.parse(localWishlist);

      // Get current backend wishlist items
      const backendItems = wishlist.map((item) => item.id);

      // Find items in local storage that aren't in backend
      const itemsToAdd = parsedLocalWishlist.filter(
        (item) => !backendItems.includes(item.id)
      );

      // Add missing items to backend
      for (const item of itemsToAdd) {
        try {
          await axios.post(
            `${API_BASE_URL}/wishlist/add`,
            { productId: item.id },
            { headers: getAuthHeader() }
          );
        } catch (err) {
          console.error(
            `Failed to add item ${item.id} to backend wishlist:`,
            err
          );
        }
      }

      // Clear local storage after successful merge
      localStorage.removeItem("wishlist");

      // Refresh wishlist
      fetchWishlist();
    } catch (err) {
      console.error("Error merging wishlists:", err);
    }
  };

  // Call merge when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated() && initialized) {
      mergeWishlists();
    }
  }, [isAuthenticated(), initialized]);

  const addToWishlist = async (product) => {
    setLoading(true);

    try {
      if (isAuthenticated()) {
        // Backend API call
        const response = await axios.post(
          `${API_BASE_URL}/wishlist/add`,
          { productId: product.id || product._id },
          { headers: getAuthHeader() }
        );

        // Update state with backend response
        const newItem = response.data.wishlist.items.find(
          (item) => item.product._id === (product.id || product._id)
        );

        if (newItem) {
          const transformedItem = {
            id: newItem.product._id,
            _id: newItem._id,
            name: newItem.product.name,
            price: newItem.product.price,
            originalPrice: newItem.product.originalPrice,
            image: newItem.product.images?.[0] || newItem.product.image,
            category:
              newItem.product.category?.name || newItem.product.category,
            rating: newItem.product.rating || newItem.product.averageRating,
            addedAt: newItem.addedAt,
            slug: newItem.product.slug,
            status: newItem.product.status,
          };

          setWishlist((prev) => [...prev, transformedItem]);
        }
      } else {
        // Local storage fallback
        const existingItem = wishlist.find((item) => item.id === product.id);

        if (existingItem) {
          toast("Item is already in your wishlist", {
            icon: "⭐",
            duration: 3000,
          });
          return;
        }

        const wishlistItem = {
          id: product.id || product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image || product.images?.[0],
          category: product.category?.name || product.category,
          rating: product.rating || product.averageRating,
          addedAt: new Date().toISOString(),
          slug: product.slug,
        };

        setWishlist((prev) => [...prev, wishlistItem]);
        localStorage.setItem(
          "wishlist",
          JSON.stringify([...wishlist, wishlistItem])
        );
      }

      toast.success("Added to wishlist!");
    } catch (err) {
      console.error("Add to wishlist error:", err);

      if (err.response?.status === 401) {
        toast.error("Please login to add to wishlist");
      } else if (
        err.response?.status === 400 &&
        err.response?.data?.message === "Product already in wishlist"
      ) {
        toast("Item is already in your wishlist", {
          icon: "⭐",
          duration: 3000,
        });
      } else {
        toast.error(err.response?.data?.message || "Failed to add to wishlist");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    setLoading(true);

    try {
      if (isAuthenticated()) {
        // Backend API call
        await axios.delete(`${API_BASE_URL}/wishlist/${productId}`, {
          headers: getAuthHeader(),
        });
      }

      // Update local state
      setWishlist((prev) => prev.filter((item) => item.id !== productId));

      // Update localStorage for non-authenticated users
      if (!isAuthenticated()) {
        const updatedWishlist = wishlist.filter(
          (item) => item.id !== productId
        );
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      }

      toast.success("Removed from wishlist");
    } catch (err) {
      console.error("Remove from wishlist error:", err);
      toast.error(
        err.response?.data?.message || "Failed to remove from wishlist"
      );
    } finally {
      setLoading(false);
    }
  };

  const moveToCart = async (product, quantity = 1) => {
    setLoading(true);

    try {
      if (isAuthenticated()) {
        // Backend API call
        await axios.post(
          `${API_BASE_URL}/wishlist/${product.id}/move-to-cart`,
          { quantity },
          { headers: getAuthHeader() }
        );

        // Remove from local wishlist
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));
        toast.success("Moved to cart!");

        return { product, quantity };
      } else {
        // For non-authenticated users, just remove from wishlist
        // Cart will be handled by CartContext
        removeFromWishlist(product.id);
        return { product, quantity };
      }
    } catch (err) {
      console.error("Move to cart error:", err);
      toast.error(err.response?.data?.message || "Failed to move to cart");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    setLoading(true);

    try {
      if (isAuthenticated()) {
        // Backend API call
        await axios.delete(`${API_BASE_URL}/wishlist/clear`, {
          headers: getAuthHeader(),
        });
      }

      // Clear local state
      setWishlist([]);

      // Clear localStorage
      localStorage.removeItem("wishlist");
      localStorage.removeItem("wishlist_backup");

      toast.success("Wishlist cleared");
    } catch (err) {
      console.error("Clear wishlist error:", err);
      toast.error(err.response?.data?.message || "Failed to clear wishlist");
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

  const refreshWishlist = () => {
    fetchWishlist();
  };

  const value = {
    wishlist,
    loading,
    initialized,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
    refreshWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
