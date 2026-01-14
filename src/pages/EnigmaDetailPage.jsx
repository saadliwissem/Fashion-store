import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  ArrowLeft,
  Share2,
  Heart,
  Users,
  Lock,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  MapPin,
  Eye,
} from "lucide-react";
import { ChronicleGrid } from "../components/mysteries";

const EnigmaDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enigma, setEnigma] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sample data - in production, this would come from an API
  const enigmaData = {
    id: parseInt(id) || 1,
    name: "Anime Chronicles",
    description: "Unravel the hidden truths behind legendary anime worlds",
    fullDescription:
      "Dive deep into the most iconic anime universes, where every frame holds a secret and every character conceals a truth. This enigma spans across multiple dimensions, weaving together fragments of reality into a tapestry of mysteries waiting to be solved by dedicated keepers.",
    lore: "In the digital age, stories have evolved beyond mere entertainment. They've become living, breathing universes that hold fragments of cosmic truth. The Anime Chronicles enigma captures these fragments, scattering them across nine distinct collections.\n\nEach chronicle represents a legendary anime world, with fragments corresponding to key characters, locations, and plot points. Keepers who claim these fragments don't just own merchandise—they become guardians of these stories, entrusted with piecing together the greater narrative.\n\nThe ultimate revelation awaits those who can connect all the dots across different chronicles, revealing a meta-narrative that transcends any single anime universe.",
    status: "active",
    coverImage:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    bannerImage:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    totalChronicles: 5,
    totalFragments: 45,
    fragmentsClaimed: 32,
    difficulty: "medium",
    featured: true,
    startDate: "2024-01-15",
    estimatedEnd: "2024-06-30",
    creator: "Arcane Weavers Collective",
    location: "Virtual Nexus",
    tags: ["Anime", "Collaborative", "Limited Edition", "NFT", "Exclusive"],
    rewards: [
      {
        title: "Arcane Artifact",
        description: "Limited edition physical artifact from the solved puzzle",
        icon: "🏆",
      },
      {
        title: "Digital Grimoire",
        description: "Exclusive digital content and behind-the-scenes lore",
        icon: "📖",
      },
      {
        title: "Keeper's Badge",
        description: "Special recognition on the leaderboard and community",
        icon: "🛡️",
      },
      {
        title: "Next Enigma Access",
        description: "Early access to the next mystery before public release",
        icon: "🔮",
      },
    ],
    stats: {
      activeKeepers: 32,
      totalValueLocked: 9596.68,
      completionRate: 71,
      averageSolveTime: "45 days",
      communityRating: 4.8,
    },
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEnigma(enigmaData);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-400">Unraveling the mystery...</div>
        </div>
      </div>
    );
  }

  if (!enigma) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Mystery Not Found</h2>
          <p className="text-gray-400 mb-6">
            This enigma seems to have vanished from reality.
          </p>
          <button
            onClick={() => navigate("/mysteries")}
            className="btn-primary"
          >
            Return to Mysteries
          </button>
        </div>
      </div>
    );
  }

  const percentageClaimed =
    (enigma.fragmentsClaimed / enigma.totalFragments) * 100;

  return (
    <>
      <Helmet>
        <title>{enigma.name} | Puzzle Mysteries</title>
        <meta name="description" content={enigma.description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/mysteries")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mysteries
          </button>
        </div>

        {/* Hero Banner */}
        <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
          <img
            src={enigma.bannerImage}
            alt={enigma.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="max-w-4xl">
                <div className="flex flex-wrap gap-2 mb-4">
                  {enigma.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-gray-700 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {enigma.name}
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl">
                  {enigma.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-8 right-8 flex gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-full backdrop-blur-sm border transition-all ${
                isLiked
                  ? "bg-red-500/20 border-red-500/30 text-red-400"
                  : "bg-black/40 border-gray-700 text-gray-300 hover:text-red-400"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button className="p-3 rounded-full backdrop-blur-sm bg-black/40 border border-gray-700 text-gray-300 hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700 p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary-500" />
                  The Enigma Unveiled
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    {enigma.fullDescription}
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    This is not just a collection of merchandise—it's an
                    interactive experience where every purchase makes you part
                    of a living story. As a keeper, you'll receive clues,
                    collaborate with others, and work towards solving a mystery
                    that spans multiple fragments.
                  </p>
                </div>
              </div>

              {/* Lore */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700 p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary-500" />
                  Arcane Lore
                </h2>
                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 border border-gray-700">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {enigma.lore}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700 text-center">
                  <div className="text-3xl font-bold text-primary-400 mb-2">
                    {enigma.totalChronicles}
                  </div>
                  <div className="text-sm text-gray-400">Chronicles</div>
                </div>
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700 text-center">
                  <div className="text-3xl font-bold text-secondary-400 mb-2">
                    {enigma.fragmentsClaimed}
                  </div>
                  <div className="text-sm text-gray-400">Keepers</div>
                </div>
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700 text-center">
                  <div className="text-3xl font-bold text-accent-400 mb-2">
                    {enigma.stats.completionRate}%
                  </div>
                  <div className="text-sm text-gray-400">Progress</div>
                </div>
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-2">
                    {enigma.difficulty}
                  </div>
                  <div className="text-sm text-gray-400">Difficulty</div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Progress Card */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700 p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-400" />
                  Manifestation Progress
                </h3>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Fragments Claimed</span>
                    <span className="font-bold">
                      {Math.round(percentageClaimed)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-1000"
                      style={{ width: `${percentageClaimed}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{enigma.fragmentsClaimed} claimed</span>
                    <span>
                      {enigma.totalFragments - enigma.fragmentsClaimed}{" "}
                      remaining
                    </span>
                  </div>
                </div>
                <button className="w-full btn-primary py-3">
                  Join the Investigation
                </button>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700 p-6">
                <h3 className="font-bold mb-4">Enigma Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        enigma.status === "active"
                          ? "bg-green-500/20 text-green-300"
                          : enigma.status === "upcoming"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {enigma.status.charAt(0).toUpperCase() +
                        enigma.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Started</span>
                    <span className="font-medium">{enigma.startDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Estimated End</span>
                    <span className="font-medium">{enigma.estimatedEnd}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Created by</span>
                    <span className="font-medium">{enigma.creator}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">{enigma.location}</span>
                  </div>
                </div>
              </div>

              {/* Rewards Card */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700 p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Arcane Rewards
                </h3>
                <div className="space-y-3">
                  {enigma.rewards.map((reward, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg"
                    >
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <div className="font-medium">{reward.title}</div>
                        <div className="text-sm text-gray-400">
                          {reward.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chronicles Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Chronicles</h2>
                <p className="text-gray-400">
                  Explore the collections within this enigma
                </p>
              </div>
              <Link
                to={`/mysteries/${id}/chronicles`}
                className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <ChronicleGrid />
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-3xl border border-gray-700 p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Claim Your Fragment?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join {enigma.fragmentsClaimed} other keepers in unraveling this
                mystery. Your fragment awaits—claim it now and become part of
                puzzle history.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary px-8 py-4 text-lg">
                  <Lock className="w-5 h-5 inline mr-2" />
                  Browse Available Fragments
                </button>
                <button className="btn-outline px-8 py-4 text-lg">
                  <Users className="w-5 h-5 inline mr-2" />
                  Join Community Discussion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnigmaDetailPage;
