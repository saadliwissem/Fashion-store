import React, { useState } from "react";
import {
  Users,
  Bell,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  UserPlus,
} from "lucide-react";

const WaitlistManager = ({ chronicle, currentUserPosition = null }) => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notifyOnAvailable, setNotifyOnAvailable] = useState(true);
  const [notifyOnNewChronicle, setNotifyOnNewChronicle] = useState(true);

  // Sample waitlist data
  const waitlistData = {
    totalSubscribers: 157,
    usersAhead: currentUserPosition || 42,
    lastAvailableFragment: "3 days ago",
    averageWaitTime: "2-4 weeks",
    notificationSent: 12,
    nextExpectedRelease: "2024-03-15",
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setIsSubscribed(true);
      // In production, this would send to your backend
      console.log("Subscribed:", email, {
        notifyOnAvailable,
        notifyOnNewChronicle,
      });
    }
  };

  const getWaitTimeColor = (position) => {
    if (position <= 10) return "text-green-400";
    if (position <= 30) return "text-yellow-400";
    if (position <= 50) return "text-orange-400";
    return "text-red-400";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-gray-700 p-6 lg:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-500/20 to-yellow-500/20 border border-accent-500/30 mb-4">
          <Bell className="w-4 h-4 text-accent-400" />
          <span className="text-sm font-medium">Waitlist Manager</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold mb-3">
          {chronicle?.name || "This Chronicle"} is Fully Claimed
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          All fragments have been claimed for this chronicle. Join the waitlist
          to be notified when fragments become available or new chronicles are
          released.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500/20 rounded-lg">
              <Users className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {waitlistData.totalSubscribers}
              </div>
              <div className="text-sm text-gray-400">Waiting</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-secondary-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {waitlistData.usersAhead}
              </div>
              <div className="text-sm text-gray-400">Ahead of You</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent-500/20 rounded-lg">
              <Bell className="w-6 h-6 text-accent-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {waitlistData.notificationSent}
              </div>
              <div className="text-sm text-gray-400">Notified</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-xl font-bold">
                {waitlistData.averageWaitTime}
              </div>
              <div className="text-sm text-gray-400">Average Wait</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Waitlist Form */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700 p-6">
          {isSubscribed ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">You're on the List!</h3>
              <p className="text-gray-400 mb-6">
                We've added{" "}
                <span className="text-primary-300 font-medium">{email}</span> to
                the waitlist.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">
                    Your Position
                  </div>
                  <div
                    className={`text-3xl font-bold ${getWaitTimeColor(
                      waitlistData.usersAhead + 1
                    )}`}
                  >
                    #{waitlistData.totalSubscribers + 1}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  We'll notify you when a fragment becomes available or when new
                  chronicles are released.
                </p>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary-500" />
                Join the Waitlist
              </h3>

              <form onSubmit={handleSubscribe} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="notifyAvailable"
                      checked={notifyOnAvailable}
                      onChange={(e) => setNotifyOnAvailable(e.target.checked)}
                      className="mt-1"
                    />
                    <label
                      htmlFor="notifyAvailable"
                      className="text-sm text-gray-300"
                    >
                      <span className="font-medium">
                        Notify me when fragments become available
                      </span>
                      <div className="text-gray-500 mt-1">
                        Get immediate notification if a claimed fragment is
                        released
                      </div>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="notifyNew"
                      checked={notifyOnNewChronicle}
                      onChange={(e) =>
                        setNotifyOnNewChronicle(e.target.checked)
                      }
                      className="mt-1"
                    />
                    <label
                      htmlFor="notifyNew"
                      className="text-sm text-gray-300"
                    >
                      <span className="font-medium">
                        Notify me about new chronicles
                      </span>
                      <div className="text-gray-500 mt-1">
                        Be the first to know about upcoming puzzle releases
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-4 text-lg font-bold"
                >
                  Join Waitlist
                </button>
              </form>
            </>
          )}
        </div>

        {/* Waitlist Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700 p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-accent-500" />
              How Waitlist Works
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <Bell className="w-4 h-4 text-primary-400" />
                </div>
                <div>
                  <div className="font-medium">Priority Notifications</div>
                  <div className="text-sm text-gray-400">
                    Waitlist members get first access to newly available
                    fragments
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-secondary-500/20 rounded-lg">
                  <Clock className="w-4 h-4 text-secondary-400" />
                </div>
                <div>
                  <div className="font-medium">Time Window</div>
                  <div className="text-sm text-gray-400">
                    You'll have 24 hours to claim before it goes to the next
                    person
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent-500/20 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-accent-400" />
                </div>
                <div>
                  <div className="font-medium">Position Updates</div>
                  <div className="text-sm text-gray-400">
                    Your position improves as others ahead of you claim
                    fragments
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700 p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Expected Timeline
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-gray-300">Next Expected Release</div>
                <div className="font-bold">
                  {formatDate(waitlistData.nextExpectedRelease)}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-gray-300">Average Wait Time</div>
                <div className="font-bold">{waitlistData.averageWaitTime}</div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-gray-300">Last Available Fragment</div>
                <div className="font-bold">
                  {waitlistData.lastAvailableFragment}
                </div>
              </div>
            </div>

            {/* Wait Time Indicator */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Estimated Wait</span>
                <span
                  className={`font-bold ${getWaitTimeColor(
                    waitlistData.usersAhead
                  )}`}
                >
                  {waitlistData.usersAhead <= 10
                    ? "Soon"
                    : waitlistData.usersAhead <= 30
                    ? "Moderate"
                    : waitlistData.usersAhead <= 50
                    ? "Long"
                    : "Very Long"}
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    waitlistData.usersAhead <= 10
                      ? "bg-green-500"
                      : waitlistData.usersAhead <= 30
                      ? "bg-yellow-500"
                      : waitlistData.usersAhead <= 50
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (waitlistData.usersAhead / 100) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Short wait</span>
                <span>Long wait</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Options */}
      <div className="mt-8 pt-8 border-t border-gray-700">
        <h3 className="text-xl font-bold mb-6 text-center">
          Alternative Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-primary-400 mb-2">
              Explore Other Chronicles
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Browse available fragments in other ongoing mysteries
            </p>
            <button className="btn-outline w-full">View Chronicles</button>
          </div>

          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-secondary-400 mb-2">
              Secondary Market
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Check if keepers are willing to transfer their fragments
            </p>
            <button className="btn-outline w-full">Browse Transfers</button>
          </div>

          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-accent-400 mb-2">
              Create Alert
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Get notified when similar chronicles are released
            </p>
            <button className="btn-outline w-full">Set Alert</button>
          </div>
        </div>
      </div>
    </div>
  );
};

WaitlistManager.defaultProps = {
  chronicle: {
    id: 1,
    name: "The Straw Hat Legacy",
    fragmentCount: 9,
    fragmentsClaimed: 9,
    requiredFragments: 9,
  },
  currentUserPosition: null,
};

export default WaitlistManager;
