import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Puzzle,
  Filter,
  Search,
  Users,
  Lock,
  Sparkles,
  Eye,
  Loader,
} from "lucide-react";
import ChronicleCard from "./ChronicleCard";
import { chronicleAPI } from "../../services/api";
import toast from "react-hot-toast";

const ChronicleGrid = ({ enigmaId: propEnigmaId }) => {
  const params = useParams();
  // Use prop if provided, otherwise get from URL params
  const enigmaId = propEnigmaId || params.enigmaId;

  const [chronicles, setChronicles] = useState([]);
  const [filteredChronicles, setFilteredChronicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, available, forging, cipher, solved
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    forging: 0,
    cipher: 0,
    solved: 0,
  });

  useEffect(() => {
    if (enigmaId) {
      fetchChronicles();
    } else {
      setError("No enigma ID provided");
      setLoading(false);
    }
  }, [enigmaId]);

  useEffect(() => {
    // Apply filters whenever chronicles, searchTerm, or filter changes
    filterChronicles();
  }, [chronicles, searchTerm, filter]);

  const fetchChronicles = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching chronicles for enigma:", enigmaId);

      // Fetch chronicles for this specific enigma
      const response = await chronicleAPI.getAll({ enigma: enigmaId });

      console.log("Chronicles response:", response.data);

      const fetchedChronicles = response.data.data || [];
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
      console.error("Failed to fetch chronicles:", error);
      setError(error.response?.data?.message || "Failed to load chronicles");
      toast.error("Failed to load chronicles");
    } finally {
      setLoading(false);
    }
  };

  const filterChronicles = () => {
    let filtered = [...chronicles];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (chronicle) =>
          chronicle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chronicle.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((chronicle) => chronicle.status === filter);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="ml-3 text-gray-600">Loading chronicles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
        <Puzzle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2 text-gray-900">
          Error Loading Chronicles
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">{error}</p>
        <button
          onClick={fetchChronicles}
          className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (chronicles.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
        <Puzzle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2 text-gray-900">
          No Chronicles Found
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          This enigma doesn't have any chronicles yet. Check back soon for new
          mysteries.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Puzzle className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Chronicles</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-100 rounded-lg">
              <Users className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {getClaimedFragments()}
              </div>
              <div className="text-sm text-gray-600">Keepers</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent-100 rounded-lg">
              <Lock className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {getTotalFragments() - getClaimedFragments()}
              </div>
              <div className="text-sm text-gray-600">Fragments Available</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.solved}
              </div>
              <div className="text-sm text-gray-600">Solved Mysteries</div>
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
            placeholder="Search chronicles, fragments, or themes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              filter === "all"
                ? "bg-primary-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
            }`}
          >
            <Filter className="w-4 h-4" />
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter("available")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              filter === "available"
                ? "bg-green-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
            }`}
          >
            <Lock className="w-4 h-4" />
            Available ({stats.available})
          </button>
          <button
            onClick={() => setFilter("forging")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              filter === "forging"
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Forging ({stats.forging})
          </button>
          <button
            onClick={() => setFilter("cipher")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              filter === "cipher"
                ? "bg-purple-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
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
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
            }`}
          >
            <Eye className="w-4 h-4" />
            Solved ({stats.solved})
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
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
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
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
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-6 py-2 btn-primary"
            >
              Clear Search
            </button>
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
    </div>
  );
};

export default ChronicleGrid;
