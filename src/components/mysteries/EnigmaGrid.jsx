import React, { useState } from "react";
import { Search, Filter, Sparkles, Eye } from "lucide-react";
import EnigmaCard from "./EnigmaCard";

const EnigmaGrid = ({ enigmas }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, upcoming, archived

  const filteredEnigmas = enigmas.filter((enigma) => {
    const matchesSearch =
      enigma.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enigma.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && enigma.status === "active";
    if (filter === "upcoming")
      return matchesSearch && enigma.status === "upcoming";
    if (filter === "archived")
      return matchesSearch && enigma.status === "archived";
    return matchesSearch;
  });

  const getFilterCount = (status) => {
    return enigmas.filter((e) => e.status === status).length;
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary-500" />
              Arcane Enigmas
            </h1>
            <p className="text-gray-400">
              Unravel mysteries, claim fragments, and solve cosmic puzzles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-400">
              {enigmas.length} enigmas waiting
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search for mysteries, themes, or fragments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                filter === "all"
                  ? "bg-primary-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Filter className="w-4 h-4" />
              All ({enigmas.length})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                filter === "active"
                  ? "bg-secondary-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Active ({getFilterCount("active")})
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                filter === "upcoming"
                  ? "bg-accent-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Upcoming ({getFilterCount("upcoming")})
            </button>
            <button
              onClick={() => setFilter("archived")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                filter === "archived"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Archived ({getFilterCount("archived")})
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-400">
          Found{" "}
          <span className="text-white font-bold">{filteredEnigmas.length}</span>{" "}
          enigma{filteredEnigmas.length !== 1 ? "s" : ""}
          {searchTerm && (
            <span>
              {" "}
              for "<span className="text-primary-300">{searchTerm}</span>"
            </span>
          )}
        </p>
      </div>

      {/* Empty State */}
      {filteredEnigmas.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700">
          <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Mysteries Found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {searchTerm
              ? `No enigmas match "${searchTerm}". Try another search or explore all mysteries.`
              : `All mysteries are currently hidden. New enigmas will appear soon.`}
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
        /* Enigma Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnigmas.map((enigma) => (
            <EnigmaCard key={enigma.id} enigma={enigma} />
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-12 pt-8 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl">
          <div className="text-3xl font-bold text-primary-400 mb-2">
            {enigmas.filter((e) => e.status === "active").length}
          </div>
          <div className="text-gray-400">Active Investigations</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl">
          <div className="text-3xl font-bold text-secondary-400 mb-2">
            {enigmas.reduce((sum, e) => sum + e.totalFragments, 0)}
          </div>
          <div className="text-gray-400">Fragments Waiting</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl">
          <div className="text-3xl font-bold text-accent-400 mb-2">
            {enigmas.filter((e) => e.status === "solved").length}
          </div>
          <div className="text-gray-400">Solved Mysteries</div>
        </div>
      </div>
    </div>
  );
};

// Default props with sample data
EnigmaGrid.defaultProps = {
  enigmas: [
    {
      id: 1,
      name: "Anime Chronicles",
      description: "Unravel the hidden truths behind legendary anime worlds",
      status: "active",
      coverImage:
        "https://images.unsplash.com/photo-1635805737707-575885ab0820",
      totalChronicles: 5,
      totalFragments: 45,
      fragmentsClaimed: 32,
      difficulty: "medium",
      featured: true,
    },
    {
      id: 2,
      name: "Mythology Enigmas",
      description: "Decode ancient myths and forgotten legends",
      status: "upcoming",
      coverImage:
        "https://images.unsplash.com/photo-1531259683007-016a7b628fc3",
      totalChronicles: 3,
      totalFragments: 27,
      fragmentsClaimed: 0,
      difficulty: "hard",
      featured: true,
    },
    {
      id: 3,
      name: "Sci-Fi Paradoxes",
      description: "Solve futuristic puzzles across time and space",
      status: "upcoming",
      coverImage:
        "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06",
      totalChronicles: 4,
      totalFragments: 36,
      fragmentsClaimed: 0,
      difficulty: "expert",
      featured: false,
    },
    {
      id: 4,
      name: "Historical Cryptex",
      description: "Unlock secrets from pivotal moments in history",
      status: "active",
      coverImage:
        "https://images.unsplash.com/photo-1505664194779-8beaceb93744",
      totalChronicles: 6,
      totalFragments: 54,
      fragmentsClaimed: 48,
      difficulty: "medium",
      featured: false,
    },
    {
      id: 5,
      name: "Fantasy Legends",
      description: "Navigate magical realms and mystical creatures",
      status: "archived",
      coverImage:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176",
      totalChronicles: 4,
      totalFragments: 36,
      fragmentsClaimed: 36,
      difficulty: "easy",
      featured: true,
    },
    {
      id: 6,
      name: "Cyber Enigma",
      description: "Hack through digital mysteries and virtual realities",
      status: "active",
      coverImage:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176",
      totalChronicles: 3,
      totalFragments: 27,
      fragmentsClaimed: 15,
      difficulty: "hard",
      featured: true,
    },
  ],
};

export default EnigmaGrid;
