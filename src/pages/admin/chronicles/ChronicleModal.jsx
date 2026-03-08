import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Upload,
  Plus,
  Trash2,
  Star,
  Calendar,
  MapPin,
  User,
  FileText,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Hammer,
  Paintbrush,
  Package,
  Truck,
  Zap,
  DollarSign,
  Hash,
  BookOpen,
} from "lucide-react";
import Button from "../../../components/common/Button";
import toast from "react-hot-toast";

const ChronicleModal = ({
  isOpen,
  onClose,
  mode,
  chronicle,
  enigmas,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    enigma: "",
    name: "",
    description: "",
    lore: "",
    difficulty: "intermediate",
    status: "available",
    productionStatus: "awaiting",
    timeline: "",
    basePrice: "",
    location: {
      country: "",
      city: "",
      coordinates: {
        lat: "",
        lng: "",
      },
    },
    author: {
      name: "",
      avatar: "",
      role: "",
    },
    featured: false,
    estimatedStartDate: "",
    estimatedCompletion: "",
    stats: {
      fragmentCount: 0,
      fragmentsClaimed: 0,
      requiredFragments: 1,
      uniqueKeepers: 0,
    },
    rewards: [],
    waitlist: {
      enabled: true,
      maxCapacity: "",
      currentCount: 0,
    },
    coverImage: {
      url: "",
      alt: "",
      publicId: "",
    },
    metadata: {
      viewCount: 0,
      interestedCount: 0,
    },
  });

  const [rewardForm, setRewardForm] = useState({
    name: "",
    description: "",
    type: "physical",
    rarity: "common",
    image: "",
    unlockThreshold: 1,
  });
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    details: false,
    production: false,
    location: false,
    author: false,
    stats: false,
    rewards: false,
    waitlist: false,
    media: false,
  });
  const [coverPreview, setCoverPreview] = useState("");

  useEffect(() => {
    if (mode === "edit" && chronicle) {
      setFormData({
        enigma: chronicle.enigma?._id || chronicle.enigma || "",
        name: chronicle.name || "",
        description: chronicle.description || "",
        lore: chronicle.lore || "",
        difficulty: chronicle.difficulty || "intermediate",
        status: chronicle.status || "available",
        productionStatus: chronicle.productionStatus || "awaiting",
        timeline: chronicle.timeline || "",
        basePrice: chronicle.basePrice || "",
        location: chronicle.location || {
          country: "",
          city: "",
          coordinates: { lat: "", lng: "" },
        },
        author: chronicle.author || { name: "", avatar: "", role: "" },
        featured: chronicle.featured || false,
        estimatedStartDate: chronicle.estimatedStartDate
          ? chronicle.estimatedStartDate.split("T")[0]
          : "",
        estimatedCompletion: chronicle.estimatedCompletion
          ? chronicle.estimatedCompletion.split("T")[0]
          : "",
        stats: chronicle.stats || {
          fragmentCount: 0,
          fragmentsClaimed: 0,
          requiredFragments: 1,
          uniqueKeepers: 0,
        },
        rewards: chronicle.rewards || [],
        waitlist: chronicle.waitlist || {
          enabled: true,
          maxCapacity: "",
          currentCount: 0,
        },
        coverImage: chronicle.coverImage || { url: "", alt: "", publicId: "" },
        metadata: chronicle.metadata || {
          viewCount: 0,
          interestedCount: 0,
        },
      });
      setCoverPreview(chronicle.coverImage?.url || "");
    } else {
      // Reset form for add mode
      setFormData({
        enigma: enigmas?.length > 0 ? enigmas[0]._id : "",
        name: "",
        description: "",
        lore: "",
        difficulty: "intermediate",
        status: "available",
        productionStatus: "awaiting",
        timeline: "",
        basePrice: "",
        location: {
          country: "",
          city: "",
          coordinates: { lat: "", lng: "" },
        },
        author: { name: "", avatar: "", role: "" },
        featured: false,
        estimatedStartDate: "",
        estimatedCompletion: "",
        stats: {
          fragmentCount: 0,
          fragmentsClaimed: 0,
          requiredFragments: 1,
          uniqueKeepers: 0,
        },
        rewards: [],
        waitlist: {
          enabled: true,
          maxCapacity: "",
          currentCount: 0,
        },
        coverImage: { url: "", alt: "", publicId: "" },
        metadata: {
          viewCount: 0,
          interestedCount: 0,
        },
      });
      setCoverPreview("");
      setRewardForm({
        name: "",
        description: "",
        type: "physical",
        rarity: "common",
        image: "",
        unlockThreshold: 1,
      });
    }
  }, [mode, chronicle, enigmas, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const parts = name.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === "checkbox" ? checked : value,
          },
        }));
      } else if (parts.length === 3) {
        const [parent, child, grandchild] = parts;
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent]?.[child],
              [grandchild]: value,
            },
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : parseFloat(value);

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: numValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    }
  };

  const handleAddReward = () => {
    if (rewardForm.name && rewardForm.description) {
      setFormData((prev) => ({
        ...prev,
        rewards: [
          ...prev.rewards,
          { ...rewardForm, _id: Date.now().toString() },
        ],
      }));
      setRewardForm({
        name: "",
        description: "",
        type: "physical",
        rarity: "common",
        image: "",
        unlockThreshold: 1,
      });
      setShowRewardForm(false);
    } else {
      toast.error("Please fill in reward name and description");
    }
  };

  const handleRemoveReward = (rewardToRemove) => {
    setFormData((prev) => ({
      ...prev,
      rewards: prev.rewards.filter((r) => r._id !== rewardToRemove._id),
    }));
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        coverImage: {
          ...prev.coverImage,
          url: reader.result,
          alt: formData.name || "Chronicle cover image",
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.enigma) {
      toast.error("Please select a parent enigma");
      return;
    }
    if (!formData.name) {
      toast.error("Chronicle name is required");
      return;
    }
    if (!formData.description) {
      toast.error("Description is required");
      return;
    }
    if (!formData.basePrice || formData.basePrice <= 0) {
      toast.error("Valid base price is required");
      return;
    }
    if (
      !formData.stats.requiredFragments ||
      formData.stats.requiredFragments < 1
    ) {
      toast.error("Required fragments must be at least 1");
      return;
    }

    onSave(formData);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getProductionStatusIcon = (status) => {
    switch (status) {
      case "awaiting":
        return <Clock className="w-4 h-4" />;
      case "design":
        return <Paintbrush className="w-4 h-4" />;
      case "forging":
        return <Hammer className="w-4 h-4" />;
      case "enchanting":
        return <Zap className="w-4 h-4" />;
      case "shipping":
        return <Package className="w-4 h-4" />;
      case "delivered":
        return <Truck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === "add" ? "Create New Chronicle" : "Edit Chronicle"}
              </h2>
              <p className="text-gray-600 mt-1">
                {mode === "add"
                  ? "Add a new chronicle to an enigma"
                  : "Update the chronicle details"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("basic")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">
                  Basic Information
                </span>
              </div>
              {expandedSections.basic ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.basic && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Enigma *
                  </label>
                  <select
                    name="enigma"
                    value={formData.enigma}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    required
                  >
                    <option value="">Select an enigma</option>
                    {enigmas?.map((enigma) => (
                      <option key={enigma._id} value={enigma._id}>
                        {enigma.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chronicle Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., The Straw Hat Legacy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    placeholder="Brief description of the chronicle..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lore
                  </label>
                  <textarea
                    name="lore"
                    value={formData.lore}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    placeholder="The deep story and mythology of this chronicle..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("details")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Details</span>
              </div>
              {expandedSections.details ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.details && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="forging">Forging</option>
                    <option value="cipher">Cipher</option>
                    <option value="solved">Solved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <input
                    type="text"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., 6-8 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price ($) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleNumberChange}
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                      placeholder="299.99"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 md:col-span-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    <span className="font-medium">Featured Chronicle</span>
                    <p className="text-xs text-gray-500">
                      Featured chronicles appear prominently
                    </p>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Production Status */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("production")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Hammer className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Production</span>
              </div>
              {expandedSections.production ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.production && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Production Status
                    </label>
                    <select
                      name="productionStatus"
                      value={formData.productionStatus}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="awaiting">Awaiting</option>
                      <option value="design">Design</option>
                      <option value="forging">Forging</option>
                      <option value="enchanting">Enchanting</option>
                      <option value="shipping">Shipping</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Start Date
                    </label>
                    <input
                      type="date"
                      name="estimatedStartDate"
                      value={formData.estimatedStartDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Completion
                    </label>
                    <input
                      type="date"
                      name="estimatedCompletion"
                      value={formData.estimatedCompletion}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    {getProductionStatusIcon(formData.productionStatus)}
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Current Phase: {formData.productionStatus}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Update this status to keep keepers informed about
                        production progress
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("location")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Location</span>
              </div>
              {expandedSections.location ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.location && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Japan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Tokyo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="location.coordinates.lat"
                    value={formData.location.coordinates.lat}
                    onChange={handleChange}
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    placeholder="35.6895"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="location.coordinates.lng"
                    value={formData.location.coordinates.lng}
                    onChange={handleChange}
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    placeholder="139.6917"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Author */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("author")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Author</span>
              </div>
              {expandedSections.author ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.author && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    name="author.name"
                    value={formData.author.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Mystery Weaver #42"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Avatar URL
                  </label>
                  <input
                    type="url"
                    name="author.avatar"
                    value={formData.author.avatar}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Role
                  </label>
                  <input
                    type="text"
                    name="author.role"
                    value={formData.author.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Chronicle Keeper"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("stats")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">
                  Fragment Statistics
                </span>
              </div>
              {expandedSections.stats ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.stats && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fragment Count
                  </label>
                  <input
                    type="number"
                    name="stats.fragmentCount"
                    value={formData.stats.fragmentCount}
                    onChange={handleNumberChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    readOnly={mode === "edit"}
                  />
                  {mode === "edit" && (
                    <p className="text-xs text-gray-500 mt-1">
                      Automatically updated based on fragments
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fragments Claimed
                  </label>
                  <input
                    type="number"
                    name="stats.fragmentsClaimed"
                    value={formData.stats.fragmentsClaimed}
                    onChange={handleNumberChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    readOnly={mode === "edit"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Fragments *
                  </label>
                  <input
                    type="number"
                    name="stats.requiredFragments"
                    value={formData.stats.requiredFragments}
                    onChange={handleNumberChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unique Keepers
                  </label>
                  <input
                    type="number"
                    name="stats.uniqueKeepers"
                    value={formData.stats.uniqueKeepers}
                    onChange={handleNumberChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    readOnly={mode === "edit"}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Rewards */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("rewards")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Rewards</span>
              </div>
              {expandedSections.rewards ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.rewards && (
              <div className="p-4">
                {/* Existing Rewards */}
                <div className="space-y-3 mb-4">
                  {formData.rewards.map((reward, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {reward.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              reward.rarity === "legendary"
                                ? "bg-yellow-100 text-yellow-800"
                                : reward.rarity === "rare"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {reward.rarity}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {reward.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            Threshold: {reward.unlockThreshold}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {reward.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveReward(reward)}
                        className="p-2 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Reward Form */}
                {showRewardForm ? (
                  <div className="border border-gray-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Add New Reward
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Reward Name"
                        value={rewardForm.name}
                        onChange={(e) =>
                          setRewardForm({ ...rewardForm, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <textarea
                        placeholder="Reward Description"
                        value={rewardForm.description}
                        onChange={(e) =>
                          setRewardForm({
                            ...rewardForm,
                            description: e.target.value,
                          })
                        }
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={rewardForm.type}
                          onChange={(e) =>
                            setRewardForm({
                              ...rewardForm,
                              type: e.target.value,
                            })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="physical">Physical</option>
                          <option value="nft">NFT</option>
                          <option value="badge">Badge</option>
                          <option value="experience">Experience</option>
                        </select>
                        <select
                          value={rewardForm.rarity}
                          onChange={(e) =>
                            setRewardForm({
                              ...rewardForm,
                              rarity: e.target.value,
                            })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="common">Common</option>
                          <option value="rare">Rare</option>
                          <option value="legendary">Legendary</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Unlock Threshold (fragments needed)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={rewardForm.unlockThreshold}
                          onChange={(e) =>
                            setRewardForm({
                              ...rewardForm,
                              unlockThreshold: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <input
                        type="url"
                        placeholder="Reward Image URL (optional)"
                        value={rewardForm.image}
                        onChange={(e) =>
                          setRewardForm({
                            ...rewardForm,
                            image: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleAddReward}
                          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          Add Reward
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRewardForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowRewardForm(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Reward
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Waitlist */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("waitlist")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Waitlist</span>
              </div>
              {expandedSections.waitlist ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.waitlist && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="waitlistEnabled"
                    name="waitlist.enabled"
                    checked={formData.waitlist.enabled}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label
                    htmlFor="waitlistEnabled"
                    className="text-sm text-gray-700"
                  >
                    <span className="font-medium">Enable Waitlist</span>
                    <p className="text-xs text-gray-500">
                      Allow keepers to join waitlist when all fragments are
                      claimed
                    </p>
                  </label>
                </div>

                {formData.waitlist.enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Capacity
                      </label>
                      <input
                        type="number"
                        name="waitlist.maxCapacity"
                        value={formData.waitlist.maxCapacity}
                        onChange={handleNumberChange}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                        placeholder="Leave empty for unlimited"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Count
                      </label>
                      <input
                        type="number"
                        name="waitlist.currentCount"
                        value={formData.waitlist.currentCount}
                        onChange={handleNumberChange}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                        readOnly={mode === "edit"}
                      />
                      {mode === "edit" && (
                        <p className="text-xs text-gray-500 mt-1">
                          Automatically updated when keepers join/leave
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Media */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("media")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Cover Image</span>
              </div>
              {expandedSections.media ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.media && (
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Cover Image
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended size: 800x600px, max 5MB
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    name="coverImage.alt"
                    value={formData.coverImage.alt}
                    onChange={handleChange}
                    placeholder="Alt text for cover image"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              <Save className="w-4 h-4" />
              {mode === "add" ? "Create Chronicle" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChronicleModal;
