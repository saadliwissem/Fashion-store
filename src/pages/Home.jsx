import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import {
  ArrowRight,
  Star,
  Shield,
  TrendingUp,
  Truck,
  Puzzle,
  Sparkles,
  Users,
} from "lucide-react";
import ProductCard from "../components/products/ProductCard";
import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      let url = `${API_BASE_URL}/products/featured`;

      // Make API call
      const response = await axios.get(url);

      setProducts(response.data.products || response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fade-in ">
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
      {/* Puzzle Mysteries Section - FIXED VERSION */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold mb-4">
              <span>✨</span>
              <span>Exclusive Experience</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Join Our
              <span className="block bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Puzzle Mysteries
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Become part of an exclusive community solving epic fashion
              mysteries. Claim unique fragments, collaborate with keepers, and
              earn legendary rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Mystery Preview Card - REMOVED bg-white and gradient overlay */}
            <div className="rounded-3xl overflow-hidden border border-gray-200 group hover:shadow-2xl transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Anime Chronicles Mystery"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* REMOVED: This gradient overlay div that could affect page background */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" /> */}
              </div>

              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                    Active Mystery
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                    32 Keepers
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Anime Chronicles
                </h3>
                <p className="text-gray-600 mb-6">
                  Unravel hidden truths behind legendary anime worlds. Claim
                  fragments, solve mysteries, and earn exclusive rewards.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">9</div>
                      <div className="text-xs text-gray-500">Fragments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-emerald-600">
                        3
                      </div>
                      <div className="text-xs text-gray-500">Claimed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-amber-600">6</div>
                      <div className="text-xs text-gray-500">Available</div>
                    </div>
                  </div>

                  <Link
                    to="/mysteries"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium hover:shadow-lg transition-all group-hover:scale-105"
                  >
                    <span>🧩</span>
                    Explore
                  </Link>
                </div>
              </div>
            </div>

            {/* How It Works - REMOVED glass-card class */}
            <div className="space-y-6">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">
                      Discover Mysteries
                    </h4>
                    <p className="text-gray-600">
                      Browse exclusive puzzle collections
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Each mystery contains unique fragments that form part of a
                  larger story. Explore themes like Anime Chronicles, Mythology
                  Enigmas, and more.
                </p>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                    <span className="w-6 h-6">👥</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">
                      Claim & Collaborate
                    </h4>
                    <p className="text-gray-600">
                      Join keepers solving puzzles together
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Claim unique fragments, connect with other keepers, and work
                  together to unravel mysteries. Each fragment is globally
                  unique to its owner.
                </p>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center">
                    <span className="w-6 h-6">✨</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Earn Rewards</h4>
                    <p className="text-gray-600">
                      Unlock exclusive prizes and recognition
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Solve mysteries to earn limited edition artifacts, digital
                  content, special recognition, and early access to future
                  releases.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/mysteries"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <span className="w-5 h-5">🧩</span>
              Explore All Mysteries
              <span className="w-5 h-5">→</span>
            </Link>
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
              <p className="text-gray-600">
                Free delivery on orders over 300 TND
              </p>
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
            {loading
              ? "Loading products..."
              : products.map((product) => (
                  <ProductCard key={product._id} product={product} />
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
            with DAR ENNAR
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
