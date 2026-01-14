import React from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  Users,
  Puzzle,
  Sparkles,
  Clock,
  Trophy,
  ChevronRight,
} from "lucide-react";

const EnigmaCard = ({ enigma }) => {
  const {
    id,
    name,
    description,
    status,
    coverImage,
    totalChronicles,
    totalFragments,
    fragmentsClaimed,
    difficulty,
    featured,
  } = enigma;

  const percentageClaimed =
    totalFragments > 0 ? (fragmentsClaimed / totalFragments) * 100 : 0;
  const fragmentsRemaining = totalFragments - fragmentsClaimed;

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        label: "Active Investigation",
        color: "bg-green-500/20 text-green-300",
        icon: Sparkles,
        iconColor: "text-green-400",
      },
      upcoming: {
        label: "Coming Soon",
        color: "bg-blue-500/20 text-blue-300",
        icon: Clock,
        iconColor: "text-blue-400",
      },
      archived: {
        label: "Solved & Archived",
        color: "bg-gray-500/20 text-gray-300",
        icon: Trophy,
        iconColor: "text-gray-400",
      },
      solved: {
        label: "Revealed",
        color: "bg-purple-500/20 text-purple-300",
        icon: Trophy,
        iconColor: "text-purple-400",
      },
    };
    return configs[status] || configs["active"];
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

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-puzzle ${
        featured
          ? "border-primary-500/30 bg-gradient-to-br from-gray-800 to-gray-900"
          : "border-gray-700 bg-gradient-to-br from-gray-800/80 to-gray-900/80"
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
            Featured Enigma
          </span>
        </div>
      )}

      {/* Background Image with Overlay */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />

        {/* Status Overlay */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color} flex items-center gap-1`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary-300 transition-colors">
            {name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Puzzle className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-gray-400">Chronicles</span>
            </div>
            <div className="text-lg font-bold">{totalChronicles}</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-secondary-400" />
              <span className="text-sm text-gray-400">Fragments</span>
            </div>
            <div className="text-lg font-bold">{totalFragments}</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-accent-400" />
              <span className="text-sm text-gray-400">Claimed</span>
            </div>
            <div className="text-lg font-bold">{fragmentsClaimed}</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Difficulty</span>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${difficultyConfig.color}`}
            >
              {difficultyConfig.label}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Fragments Claimed</span>
            <span className="font-bold">{Math.round(percentageClaimed)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-700"
              style={{ width: `${percentageClaimed}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{fragmentsClaimed} claimed</span>
            <span>{fragmentsRemaining} remaining</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/enigmas/${id}`}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-primary-500 group-hover:shadow-puzzle transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${statusConfig.color
                .replace("text-", "bg-")
                .replace("/20", "/10")}`}
            >
              <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor}`} />
            </div>
            <div className="text-left">
              <div className="font-bold">Investigate Enigma</div>
              <div className="text-sm text-gray-400">
                {status === "active"
                  ? "Join the investigation"
                  : status === "upcoming"
                  ? "Get notified when live"
                  : "View archived chronicles"}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary-400 transition-colors" />
        </Link>
      </div>

      {/* Hover Effects */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-500/20 rounded-2xl pointer-events-none transition-all duration-300" />
      {featured && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/10 via-transparent to-secondary-500/10 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
    </div>
  );
};

export default EnigmaCard;
