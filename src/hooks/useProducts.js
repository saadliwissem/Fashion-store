import { useState, useEffect, useCallback } from "react";
import { productsAPI } from "../services/api";
import toast from "react-hot-toast";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // const response = await productsAPI.getAll(params);

      // Mock products data
      setTimeout(() => {
        const mockProducts = [
          {
            id: 1,
            name: "Premium Cotton T-Shirt",
            price: 29.99,
            originalPrice: 39.99,
            image:
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
            category: "men",
            rating: 4.8,
            isNew: true,
            tags: ["best-seller", "cotton"],
            inStock: true,
          },
          // Add more mock products as needed
        ];

        setProducts(mockProducts);
        setFeaturedProducts(mockProducts.slice(0, 4));
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
      toast.error("Failed to load products");
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // const response = await productsAPI.getById(id);

      // Mock product data
      setTimeout(() => {
        const mockProduct = {
          id: 1,
          name: "Premium Cotton T-Shirt",
          price: 29.99,
          originalPrice: 39.99,
          description:
            "Experience ultimate comfort with our premium cotton t-shirt.",
          category: "men",
          rating: 4.8,
          reviewCount: 124,
          tags: ["cotton", "organic", "casual", "best-seller"],
          images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop",
            "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&h=1000&fit=crop",
          ],
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          colors: [
            { name: "Navy Blue", value: "#1e3a8a" },
            { name: "Charcoal Gray", value: "#374151" },
          ],
          details: [
            "100% Organic Cotton",
            "Machine washable",
            "Slim fit design",
          ],
          inStock: true,
        };

        setProducts([mockProduct]);
        setLoading(false);
        return mockProduct;
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch product");
      toast.error("Failed to load product details");
      setLoading(false);
      throw err;
    }
  }, []);

  const searchProducts = useCallback(
    async (query) => {
      setLoading(true);
      setError(null);

      try {
        // In a real app, this would be an API call
        // const response = await productsAPI.search(query);

        // Mock search results
        setTimeout(() => {
          const mockResults = products.filter(
            (product) =>
              product.name.toLowerCase().includes(query.toLowerCase()) ||
              product.tags.some((tag) =>
                tag.toLowerCase().includes(query.toLowerCase())
              )
          );

          setProducts(mockResults);
          setLoading(false);
        }, 300);
      } catch (err) {
        setError(err.response?.data?.message || "Search failed");
        toast.error("Search failed");
        setLoading(false);
      }
    },
    [products]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    featuredProducts,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    searchProducts,
    refetch: fetchProducts,
  };
};
