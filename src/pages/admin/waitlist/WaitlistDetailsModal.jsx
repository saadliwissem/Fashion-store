import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Bell,
  BellOff,
  CheckCircle,
  XCircle,
  Send,
  Copy,
  MapPin,
  Globe,
  Users,
  Eye,
  Edit,
  Save,
  AlertCircle,
  TrendingUp,
  History,
  MessageSquare,
  Award,
  Tag,
  Filter,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Button from "../../../components/common/Button";
import toast from "react-hot-toast";
import { formatDate } from "../../../utils/formatters";

const WaitlistDetailsModal = ({ isOpen, onClose, entry, onNotify }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPreferences, setEditedPreferences] = useState({
    ...entry?.preferences,
  });

  if (!isOpen || !entry) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "notified":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "fulfilled":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPositionColor = (position) => {
    if (position <= 10) return "text-green-600 bg-green-50";
    if (position <= 30) return "text-yellow-600 bg-yellow-50";
    if (position <= 50) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case "organic":
        return "🌱";
      case "referral":
        return "🤝";
      case "campaign":
        return "📢";
      default:
        return "📋";
    }
  };

  const handleCopyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleSavePreferences = () => {
    // Here you would call API to update preferences
    toast.success("Notification preferences updated");
    setIsEditing(false);
  };

  const daysInWaitlist = Math.floor(
    (new Date() - new Date(entry.createdAt)) / (1000 * 60 * 60 * 24)
  );

  const tabs = [
    { id: "details", label: "Entry Details", icon: User },
    { id: "chronicle", label: "Chronicle Info", icon: Eye },
    { id: "preferences", label: "Notification Prefs", icon: Bell },
    { id: "history", label: "History", icon: History },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Waitlist Entry Details
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    entry.status
                  )}`}
                >
                  {entry.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  {entry.user
                    ? `${entry.user.firstName} ${entry.user.lastName}`
                    : "Anonymous User"}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{entry.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCopyToClipboard(entry._id, "Entry ID")}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Copy Entry ID"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Entry Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Position Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Current Position
                    </p>
                    <div
                      className={`text-5xl font-bold inline-block px-6 py-3 rounded-xl ${getPositionColor(
                        entry.position
                      )}`}
                    >
                      #{entry.position}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Users Ahead</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {entry.position - 1}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {daysInWaitlist} days on waitlist
                    </p>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  User Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {entry.user ? (
                    <>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Name</p>
                        <p className="font-medium text-gray-900">
                          {entry.user.firstName} {entry.user.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${entry.user.email}`}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            {entry.user.email}
                          </a>
                          <button
                            onClick={() =>
                              handleCopyToClipboard(entry.user.email, "Email")
                            }
                            className="text-gray-400 hover:text-purple-600"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {entry.user.phone && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Phone</p>
                          <a
                            href={`tel:${entry.user.phone}`}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            {entry.user.phone}
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="md:col-span-2">
                      <p className="text-gray-500">
                        Anonymous user (no account)
                      </p>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {entry.email}
                          </span>
                          <button
                            onClick={() =>
                              handleCopyToClipboard(entry.email, "Email")
                            }
                            className="text-gray-400 hover:text-purple-600"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Source & Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-purple-600" />
                    Source Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source:</span>
                      <span className="font-medium text-gray-900 flex items-center gap-1">
                        {getSourceIcon(entry.source)} {entry.source}
                      </span>
                    </div>
                    {entry.metadata?.userAgent && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Browser:</span>
                        <span className="font-medium text-gray-900 text-sm">
                          {entry.metadata.userAgent.substring(0, 50)}...
                        </span>
                      </div>
                    )}
                    {entry.metadata?.ipAddress && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">IP Address:</span>
                        <span className="font-medium text-gray-900">
                          {entry.metadata.ipAddress}
                        </span>
                      </div>
                    )}
                    {entry.metadata?.referrer && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Referrer:</span>
                        <span className="font-medium text-gray-900 text-sm">
                          {entry.metadata.referrer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Timeline
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joined:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(entry.updatedAt)}
                      </span>
                    </div>
                    {entry.notifiedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Notified:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(entry.notifiedAt)}
                        </span>
                      </div>
                    )}
                    {entry.fulfilledAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fulfilled:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(entry.fulfilledAt)}
                        </span>
                      </div>
                    )}
                    {entry.expiresAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expires:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(entry.expiresAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chronicle Info Tab */}
          {activeTab === "chronicle" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  Chronicle Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Chronicle Name</p>
                    <p className="font-medium text-gray-900 text-lg">
                      {entry.chronicle?.name || "Unknown Chronicle"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Parent Enigma</p>
                    <p className="font-medium text-gray-900">
                      {entry.chronicle?.enigma?.name || "Unknown Enigma"}
                    </p>
                  </div>
                </div>

                {entry.chronicle?.description && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-gray-700">
                      {entry.chronicle.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Fragment Count</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {entry.chronicle?.stats?.fragmentCount || 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Claimed</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {entry.chronicle?.stats?.fragmentsClaimed || 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">
                    Required for Forge
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {entry.chronicle?.stats?.requiredFragments || 0}
                  </p>
                </div>
              </div>

              {entry.chronicle?.productionStatus && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Production Status: {entry.chronicle.productionStatus}
                      </p>
                      {entry.chronicle.estimatedCompletion && (
                        <p className="text-xs text-blue-600 mt-1">
                          Estimated completion:{" "}
                          {formatDate(entry.chronicle.estimatedCompletion)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notification Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-purple-600" />
                    Notification Preferences
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Preferences
                    </button>
                  ) : (
                    <button
                      onClick={handleSavePreferences}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Notify when available
                          </p>
                          <p className="text-sm text-gray-500">
                            Send notification when fragments become available
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editedPreferences.notifyOnAvailable}
                          onChange={(e) =>
                            setEditedPreferences({
                              ...editedPreferences,
                              notifyOnAvailable: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Notify on new chronicles
                          </p>
                          <p className="text-sm text-gray-500">
                            Send notification when new chronicles are released
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editedPreferences.notifyOnNewChronicle}
                          onChange={(e) =>
                            setEditedPreferences({
                              ...editedPreferences,
                              notifyOnNewChronicle: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm font-medium text-purple-800 mb-2">
                        Notification Methods
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-gray-700">Email</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                editedPreferences.notificationMethods?.email
                              }
                              onChange={(e) =>
                                setEditedPreferences({
                                  ...editedPreferences,
                                  notificationMethods: {
                                    ...editedPreferences.notificationMethods,
                                    email: e.target.checked,
                                  },
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-gray-700">SMS</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                editedPreferences.notificationMethods?.sms
                              }
                              onChange={(e) =>
                                setEditedPreferences({
                                  ...editedPreferences,
                                  notificationMethods: {
                                    ...editedPreferences.notificationMethods,
                                    sms: e.target.checked,
                                  },
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          {entry.preferences?.notifyOnAvailable ? (
                            <Bell className="w-5 h-5 text-green-600" />
                          ) : (
                            <BellOff className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="font-medium text-gray-900">
                            Available Fragments
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {entry.preferences?.notifyOnAvailable
                            ? "Will be notified when fragments become available"
                            : "Will not be notified about available fragments"}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          {entry.preferences?.notifyOnNewChronicle ? (
                            <Bell className="w-5 h-5 text-blue-600" />
                          ) : (
                            <BellOff className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="font-medium text-gray-900">
                            New Chronicles
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {entry.preferences?.notifyOnNewChronicle
                            ? "Will be notified about new chronicle releases"
                            : "Will not be notified about new chronicles"}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm font-medium text-purple-800 mb-2">
                        Notification Methods
                      </p>
                      <div className="flex gap-4">
                        {entry.preferences?.notificationMethods?.email && (
                          <span className="flex items-center gap-1 text-sm text-purple-700">
                            <Mail className="w-4 h-4" />
                            Email
                          </span>
                        )}
                        {entry.preferences?.notificationMethods?.sms && (
                          <span className="flex items-center gap-1 text-sm text-purple-700">
                            <Phone className="w-4 h-4" />
                            SMS
                          </span>
                        )}
                        {!entry.preferences?.notificationMethods?.email &&
                          !entry.preferences?.notificationMethods?.sms && (
                            <span className="text-sm text-gray-500">
                              No notification methods selected
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-600" />
                  Waitlist Timeline
                </h3>

                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <div className="space-y-6">
                    {/* Joined Event */}
                    <div className="relative pl-12">
                      <div className="absolute left-2 top-1 w-5 h-5 bg-green-100 rounded-full border-2 border-green-500 flex items-center justify-center">
                        <UserPlus className="w-3 h-3 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Joined Waitlist
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(entry.createdAt)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          User joined waitlist for {entry.chronicle?.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Position: #{entry.position}
                        </p>
                      </div>
                    </div>

                    {/* Status Changes */}
                    {entry.status !== "active" && (
                      <div className="relative pl-12">
                        <div className="absolute left-2 top-1 w-5 h-5 bg-blue-100 rounded-full border-2 border-blue-500 flex items-center justify-center">
                          <AlertCircle className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Status Changed
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(entry.updatedAt)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Status updated to:{" "}
                            <span className="font-medium">{entry.status}</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Notification Events */}
                    {entry.notifiedAt && (
                      <div className="relative pl-12">
                        <div className="absolute left-2 top-1 w-5 h-5 bg-purple-100 rounded-full border-2 border-purple-500 flex items-center justify-center">
                          <Send className="w-3 h-3 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Notification Sent
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(entry.notifiedAt)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            User was notified about availability
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Fulfilled Event */}
                    {entry.fulfilledAt && (
                      <div className="relative pl-12">
                        <div className="absolute left-2 top-1 w-5 h-5 bg-green-100 rounded-full border-2 border-green-500 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Waitlist Fulfilled
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(entry.fulfilledAt)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            User claimed a fragment and was removed from
                            waitlist
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Expired Event */}
                    {entry.expiresAt &&
                      new Date(entry.expiresAt) < new Date() && (
                        <div className="relative pl-12">
                          <div className="absolute left-2 top-1 w-5 h-5 bg-gray-100 rounded-full border-2 border-gray-500 flex items-center justify-center">
                            <XCircle className="w-3 h-3 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Waitlist Expired
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(entry.expiresAt)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Waitlist entry expired without being fulfilled
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                  <p className="text-sm text-gray-600 mb-1">Wait Time</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {daysInWaitlist} days
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Since joining</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <p className="text-sm text-gray-600 mb-1">Position Change</p>
                  <p className="text-3xl font-bold text-green-600">
                    -{entry.position - 1}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Spots moved up</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
                  <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {entry.status === "fulfilled" ? "100%" : "0%"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {entry.status === "fulfilled"
                      ? "Successfully converted"
                      : "Not yet converted"}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Waitlist Insights
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Position Progress</span>
                      <span className="font-medium text-gray-900">
                        {Math.min(
                          100,
                          Math.floor(
                            ((entry.position - 1) / entry.position) * 100
                          )
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-purple-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.floor(
                              ((entry.position - 1) / entry.position) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">
                        Est. Remaining Wait
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {entry.position <= 10
                          ? "1-2 weeks"
                          : entry.position <= 30
                          ? "3-4 weeks"
                          : entry.position <= 50
                          ? "5-8 weeks"
                          : "8+ weeks"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Users Ahead</p>
                      <p className="text-xl font-bold text-gray-900">
                        {entry.position - 1}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-purple-800 mb-2">
                      Prediction
                    </p>
                    <p className="text-sm text-purple-700">
                      Based on current waitlist movement, user is estimated to
                      reach the front in approximately{" "}
                      {entry.position <= 10
                        ? "1-2 weeks"
                        : entry.position <= 30
                        ? "3-4 weeks"
                        : entry.position <= 50
                        ? "2 months"
                        : "2-3 months"}
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {entry.status === "active" && (
              <Button
                onClick={() => onNotify(entry)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                <Send className="w-4 h-4" />
                Send Notification
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistDetailsModal;
