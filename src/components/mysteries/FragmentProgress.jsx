import React, { useState, useEffect } from "react";
import {
  Trophy,
  Users,
  Lock,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const FragmentProgress = ({
  fragmentsClaimed = 0,
  totalFragments = 9,
  requiredForProduction = 9,
  productionStatus = "awaiting",
  onThresholdReached,
}) => {
  const [progress, setProgress] = useState(0);

  const percentage = (fragmentsClaimed / totalFragments) * 100;
  const fragmentsRemaining = totalFragments - fragmentsClaimed;
  const neededForProduction = Math.max(
    0,
    requiredForProduction - fragmentsClaimed
  );
  const thresholdReached = fragmentsClaimed >= requiredForProduction;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  useEffect(() => {
    if (
      thresholdReached &&
      onThresholdReached &&
      productionStatus === "awaiting"
    ) {
      onThresholdReached();
    }
  }, [thresholdReached, onThresholdReached, productionStatus]);

  const getProductionStatusConfig = () => {
    const configs = {
      awaiting: {
        label: "Awakening the Forge",
        color: "bg-gray-500/20 text-gray-300",
        icon: Clock,
        description: "Waiting for enough keepers to begin creation",
      },
      design: {
        label: "Arcane Design",
        color: "bg-blue-500/20 text-blue-300",
        icon: Lock,
        description: "Crafting the mystical patterns and sigils",
      },
      forging: {
        label: "In The Forge",
        color: "bg-orange-500/20 text-orange-300",
        icon: Trophy,
        description: "Manifesting physical form with ancient techniques",
      },
      enchanting: {
        label: "Enchantment Phase",
        color: "bg-purple-500/20 text-purple-300",
        icon: AlertCircle,
        description: "Imbuing with hidden clues and magical properties",
      },
      shipping: {
        label: "Dispatching to Keepers",
        color: "bg-green-500/20 text-green-300",
        icon: CheckCircle,
        description: "Preparing for delivery to fragment guardians",
      },
      delivered: {
        label: "In Keepers' Hands",
        color: "bg-emerald-500/20 text-emerald-300",
        icon: Users,
        description: "All fragments delivered to their guardians",
      },
    };
    return configs[productionStatus] || configs["awaiting"];
  };

  const productionStatusConfig = getProductionStatusConfig();
  const StatusIcon = productionStatusConfig.icon;

  const getFragmentIcon = (index) => {
    if (index < fragmentsClaimed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (index < requiredForProduction) {
      return <Lock className="w-5 h-5 text-yellow-500" />;
    } else {
      return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold mb-2">Fragment Convergence</h3>
          <p className="text-gray-400 text-sm">
            Collect all fragments to unlock the mystery
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-full ${productionStatusConfig.color} flex items-center gap-2`}
        >
          <StatusIcon className="w-4 h-4" />
          <span className="font-medium">{productionStatusConfig.label}</span>
        </div>
      </div>

      {/* Main Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-300">Fragment Manifestation</div>
          <div className="text-lg font-bold">{Math.round(progress)}%</div>
        </div>

        <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <div className="text-gray-400">
            {fragmentsClaimed} of {totalFragments} claimed
          </div>
          <div
            className={`font-medium ${
              thresholdReached ? "text-green-400" : "text-accent-400"
            }`}
          >
            {fragmentsRemaining} remaining
          </div>
        </div>
      </div>

      {/* Fragment Visualization */}
      <div className="mb-8">
        <div className="text-sm text-gray-300 mb-4">Fragment Assembly</div>
        <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
          {Array.from({ length: totalFragments }).map((_, index) => (
            <div
              key={index}
              className={`
                aspect-square rounded-lg flex items-center justify-center
                transition-all duration-300 hover:scale-110
                ${
                  index < fragmentsClaimed
                    ? "bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30"
                    : index < requiredForProduction
                    ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30"
                    : "bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600"
                }
              `}
              title={`Fragment ${index + 1}: ${
                index < fragmentsClaimed ? "Claimed" : "Available"
              }`}
            >
              {getFragmentIcon(index)}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <Users className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{fragmentsClaimed}</div>
              <div className="text-sm text-gray-400">Keeper Guardians</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-500/20 rounded-lg">
              <Lock className="w-5 h-5 text-secondary-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{neededForProduction}</div>
              <div className="text-sm text-gray-400">Needed for Forge</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalFragments}</div>
              <div className="text-sm text-gray-400">Total Fragments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Status */}
      <div className="pt-6 border-t border-gray-700">
        <div className="text-sm text-gray-300 mb-3">Current Phase</div>
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-4 border border-gray-700">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg ${productionStatusConfig.color
                .replace("text-", "bg-")
                .replace("/20", "/10")}`}
            >
              <StatusIcon
                className={`w-5 h-5 ${productionStatusConfig.color
                  .replace("bg-", "text-")
                  .replace("/20", "")}`}
              />
            </div>
            <div>
              <div className="font-medium">{productionStatusConfig.label}</div>
              <div className="text-sm text-gray-400 mt-1">
                {productionStatusConfig.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Threshold Alert */}
      {!thresholdReached && productionStatus === "awaiting" && (
        <div className="mt-6 p-4 bg-gradient-to-r from-accent-500/10 to-yellow-500/10 border border-accent-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-accent-400 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-accent-300">
                {neededForProduction} more fragment
                {neededForProduction !== 1 ? "s" : ""}
              </span>{" "}
              need{neededForProduction === 1 ? "s" : ""} to be claimed before
              the forging ritual can begin.
            </div>
          </div>
        </div>
      )}

      {thresholdReached && productionStatus === "awaiting" && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-green-300">
                Threshold reached!
              </span>{" "}
              The forging ritual has been initiated. Keepers will receive
              updates as creation progresses.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FragmentProgress;
