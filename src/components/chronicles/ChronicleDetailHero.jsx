import React, { useState } from "react";
import {
  Sparkles,
  Users,
  Lock,
  Clock,
  MapPin,
  Share2,
  Heart,
  Eye,
  AlertTriangle,
  Trophy,
} from "lucide-react";

const ChronicleDetailHero = ({
  chronicle,
  onLike,
  onShare,
  isLiked = false,
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Map API data to component props with fallbacks
  const {
    _id,
    name = "Unknown Chronicle",
    description = "No description available",
    lore = "",
    coverImage = {},
    stats = {},
    difficulty = "medium",
    timeline = "TBD",
    basePrice = 0,
    location = {},
    author = {},
    featured = false,
  } = chronicle;

  const fragmentCount = stats?.fragmentCount || 0;
  const fragmentsClaimed = stats?.fragmentsClaimed || 0;
  const requiredFragments = stats?.requiredFragments || 0;

  const percentageClaimed =
    fragmentCount > 0 ? (fragmentsClaimed / fragmentCount) * 100 : 0;
  const thresholdReached = fragmentsClaimed >= requiredFragments;
  const fragmentsRemaining = fragmentCount - fragmentsClaimed;

  const getDifficultyColor = () => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
      case "beginner":
        return "text-green-600";
      case "medium":
      case "intermediate":
        return "text-yellow-600";
      case "hard":
        return "text-orange-600";
      case "expert":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const shareOptions = [
    {
      platform: "Twitter",
      icon: "🐦",
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `Check out "${name}" on Puzzle - ${window.location.href}`
          )}`
        ),
    },
    {
      platform: "Facebook",
      icon: "📘",
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            window.location.href
          )}`
        ),
    },
    {
      platform: "Copy Link",
      icon: "🔗",
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        setShowShareMenu(false);
        if (onShare) onShare();
      },
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-medium">
      {/* Background Image with Overlay */}
      <div className="relative h-[500px] lg:h-[600px] rounded-t-2xl overflow-hidden">
        <img
          src={coverImage?.url || coverImage}
          alt={coverImage?.alt || name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 to-transparent" />

        {/* Floating Elements */}
        <div className="absolute top-6 left-6">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-300">
              <span className="text-sm font-medium text-gray-700">
                Chronicle #{_id?.slice(-4) || "0000"}
              </span>
            </div>
            {featured && (
              <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 backdrop-blur-sm border border-primary-200">
                <span className="text-sm font-medium text-primary-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={onLike}
            className={`p-3 rounded-full backdrop-blur-sm border transition-all ${
              isLiked
                ? "bg-red-100 border-red-300 text-red-500 shadow-sm"
                : "bg-white/70 border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-300 hover:shadow-sm"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-3 rounded-full backdrop-blur-sm bg-white/70 border border-gray-300 text-gray-600 hover:text-primary-600 hover:border-primary-300 hover:shadow-sm transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg backdrop-blur-sm z-50">
                {shareOptions.map((option) => (
                  <button
                    key={option.platform}
                    onClick={option.action}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-gray-700">{option.platform}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="flex-1">
                {/* Breadcrumb - You might want to make these dynamic */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span className="hover:text-primary-600 cursor-pointer">
                    Enigmas
                  </span>
                  <span>→</span>
                  <span className="hover:text-primary-600 cursor-pointer">
                    {chronicle.enigma?.name || "Enigma"}
                  </span>
                  <span>→</span>
                  <span className="text-gray-900 font-medium">{name}</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                  {name}
                </h1>

                {/* Description */}
                <p className="text-xl text-gray-700 mb-8 max-w-3xl">
                  {description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Users className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {fragmentsClaimed}
                      </div>
                      <div className="text-sm text-gray-600">Keepers</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-secondary-100 rounded-lg">
                      <Lock className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {fragmentsRemaining}
                      </div>
                      <div className="text-sm text-gray-600">Available</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-accent-100 rounded-lg">
                      <Clock className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {timeline}
                      </div>
                      <div className="text-sm text-gray-600">Timeline</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Trophy className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div
                        className={`text-2xl font-bold ${getDifficultyColor()}`}
                      >
                        {difficulty?.charAt(0).toUpperCase() +
                          difficulty?.slice(1)}
                      </div>
                      <div className="text-sm text-gray-600">Difficulty</div>
                    </div>
                  </div>
                </div>

                {/* Author & Location */}
                <div className="flex flex-wrap gap-6 text-sm">
                  {author?.name && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Curated by:</span>
                      <span className="font-medium text-gray-900">
                        {author.name}
                      </span>
                    </div>
                  )}
                  {(location?.city ||
                    location?.country ||
                    location?.virtual) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {location.virtual
                          ? "Virtual"
                          : location.city || location.country || "Unknown"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Panel */}
              <div className="lg:w-96">
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
                  <div className="mb-6">
                    <div className="text-4xl font-bold mb-2 text-gray-900">
                      ${basePrice?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-gray-600">per fragment</div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">
                        Manifestation Progress
                      </span>
                      <span className="font-bold text-gray-900">
                        {Math.round(percentageClaimed)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          thresholdReached
                            ? "bg-gradient-to-r from-primary-500 to-secondary-500"
                            : "bg-gradient-to-r from-accent-500 to-yellow-500"
                        }`}
                        style={{ width: `${percentageClaimed}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{fragmentsClaimed} claimed</span>
                      <span>{fragmentsRemaining} remaining</span>
                    </div>
                  </div>

                  {/* Threshold Alert */}
                  {!thresholdReached && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-accent-50 to-yellow-50 border border-accent-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-700">
                          <span className="font-medium text-accent-700">
                            {requiredFragments - fragmentsClaimed} more fragment
                            {requiredFragments - fragmentsClaimed !== 1
                              ? "s"
                              : ""}
                          </span>{" "}
                          needed to begin the forging ritual.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        const fragmentGrid =
                          document.getElementById("fragments-grid");
                        if (fragmentGrid)
                          fragmentGrid.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full btn-primary py-4 text-lg font-bold"
                    >
                      <Eye className="w-5 h-5 inline mr-2" />
                      View Available Fragments
                    </button>
                    <button className="w-full btn-secondary py-4 text-lg font-bold">
                      <Sparkles className="w-5 h-5 inline mr-2" />
                      Join Waitlist
                    </button>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {fragmentCount}
                        </div>
                        <div className="text-xs text-gray-600">
                          Total Fragments
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {requiredFragments}
                        </div>
                        <div className="text-xs text-gray-600">
                          Required to Forge
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lore Section */}
      {lore && (
        <div className="p-8 lg:p-12 bg-white">
          <div className="max-w-4xl">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
              <Sparkles className="w-6 h-6 text-primary-600" />
              The Chronicle's Lore
            </h3>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {lore}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChronicleDetailHero;
