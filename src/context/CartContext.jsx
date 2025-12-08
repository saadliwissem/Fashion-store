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
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState({
    items: 0,
    quantity: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });

  // Initialize cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (err) {
        console.error("Error parsing cart data:", err);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Update localStorage and calculate totals when cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));

    // Calculate cart totals
    const items = cart.length;
    const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 99 ? 0 : 7.0;
    const tax = subtotal * 0.07; // 7% TVA
    const total = subtotal + shipping + tax;

    setCartTotal({
      items,
      quantity,
      subtotal,
      shipping,
      tax,
      total,
    });
  }, [cart]);

  const addToCart = async (product, quantity = 1) => {
    setLoading(true);

    try {
      // In a real app, this would be an API call
      // await cartAPI.addToCart(product.id, quantity);

      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        // Update quantity if item already exists
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
        toast.success(`Added ${quantity} more to cart`);
      } else {
        // Add new item to cart
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          size: product.size || "M",
          color: product.color || "Default",
          quantity,
          inStock: product.inStock !== false,
        };

        setCart((prevCart) => [...prevCart, cartItem]);
        toast.success("Added to cart!");
      }
    } catch (err) {
      toast.error("Failed to add item to cart");
      console.error("Add to cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would be an API call
      // await cartAPI.updateQuantity(itemId, quantity);

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );

      toast.success("Quantity updated");
    } catch (err) {
      toast.error("Failed to update quantity");
      console.error("Update quantity error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    setLoading(true);

    try {
      // In a real app, this would be an API call
      // await cartAPI.removeItem(itemId);

      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
      console.error("Remove item error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);

    try {
      // In a real app, this would be an API call
      // await cartAPI.clearCart();

      setCart([]);
      localStorage.removeItem("cart");
      toast.success("Cart cleared");
    } catch (err) {
      toast.error("Failed to clear cart");
      console.error("Clear cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getItemQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) => {
    return cart.some((item) => item.id === productId);
  };

  const value = {
    cart,
    cartTotal,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
