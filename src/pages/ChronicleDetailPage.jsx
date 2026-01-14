import React, { useState } from "react";
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
  FragmentProgress,
  ChronicleOracle,
  ClaimRequestForm,
  WaitlistManager,
} from "../components/chronicles";

const ChronicleDetailPage = () => {
  const { enigmaId, chronicleId } = useParams();
  const navigate = useNavigate();

  const [selectedFragment, setSelectedFragment] = useState(null);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Sample chronicle data - in production, this would come from an API
  const chronicleData = {
    id: parseInt(chronicleId) || 1,
    enigmaId: parseInt(enigmaId) || 1,
    name: "The Straw Hat Legacy",
    description:
      "Unravel the mysteries of the Nine Straw Hats crew members. Each fragment represents a crew member with hidden clues woven into the design.",
    lore: "In the Grand Line, a legend speaks of nine individuals bound by fate, each carrying a fragment of a greater truth. Their journey, marked by laughter, tears, and unbreakable bonds, hides secrets that only the worthy can uncover.\n\nThis chronicle captures the essence of their adventure - nine fragments, nine stories, one ultimate mystery. Those who claim these fragments become part of the legend, guardians of secrets that could change the very fabric of reality.\n\nWill you be the one to piece together the Straw Hat's ultimate truth?",
    coverImage:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    fragmentCount: 9,
    fragmentsClaimed: 3,
    requiredFragments: 9,
    difficulty: "medium",
    timeline: "6-8 weeks",
    basePrice: 299.99,
    location: "Grand Line",
    author: "Mystery Weaver #42",
    featured: true,
    status: "available", // available, forging, cipher, solved
    productionStatus: "awaiting", // awaiting, design, forging, enchanting, shipping, delivered
    estimatedStartDate: "2024-02-15",
    estimatedCompletion: "2024-04-01",
    rewards: [
      "Limited edition crew member artifact",
      "Digital certificate of guardianship",
      "Exclusive access to cipher community",
      "Legendary puzzle solver title",
    ],
  };

  const handleFragmentSelect = (fragment) => {
    if (fragment.status === "available") {
      setSelectedFragment(fragment);
      setShowClaimForm(true);
    } else {
      toast.error("This fragment has already been claimed");
    }
  };

  const handleClaimSubmit = (claimData) => {
    console.log("Claim submitted:", claimData);
    toast.success(
      `Successfully claimed Fragment #${claimData.fragment.number}!`
    );
    setShowClaimForm(false);
    setSelectedFragment(null);

    // In production, this would trigger API call and update state
  };

  const handleThresholdReached = () => {
    toast.success("Production threshold reached! Forging ritual initiated.");
    // In production, this would trigger production workflow
  };

  const isFullyClaimed =
    chronicleData.fragmentsClaimed >= chronicleData.fragmentCount;
  const thresholdReached =
    chronicleData.fragmentsClaimed >= chronicleData.requiredFragments;

  return (
    <>
      <Helmet>
        <title>{chronicleData.name} | Puzzle Chronicles</title>
        <meta name="description" content={chronicleData.description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/mysteries/${enigmaId}`)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Enigma
            </button>
            <div className="text-gray-500">|</div>
            <Link
              to="/mysteries"
              className="text-gray-400 hover:text-white transition-colors"
            >
              All Mysteries
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <ChronicleDetailHero chronicle={chronicleData} />

        <div className="container mx-auto px-4 py-8">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column - Fragments & Progress */}
            <div className="lg:col-span-2 space-y-8">
              {/* Fragment Progress */}
              <FragmentProgress
                fragmentsClaimed={chronicleData.fragmentsClaimed}
                totalFragments={chronicleData.fragmentCount}
                requiredForProduction={chronicleData.requiredFragments}
                productionStatus={chronicleData.productionStatus}
                onThresholdReached={handleThresholdReached}
              />

              {/* Fragment Grid */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Available Fragments
                    </h2>
                    <p className="text-gray-400">
                      Select a fragment to claim and become its guardian
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-400">
                      {chronicleData.fragmentCount -
                        chronicleData.fragmentsClaimed}
                      /{chronicleData.fragmentCount}
                    </div>
                    <div className="text-sm text-gray-400">Available</div>
                  </div>
                </div>

                {isFullyClaimed ? (
                  <WaitlistManager
                    chronicle={chronicleData}
                    currentUserPosition={42}
                  />
                ) : (
                  <FragmentGrid onFragmentSelect={handleFragmentSelect} />
                )}
              </div>

              {/* Oracle Predictions */}
              <ChronicleOracle chronicle={chronicleData} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700 p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary-400" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() =>
                      document
                        .getElementById("fragments-grid")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-primary-500 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-500/20 rounded-lg">
                        <Eye className="w-5 h-5 text-primary-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold">Browse Fragments</div>
                        <div className="text-sm text-gray-400">
                          View all available pieces
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary-400 transition-colors" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-secondary-500 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary-500/20 rounded-lg">
                        <Users className="w-5 h-5 text-secondary-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold">Join Community</div>
                        <div className="text-sm text-gray-400">
                          Connect with other keepers
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-secondary-400 transition-colors" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-accent-500 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent-500/20 rounded-lg">
                        <Package className="w-5 h-5 text-accent-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold">Track Production</div>
                        <div className="text-sm text-gray-400">
                          View manufacturing status
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-accent-400 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Production Timeline */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700 p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent-400" />
                  Production Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Current Phase</span>
                    <span className="px-2 py-1 rounded text-xs font-bold bg-gray-700">
                      {chronicleData.productionStatus.charAt(0).toUpperCase() +
                        chronicleData.productionStatus.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Estimated Start</span>
                    <span className="font-medium">
                      {chronicleData.estimatedStartDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Estimated Completion</span>
                    <span className="font-medium">
                      {chronicleData.estimatedCompletion}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Timeline</span>
                    <span className="font-medium">
                      {chronicleData.timeline}
                    </span>
                  </div>
                </div>

                {!thresholdReached && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-accent-500/10 to-yellow-500/10 border border-accent-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <span className="font-medium text-accent-300">
                          {chronicleData.requiredFragments -
                            chronicleData.fragmentsClaimed}{" "}
                          more needed
                        </span>{" "}
                        to begin production
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Security & Authenticity */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700 p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Security & Authenticity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-sm">
                      NFT Certificate of Authenticity
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-sm">Blockchain-Verified Ownership</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-sm">Unique Serial Numbering</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-sm">Anti-Counterfeit Features</div>
                  </div>
                </div>
              </div>

              {/* Rewards */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700 p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Keeper Rewards
                </h3>
                <div className="space-y-3">
                  {chronicleData.rewards.map((reward, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">{reward}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          {!isFullyClaimed && (
            <div className="text-center mb-12">
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-3xl border border-gray-700 p-12">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Become a Keeper?
                </h2>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                  Claim your fragment now and join{" "}
                  {chronicleData.fragmentsClaimed} other guardians in unraveling
                  this mystery. Each fragment is globally unique and comes with
                  exclusive benefits.
                </p>
                <button
                  onClick={() =>
                    document
                      .getElementById("fragments-grid")
                      .scrollIntoView({ behavior: "smooth" })
                  }
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
            <h3 className="text-2xl font-bold mb-6">
              More Chronicles in This Enigma
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* This would be populated with related chronicles from API */}
              <div className="text-center py-12 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700">
                <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">More chronicles coming soon</p>
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
