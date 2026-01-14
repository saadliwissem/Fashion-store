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

const EnigmasPage = () => {
  const [showHero, setShowHero] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data - in production, this would come from an API
  const enigmasData = [
    {
      id: 1,
      name: "Anime Chronicles",
      description: "Unravel the hidden truths behind legendary anime worlds",
      lore: "In the beginning, there were stories. Stories that transcended reality, creating worlds where the impossible became possible. These stories contained fragments of truth, pieces of a larger puzzle scattered across dimensions.\n\nThose who possess the fragments become keepers of these truths. Each fragment holds a clue, and only when all fragments are united can the full mystery be revealed.\n\nThe journey begins with a single fragment, but it takes a community of keepers to piece together the complete picture. Will you be among those who solve the ultimate mystery?",
      status: "active",
      coverImage:
        "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      totalChronicles: 5,
      totalFragments: 45,
      fragmentsClaimed: 32,
      difficulty: "medium",
      featured: true,
      startDate: "2024-01-15",
      estimatedEnd: "2024-06-30",
      rewards: [
        {
          title: "Arcane Artifact",
          description:
            "Limited edition physical artifact from the solved puzzle",
        },
        {
          title: "Digital Grimoire",
          description: "Exclusive digital content and behind-the-scenes lore",
        },
        {
          title: "Keeper's Badge",
          description: "Special recognition on the leaderboard and community",
        },
        {
          title: "Next Enigma Access",
          description: "Early access to the next mystery before public release",
        },
      ],
    },
    {
      id: 2,
      name: "Mythology Enigmas",
      description: "Decode ancient myths and forgotten legends",
      status: "upcoming",
      coverImage:
        "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
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
        "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
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
        "https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
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
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
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
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      totalChronicles: 3,
      totalFragments: 27,
      fragmentsClaimed: 15,
      difficulty: "hard",
      featured: true,
    },
  ];

  const stats = {
    totalEnigmas: enigmasData.length,
    activeEnigmas: enigmasData.filter((e) => e.status === "active").length,
    totalFragments: enigmasData.reduce((sum, e) => sum + e.totalFragments, 0),
    claimedFragments: enigmasData.reduce(
      (sum, e) => sum + e.fragmentsClaimed,
      0
    ),
    totalKeepers: enigmasData.reduce((sum, e) => sum + e.fragmentsClaimed, 0),
  };

  const filteredEnigmas = enigmasData
    .filter((enigma) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "active") return enigma.status === "active";
      if (activeFilter === "upcoming") return enigma.status === "upcoming";
      if (activeFilter === "archived") return enigma.status === "archived";
      if (activeFilter === "featured") return enigma.featured;
      return true;
    })
    .filter(
      (enigma) =>
        enigma.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enigma.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Hide hero after 10 seconds of inactivity
  useEffect(() => {
    if (!showHero) return;

    const timer = setTimeout(() => {
      setShowHero(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [showHero]);

  return (
    <>
      <Helmet>
        <title>Mysteries | Puzzle - Exclusive Collaborative Fashion</title>
        <meta
          name="description"
          content="Join exclusive puzzle mysteries. Claim unique fragments, collaborate with keepers, and solve epic mysteries for legendary rewards."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        {/* Hero Section - Only shows on first visit */}
        {showHero && (
          <div className="relative">
            <MysteryReveal enigma={enigmasData[0]} />
            <button
              onClick={() => setShowHero(false)}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-black/50 backdrop-blur-sm border border-gray-700 rounded-full text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-all z-10"
            >
              Skip to Mysteries
            </button>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 mb-4">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium">Exclusive Mysteries</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Arcane{" "}
              <span className="text-primary-400">Mysteries</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join exclusive puzzle collections. Claim unique fragments,
              collaborate with fellow keepers, and unravel epic mysteries for
              legendary rewards.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-500/20 rounded-xl">
                  <Eye className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalEnigmas}</div>
                  <div className="text-sm text-gray-400">Active Mysteries</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary-500/20 rounded-xl">
                  <Users className="w-6 h-6 text-secondary-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalKeepers}</div>
                  <div className="text-sm text-gray-400">Keeper Guardians</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent-500/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-accent-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {stats.claimedFragments}/{stats.totalFragments}
                  </div>
                  <div className="text-sm text-gray-400">Fragments Claimed</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {stats.activeEnigmas}
                  </div>
                  <div className="text-sm text-gray-400">
                    Active Investigations
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search mysteries, themes, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    activeFilter === "all"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <Filter className="w-4 h-4 inline mr-2" />
                  All
                </button>
                <button
                  onClick={() => setActiveFilter("active")}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    activeFilter === "active"
                      ? "bg-green-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveFilter("upcoming")}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    activeFilter === "upcoming"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveFilter("featured")}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    activeFilter === "featured"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Featured
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-gray-400">
              Showing {filteredEnigmas.length} of {enigmasData.length} mysteries
              {searchQuery && (
                <span>
                  {" "}
                  for "<span className="text-primary-300">{searchQuery}</span>"
                </span>
              )}
            </div>
          </div>

          {/* Enigmas Grid */}
          <EnigmaGrid enigmas={filteredEnigmas} />

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-3xl border border-gray-700 p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
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
            <h3 className="text-2xl font-bold mb-8 text-center">
              How Puzzle Mysteries Work
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-primary-400 mb-2">
                  1
                </div>
                <h4 className="text-lg font-bold mb-2">Choose a Mystery</h4>
                <p className="text-gray-400">
                  Browse through our exclusive enigma collections. Each contains
                  unique fragments waiting for keepers.
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-secondary-400 mb-2">
                  2
                </div>
                <h4 className="text-lg font-bold mb-2">Claim Your Fragment</h4>
                <p className="text-gray-400">
                  Select and purchase a specific fragment. You become its
                  exclusive guardian with NFT authentication.
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-accent-400 mb-2">3</div>
                <h4 className="text-lg font-bold mb-2">Solve & Earn Rewards</h4>
                <p className="text-gray-400">
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
