import { useState, useEffect, useCallback } from "react";
import { productsAPI } from "../services/api";
import toast from "react-hot-toast";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [productsOnSale, setProductsOnSale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await productsAPI.getAll(params);
      setProducts(response.data.products);
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch products";
      setError(errorMessage);
      toast.error("Failed to load products");
      setLoading(false);
      throw err;
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await productsAPI.getById(id);
      setLoading(false);
      return response.data.product;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch product";
      setError(errorMessage);
      toast.error("Failed to load product details");
      setLoading(false);
      throw err;
    }
  }, []);

  const fetchProductBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);

    try {
      const response = await productsAPI.getBySlug(slug);
      setLoading(false);
      return response.data.product;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch product";
      setError(errorMessage);
      toast.error("Failed to load product details");
      setLoading(false);
      throw err;
    }
  }, []);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const response = await productsAPI.getFeatured();
      setFeaturedProducts(response.data.products);
    } catch (err) {
      console.error("Failed to fetch featured products:", err);
    }
  }, []);

  const fetchNewArrivals = useCallback(async () => {
    try {
      const response = await productsAPI.getNewArrivals();
      setNewArrivals(response.data.products);
    } catch (err) {
      console.error("Failed to fetch new arrivals:", err);
    }
  }, []);

  const fetchProductsOnSale = useCallback(async () => {
    try {
      const response = await productsAPI.getOnSale();
      setProductsOnSale(response.data.products);
    } catch (err) {
      console.error("Failed to fetch products on sale:", err);
    }
  }, []);

  const searchProducts = useCallback(async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await productsAPI.search(query);
      setProducts(response.data.products);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Search failed";
      setError(errorMessage);
      toast.error("Search failed");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      await fetchProducts({ limit: 8 });
      await fetchFeaturedProducts();
      await fetchNewArrivals();
      await fetchProductsOnSale();
    };

    fetchInitialData();
  }, [
    fetchProducts,
    fetchFeaturedProducts,
    fetchNewArrivals,
    fetchProductsOnSale,
  ]);

  return {
    products,
    featuredProducts,
    newArrivals,
    productsOnSale,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    fetchProductBySlug,
    searchProducts,
    refetch: fetchProducts,
  };
};
