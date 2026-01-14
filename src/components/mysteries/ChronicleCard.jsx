import React from "react";
import { Link } from "react-router-dom";
import {
  Puzzle,
  Users,
  Lock,
  Clock,
  Sparkles,
  CheckCircle,
  Flame,
  ChevronRight,
} from "lucide-react";

const ChronicleCard = ({ chronicle }) => {
  const {
    id,
    enigmaId,
    name,
    description,
    status,
    coverImage,
    fragmentCount,
    fragmentsClaimed,
    requiredFragments,
    difficulty,
    timeline,
    price,
  } = chronicle;

  const percentageClaimed = (fragmentsClaimed / fragmentCount) * 100;
  const fragmentsRemaining = fragmentCount - fragmentsClaimed;
  const thresholdReached = fragmentsClaimed >= requiredFragments;

  const getStatusConfig = (status) => {
    const configs = {
      available: {
        label: "Seeking Keepers",
        color: "bg-green-500/20 text-green-300",
        icon: Lock,
        iconColor: "text-green-400",
        bgColor: "bg-green-500/10",
      },
      forging: {
        label: "In The Forge",
        color: "bg-orange-500/20 text-orange-300",
        icon: Flame,
        iconColor: "text-orange-400",
        bgColor: "bg-orange-500/10",
      },
      cipher: {
        label: "Cipher Active",
        color: "bg-purple-500/20 text-purple-300",
        icon: Puzzle,
        iconColor: "text-purple-400",
        bgColor: "bg-purple-500/10",
      },
      solved: {
        label: "Mystery Solved",
        color: "bg-gray-500/20 text-gray-300",
        icon: CheckCircle,
        iconColor: "text-gray-400",
        bgColor: "bg-gray-500/10",
      },
    };
    return configs[status] || configs["available"];
  };

  const getDifficultyConfig = (difficulty) => {
    const configs = {
      easy: { label: "Novice", color: "bg-green-500/20 text-green-300" },
      medium: { label: "Adept", color: "bg-yellow-500/20 text-yellow-300" },
      hard: { label: "Expert", color: "bg-orange-500/20 text-orange-300" },
      expert: { label: "Master", color: "bg-red-500/20 text-red-300" },
    };
    return configs[difficulty] || configs["medium"];
  };

  const statusConfig = getStatusConfig(status);
  const difficultyConfig = getDifficultyConfig(difficulty);
  const StatusIcon = statusConfig.icon;

  const getActionText = () => {
    switch (status) {
      case "available":
        return thresholdReached
          ? "View Fragments"
          : `Need ${requiredFragments - fragmentsClaimed} more`;
      case "forging":
        return "Track Production";
      case "cipher":
        return "Join Cipher";
      case "solved":
        return "View Solution";
      default:
        return "Investigate";
    }
  };

  return (
    <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-puzzle">
      {/* Background Image */}
      <div className="h-56 overflow-hidden relative">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.color} flex items-center gap-2`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {statusConfig.label}
          </span>
        </div>

        {/* Threshold Badge */}
        {thresholdReached && status === "available" && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Threshold Reached!
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3 group-hover:text-primary-300 transition-colors">
            {name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Puzzle className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-gray-400">Fragments</span>
              </div>
              <span className="font-bold">{fragmentCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-secondary-400" />
                <span className="text-sm text-gray-400">Claimed</span>
              </div>
              <span className="font-bold">{fragmentsClaimed}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent-400" />
                <span className="text-sm text-gray-400">Required</span>
              </div>
              <span className="font-bold">{requiredFragments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Timeline</span>
              </div>
              <span className="font-bold">{timeline}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Fragment Progress</span>
            <span className="font-bold">{Math.round(percentageClaimed)}%</span>
          </div>
          <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                thresholdReached
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500"
                  : "bg-gradient-to-r from-accent-500 to-yellow-500"
              }`}
              style={{ width: `${percentageClaimed}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{fragmentsClaimed} claimed</span>
            <span>{fragmentsRemaining} available</span>
          </div>
          {!thresholdReached && status === "available" && (
            <div className="mt-2 text-center">
              <span className="text-sm text-accent-400 font-medium">
                {requiredFragments - fragmentsClaimed} more needed to forge
              </span>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <div>
            <div className="text-2xl font-bold">${price}</div>
            <div className="text-sm text-gray-400">per fragment</div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-2 py-1 rounded-full ${difficultyConfig.color}`}
            >
              {difficultyConfig.label}
            </span>

            <Link
              to={`/enigmas/${enigmaId}/chronicles/${id}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-primary-500 hover:shadow-puzzle transition-all duration-300 group-hover:scale-105"
            >
              <span className="font-medium">{getActionText()}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-500/20 rounded-2xl pointer-events-none transition-all duration-300" />
    </div>
  );
};

export default ChronicleCard;
