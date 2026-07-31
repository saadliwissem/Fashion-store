// pages/Home.jsx
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
  Loader,
} from "lucide-react";
import ProductCard from "../components/products/ProductCard";
import { homeAPI } from "../services/homeAPI";
import { productsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchHomeSettings();
    fetchProducts();
  }, []);

  const fetchHomeSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await homeAPI.getSettings();
      setSettings(response.data.data);
    } catch (error) {
      console.error("Error fetching home settings:", error);
      toast.error("Failed to load home settings");
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getProducts({
        featured: true,
        limit: 4,
      });

      let productsData = [];
      if (response.data?.data) {
        productsData = response.data.data;
      } else if (response.data?.products) {
        productsData = response.data.products;
      } else if (Array.isArray(response.data)) {
        productsData = response.data;
      }
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Fallback if settings not loaded
  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            Failed to load content. Please refresh.
          </p>
        </div>
      </div>
    );
  }

  const { hero, mysteries, features, cta } = settings;

  // Helper to get icon component
  const getIconComponent = (iconName, className = "w-8 h-8") => {
    const icons = {
      Truck: <Truck className={className} />,
      Shield: <Shield className={className} />,
      Star: <Star className={className} />,
      TrendingUp: <TrendingUp className={className} />,
      Users: <Users className={className} />,
      Puzzle: <Puzzle className={className} />,
      Sparkles: <Sparkles className={className} />,
    };
    return icons[iconName] || <Star className={className} />;
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                {hero?.badge && (
                  <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold mb-4">
                    {hero.badge}
                  </span>
                )}
                <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                  {hero?.title?.split(" ").map((word, index, array) => {
                    const isLast = index === array.length - 1;
                    const isSecondLast = index === array.length - 2;

                    // If it's the last word, put it on a new line with gradient
                    if (isLast) {
                      return (
                        <span
                          key={index}
                          className="block bg-gradient-to-r from-primary-600 to-pink-500 bg-clip-text text-transparent"
                        >
                          {word}
                        </span>
                      );
                    }
                    // If it's the second last word, also put it on the gradient line
                    if (isSecondLast) {
                      return (
                        <span key={index}>
                          <span className="bg-gradient-to-r from-primary-600 to-pink-500 bg-clip-text text-transparent">
                            {word}
                          </span>{" "}
                        </span>
                      );
                    }
                    // All other words stay on the same line
                    return <span key={index}>{word} </span>;
                  })}
                </h1>
                <p className="text-xl text-gray-600 mb-8">{hero?.subtitle}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={hero?.buttons?.primary?.link || "/shop"}>
                  <Button size="large" className="group">
                    {hero?.buttons?.primary?.text || "Shop Now"}
                    <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link
                  to={hero?.buttons?.secondary?.link || "/shop?category=new"}
                >
                  <Button variant="outline" size="large">
                    {hero?.buttons?.secondary?.text || "New Arrivals"}
                  </Button>
                </Link>
              </div>

              {hero?.stats && (
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {hero.stats.customers?.value || "10K+"}
                    </div>
                    <div className="text-gray-600">
                      {hero.stats.customers?.label || "Happy Customers"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {hero.stats.products?.value || "500+"}
                    </div>
                    <div className="text-gray-600">
                      {hero.stats.products?.label || "Premium Products"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {hero.stats.support?.value || "24/7"}
                    </div>
                    <div className="text-gray-600">
                      {hero.stats.support?.label || "Customer Support"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src={hero?.image?.url || "/placeholder-hero.jpg"}
                  alt={hero?.image?.alt || "Hero Image"}
                  className="rounded-3xl shadow-2xl w-full h-auto"
                  onError={(e) => {
                    e.target.src = "/placeholder-hero.jpg";
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl opacity-20 blur-2xl"></div>
              <div className="absolute -top-6 -right-6 w-64 h-64 bg-gradient-to-br from-primary-500 to-pink-500 rounded-3xl opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Puzzle Mysteries Section */}
      {mysteries?.enabled && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              {mysteries.badge && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-semibold mb-4">
                  <span>{mysteries.badge}</span>
                </div>
              )}
              {/* Mysteries Title */}
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                {mysteries.title?.split(" ").map((word, index, array) => {
                  if (index === array.length - 1) {
                    return (
                      <span
                        key={index}
                        className="block bg-gradient-to-r from-primary-600 to-pink-500 bg-clip-text text-transparent"
                      >
                        {word}
                      </span>
                    );
                  }
                  if (index === array.length - 2) {
                    return (
                      <span key={index}>
                        <span className="bg-gradient-to-r from-primary-600 to-pink-500 bg-clip-text text-transparent">
                          {word}
                        </span>{" "}
                      </span>
                    );
                  }
                  return <span key={index}>{word} </span>;
                })}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {mysteries.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Mystery Preview Card */}
              <div className="rounded-3xl overflow-hidden border border-gray-200 group hover:shadow-2xl transition-all duration-300">
                <div className="h-48 overflow-hidden">
                  <img
                    src={
                      mysteries.featuredMystery?.image?.url ||
                      "/placeholder-mystery.jpg"
                    }
                    alt={
                      mysteries.featuredMystery?.image?.alt ||
                      "Featured Mystery"
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = "/placeholder-mystery.jpg";
                    }}
                  />
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        mysteries.featuredMystery?.badgeColor ||
                        "bg-primary-100 text-primary-700"
                      }`}
                    >
                      {mysteries.featuredMystery?.badge || "Active Mystery"}
                    </span>
                    {mysteries.featuredMystery?.stats && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                        {mysteries.featuredMystery.stats.claimed || 0} Keepers
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {mysteries.featuredMystery?.title || "Featured Mystery"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {mysteries.featuredMystery?.description}
                  </p>

                  {mysteries.featuredMystery?.stats && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-900">
                            {mysteries.featuredMystery.stats.fragments || 0}
                          </div>
                          <div className="text-xs text-gray-500">Fragments</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-emerald-600">
                            {mysteries.featuredMystery.stats.claimed || 0}
                          </div>
                          <div className="text-xs text-gray-500">Claimed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-amber-600">
                            {mysteries.featuredMystery.stats.available || 0}
                          </div>
                          <div className="text-xs text-gray-500">Available</div>
                        </div>
                      </div>

                      <Link
                        to={mysteries.featuredMystery?.link || "/mysteries"}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-pink-500 text-white font-medium hover:shadow-lg transition-all group-hover:scale-105"
                      >
                        <span>🧩</span>
                        Explore
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* How It Works */}
              <div className="space-y-6">
                {mysteries.steps?.map((step, index) => (
                  <div
                    key={index}
                    className="p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${
                          step.bgColor || "from-primary-100 to-primary-200"
                        } rounded-2xl flex items-center justify-center`}
                      >
                        <span className="text-2xl">{step.icon || "🔍"}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-1">{step.title}</h4>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link
                to={mysteries.ctaButton?.link || "/mysteries"}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-pink-500 text-white font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <span className="w-5 h-5">🧩</span>
                {mysteries.ctaButton?.text || "Explore All Mysteries"}
                <span className="w-5 h-5">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features
              ?.filter((f) => f.enabled !== false)
              .map((feature, index) => (
                <div key={index} className="glass-card p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${
                      feature.bgColor || "from-primary-100 to-primary-200"
                    } rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  >
                    {getIconComponent(feature.icon, "w-8 h-8")}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
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
                <span className="block text-primary-600">Products</span>
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
            {loading ? (
              <div className="col-span-4 flex justify-center py-12">
                <Loader className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-gray-600">
                No featured products available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`py-20 bg-gradient-to-r ${
          cta?.bgGradient || "from-primary-600 to-black"
        } rounded-3xl mx-4 lg:mx-8`}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {cta?.title || "Ready to Transform Your Wardrobe?"}
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            {cta?.subtitle ||
              "Join thousands of satisfied customers who have elevated their style with PUZZLE"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={cta?.buttons?.primary?.link || "/shop"}>
              <Button
                variant={cta?.buttons?.primary?.variant || "secondary"}
                size="large"
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                {cta?.buttons?.primary?.text || "Start Shopping"}
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to={cta?.buttons?.secondary?.link || "/register"}>
                <Button
                  variant={cta?.buttons?.secondary?.variant || "outline"}
                  size="large"
                  className="border-white text-white hover:bg-white/10"
                >
                  {cta?.buttons?.secondary?.text || "Create Account"}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
