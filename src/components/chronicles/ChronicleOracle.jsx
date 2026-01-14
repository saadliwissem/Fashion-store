import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Eye,
  Zap,
  Activity,
  Target,
  PieChart,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const ChronicleOracle = ({ chronicle }) => {
  const [stats, setStats] = useState({
    fragmentsClaimed: chronicle?.fragmentsClaimed || 0,
    fragmentsRemaining:
      chronicle?.fragmentCount - chronicle?.fragmentsClaimed || 0,
    requiredForProduction: chronicle?.requiredFragments || 0,
    daysUntilThreshold: 14,
    estimatedCompletion: "2024-03-15",
    averageClaimRate: 2.3,
    completionProbability: 85,
    totalValueLocked:
      (chronicle?.fragmentsClaimed || 0) * (chronicle?.basePrice || 299.99),
    recentActivity: 12,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState("Just now");

  const refreshStats = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setStats((prev) => ({
        ...prev,
        fragmentsClaimed: Math.min(
          chronicle?.fragmentCount || 9,
          prev.fragmentsClaimed + 1
        ),
        fragmentsRemaining: Math.max(
          0,
          (chronicle?.fragmentCount || 9) - (prev.fragmentsClaimed + 1)
        ),
        totalValueLocked:
          (prev.fragmentsClaimed + 1) * (chronicle?.basePrice || 299.99),
        recentActivity: prev.recentActivity + Math.floor(Math.random() * 3),
      }));
      setIsRefreshing(false);
      setTimeSinceUpdate("Just now");
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      if (seconds < 60) {
        setTimeSinceUpdate(`${seconds} second${seconds !== 1 ? "s" : ""} ago`);
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setTimeSinceUpdate(`${minutes} minute${minutes !== 1 ? "s" : ""} ago`);
      } else {
        const hours = Math.floor(seconds / 3600);
        setTimeSinceUpdate(`${hours} hour${hours !== 1 ? "s" : ""} ago`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startTime = Date.now();

  const thresholdReached =
    stats.fragmentsClaimed >= stats.requiredForProduction;
  const percentageToThreshold =
    (stats.fragmentsClaimed / stats.requiredForProduction) * 100;
  const daysPerFragment =
    stats.averageClaimRate > 0
      ? stats.fragmentsRemaining / stats.averageClaimRate
      : 0;

  const getCompletionProbabilityColor = (probability) => {
    if (probability >= 90) return "text-green-400";
    if (probability >= 70) return "text-yellow-400";
    if (probability >= 50) return "text-orange-400";
    return "text-red-400";
  };

  const getProbabilityBarColor = (probability) => {
    if (probability >= 90) return "bg-green-500";
    if (probability >= 70) return "bg-yellow-500";
    if (probability >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-gray-700 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-2 flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary-500" />
            Chronicle Oracle
          </h2>
          <p className="text-gray-400">
            Real-time predictions and insights for this mystery
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">Updated {timeSinceUpdate}</div>
          <button
            onClick={refreshStats}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-500/20 rounded-lg">
              <Users className="w-6 h-6 text-primary-400" />
            </div>
            <div
              className={`text-2xl font-bold ${
                thresholdReached ? "text-green-400" : "text-white"
              }`}
            >
              {stats.fragmentsClaimed}/{chronicle?.fragmentCount || 9}
            </div>
          </div>
          <div className="text-sm text-gray-400">Fragments Claimed</div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-1000"
              style={{
                width: `${
                  (stats.fragmentsClaimed / (chronicle?.fragmentCount || 9)) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary-500/20 rounded-lg">
              <Target className="w-6 h-6 text-secondary-400" />
            </div>
            <div className="text-2xl font-bold">
              {stats.requiredForProduction - stats.fragmentsClaimed}
            </div>
          </div>
          <div className="text-sm text-gray-400">Needed for Production</div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                thresholdReached ? "bg-green-500" : "bg-accent-500"
              }`}
              style={{ width: `${percentageToThreshold}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-accent-400" />
            </div>
            <div className="text-2xl font-bold">{stats.daysUntilThreshold}</div>
          </div>
          <div className="text-sm text-gray-400">Days to Threshold</div>
          <div className="text-xs text-gray-500 mt-2">
            {daysPerFragment > 0
              ? `~${daysPerFragment.toFixed(1)} days per fragment`
              : "Calculating..."}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold">
              ${stats.totalValueLocked.toLocaleString()}
            </div>
          </div>
          <div className="text-sm text-gray-400">Total Value Locked</div>
          <div className="text-xs text-gray-500 mt-2">
            ${(chronicle?.basePrice || 299.99).toFixed(2)} per fragment
          </div>
        </div>
      </div>

      {/* Prediction Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Completion Probability */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700 p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary-500" />
            Completion Probability
          </h3>

          <div className="text-center mb-6">
            <div
              className={`text-5xl font-bold mb-2 ${getCompletionProbabilityColor(
                stats.completionProbability
              )}`}
            >
              {stats.completionProbability}%
            </div>
            <div className="text-gray-400">
              Chance of reaching production threshold
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Probability Scale</span>
                <span className="font-bold">
                  {stats.completionProbability}%
                </span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getProbabilityBarColor(
                    stats.completionProbability
                  )}`}
                  style={{ width: `${stats.completionProbability}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Very High</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                <div className="text-2xl font-bold">
                  {stats.averageClaimRate}
                </div>
                <div className="text-sm text-gray-400">Claims/Day</div>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                <div className="text-2xl font-bold">{stats.recentActivity}</div>
                <div className="text-sm text-gray-400">Recent Views</div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Prediction */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700 p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary-500" />
            Timeline Prediction
          </h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Estimated Completion</span>
                <span className="font-bold">{stats.estimatedCompletion}</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary-500 to-accent-500 transition-all duration-1000"
                  style={{
                    width: `${Math.min(
                      100,
                      (stats.fragmentsClaimed / stats.requiredForProduction) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Eye className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">Current Pace</div>
                    <div className="text-sm text-gray-400">
                      {stats.averageClaimRate} claims per day
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {stats.daysUntilThreshold} days
                  </div>
                  <div className="text-sm text-gray-400">to threshold</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Activity className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium">Activity Level</div>
                    <div className="text-sm text-gray-400">
                      Based on recent engagement
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold ${
                      stats.recentActivity > 20
                        ? "text-green-400"
                        : stats.recentActivity > 10
                        ? "text-yellow-400"
                        : "text-orange-400"
                    }`}
                  >
                    {stats.recentActivity > 20
                      ? "High"
                      : stats.recentActivity > 10
                      ? "Medium"
                      : "Low"}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stats.recentActivity} views
                  </div>
                </div>
              </div>
            </div>

            {/* Prediction Factors */}
            <div className="pt-4 border-t border-gray-700">
              <h4 className="font-bold mb-3">Prediction Factors</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Claim Rate</span>
                  <span
                    className={
                      stats.averageClaimRate > 2
                        ? "text-green-400"
                        : "text-yellow-400"
                    }
                  >
                    {stats.averageClaimRate > 2 ? "Favorable" : "Moderate"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Community Interest</span>
                  <span
                    className={
                      stats.recentActivity > 15
                        ? "text-green-400"
                        : "text-yellow-400"
                    }
                  >
                    {stats.recentActivity > 15 ? "High" : "Growing"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Time Since Launch</span>
                  <span className="text-yellow-400">Early Stage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts & Recommendations */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700 p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-accent-500" />
          Oracle's Insights
        </h3>

        <div className="space-y-4">
          {thresholdReached ? (
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-green-300 mb-1">
                    Production Threshold Reached!
                  </div>
                  <div className="text-sm text-gray-300">
                    The forging ritual has been initiated. Keepers will receive
                    production updates shortly.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 bg-gradient-to-r from-accent-500/10 to-yellow-500/10 border border-accent-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-accent-300 mb-1">
                      {stats.requiredForProduction - stats.fragmentsClaimed}{" "}
                      More Fragments Needed
                    </div>
                    <div className="text-sm text-gray-300">
                      At current pace, threshold will be reached in
                      approximately {stats.daysUntilThreshold} days.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-300 mb-1">
                      High Community Interest
                    </div>
                    <div className="text-sm text-gray-300">
                      Recent activity suggests growing interest. Consider
                      claiming soon to secure your fragment.
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-purple-300 mb-1">
                  Oracle's Recommendation
                </div>
                <div className="text-sm text-gray-300">
                  {thresholdReached
                    ? "Monitor production updates and prepare for the cipher phase."
                    : `With ${
                        stats.completionProbability
                      }% completion probability, this chronicle is a ${
                        stats.completionProbability >= 70
                          ? "strong"
                          : "moderate"
                      } candidate for successful completion.`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ChronicleOracle.defaultProps = {
  chronicle: {
    fragmentCount: 9,
    fragmentsClaimed: 3,
    requiredFragments: 9,
    basePrice: 299.99,
  },
};

export default ChronicleOracle;
