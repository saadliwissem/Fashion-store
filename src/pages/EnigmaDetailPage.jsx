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
import { enigmaAPI, analyticsAPI, keeperAPI } from "../services/api";
import toast from "react-hot-toast";

const EnigmaDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enigma, setEnigma] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchEnigmaData();
  }, [id]);

  const fetchEnigmaData = async () => {
    try {
      setLoading(true);
      const [enigmaRes, analyticsRes] = await Promise.all([
        enigmaAPI.getOne(id),
        analyticsAPI.getEnigmaAnalytics(id),
      ]);

      setEnigma(enigmaRes.data.data);
      setAnalytics(analyticsRes.data.data);

      // Check if user is following this enigma
      if (localStorage.getItem("token")) {
        try {
          const profileRes = await keeperAPI.getProfile();
          // Check if enigma is in user's followed list (if you implement this)
          // setIsFollowing(profileRes.data.data.followedEnigmas?.includes(parseInt(id)));
        } catch (error) {
          // Ignore - user not logged in or profile not found
        }
      }
    } catch (error) {
      toast.error("Failed to load enigma details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!localStorage.getItem("token")) {
      toast.error("Please login to like enigmas");
      navigate("/login");
      return;
    }

    try {
      // Toggle like/follow status
      if (isFollowing) {
        await keeperAPI.unfollow(id);
        toast.success("Removed from favorites");
      } else {
        await keeperAPI.follow(id);
        toast.success("Added to favorites");
      }
      setIsFollowing(!isFollowing);
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-300 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Unraveling the mystery...</div>
        </div>
      </div>
    );
  }

  if (!enigma) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Mystery Not Found
          </h2>
          <p className="text-gray-600 mb-6">
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
    enigma.metadata?.fragmentsClaimed && enigma.metadata?.totalFragments
      ? (enigma.metadata.fragmentsClaimed / enigma.metadata.totalFragments) *
        100
      : 0;

  return (
    <>
      <Helmet>
        <title>{enigma.name} | Puzzle Mysteries</title>
        <meta name="description" content={enigma.description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/mysteries")}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mysteries
          </button>
        </div>

        {/* Hero Banner */}
        <div className="relative h-[400px] lg:h-[500px] overflow-hidden rounded-2xl mx-4 lg:mx-0">
          <img
            src={enigma.bannerImage?.url || enigma.coverImage?.url}
            alt={enigma.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 to-transparent" />

          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="max-w-4xl">
                <div className="flex flex-wrap gap-2 mb-4">
                  {enigma.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-gray-300 text-sm text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                  {enigma.name}
                </h1>
                <p className="text-xl text-gray-700 max-w-3xl">
                  {enigma.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-8 right-8 flex gap-3">
            <button
              onClick={handleLike}
              className={`p-3 rounded-full backdrop-blur-sm border transition-all ${
                isLiked
                  ? "bg-red-100 border-red-300 text-red-500 shadow-sm"
                  : "bg-white/70 border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-300 hover:shadow-sm"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button className="p-3 rounded-full backdrop-blur-sm bg-white/70 border border-gray-300 text-gray-600 hover:text-primary-600 hover:border-primary-300 hover:shadow-sm transition-all">
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
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-soft">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                  <Eye className="w-5 h-5 text-primary-500" />
                  The Enigma Unveiled
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {enigma.fullDescription || enigma.description}
                  </p>
                </div>
              </div>

              {/* Lore */}
              {enigma.lore && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-soft">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                    <Sparkles className="w-5 h-5 text-secondary-500" />
                    Arcane Lore
                  </h2>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {enigma.lore}
                    </p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-soft">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {enigma.metadata?.totalChronicles || 0}
                  </div>
                  <div className="text-sm text-gray-600">Chronicles</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-soft">
                  <div className="text-3xl font-bold text-secondary-600 mb-2">
                    {enigma.stats?.activeKeepers || 0}
                  </div>
                  <div className="text-sm text-gray-600">Keepers</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-soft">
                  <div className="text-3xl font-bold text-accent-600 mb-2">
                    {enigma.stats?.completionRate || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Progress</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-soft">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {enigma.difficulty}
                  </div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Progress Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  Manifestation Progress
                </h3>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">Fragments Claimed</span>
                    <span className="font-bold text-gray-900">
                      {Math.round(percentageClaimed)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-1000"
                      style={{ width: `${percentageClaimed}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>
                      {enigma.metadata?.fragmentsClaimed || 0} claimed
                    </span>
                    <span>
                      {(enigma.metadata?.totalFragments || 0) -
                        (enigma.metadata?.fragmentsClaimed || 0)}{" "}
                      remaining
                    </span>
                  </div>
                </div>
                <Link
                  to={`/enigmas/${id}/chronicles`}
                  className="w-full btn-primary py-3"
                >
                  Explore Chronicles
                </Link>
              </div>

              {/* Info Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
                <h3 className="font-bold mb-4 text-gray-900">Enigma Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        enigma.status === "active"
                          ? "bg-green-100 text-green-700"
                          : enigma.status === "upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {enigma.status?.charAt(0).toUpperCase() +
                        enigma.status?.slice(1)}
                    </span>
                  </div>
                  {enigma.startDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Started</span>
                      <span className="font-medium text-gray-900">
                        {new Date(enigma.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {enigma.estimatedEnd && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Estimated End</span>
                      <span className="font-medium text-gray-900">
                        {new Date(enigma.estimatedEnd).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {enigma.creator && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Created by</span>
                      <span className="font-medium text-gray-900">
                        {enigma.creator.name}
                      </span>
                    </div>
                  )}
                  {enigma.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {enigma.location.virtual
                          ? "Virtual"
                          : enigma.location.city || "Unknown"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rewards Card */}
              {enigma.rewards && enigma.rewards.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Arcane Rewards
                  </h3>
                  <div className="space-y-3">
                    {enigma.rewards.map((reward, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <span className="text-2xl">{reward.icon || "🏆"}</span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {reward.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {reward.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chronicles Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900">
                  Chronicles
                </h2>
                <p className="text-gray-600">
                  Explore the collections within this enigma
                </p>
              </div>
              <Link
                to={`/enigmas/${id}/chronicles`}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-500 transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <ChronicleGrid enigmaId={id} />
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-12 shadow-medium">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Ready to Claim Your Fragment?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join {enigma.stats?.activeKeepers || 0} other keepers in
                unraveling this mystery. Your fragment awaits—claim it now and
                become part of puzzle history.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={`/enigmas/${id}/chronicles`}
                  className="btn-primary px-8 py-4 text-lg"
                >
                  <Lock className="w-5 h-5 inline mr-2" />
                  Browse Chronicles
                </Link>
                <button className="btn-outline px-8 py-4 text-lg">
                  <Users className="w-5 h-5 inline mr-2" />
                  Join Community
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
