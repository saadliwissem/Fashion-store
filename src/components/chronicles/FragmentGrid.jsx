import React, { useState } from "react";
import {
  Lock,
  CheckCircle,
  Eye,
  Users,
  Sparkles,
  Filter,
  Search,
  AlertCircle,
  Crown,
} from "lucide-react";
import FragmentCard from "./FragmentCard";

const FragmentGrid = ({ fragments, onFragmentSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, available, claimed, featured
  const [sortBy, setSortBy] = useState("number"); // number, price, popularity

  // Sample data if none provided
  const sampleFragments = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    name: `Fragment #${i + 1}`,
    description: `Represents crew member ${i + 1} with unique hidden clues`,
    status: i < 3 ? "claimed" : "available", // First 3 claimed
    claimedBy: i < 3 ? `Keeper_${String.fromCharCode(65 + i)}` : null,
    price: 299.99,
    rarity: i === 0 ? "legendary" : i < 3 ? "rare" : "common",
    features: [
      "Hidden QR code",
      "UV-reactive ink",
      "Embossed symbol",
      "Numbered certificate",
    ],
    estimatedDelivery: "6-8 weeks",
    imageUrl: `https://images.unsplash.com/photo-155${i}1023543-2e228?auto=format&fit=crop&w=400`,
    cluesRevealed: i < 3 ? Math.floor(Math.random() * 3) + 1 : 0,
    totalClues: 5,
    isFeatured: i === 4, // Center fragment is featured
  }));

  const fragmentData = fragments || sampleFragments;

  const filteredFragments = fragmentData.filter((fragment) => {
    const matchesSearch =
      fragment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fragment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fragment.claimedBy &&
        fragment.claimedBy.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filter === "all") return matchesSearch;
    if (filter === "available")
      return matchesSearch && fragment.status === "available";
    if (filter === "claimed")
      return matchesSearch && fragment.status === "claimed";
    if (filter === "featured") return matchesSearch && fragment.isFeatured;
    return matchesSearch;
  });

  const sortedFragments = [...filteredFragments].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "popularity":
        return (b.cluesRevealed || 0) - (a.cluesRevealed || 0);
      case "number":
      default:
        return a.number - b.number;
    }
  });

  const stats = {
    total: fragmentData.length,
    available: fragmentData.filter((f) => f.status === "available").length,
    claimed: fragmentData.filter((f) => f.status === "claimed").length,
    featured: fragmentData.filter((f) => f.isFeatured).length,
  };

  const handleFragmentClick = (fragment) => {
    if (fragment.status === "available" && onFragmentSelect) {
      onFragmentSelect(fragment);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-gray-700 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              Fragment Assembly
            </h2>
            <p className="text-gray-400">
              Select a fragment to claim and become its guardian
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-400">
                {stats.available}/{stats.total}
              </div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search fragments, keepers, or features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 appearance-none"
              >
                <option value="all">All Fragments</option>
                <option value="available">Available</option>
                <option value="claimed">Claimed</option>
                <option value="featured">Featured</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 appearance-none"
              >
                <option value="number">By Number</option>
                <option value="price">By Price</option>
                <option value="popularity">By Popularity</option>
              </select>
              <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <Eye className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-400">Total Fragments</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Lock className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.available}</div>
                <div className="text-sm text-gray-400">Available</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.claimed}</div>
                <div className="text-sm text-gray-400">Claimed</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Crown className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-xl font-bold">{stats.featured}</div>
                <div className="text-sm text-gray-400">Featured</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-6">
        <p className="text-gray-400">
          Showing{" "}
          <span className="text-white font-bold">{sortedFragments.length}</span>{" "}
          fragment{sortedFragments.length !== 1 ? "s" : ""}
          {searchTerm && (
            <span>
              {" "}
              for "<span className="text-primary-300">{searchTerm}</span>"
            </span>
          )}
          <span className="ml-2 text-sm bg-gray-800 px-2 py-1 rounded">
            Sorted by {sortBy.replace("number", "fragment number")}
          </span>
        </p>
      </div>

      {/* Empty State */}
      {sortedFragments.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700">
          <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Fragments Found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {searchTerm
              ? `No fragments match "${searchTerm}". Try another search or view all fragments.`
              : `All fragments in this chronicle have been claimed. Join the waitlist for future releases.`}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        /* Fragment Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedFragments.map((fragment) => (
            <FragmentCard
              key={fragment.id}
              fragment={fragment}
              onClick={() => handleFragmentClick(fragment)}
            />
          ))}
        </div>
      )}

      {/* Legend and Info */}
      <div className="mt-12 pt-8 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Legend */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary-500" />
              Fragment Status Legend
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <div className="font-medium">Available</div>
                  <div className="text-sm text-gray-400">
                    Ready to be claimed
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <div>
                  <div className="font-medium">Claimed</div>
                  <div className="text-sm text-gray-400">Guardian assigned</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div>
                  <div className="font-medium">Featured</div>
                  <div className="text-sm text-gray-400">
                    Special edition fragment
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-500" />
              Important Information
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>
                  Each fragment purchase includes a numbered NFT certificate
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>
                  Claimed fragments cannot be transferred until the cipher is
                  solved
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>
                  Production begins only when all required fragments are claimed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>
                  Estimated delivery timeline is 6-8 weeks after production
                  begins
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FragmentGrid;
