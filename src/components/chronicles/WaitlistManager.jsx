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
    if (position <= 10) return "text-green-600";
    if (position <= 30) return "text-yellow-600";
    if (position <= 50) return "text-orange-600";
    return "text-red-600";
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
    <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-medium">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-100 to-yellow-100 border border-accent-200 mb-4">
          <Bell className="w-4 h-4 text-accent-600" />
          <span className="text-sm font-medium text-gray-700">
            Waitlist Manager
          </span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-gray-900">
          {chronicle?.name || "This Chronicle"} is Fully Claimed
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          All fragments have been claimed for this chronicle. Join the waitlist
          to be notified when fragments become available or new chronicles are
          released.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {waitlistData.totalSubscribers}
              </div>
              <div className="text-sm text-gray-600">Waiting</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-100 rounded-lg">
              <Clock className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {waitlistData.usersAhead}
              </div>
              <div className="text-sm text-gray-600">Ahead of You</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent-100 rounded-lg">
              <Bell className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {waitlistData.notificationSent}
              </div>
              <div className="text-sm text-gray-600">Notified</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {waitlistData.averageWaitTime}
              </div>
              <div className="text-sm text-gray-600">Average Wait</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Waitlist Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
          {isSubscribed ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                You're on the List!
              </h3>
              <p className="text-gray-600 mb-6">
                We've added{" "}
                <span className="text-primary-600 font-medium">{email}</span> to
                the waitlist.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">
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
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                <UserPlus className="w-5 h-5 text-primary-600" />
                Join the Waitlist
              </h3>

              <form onSubmit={handleSubscribe} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all shadow-sm"
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
                      className="mt-1 text-primary-600 focus:ring-primary-200"
                    />
                    <label
                      htmlFor="notifyAvailable"
                      className="text-sm text-gray-700"
                    >
                      <span className="font-medium">
                        Notify me when fragments become available
                      </span>
                      <div className="text-gray-600 mt-1">
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
                      className="mt-1 text-primary-600 focus:ring-primary-200"
                    />
                    <label
                      htmlFor="notifyNew"
                      className="text-sm text-gray-700"
                    >
                      <span className="font-medium">
                        Notify me about new chronicles
                      </span>
                      <div className="text-gray-600 mt-1">
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
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
              <AlertTriangle className="w-5 h-5 text-accent-600" />
              How Waitlist Works
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Bell className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Priority Notifications
                  </div>
                  <div className="text-sm text-gray-600">
                    Waitlist members get first access to newly available
                    fragments
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <Clock className="w-4 h-4 text-secondary-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Time Window</div>
                  <div className="text-sm text-gray-600">
                    You'll have 24 hours to claim before it goes to the next
                    person
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-accent-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Position Updates
                  </div>
                  <div className="text-sm text-gray-600">
                    Your position improves as others ahead of you claim
                    fragments
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
              <Clock className="w-5 h-5 text-gray-600" />
              Expected Timeline
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-gray-700">Next Expected Release</div>
                <div className="font-bold text-gray-900">
                  {formatDate(waitlistData.nextExpectedRelease)}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-gray-700">Average Wait Time</div>
                <div className="font-bold text-gray-900">
                  {waitlistData.averageWaitTime}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-gray-700">Last Available Fragment</div>
                <div className="font-bold text-gray-900">
                  {waitlistData.lastAvailableFragment}
                </div>
              </div>
            </div>

            {/* Wait Time Indicator */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Estimated Wait</span>
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
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
          Alternative Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center shadow-soft">
            <div className="text-2xl font-bold text-primary-600 mb-2">
              Explore Other Chronicles
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Browse available fragments in other ongoing mysteries
            </p>
            <button className="btn-outline w-full">View Chronicles</button>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center shadow-soft">
            <div className="text-2xl font-bold text-secondary-600 mb-2">
              Secondary Market
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Check if keepers are willing to transfer their fragments
            </p>
            <button className="btn-outline w-full">Browse Transfers</button>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center shadow-soft">
            <div className="text-2xl font-bold text-accent-600 mb-2">
              Create Alert
            </div>
            <p className="text-sm text-gray-600 mb-4">
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
