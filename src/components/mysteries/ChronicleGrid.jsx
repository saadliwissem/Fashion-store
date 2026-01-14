import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Puzzle,
  Filter,
  Search,
  Users,
  Lock,
  Sparkles,
  Eye,
} from "lucide-react";
import ChronicleCard from "./ChronicleCard";

const ChronicleGrid = ({ chronicles: propChronicles }) => {
  const { enigmaId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, available, forging, cipher, solved

  // Sample data if none provided
  const sampleChronicles = [
    {
      id: 1,
      enigmaId: parseInt(enigmaId) || 1,
      name: "The Straw Hat Legacy",
      description: "Unravel the mysteries of the Nine Straw Hats crew members",
      status: "available",
      coverImage:
        "https://images.unsplash.com/photo-1635805737707-575885ab0820",
      fragmentCount: 9,
      fragmentsClaimed: 3,
      requiredFragments: 9,
      difficulty: "medium",
      timeline: "6-8 weeks",
      price: 299.99,
    },
    {
      id: 2,
      enigmaId: parseInt(enigmaId) || 1,
      name: "Naruto's Seal Mystery",
      description: "Decode the hidden seals across the ninja world",
      status: "forging",
      coverImage:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
      fragmentCount: 12,
      fragmentsClaimed: 12,
      requiredFragments: 12,
      difficulty: "hard",
      timeline: "In Production",
      price: 349.99,
    },
    {
      id: 3,
      enigmaId: parseInt(enigmaId) || 1,
      name: "Attack on Titan Walls",
      description: "Discover what lies beyond the three walls",
      status: "cipher",
      coverImage:
        "https://images.unsplash.com/photo-1531259683007-016a7b628fc3",
      fragmentCount: 3,
      fragmentsClaimed: 3,
      requiredFragments: 3,
      difficulty: "expert",
      timeline: "Active Cipher",
      price: 399.99,
    },
    {
      id: 4,
      enigmaId: parseInt(enigmaId) || 1,
      name: "Demon Slayer Corps",
      description: "Hunt demons with the breath techniques",
      status: "available",
      coverImage:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176",
      fragmentCount: 9,
      fragmentsClaimed: 0,
      requiredFragments: 9,
      difficulty: "medium",
      timeline: "8-10 weeks",
      price: 279.99,
    },
    {
      id: 5,
      enigmaId: parseInt(enigmaId) || 1,
      name: "Dragon Ball Wishes",
      description: "Collect the dragon balls to unlock ultimate power",
      status: "solved",
      coverImage:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176",
      fragmentCount: 7,
      fragmentsClaimed: 7,
      requiredFragments: 7,
      difficulty: "easy",
      timeline: "Archived",
      price: 249.99,
    },
    {
      id: 6,
      enigmaId: parseInt(enigmaId) || 1,
      name: "One Piece Treasure Map",
      description: "Follow the clues to the ultimate treasure",
      status: "available",
      coverImage:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176",
      fragmentCount: 15,
      fragmentsClaimed: 2,
      requiredFragments: 15,
      difficulty: "hard",
      timeline: "10-12 weeks",
      price: 449.99,
    },
  ];

  const chronicles = propChronicles || sampleChronicles;

  const filteredChronicles = chronicles.filter((chronicle) => {
    const matchesSearch =
      chronicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chronicle.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    return matchesSearch && chronicle.status === filter;
  });

  const getStatusCount = (status) => {
    return chronicles.filter((c) => c.status === status).length;
  };

  const getTotalFragments = () => {
    return chronicles.reduce((sum, c) => sum + c.fragmentCount, 0);
  };

  const getClaimedFragments = () => {
    return chronicles.reduce((sum, c) => sum + c.fragmentsClaimed, 0);
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Puzzle className="w-8 h-8 text-primary-500" />
              Mystery Chronicles
            </h1>
            <p className="text-gray-400">
              Each chronicle contains fragments waiting to be claimed and solved
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-400">
                {getClaimedFragments()}/{getTotalFragments()}
              </div>
              <div className="text-sm text-gray-400">Fragments Claimed</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search chronicles, fragments, or themes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                filter === "all"
                  ? "bg-primary-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Filter className="w-4 h-4" />
              All ({chronicles.length})
            </button>
            <button
              onClick={() => setFilter("available")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                filter === "available"
                  ? "bg-green-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Lock className="w-4 h-4" />
              Available ({getStatusCount("available")})
            </button>
            <button
              onClick={() => setFilter("forging")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                filter === "forging"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Forging ({getStatusCount("forging")})
            </button>
            <button
              onClick={() => setFilter("cipher")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                filter === "cipher"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Puzzle className="w-4 h-4" />
              Cipher ({getStatusCount("cipher")})
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500/20 rounded-lg">
              <Puzzle className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{chronicles.length}</div>
              <div className="text-sm text-gray-400">Active Chronicles</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-500/20 rounded-lg">
              <Users className="w-6 h-6 text-secondary-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{getClaimedFragments()}</div>
              <div className="text-sm text-gray-400">Keepers</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent-500/20 rounded-lg">
              <Lock className="w-6 h-6 text-accent-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {getTotalFragments() - getClaimedFragments()}
              </div>
              <div className="text-sm text-gray-400">Fragments Available</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Eye className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {chronicles.filter((c) => c.status === "solved").length}
              </div>
              <div className="text-sm text-gray-400">Solved Mysteries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-400">
          Showing{" "}
          <span className="text-white font-bold">
            {filteredChronicles.length}
          </span>{" "}
          chronicle{filteredChronicles.length !== 1 ? "s" : ""}
          {searchTerm && (
            <span>
              {" "}
              for "<span className="text-primary-300">{searchTerm}</span>"
            </span>
          )}
        </p>
      </div>

      {/* Empty State */}
      {filteredChronicles.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700">
          <Puzzle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Chronicles Found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {searchTerm
              ? `No chronicles match "${searchTerm}". Try another search.`
              : `No chronicles available in this enigma. Check back soon for new mysteries.`}
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
        /* Chronicle Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredChronicles.map((chronicle) => (
            <ChronicleCard key={chronicle.id} chronicle={chronicle} />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="mt-12 pt-8 border-t border-gray-800">
        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-500" />
          Chronicle Status Legend
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div>
              <div className="font-medium">Available</div>
              <div className="text-sm text-gray-400">
                Fragments can be claimed
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <div>
              <div className="font-medium">Forging</div>
              <div className="text-sm text-gray-400">In production phase</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <div>
              <div className="font-medium">Cipher Active</div>
              <div className="text-sm text-gray-400">Puzzle being solved</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <div>
              <div className="font-medium">Solved</div>
              <div className="text-sm text-gray-400">Mystery revealed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChronicleGrid;
