import React, { useState } from "react";
import {
  X,
  Send,
  Mail,
  Bell,
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  Edit,
  Save,
  Phone,
  Globe,
  Settings,
  Filter,
  ChevronDown,
  Calendar,
  Tag,
  User,
  FileText,
} from "lucide-react";
import Button from "../../../components/common/Button";
import toast from "react-hot-toast";

const WaitlistNotifyModal = ({
  isOpen,
  onClose,
  entries,
  entryCount = 1,
  onSend,
}) => {
  const [notificationData, setNotificationData] = useState({
    type: "availability", // 'availability', 'newChronicle', 'custom'
    subject: "",
    message: "",
    sendEmail: true,
    sendSms: false,
    includePosition: true,
    includeChronicleDetails: true,
    schedule: "now", // 'now', 'later'
    scheduledDate: "",
    template: "standard",
  });

  const [saving, setSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState("compose");
  const [previewMode, setPreviewMode] = useState(false);

  if (!isOpen) return null;

  const isBulk = entryCount > 1;

  // Template messages
  const templates = {
    availability: {
      subject: "🎉 Fragment Now Available!",
      message: `Great news! A fragment you've been waiting for is now available. 
      
Visit the chronicle page to claim your fragment before it's gone.

[CHRONICLE_LINK]`,
    },
    newChronicle: {
      subject: "✨ New Chronicle Released!",
      message: `A new chronicle has been released in the enigma you're following. 
      
Be among the first to claim fragments from this exciting new mystery.

[CHRONICLE_LINK]`,
    },
    position: {
      subject: "📊 Your Waitlist Position",
      message: `You're moving up in the waitlist! Your current position is #[POSITION] with approximately [USERS_AHEAD] users ahead of you.

Keep an eye on your email - you'll be notified as soon as fragments become available.`,
    },
  };

  const handleTemplateChange = (type) => {
    setNotificationData({
      ...notificationData,
      type,
      subject: templates[type]?.subject || "",
      message: templates[type]?.message || "",
    });
  };

  const handleSubmit = async () => {
    // Validate
    if (!notificationData.subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!notificationData.message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      setSaving(true);
      await onSend(notificationData);
      toast.success(
        `Notification ${
          isBulk ? `sent to ${entryCount} users` : "sent successfully"
        }`
      );
      onClose();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error(
        error.response?.data?.message || "Failed to send notification"
      );
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "compose", label: "Compose", icon: Edit },
    { id: "preview", label: "Preview", icon: Eye },
    { id: "recipients", label: "Recipients", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Sample recipients for preview
  const sampleRecipients = [
    { email: "user1@example.com", phone: "+216 12345678", position: 15 },
    { email: "user2@example.com", phone: "+216 23456789", position: 23 },
    { email: "user3@example.com", phone: "+216 34567890", position: 42 },
  ];

  // Preview message with template variables replaced
  const getPreviewMessage = () => {
    let msg = notificationData.message;
    msg = msg.replace(/\[POSITION\]/g, "15");
    msg = msg.replace(/\[USERS_AHEAD\]/g, "14");
    msg = msg.replace(
      /\[CHRONICLE_LINK\]/g,
      "https://yourstore.com/enigmas/..."
    );
    return msg;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isBulk ? "Send Bulk Notification" : "Send Notification"}
                </h2>
                {isBulk && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {entryCount} recipients
                  </span>
                )}
              </div>
              <p className="text-gray-600">
                {isBulk
                  ? `Compose a message to send to ${entryCount} waitlist users`
                  : "Send a notification to a waitlist user"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    selectedTab === tab.id
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
          {/* Compose Tab */}
          {selectedTab === "compose" && (
            <div className="space-y-6">
              {/* Template Selection */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Notification Templates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleTemplateChange("availability")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      notificationData.type === "availability"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 bg-white"
                    }`}
                  >
                    <Bell
                      className={`w-6 h-6 mb-2 ${
                        notificationData.type === "availability"
                          ? "text-purple-600"
                          : "text-gray-500"
                      }`}
                    />
                    <p className="font-medium text-gray-900">
                      Fragment Available
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Notify when fragments are ready
                    </p>
                  </button>

                  <button
                    onClick={() => handleTemplateChange("newChronicle")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      notificationData.type === "newChronicle"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 bg-white"
                    }`}
                  >
                    <Mail
                      className={`w-6 h-6 mb-2 ${
                        notificationData.type === "newChronicle"
                          ? "text-purple-600"
                          : "text-gray-500"
                      }`}
                    />
                    <p className="font-medium text-gray-900">New Chronicle</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Announce new chronicle releases
                    </p>
                  </button>

                  <button
                    onClick={() => handleTemplateChange("position")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      notificationData.type === "position"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 bg-white"
                    }`}
                  >
                    <Clock
                      className={`w-6 h-6 mb-2 ${
                        notificationData.type === "position"
                          ? "text-purple-600"
                          : "text-gray-500"
                      }`}
                    />
                    <p className="font-medium text-gray-900">Position Update</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Update users on waitlist progress
                    </p>
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={notificationData.subject}
                  onChange={(e) =>
                    setNotificationData({
                      ...notificationData,
                      subject: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter notification subject"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={notificationData.message}
                  onChange={(e) =>
                    setNotificationData({
                      ...notificationData,
                      message: e.target.value,
                    })
                  }
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none font-mono text-sm"
                  placeholder="Write your notification message..."
                />

                {/* Template Variables Help */}
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Available Variables:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <code className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      [POSITION]
                    </code>
                    <span className="text-xs text-gray-500">
                      - User's waitlist position
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <code className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      [USERS_AHEAD]
                    </code>
                    <span className="text-xs text-gray-500">
                      - Number of users ahead
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <code className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      [CHRONICLE_LINK]
                    </code>
                    <span className="text-xs text-gray-500">
                      - Link to chronicle
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {selectedTab === "preview" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  Message Preview
                </h3>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Email Header */}
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>
                        To:{" "}
                        {isBulk ? "multiple recipients" : "user@example.com"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Bell className="w-4 h-4" />
                      <span>
                        Subject: {notificationData.subject || "No subject"}
                      </span>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="p-6 bg-white">
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-line text-gray-700">
                        {getPreviewMessage()}
                      </div>
                    </div>

                    {/* Sample Data */}
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm font-medium text-purple-800 mb-2">
                        Preview Data:
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-purple-600">Position:</span>
                          <span className="ml-2 text-purple-900">#15</span>
                        </div>
                        <div>
                          <span className="text-purple-600">Users Ahead:</span>
                          <span className="ml-2 text-purple-900">14</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Channel Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Preview */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-gray-900">Email Version</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-green-600 font-medium">
                        {notificationData.sendEmail ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    {notificationData.sendEmail && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-green-700">
                          Will be sent to {isBulk ? entryCount : 1} email
                          address(es)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* SMS Preview */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-gray-900">SMS Version</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={
                          notificationData.sendSms
                            ? "text-blue-600 font-medium"
                            : "text-gray-400"
                        }
                      >
                        {notificationData.sendSms ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    {notificationData.sendSms && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700">
                          Will be sent to {isBulk ? entryCount : 1} phone
                          number(s)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recipients Tab */}
          {selectedTab === "recipients" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  {isBulk ? "Recipient List" : "Recipient Details"}
                </h3>

                {isBulk ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-800">
                        <span className="font-bold">{entryCount}</span> users
                        will receive this notification
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3 text-xs font-medium text-gray-500">
                              Email
                            </th>
                            <th className="text-left p-3 text-xs font-medium text-gray-500">
                              Phone
                            </th>
                            <th className="text-left p-3 text-xs font-medium text-gray-500">
                              Position
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {sampleRecipients.map((recipient, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="p-3 text-sm text-gray-900">
                                {recipient.email}
                              </td>
                              <td className="p-3 text-sm text-gray-900">
                                {recipient.phone}
                              </td>
                              <td className="p-3 text-sm font-medium text-purple-600">
                                #{recipient.position}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">John Doe</p>
                        <p className="text-sm text-gray-500">
                          john@example.com
                        </p>
                        <p className="text-sm text-gray-500">+216 12 345 678</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">
                          Waitlist Position
                        </p>
                        <p className="text-2xl font-bold text-purple-600">
                          #15
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">
                          Users Ahead
                        </p>
                        <p className="text-2xl font-bold text-gray-900">14</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {selectedTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  Notification Settings
                </h3>

                <div className="space-y-4">
                  {/* Channels */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Notification Channels
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">Email</p>
                            <p className="text-sm text-gray-500">
                              Send via email
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationData.sendEmail}
                            onChange={(e) =>
                              setNotificationData({
                                ...notificationData,
                                sendEmail: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">SMS</p>
                            <p className="text-sm text-gray-500">
                              Send via text message
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationData.sendSms}
                            onChange={(e) =>
                              setNotificationData({
                                ...notificationData,
                                sendSms: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Content Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Content Options
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Include Position
                            </p>
                            <p className="text-sm text-gray-500">
                              Show user's waitlist position
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationData.includePosition}
                            onChange={(e) =>
                              setNotificationData({
                                ...notificationData,
                                includePosition: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start gap-3">
                          <Tag className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Include Chronicle Details
                            </p>
                            <p className="text-sm text-gray-500">
                              Add chronicle name and link
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationData.includeChronicleDetails}
                            onChange={(e) =>
                              setNotificationData({
                                ...notificationData,
                                includeChronicleDetails: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Schedule
                    </label>
                    <div className="space-y-4">
                      <select
                        value={notificationData.schedule}
                        onChange={(e) =>
                          setNotificationData({
                            ...notificationData,
                            schedule: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                      >
                        <option value="now">Send Now</option>
                        <option value="later">Schedule for Later</option>
                      </select>

                      {notificationData.schedule === "later" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Schedule Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            value={notificationData.scheduledDate}
                            onChange={(e) =>
                              setNotificationData({
                                ...notificationData,
                                scheduledDate: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {notificationData.schedule === "now"
                    ? "Send Now"
                    : "Schedule"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistNotifyModal;
