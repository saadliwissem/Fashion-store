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

const ChronicleDetailHero = ({ chronicle }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const {
    id,
    name,
    description,
    lore,
    coverImage,
    fragmentCount,
    fragmentsClaimed,
    requiredFragments,
    difficulty,
    timeline,
    basePrice,
    location,
    author,
    featured,
  } = chronicle;

  const percentageClaimed = (fragmentsClaimed / fragmentCount) * 100;
  const thresholdReached = fragmentsClaimed >= requiredFragments;
  const fragmentsRemaining = fragmentCount - fragmentsClaimed;

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-orange-400";
      case "expert":
        return "text-red-400";
      default:
        return "text-gray-400";
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
      },
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-900 to-black">
      {/* Background Image with Overlay */}
      <div className="relative h-[500px] lg:h-[600px]">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        {/* Floating Elements */}
        <div className="absolute top-6 left-6">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-gray-700">
              <span className="text-sm font-medium text-gray-300">
                Chronicle #{id}
              </span>
            </div>
            {featured && (
              <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm border border-primary-500/30">
                <span className="text-sm font-medium text-primary-300 flex items-center gap-1">
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
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-full backdrop-blur-sm border transition-all ${
              isLiked
                ? "bg-red-500/20 border-red-500/30 text-red-400"
                : "bg-black/40 border-gray-700 text-gray-300 hover:text-red-400"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-3 rounded-full backdrop-blur-sm bg-black/40 border border-gray-700 text-gray-300 hover:text-white transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm z-50">
                {shareOptions.map((option) => (
                  <button
                    key={option.platform}
                    onClick={option.action}
                    className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors flex items-center gap-3"
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-gray-200">{option.platform}</span>
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
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <span className="hover:text-white cursor-pointer">
                    Enigmas
                  </span>
                  <span>→</span>
                  <span className="hover:text-white cursor-pointer">
                    Anime Chronicles
                  </span>
                  <span>→</span>
                  <span className="text-white font-medium">{name}</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">{name}</h1>

                {/* Description */}
                <p className="text-xl text-gray-300 mb-8 max-w-3xl">
                  {description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary-500/20 rounded-lg">
                      <Users className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {fragmentsClaimed}
                      </div>
                      <div className="text-sm text-gray-400">Keepers</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-secondary-500/20 rounded-lg">
                      <Lock className="w-5 h-5 text-secondary-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {fragmentsRemaining}
                      </div>
                      <div className="text-sm text-gray-400">Available</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-accent-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-accent-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{timeline}</div>
                      <div className="text-sm text-gray-400">Timeline</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Trophy className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div
                        className={`text-2xl font-bold ${getDifficultyColor()}`}
                      >
                        {difficulty.charAt(0).toUpperCase() +
                          difficulty.slice(1)}
                      </div>
                      <div className="text-sm text-gray-400">Difficulty</div>
                    </div>
                  </div>
                </div>

                {/* Author & Location */}
                <div className="flex flex-wrap gap-6 text-sm">
                  {author && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Curated by:</span>
                      <span className="font-medium">{author}</span>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">{location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Panel */}
              <div className="lg:w-96">
                <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                  <div className="mb-6">
                    <div className="text-4xl font-bold mb-2">${basePrice}</div>
                    <div className="text-gray-400">per fragment</div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">
                        Manifestation Progress
                      </span>
                      <span className="font-bold">
                        {Math.round(percentageClaimed)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
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
                    <div className="mb-6 p-4 bg-gradient-to-r from-accent-500/10 to-yellow-500/10 border border-accent-500/20 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <span className="font-medium text-accent-300">
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
                    <button className="w-full btn-primary py-4 text-lg font-bold">
                      <Eye className="w-5 h-5 inline mr-2" />
                      View Available Fragments
                    </button>
                    <button className="w-full btn-secondary py-4 text-lg font-bold">
                      <Sparkles className="w-5 h-5 inline mr-2" />
                      Join Waitlist
                    </button>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {fragmentCount}
                        </div>
                        <div className="text-xs text-gray-400">
                          Total Fragments
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {requiredFragments}
                        </div>
                        <div className="text-xs text-gray-400">
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
        <div className="p-8 lg:p-12">
          <div className="max-w-4xl">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              The Chronicle's Lore
            </h3>
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {lore}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Default props with sample data
ChronicleDetailHero.defaultProps = {
  chronicle: {
    id: 1,
    name: "The Straw Hat Legacy",
    description:
      "Unravel the mysteries of the Nine Straw Hats crew members. Each fragment represents a crew member with hidden clues woven into the design.",
    lore: "In the Grand Line, a legend speaks of nine individuals bound by fate, each carrying a fragment of a greater truth. Their journey, marked by laughter, tears, and unbreakable bonds, hides secrets that only the worthy can uncover.\n\nThis chronicle captures the essence of their adventure - nine fragments, nine stories, one ultimate mystery. Those who claim these fragments become part of the legend, guardians of secrets that could change the very fabric of reality.\n\nWill you be the one to piece together the Straw Hat's ultimate truth?",
    coverImage: "https://images.unsplash.com/photo-1635805737707-575885ab0820",
    fragmentCount: 9,
    fragmentsClaimed: 3,
    requiredFragments: 9,
    difficulty: "medium",
    timeline: "6-8 weeks",
    basePrice: 299.99,
    location: "Grand Line",
    author: "Mystery Weaver #42",
    featured: true,
  },
};

export default ChronicleDetailHero;
