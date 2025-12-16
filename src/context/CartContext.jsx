import React, { createContext, useState, useContext, useEffect } from "react";
import { cartAPI } from "../services/api";
import toast from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    summary: {},
    _id: null,
    user: null,
  });
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [cartTotal, setCartTotal] = useState({
    items: 0,
    quantity: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });

  // Track loading states for individual items
  const [updatingItems, setUpdatingItems] = useState({});

  // Get auth token helper
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!getAuthToken();
  };

  // Fetch cart from backend on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    if (!isAuthenticated()) {
      // Load from localStorage for non-authenticated users
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
          updateCartTotals(parsedCart);
        } catch (err) {
          console.error("Error parsing cart data:", err);
          localStorage.removeItem("cart");
        }
      }
      setInitialized(true);
      return;
    }

    setLoading(true);
    try {
      const response = await cartAPI.getCart();
      // console.log("Cart API response:", response.data);

      // Set the entire cart object
      const cartData = response.data.cart || {
        items: [],
        summary: {},
        _id: null,
        user: null,
      };

      setCart(cartData);
      updateCartTotals(cartData);

      // Save backup to localStorage
      localStorage.setItem("cart_backup", JSON.stringify(cartData));
    } catch (err) {
      console.error("Error fetching cart:", err);

      // If unauthorized, clear token and fallback to localStorage
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            setCart(parsedCart);
            updateCartTotals(parsedCart);
          } catch (parseErr) {
            console.error("Error parsing cart data:", parseErr);
            localStorage.removeItem("cart");
          }
        }
      } else {
        toast.error("Failed to load cart");
      }

      // Set default empty cart
      setCart({
        items: [],
        summary: {},
        _id: null,
        user: null,
      });
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const updateCartTotals = (cartData) => {
    if (!cartData) {
      setCartTotal({
        items: 0,
        quantity: 0,
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
      });
      return;
    }

    // Use summary from backend if available
    if (cartData.summary) {
      setCartTotal({
        items: cartData.summary.itemCount || 0,
        quantity: cartData.summary.totalItems || 0,
        subtotal: cartData.summary.subtotal || 0,
        shipping: 0, // Will be calculated by backend
        tax: 0, // Will be calculated by backend
        total: cartData.summary.subtotal || 0,
      });
    } else {
      // Calculate manually
      const items = cartData.items || [];
      const subtotal = items.reduce((sum, item) => {
        const price = item.product?.price || item.price || 0;
        const quantity = item.quantity || 0;
        return sum + price * quantity;
      }, 0);

      const totalItems = items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );

      // For now, use simple calculations
      const shipping = subtotal > 99 ? 0 : 5.99;
      const tax = subtotal * 0.07; // 7% tax rate

      setCartTotal({
        items: items.length,
        quantity: totalItems,
        subtotal,
        shipping,
        tax,
        total: subtotal + shipping + tax,
      });
    }
  };

  // Optimistic update helper
  const optimisticUpdate = (itemId, updates) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) => {
        if (item._id === itemId || item.id === itemId) {
          return { ...item, ...updates };
        }
        return item;
      });

      return {
        ...prevCart,
        items: updatedItems,
      };
    });
  };

  const addToCart = async (product, quantity = 1, color, size) => {
    const productId = product.id || product._id;

    // Check if product is already in cart for optimistic update
    const existingItem = cart.items.find(
      (item) =>
        item.product?.id === productId || item.product?._id === productId
    );

    if (existingItem) {
      // If item exists, update quantity instead
      return updateQuantity(
        existingItem._id || existingItem.id,
        existingItem.quantity + quantity
      );
    }

    // Start loading for this specific action
    setUpdatingItems((prev) => ({ ...prev, [productId]: true }));

    try {
      if (isAuthenticated()) {
        // Optimistic update: Add to local state immediately
        const tempId = `temp-${Date.now()}`;
        const newItem = {
          _id: tempId,
          product: {
            _id: productId,
            name: product.name,
            price: product.price,
            images: product.images,
            slug: product.slug,
          },
          quantity,
          selectedColor: color || product.color,
          selectedSize: size || product.size,
          addedAt: new Date().toISOString(),
        };

        setCart((prevCart) => ({
          ...prevCart,
          items: [...prevCart.items, newItem],
        }));

        // Backend API call
        const response = await cartAPI.addToCart({
          productId,
          quantity,
          color: color || product.color,
          size: size || product.size,
        });

        // Replace temporary item with backend item
        const cartData = response.data.cart;
        setCart(cartData);
        updateCartTotals(cartData);
        toast.success("Added to cart!");

        return cartData;
      } else {
        // Local storage fallback
        const newItem = {
          id: Date.now(), // Temporary ID
          product: {
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image || product.images?.[0],
            slug: product.slug,
          },
          quantity,
          selectedColor: color || product.color,
          selectedSize: size || product.size,
          addedAt: new Date().toISOString(),
        };

        const updatedCart = {
          ...cart,
          items: [...cart.items, newItem],
        };

        setCart(updatedCart);
        updateCartTotals(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toast.success("Added to cart!");

        return updatedCart;
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to add to cart";
      toast.error(errorMessage);

      // Rollback optimistic update on error
      if (isAuthenticated()) {
        setCart((prevCart) => ({
          ...prevCart,
          items: prevCart.items.filter((item) => !item._id.startsWith("temp-")),
        }));
      }

      if (err.response?.status === 401) {
        toast.error("Please login to add to cart");
      }

      throw err;
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem(itemId);
      return;
    }

    // Start loading for this specific item
    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));

    // Optimistic update: Update local state immediately
    const previousCart = { ...cart };
    optimisticUpdate(itemId, { quantity: newQuantity });
    updateCartTotals({
      ...cart,
      items: cart.items.map((item) =>
        item._id === itemId || item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      ),
    });

    try {
      if (isAuthenticated()) {
        // Backend API call
        const response = await cartAPI.updateQuantity(itemId, newQuantity);

        const cartData = response.data.cart;
        setCart(cartData);
        updateCartTotals(cartData);

        // Don't show toast for quantity updates unless there's an error
      } else {
        // Local storage fallback
        const updatedItems = cart.items.map((item) => {
          if (item.id === itemId || item._id === itemId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });

        const updatedCart = {
          ...cart,
          items: updatedItems,
        };

        setCart(updatedCart);
        updateCartTotals(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }
    } catch (err) {
      console.error("Update quantity error:", err);

      // Rollback optimistic update on error
      setCart(previousCart);
      updateCartTotals(previousCart);

      const errorMessage =
        err.response?.data?.message || "Failed to update quantity";
      toast.error(errorMessage);
      throw err;
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    // Start loading for this specific item
    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));

    // Optimistic update: Remove from local state immediately
    const previousCart = { ...cart };
    const updatedItems = cart.items.filter(
      (item) => !(item._id === itemId || item.id === itemId)
    );
    const updatedCart = { ...cart, items: updatedItems };

    setCart(updatedCart);
    updateCartTotals(updatedCart);

    try {
      if (isAuthenticated()) {
        // Backend API call
        const response = await cartAPI.removeItem(itemId);

        const cartData = response.data.cart;
        setCart(cartData);
        updateCartTotals(cartData);
        toast.success("Item removed from cart");
      } else {
        // Local storage fallback
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toast.success("Item removed from cart");
      }
    } catch (err) {
      console.error("Remove item error:", err);

      // Rollback optimistic update on error
      setCart(previousCart);
      updateCartTotals(previousCart);

      const errorMessage =
        err.response?.data?.message || "Failed to remove item";
      toast.error(errorMessage);
      throw err;
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const clearCart = async () => {
    setLoading(true);

    try {
      if (isAuthenticated()) {
        // Backend API call
        const response = await cartAPI.clearCart();

        const cartData = response.data.cart;
        setCart(cartData);
        updateCartTotals(cartData);
        toast.success("Cart cleared");

        return cartData;
      } else {
        // Local storage fallback
        const updatedCart = {
          ...cart,
          items: [],
        };

        setCart(updatedCart);
        updateCartTotals(updatedCart);
        localStorage.removeItem("cart");
        localStorage.removeItem("cart_backup");
        toast.success("Cart cleared");

        return updatedCart;
      }
    } catch (err) {
      console.error("Clear cart error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to clear cart";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (code) => {
    setLoading(true);

    try {
      if (isAuthenticated()) {
        // Backend API call
        const response = await cartAPI.applyCoupon(code);

        const cartData = response.data.cart;
        setCart(cartData);
        updateCartTotals(cartData);
        toast.success("Coupon applied successfully");

        return cartData;
      } else {
        // For non-authenticated users, we can't apply coupons
        toast.error("Please login to apply coupons");
        throw new Error("Login required");
      }
    } catch (err) {
      console.error("Apply coupon error:", err);
      const errorMessage = err.response?.data?.message || "Invalid coupon code";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getItemQuantity = (productId) => {
    if (!cart?.items || cart.items.length === 0) return 0;

    const item = cart.items.find(
      (item) =>
        item.product?.id === productId || item.product?._id === productId
    );
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) => {
    if (!cart?.items || cart.items.length === 0) return false;

    return cart.items.some(
      (item) =>
        item.product?.id === productId || item.product?._id === productId
    );
  };

  const isItemUpdating = (itemId) => {
    return updatingItems[itemId] || false;
  };

  const mergeCarts = async () => {
    if (!isAuthenticated()) return;

    const localCart = localStorage.getItem("cart");
    if (!localCart) return;

    try {
      const parsedLocalCart = JSON.parse(localCart);

      // Add local cart items to backend
      for (const item of parsedLocalCart.items || []) {
        try {
          await cartAPI.addToCart({
            productId: item.product.id || item.product._id,
            quantity: item.quantity,
            color: item.selectedColor,
            size: item.selectedSize,
          });
        } catch (err) {
          console.error(`Failed to add item ${item.id} to backend cart:`, err);
        }
      }

      // Clear local storage after successful merge
      localStorage.removeItem("cart");

      // Refresh cart
      fetchCart();
    } catch (err) {
      console.error("Error merging carts:", err);
    }
  };

  // Call merge when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated() && initialized) {
      mergeCarts();
    }
  }, [isAuthenticated(), initialized]);

  const value = {
    cart: cart.items || [],
    cartItems: cart.items || [],
    cartData: cart,
    cartTotal,
    loading, // This is only for initial load and clear cart
    updatingItems, // Per-item loading states
    initialized,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    getItemQuantity,
    isInCart,
    isItemUpdating, // Check if specific item is updating
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
