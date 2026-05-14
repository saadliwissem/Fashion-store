// pages/ChroniclesPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Puzzle,
  Filter,
  Search,
  Users,
  Lock,
  Sparkles,
  Eye,
  Loader,
  ArrowLeft,
  BookOpen,
  MapPin,
  Calendar,
  DollarSign,
  ChevronRight,
  TrendingUp,
  Award,
} from "lucide-react";
import ChronicleCard from "../components/chronicles/ChronicleCard";
import { chronicleAPI, enigmaAPI } from "../services/api";
import toast from "react-hot-toast";

const ChroniclesPage = () => {
  const { id } = useParams();
  const enigmaId = id;
  const [enigma, setEnigma] = useState(null);
  const [chronicles, setChronicles] = useState([]);
  const [filteredChronicles, setFilteredChronicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, available, forging, cipher, solved
  const [sortBy, setSortBy] = useState("featured"); // featured, price_asc, price_desc, newest
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    forging: 0,
    cipher: 0,
    solved: 0,
  });

  useEffect(() => {
    if (enigmaId) {
      fetchEnigmaAndChronicles();
    } else {
      setError("No enigma ID provided");
      setLoading(false);
    }
  }, [enigmaId]);

  useEffect(() => {
    filterAndSortChronicles();
  }, [chronicles, searchTerm, filter, sortBy]);

  const fetchEnigmaAndChronicles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch enigma details
      const enigmaResponse = await enigmaAPI.getOne(enigmaId);
      setEnigma(enigmaResponse.data.data);

      // Fetch chronicles for this specific enigma
      const chroniclesResponse = await chronicleAPI.getAll({
        enigma: enigmaId,
      });

      const fetchedChronicles = chroniclesResponse.data.data || [];
      setChronicles(fetchedChronicles);

      // Calculate stats
      const newStats = {
        total: fetchedChronicles.length,
        available: fetchedChronicles.filter((c) => c.status === "available")
          .length,
        forging: fetchedChronicles.filter((c) => c.status === "forging").length,
        cipher: fetchedChronicles.filter((c) => c.status === "cipher").length,
        solved: fetchedChronicles.filter((c) => c.status === "solved").length,
      };
      setStats(newStats);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError(error.response?.data?.message || "Failed to load chronicles");
      toast.error("Failed to load chronicles");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortChronicles = () => {
    let filtered = [...chronicles];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (chronicle) =>
          chronicle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chronicle.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          chronicle.author?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((chronicle) => chronicle.status === filter);
    }

    // Apply sorting
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
        break;
      case "price_desc":
        filtered.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "featured":
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    setFilteredChronicles(filtered);
  };

  const getTotalFragments = () => {
    return chronicles.reduce(
      (sum, c) => sum + (c.stats?.fragmentCount || 0),
      0
    );
  };

  const getClaimedFragments = () => {
    return chronicles.reduce(
      (sum, c) => sum + (c.stats?.fragmentsClaimed || 0),
      0
    );
  };

  const getCompletionRate = () => {
    const total = getTotalFragments();
    const claimed = getClaimedFragments();
    return total > 0 ? ((claimed / total) * 100).toFixed(0) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading chronicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12 max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Puzzle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Page
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/enigma"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Enigmas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-black text-white">
        <div className="container mx-auto px-4 py-12">
          {/* Back Button */}
          <Link
            to="/enigma"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Enigmas
          </Link>

          {/* Enigma Header */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Cover Image */}
            <div className="lg:w-1/3">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                {enigma?.coverImage?.url ? (
                  <img
                    src={enigma.coverImage.url}
                    alt={enigma.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-primary-700 flex items-center justify-center">
                    <Puzzle className="w-16 h-16 text-primary-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Enigma Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-primary-500/30 rounded-full text-sm font-medium">
                  {enigma?.difficulty?.toUpperCase() || "INTERMEDIATE"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    enigma?.status === "active"
                      ? "bg-green-500/30 text-green-200"
                      : enigma?.status === "upcoming"
                      ? "bg-yellow-500/30 text-yellow-200"
                      : enigma?.status === "solved"
                      ? "bg-blue-500/30 text-blue-200"
                      : "bg-gray-500/30 text-gray-200"
                  }`}
                >
                  {enigma?.status?.toUpperCase() || "UPCOMING"}
                </span>
                {enigma?.featured && (
                  <span className="px-3 py-1 bg-yellow-500/30 text-yellow-200 rounded-full text-sm font-medium flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    FEATURED
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {enigma?.name}
              </h1>
              <p className="text-primary-200 text-lg mb-4">
                {enigma?.description}
              </p>

              {enigma?.lore && (
                <p className="text-primary-100 text-sm mb-6 line-clamp-2">
                  {enigma?.lore}
                </p>
              )}

              {/* Enigma Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-primary-200 text-sm">Chronicles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {getTotalFragments()}
                  </div>
                  <div className="text-primary-200 text-sm">
                    Total Fragments
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {getClaimedFragments()}
                  </div>
                  <div className="text-primary-200 text-sm">Keepers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {getCompletionRate()}%
                  </div>
                  <div className="text-primary-200 text-sm">
                    Completion Rate
                  </div>
                </div>
              </div>

              {/* Location & Creator */}
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-primary-200">
                {enigma?.location?.country && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {enigma.location.country}
                      {enigma.location?.city && `, ${enigma.location.city}`}
                    </span>
                  </div>
                )}
                {enigma?.creator?.name && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Created by {enigma.creator.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chronicles Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Total Chronicles</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.available}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.forging}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.solved}
                </div>
                <div className="text-sm text-gray-600">Solved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search chronicles by name, description, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all shadow-sm"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              filter === "all"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter("available")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              filter === "available"
                ? "bg-green-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Lock className="w-4 h-4" />
            Available ({stats.available})
          </button>
          <button
            onClick={() => setFilter("forging")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              filter === "forging"
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Forging ({stats.forging})
          </button>
          <button
            onClick={() => setFilter("cipher")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              filter === "cipher"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Puzzle className="w-4 h-4" />
            Cipher ({stats.cipher})
          </button>
          <button
            onClick={() => setFilter("solved")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              filter === "solved"
                ? "bg-gray-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Eye className="w-4 h-4" />
            Solved ({stats.solved})
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-700">
            Showing{" "}
            <span className="text-gray-900 font-bold">
              {filteredChronicles.length}
            </span>{" "}
            chronicle{filteredChronicles.length !== 1 ? "s" : ""}
            {searchTerm && (
              <span>
                {" "}
                for "<span className="text-primary-600">{searchTerm}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Empty State */}
        {filteredChronicles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Puzzle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900">
              No Chronicles Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm
                ? `No chronicles match "${searchTerm}". Try another search.`
                : `No ${
                    filter !== "all" ? filter : ""
                  } chronicles available in this enigma.`}
            </p>
            {(searchTerm || filter !== "all") && (
              <div className="flex gap-3 justify-center mt-6">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
                {filter !== "all" && (
                  <button
                    onClick={() => setFilter("all")}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Show All
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Chronicle Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredChronicles.map((chronicle) => (
              <ChronicleCard key={chronicle._id} chronicle={chronicle} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        {chronicles.length > 0 && filteredChronicles.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to={`/enigma/${enigmaId}/fragments`}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              View all fragments
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChroniclesPage;
