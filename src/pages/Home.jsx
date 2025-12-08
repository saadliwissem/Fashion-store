import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { ArrowRight, Star, Shield, TrendingUp, Truck } from "lucide-react";
import ProductCard from "../components/products/ProductCard";

// Mock data - will be replaced with real API data
const featuredProducts = [
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
  },
  {
    id: 2,
    name: "Elegant Summer Dress",
    price: 59.99,
    originalPrice: 79.99,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop",
    category: "women",
    rating: 4.9,
    isSale: true,
  },
  {
    id: 3,
    name: "Designer Denim Jacket",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w-400&h=500&fit=crop",
    category: "women",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Classic Polo Shirt",
    price: 34.99,
    originalPrice: 44.99,
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop",
    category: "men",
    rating: 4.6,
    isNew: true,
  },
];

const Home = () => {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold mb-4">
                  New Summer Collection 2024
                </span>
                <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                  Elevate Your
                  <span className="block bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    Style Game
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Discover premium clothing that combines comfort, style, and
                  sustainability. Shop the latest trends at unbeatable prices.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button size="large" className="group">
                    Shop Now
                    <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link to="/shop?category=new">
                  <Button variant="outline" size="large">
                    New Arrivals
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">10K+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-gray-600">Premium Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">24/7</div>
                  <div className="text-gray-600">Customer Support</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=700&fit=crop"
                  alt="Fashion Model"
                  className="rounded-3xl shadow-2xl w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl opacity-20 blur-2xl"></div>
              <div className="absolute -top-6 -right-6 w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Free Shipping</h3>
              <p className="text-gray-600">Free delivery on orders over $99</p>
            </div>

            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment processing</p>
            </div>

            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Premium Quality</h3>
              <p className="text-gray-600">
                High-quality materials & craftsmanship
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Featured
                <span className="block text-purple-600">Products</span>
              </h2>
              <p className="text-gray-600">
                Handpicked collection of our best items
              </p>
            </div>
            <Link to="/shop">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl mx-4 lg:mx-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Wardrobe?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have elevated their style
            with FashionStore
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button
                variant="secondary"
                size="large"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Start Shopping
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="outline"
                size="large"
                className="border-white text-white hover:bg-white/10"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
