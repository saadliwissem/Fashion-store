import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Sparkles,
  Filter,
  Search,
  TrendingUp,
  Users,
  Clock,
  Eye,
} from "lucide-react";
import { EnigmaGrid, MysteryReveal } from "../components/mysteries";
import { enigmaAPI } from "../services/api";
import toast from "react-hot-toast";

const EnigmasPage = () => {
  const [showHero, setShowHero] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [enigmas, setEnigmas] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [featuredEnigma, setFeaturedEnigma] = useState(null);

  useEffect(() => {
    fetchEnigmas();
    fetchStats();
  }, []);

  const fetchEnigmas = async () => {
    try {
      const params = {};
      if (activeFilter !== "all") {
        params.status = activeFilter === "featured" ? undefined : activeFilter;
        if (activeFilter === "featured") params.featured = true;
      }
      if (searchQuery) params.search = searchQuery;

      const response = await enigmaAPI.getAll(params);
      setEnigmas(response.data.data);
      console.log(response.data.data);

      // Set featured enigma for hero
      const featured = response.data.data.find((e) => e.featured);
      if (featured) setFeaturedEnigma(featured);
    } catch (error) {
      toast.error("Failed to load enigmas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await enigmaAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  useEffect(() => {
    fetchEnigmas();
  }, [activeFilter, searchQuery]);

  // Hide hero after 10 seconds of inactivity
  // useEffect(() => {
  //   if (!showHero) return;

  //   const timer = setTimeout(() => {
  //     setShowHero(false);
  //   }, 10000);

  //   return () => clearTimeout(timer);
  // }, [showHero]);

  if (loading && !enigmas.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-300 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Unraveling mysteries...</div>
        </div>
      </div>
    );
  }

  const filteredEnigmas = enigmas; // Already filtered by API

  return (
    <>
      <Helmet>
        <title>Mysteries | Puzzle - Exclusive Collaborative Fashion</title>
        <meta
          name="description"
          content="Join exclusive puzzle mysteries. Claim unique fragments, collaborate with keepers, and solve epic mysteries for legendary rewards."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Hero Section - Only shows on first visit */}
        {showHero && featuredEnigma && (
          <div className="relative">
            <MysteryReveal enigma={featuredEnigma} />
            <button
              onClick={() => setShowHero(false)}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full text-sm text-gray-700 hover:text-gray-900 hover:border-gray-400 transition-all z-10 shadow-sm"
            >
              Skip to Mysteries
            </button>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 border border-primary-200 mb-4">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">
                Exclusive Mysteries
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Discover Arcane{" "}
              <span className="text-primary-600">Mysteries</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join exclusive puzzle collections. Claim unique fragments,
              collaborate with fellow keepers, and unravel epic mysteries for
              legendary rewards.
            </p>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-100 rounded-xl">
                    <Eye className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.totalEnigmas}
                    </div>
                    <div className="text-sm text-gray-600">
                      Active Mysteries
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary-100 rounded-xl">
                    <Users className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.totalKeepers}
                    </div>
                    <div className="text-sm text-gray-600">
                      Keeper Guardians
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.fragmentsClaimed}/{stats.totalFragments}
                    </div>
                    <div className="text-sm text-gray-600">
                      Fragments Claimed
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.activeWaitlists}
                    </div>
                    <div className="text-sm text-gray-600">Waitlist Active</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mysteries, themes, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    activeFilter === "all"
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                  }`}
                >
                  <Filter className="w-4 h-4 inline mr-2" />
                  All ({stats?.totalEnigmas || 0})
                </button>
                <button
                  onClick={() => setActiveFilter("active")}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    activeFilter === "active"
                      ? "bg-green-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveFilter("upcoming")}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    activeFilter === "upcoming"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveFilter("featured")}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    activeFilter === "featured"
                      ? "bg-yellow-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                  }`}
                >
                  Featured
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-gray-600">
              Showing {filteredEnigmas.length} of {stats?.totalEnigmas || 0}{" "}
              mysteries
              {searchQuery && (
                <span>
                  {" "}
                  for "<span className="text-primary-600">{searchQuery}</span>"
                </span>
              )}
            </div>
          </div>

          {/* Enigmas Grid */}
          <EnigmaGrid enigmas={filteredEnigmas} />

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-12 shadow-medium">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of keepers unraveling mysteries. Claim your
                fragment, become part of an exclusive community, and etch your
                name in puzzle history.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary px-8 py-4 text-lg">
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  Start Exploring
                </button>
                <button className="btn-outline px-8 py-4 text-lg">
                  How Mysteries Work
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-8 text-center text-gray-900">
              How Puzzle Mysteries Work
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  1
                </div>
                <h4 className="text-lg font-bold mb-2 text-gray-900">
                  Choose a Mystery
                </h4>
                <p className="text-gray-600">
                  Browse through our exclusive enigma collections. Each contains
                  unique fragments waiting for keepers.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
                <div className="text-3xl font-bold text-secondary-600 mb-2">
                  2
                </div>
                <h4 className="text-lg font-bold mb-2 text-gray-900">
                  Claim Your Fragment
                </h4>
                <p className="text-gray-600">
                  Select and purchase a specific fragment. You become its
                  exclusive guardian with NFT authentication.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
                <div className="text-3xl font-bold text-accent-600 mb-2">3</div>
                <h4 className="text-lg font-bold mb-2 text-gray-900">
                  Solve & Earn Rewards
                </h4>
                <p className="text-gray-600">
                  Collaborate with other keepers, solve the mystery, and earn
                  exclusive rewards and recognition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnigmasPage;
