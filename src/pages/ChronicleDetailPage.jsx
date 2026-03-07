import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  ArrowLeft,
  Share2,
  Heart,
  Lock,
  Users,
  Clock,
  Sparkles,
  AlertTriangle,
  Key,
  Eye,
  ChevronRight,
  Package,
  Shield,
  Trophy,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  ChronicleDetailHero,
  FragmentGrid,
  ChronicleOracle,
  ClaimRequestForm,
  WaitlistManager,
} from "../components/chronicles";
import { FragmentProgress } from "../components/mysteries";
import {
  chronicleAPI,
  fragmentAPI,
  analyticsAPI,
  waitlistAPI,
  keeperAPI,
  claimAPI,
} from "../services/api";

const ChronicleDetailPage = () => {
  const { enigmaId, chronicleId } = useParams();
  const navigate = useNavigate();

  const [chronicle, setChronicle] = useState(null);
  const [fragments, setFragments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [waitlistStats, setWaitlistStats] = useState(null);
  const [userWaitlistPosition, setUserWaitlistPosition] = useState(null);
  const [selectedFragment, setSelectedFragment] = useState(null);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    fetchChronicleData();
  }, [chronicleId]);

  const fetchChronicleData = async () => {
    try {
      setLoading(true);

      // Fetch all chronicle data in parallel
      const promises = [
        chronicleAPI.getOne(chronicleId),
        chronicleAPI.getFragments(chronicleId),
        chronicleAPI.getWaitlistStats(chronicleId),
        chronicleAPI.getProgress(chronicleId),
      ];

      // Only fetch analytics if chronicle exists (we'll handle this after)
      // Add analytics promise but we'll handle errors gracefully
      const analyticsPromise = analyticsAPI
        .getChronicleAnalytics(chronicleId)
        .catch(() => null);

      const [
        chronicleRes,
        fragmentsRes,
        waitlistRes,
        progressRes,
        analyticsRes,
      ] = await Promise.all([...promises, analyticsPromise]);

      setChronicle(chronicleRes.data.data);
      setFragments(fragmentsRes.data.data);
      setWaitlistStats(waitlistRes.data.data);
      setProgress(progressRes.data.data);

      if (analyticsRes) {
        setAnalytics(analyticsRes.data.data);
      }

      // Get user's waitlist position only if authenticated
      if (isAuthenticated) {
        try {
          const positionRes = await waitlistAPI.getUserPosition(chronicleId);
          setUserWaitlistPosition(positionRes.data.data);
        } catch (error) {
          // User not on waitlist or error - just set to null
          console.log("No waitlist position found for user");
          setUserWaitlistPosition(null);
        }
      }
    } catch (error) {
      console.error("Failed to load chronicle details:", error);
      toast.error("Failed to load chronicle details");
    } finally {
      setLoading(false);
    }
  };

  const handleFragmentSelect = (fragment) => {
    if (!isAuthenticated) {
      toast.error("Please login to claim fragments");
      navigate("/login");
      return;
    }

    if (fragment.status === "available") {
      setSelectedFragment(fragment);
      setShowClaimForm(true);
    } else {
      toast.error("This fragment has already been claimed");
    }
  };

  const handleClaimSubmit = async (claimData) => {
    try {
      // Submit claim to API
      const response = await claimAPI.create({
        fragmentId: selectedFragment._id,
        userData: claimData.userData,
        paymentMethod: claimData.paymentMethod,
      });

      toast.success(
        `Successfully claimed Fragment #${selectedFragment.number}!`
      );
      setShowClaimForm(false);
      setSelectedFragment(null);

      // Refresh fragment data to show updated status
      const fragmentsRes = await chronicleAPI.getFragments(chronicleId);
      setFragments(fragmentsRes.data.data);

      // Refresh chronicle data to update stats
      const chronicleRes = await chronicleAPI.getOne(chronicleId);
      setChronicle(chronicleRes.data.data);

      // Refresh progress
      const progressRes = await chronicleAPI.getProgress(chronicleId);
      setProgress(progressRes.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit claim");
      console.error(error);
    }
  };

  const handleThresholdReached = () => {
    toast.success("Production threshold reached! Forging ritual initiated.");
    // This would trigger production workflow on the backend
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save chronicles");
      navigate("/login");
      return;
    }

    try {
      // Toggle like/follow status
      if (isLiked) {
        // await keeperAPI.unfollowChronicle(chronicleId);
        toast.success("Removed from favorites");
      } else {
        // await keeperAPI.followChronicle(chronicleId);
        toast.success("Added to favorites");
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  };

  const handleJoinWaitlist = async (preferences) => {
    if (!isAuthenticated) {
      toast.error("Please login to join waitlist");
      navigate("/login");
      return;
    }

    try {
      const response = await waitlistAPI.join({
        chronicleId,
        email: preferences.email,
        preferences,
      });

      toast.success("Successfully joined waitlist!");

      // Refresh waitlist stats and user position
      const [waitlistRes, positionRes] = await Promise.all([
        chronicleAPI.getWaitlistStats(chronicleId),
        waitlistAPI.getUserPosition(chronicleId),
      ]);

      setWaitlistStats(waitlistRes.data.data);
      setUserWaitlistPosition(positionRes.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join waitlist");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: chronicle.name,
          text: chronicle.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-300 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Unraveling the chronicle...</div>
        </div>
      </div>
    );
  }

  if (!chronicle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Chronicle Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            This chronicle seems to have vanished from reality.
          </p>
          <button
            onClick={() => navigate(`/enigmas/${enigmaId}`)}
            className="btn-primary"
          >
            Return to Enigma
          </button>
        </div>
      </div>
    );
  }

  const isFullyClaimed =
    chronicle.stats?.fragmentsClaimed >= chronicle.stats?.fragmentCount;
  const thresholdReached =
    chronicle.stats?.fragmentsClaimed >= chronicle.stats?.requiredFragments;

  return (
    <>
      <Helmet>
        <title>{chronicle.name} | Puzzle Chronicles</title>
        <meta name="description" content={chronicle.description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/enigmas/${enigmaId}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Enigma
            </button>
            <div className="text-gray-400">|</div>
            <Link
              to="/mysteries"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              All Mysteries
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <ChronicleDetailHero
          chronicle={chronicle}
          onLike={handleLike}
          onShare={handleShare}
          isLiked={isLiked}
        />

        <div className="container mx-auto px-4 py-8">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column - Fragments & Progress */}
            <div className="lg:col-span-2 space-y-8">
              {/* Fragment Progress */}
              <FragmentProgress
                fragmentsClaimed={chronicle.stats?.fragmentsClaimed || 0}
                totalFragments={chronicle.stats?.fragmentCount || 0}
                requiredForProduction={chronicle.stats?.requiredFragments || 0}
                productionStatus={chronicle.productionStatus}
                onThresholdReached={handleThresholdReached}
              />

              {/* Fragment Grid */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-soft">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">
                      Available Fragments
                    </h2>
                    <p className="text-gray-600">
                      Select a fragment to claim and become its guardian
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {chronicle.stats?.fragmentCount -
                        chronicle.stats?.fragmentsClaimed}
                      /{chronicle.stats?.fragmentCount}
                    </div>
                    <div className="text-sm text-gray-500">Available</div>
                  </div>
                </div>

                {isFullyClaimed ? (
                  <WaitlistManager
                    chronicle={chronicle}
                    currentUserPosition={userWaitlistPosition}
                    waitlistData={waitlistStats}
                    onJoinWaitlist={handleJoinWaitlist}
                    isAuthenticated={isAuthenticated}
                  />
                ) : (
                  <FragmentGrid
                    fragments={fragments}
                    onFragmentSelect={handleFragmentSelect}
                  />
                )}
              </div>

              {/* Oracle Predictions */}
              {analytics && (
                <ChronicleOracle analytics={analytics} chronicle={chronicle} />
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
                  <Key className="w-5 h-5 text-primary-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() =>
                      document
                        .getElementById("fragments-grid")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-primary-400 hover:shadow-medium transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Eye className="w-5 h-5 text-primary-500" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-gray-900">
                          Browse Fragments
                        </div>
                        <div className="text-sm text-gray-600">
                          View all available pieces
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </button>

                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.error("Please login to join community");
                        navigate("/login");
                      } else {
                        // Navigate to community/discussion page
                        toast.info("Community feature coming soon!");
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-secondary-400 hover:shadow-medium transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary-50 rounded-lg">
                        <Users className="w-5 h-5 text-secondary-500" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-gray-900">
                          Join Community
                        </div>
                        <div className="text-sm text-gray-600">
                          Connect with other keepers
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-secondary-500 transition-colors" />
                  </button>

                  <button
                    onClick={() => {
                      if (progress) {
                        // Scroll to production status
                        document
                          .getElementById("production-status")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-accent-400 hover:shadow-medium transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent-50 rounded-lg">
                        <Package className="w-5 h-5 text-accent-500" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-gray-900">
                          Track Production
                        </div>
                        <div className="text-sm text-gray-600">
                          View manufacturing status
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-accent-500 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Production Timeline */}
              <div
                id="production-status"
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft"
              >
                <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
                  <Clock className="w-5 h-5 text-accent-500" />
                  Production Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Phase</span>
                    <span className="px-2 py-1 rounded text-xs font-bold bg-accent-100 text-accent-800">
                      {chronicle.productionStatus?.charAt(0).toUpperCase() +
                        chronicle.productionStatus?.slice(1) || "Awaiting"}
                    </span>
                  </div>
                  {chronicle.estimatedStartDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Estimated Start</span>
                      <span className="font-medium text-gray-900">
                        {new Date(
                          chronicle.estimatedStartDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {chronicle.estimatedCompletion && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Estimated Completion
                      </span>
                      <span className="font-medium text-gray-900">
                        {new Date(
                          chronicle.estimatedCompletion
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Timeline</span>
                    <span className="font-medium text-gray-900">
                      {chronicle.timeline || "TBD"}
                    </span>
                  </div>
                </div>

                {!thresholdReached &&
                  chronicle.productionStatus === "awaiting" && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-accent-50 to-yellow-50 border border-accent-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-700">
                          <span className="font-medium text-accent-600">
                            {chronicle.stats?.requiredFragments -
                              chronicle.stats?.fragmentsClaimed}{" "}
                            more needed
                          </span>{" "}
                          to begin production
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* Security & Authenticity */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
                  <Shield className="w-5 h-5 text-green-500" />
                  Security & Authenticity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-sm text-gray-700">
                      NFT Certificate of Authenticity
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-sm text-gray-700">
                      Blockchain-Verified Ownership
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-sm text-gray-700">
                      Unique Serial Numbering
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-sm text-gray-700">
                      Anti-Counterfeit Features
                    </div>
                  </div>
                </div>
              </div>

              {/* Rewards */}
              {chronicle.rewards && chronicle.rewards.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Keeper Rewards
                  </h3>
                  <div className="space-y-3">
                    {chronicle.rewards.map((reward, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-700">
                          {typeof reward === "string"
                            ? reward
                            : reward.name || "Reward"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Section */}
          {!isFullyClaimed && (
            <div className="text-center mb-12">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-12 shadow-medium">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                  Ready to Become a Keeper?
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Claim your fragment now and join{" "}
                  {chronicle.stats?.fragmentsClaimed || 0} other guardians in
                  unraveling this mystery. Each fragment is globally unique and
                  comes with exclusive benefits.
                </p>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error("Please login to claim fragments");
                      navigate("/login");
                    } else {
                      document
                        .getElementById("fragments-grid")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="btn-primary px-8 py-4 text-lg"
                >
                  <Lock className="w-5 h-5 inline mr-2" />
                  Browse Available Fragments
                </button>
              </div>
            </div>
          )}

          {/* Related Chronicles */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              More Chronicles in This Enigma
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* This would be populated with related chronicles from API */}
              <div className="text-center py-12 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-soft">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">More chronicles coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Claim Request Form Modal */}
        {showClaimForm && selectedFragment && (
          <ClaimRequestForm
            fragment={selectedFragment}
            onClose={() => {
              setShowClaimForm(false);
              setSelectedFragment(null);
            }}
            onSubmit={handleClaimSubmit}
          />
        )}
      </div>
    </>
  );
};

export default ChronicleDetailPage;
