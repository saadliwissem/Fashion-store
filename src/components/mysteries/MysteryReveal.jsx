import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Eye,
  Lock,
  Puzzle,
  Users,
  ChevronRight,
  X,
  Zap,
  Star,
  Globe,
} from "lucide-react";

const MysteryReveal = ({ enigma }) => {
  const [revealed, setRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Destructure with proper MongoDB field names and fallbacks
  const {
    _id,
    name,
    description,
    lore,
    status,
    coverImage,
    metadata = {},
    stats = {},
    difficulty,
    featured,
    startDate,
    estimatedEnd,
    rewards = [],
  } = enigma;

  // Use metadata for fragment stats (from your data structure)
  const totalChronicles = metadata?.totalChronicles ?? 0;
  const totalFragments = metadata?.totalFragments ?? 0;
  const fragmentsClaimed = metadata?.fragmentsClaimed ?? 0;

  // Handle cover image (could be string or object)
  const getCoverImage = () => {
    if (!coverImage)
      return "https://images.unsplash.com/photo-1635805737707-575885ab0820";
    if (typeof coverImage === "string") return coverImage;
    return (
      coverImage.url ||
      "https://images.unsplash.com/photo-1635805737707-575885ab0820"
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleReveal = () => {
    setRevealed(true);
    setTimeout(() => {
      document.getElementById("mystery-content").scrollIntoView({
        behavior: "smooth",
      });
    }, 300);
  };

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "from-green-600 to-emerald-700";
      case "upcoming":
        return "from-blue-600 to-cyan-700";
      case "archived":
        return "from-gray-600 to-gray-700";
      case "solved":
        return "from-purple-600 to-pink-700";
      default:
        return "from-primary-600 to-secondary-700";
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "chronicles", label: "Chronicles", icon: Puzzle },
    { id: "rewards", label: "Arcane Rewards", icon: Star },
    { id: "lore", label: "Deep Lore", icon: Globe },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, #D4AF37 1px, transparent 1px),
                           linear-gradient(to bottom, #D4AF37 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Mystery Lock */}
            <div
              className={`relative mb-12 ${
                revealed ? "opacity-0 scale-95" : "opacity-100"
              } transition-all duration-700`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Outer Ring */}
                  <div className="w-64 h-64 border-4 border-dashed border-primary-400/40 rounded-full animate-spin-slow" />

                  {/* Middle Ring */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-48 h-48 border-2 border-primary-500/40 rounded-full animate-spin-slower" />
                  </div>

                  {/* Inner Lock */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-100/90 to-secondary-100/90 backdrop-blur-sm border border-primary-300/50 rounded-2xl flex items-center justify-center shadow-xl">
                      <Lock className="w-16 h-16 text-primary-600" />
                    </div>
                  </div>

                  {/* Floating Puzzle Pieces */}
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg animate-float shadow-lg"
                      style={{
                        top: `${Math.sin(i * 90) * 100 + 50}px`,
                        left: `${Math.cos(i * 90) * 100 + 50}px`,
                        animationDelay: `${i * 0.5}s`,
                      }}
                    >
                      <Puzzle className="w-full h-full p-1 text-white" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Reveal Button */}
              {!revealed && (
                <div className="relative z-10 pt-80 text-center">
                  <button
                    onClick={handleReveal}
                    className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse-slow text-white shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                      <span>Unveil the Mystery</span>
                      <Sparkles className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-500" />
                    </div>
                    <div className="text-sm opacity-90 mt-2">
                      Click to reveal the arcane secrets
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Revealed Content */}
            <div
              id="mystery-content"
              className={`transition-all duration-1000 ${
                revealed
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 border border-primary-200 mb-4 shadow-sm">
                  <Zap className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Arcane Enigma
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-gray-900 to-secondary-600 bg-clip-text text-transparent">
                  {name}
                </h1>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  {description}
                </p>
              </div>

              {/* Stats Banner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-soft">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {totalChronicles}
                  </div>
                  <div className="text-gray-600">Chronicles</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-soft">
                  <div className="text-3xl font-bold text-secondary-600 mb-2">
                    {totalFragments}
                  </div>
                  <div className="text-gray-600">Fragments</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-soft">
                  <div className="text-3xl font-bold text-accent-600 mb-2">
                    {fragmentsClaimed}
                  </div>
                  <div className="text-gray-600">Keepers</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-soft">
                  <div
                    className={`text-3xl font-bold mb-2 bg-gradient-to-r ${getStatusColor()} bg-clip-text text-transparent`}
                  >
                    {status
                      ? status.charAt(0).toUpperCase() + status.slice(1)
                      : "Unknown"}
                  </div>
                  <div className="text-gray-600">Status</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 mb-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-sm"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-soft">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">
                        The Enigma Unveiled
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        This arcane mystery spans multiple dimensions, weaving
                        together fragments of reality into a tapestry of
                        secrets. Each chronicle represents a chapter in this
                        cosmic puzzle, waiting for brave keepers to claim their
                        fragments and unravel the truth.
                      </p>
                      <div className="grid md:grid-cols-2 gap-6 mt-8">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-primary-600" />
                            <div>
                              <div className="font-medium text-gray-900">
                                Collaborative Solving
                              </div>
                              <div className="text-sm text-gray-600">
                                All keepers must work together to solve the
                                cipher
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-secondary-600" />
                            <div>
                              <div className="font-medium text-gray-900">
                                Exclusive Ownership
                              </div>
                              <div className="text-sm text-gray-600">
                                Each fragment is globally unique to its keeper
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Star className="w-5 h-5 text-accent-600" />
                            <div>
                              <div className="font-medium text-gray-900">
                                Arcane Rewards
                              </div>
                              <div className="text-sm text-gray-600">
                                Solve the puzzle for exclusive prizes and
                                recognition
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                            <div>
                              <div className="font-medium text-gray-900">
                                Progressive Clues
                              </div>
                              <div className="text-sm text-gray-600">
                                Clues unlock as more fragments are claimed
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "chronicles" && (
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-gray-900">
                        Available Chronicles
                      </h3>
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          Each chronicle represents a distinct chapter in this
                          enigma, containing its own set of fragments and
                          mysteries to solve.
                        </p>
                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-300 hover:border-primary-400 hover:shadow-md transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary-100 rounded-lg">
                              <Puzzle className="w-6 h-6 text-primary-600" />
                            </div>
                            <div className="text-left">
                              <div className="font-bold text-gray-900">
                                Explore Chronicles
                              </div>
                              <div className="text-sm text-gray-600">
                                View all {totalChronicles} available chronicles
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "rewards" && (
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-gray-900">
                        Arcane Treasures
                      </h3>
                      {rewards.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                          {rewards.map((reward, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-soft"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg">
                                  <Star className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div className="font-bold text-gray-900">
                                  {reward.name || reward.title}
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm">
                                {reward.description}
                              </p>
                              {reward.rarity && (
                                <span
                                  className={`mt-3 inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                    reward.rarity === "legendary"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : reward.rarity === "rare"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {reward.rarity}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-center py-8">
                          No rewards information available yet.
                        </p>
                      )}
                    </div>
                  )}

                  {activeTab === "lore" && (
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-gray-900">
                        Deep Lore
                      </h3>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {lore ||
                            "The full lore of this enigma is still being uncovered. As more fragments are claimed, additional lore will be revealed to the keepers."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mt-12">
                <button
                  onClick={() => (window.location.href = `/enigmas/${_id}`)}
                  className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 text-white shadow-md"
                >
                  <span>Begin Your Journey</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
                <p className="text-gray-600 mt-4">
                  Join the {fragmentsClaimed} keepers already on this quest
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-4 h-4 bg-primary-500 rounded-full animate-pulse shadow-sm" />
      <div className="absolute bottom-40 left-10 w-3 h-3 bg-secondary-500 rounded-full animate-pulse shadow-sm" />
      <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-accent-500 rounded-full animate-pulse shadow-sm" />
    </div>
  );
};

export default MysteryReveal;
