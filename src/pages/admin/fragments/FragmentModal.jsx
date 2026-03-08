import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Upload,
  Plus,
  Trash2,
  Star,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Hash,
  Eye,
  Tag,
  Users,
  Calendar,
  FileText,
  Lock,
  Copy,
  EyeOff,
} from "lucide-react";
import Button from "../../../components/common/Button";
import toast from "react-hot-toast";

const FragmentModal = ({
  isOpen,
  onClose,
  mode,
  fragment,
  chronicles,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    chronicle: "",
    number: "",
    name: "",
    description: "",
    status: "available",
    claimedBy: null,
    claimedAt: null,
    price: "",
    rarity: "common",
    imageUrl: {
      url: "",
      publicId: "",
      alt: "",
    },
    features: [],
    clues: {
      revealed: 0,
      total: 3,
      list: [],
    },
    estimatedDelivery: "",
    isFeatured: false,
    metadata: {
      viewCount: 0,
      saveCount: 0,
    },
    dimensions: {
      weight: "",
      width: "",
      height: "",
      depth: "",
    },
    materials: [],
  });

  const [featureInput, setFeatureInput] = useState("");
  const [materialInput, setMaterialInput] = useState("");
  const [clueInput, setClueInput] = useState("");
  const [showClueForm, setShowClueForm] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    details: false,
    clues: false,
    features: false,
    dimensions: false,
    media: false,
    metadata: false,
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (mode === "edit" && fragment) {
      setFormData({
        chronicle: fragment.chronicle?._id || fragment.chronicle || "",
        number: fragment.number || "",
        name: fragment.name || "",
        description: fragment.description || "",
        status: fragment.status || "available",
        claimedBy: fragment.claimedBy || null,
        claimedAt: fragment.claimedAt || null,
        price: fragment.price || "",
        rarity: fragment.rarity || "common",
        imageUrl: fragment.imageUrl || { url: "", publicId: "", alt: "" },
        features: fragment.features || [],
        clues: fragment.clues || { revealed: 0, total: 3, list: [] },
        estimatedDelivery: fragment.estimatedDelivery || "",
        isFeatured: fragment.isFeatured || false,
        metadata: fragment.metadata || { viewCount: 0, saveCount: 0 },
        dimensions: fragment.dimensions || {
          weight: "",
          width: "",
          height: "",
          depth: "",
        },
        materials: fragment.materials || [],
      });
      setImagePreview(fragment.imageUrl?.url || "");
    } else {
      // Reset form for add mode
      setFormData({
        chronicle: chronicles.length > 0 ? chronicles[0]._id : "",
        number: "",
        name: "",
        description: "",
        status: "available",
        claimedBy: null,
        claimedAt: null,
        price: "",
        rarity: "common",
        imageUrl: { url: "", publicId: "", alt: "" },
        features: [],
        clues: { revealed: 0, total: 3, list: [] },
        estimatedDelivery: "",
        isFeatured: false,
        metadata: { viewCount: 0, saveCount: 0 },
        dimensions: { weight: "", width: "", height: "", depth: "" },
        materials: [],
      });
      setImagePreview("");
      setFeatureInput("");
      setMaterialInput("");
      setClueInput("");
    }
  }, [mode, fragment, chronicles, isOpen]);

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
    const numValue = value === "" ? "" : parseInt(value);
    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === "" ? "" : parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const handleAddFeature = () => {
    if (
      featureInput.trim() &&
      !formData.features.includes(featureInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (featureToRemove) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== featureToRemove),
    }));
  };

  const handleAddMaterial = () => {
    if (
      materialInput.trim() &&
      !formData.materials.includes(materialInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        materials: [...prev.materials, materialInput.trim()],
      }));
      setMaterialInput("");
    }
  };

  const handleRemoveMaterial = (materialToRemove) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m !== materialToRemove),
    }));
  };

  const handleAddClue = () => {
    if (clueInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        clues: {
          ...prev.clues,
          list: [
            ...prev.clues.list,
            {
              text: clueInput.trim(),
              revealedAt: null,
              revealedBy: null,
            },
          ],
        },
      }));
      setClueInput("");
    }
  };

  const handleRemoveClue = (index) => {
    setFormData((prev) => ({
      ...prev,
      clues: {
        ...prev.clues,
        list: prev.clues.list.filter((_, i) => i !== index),
      },
    }));
  };

  const handleToggleClueRevealed = (index) => {
    setFormData((prev) => {
      const newList = [...prev.clues.list];
      if (newList[index].revealedAt) {
        // Unreveal
        newList[index] = {
          text: newList[index].text,
          revealedAt: null,
          revealedBy: null,
        };
      } else {
        // Reveal
        newList[index] = {
          ...newList[index],
          revealedAt: new Date().toISOString(),
          revealedBy: "admin", // This would be the actual user ID in production
        };
      }

      // Update revealed count
      const revealedCount = newList.filter((c) => c.revealedAt).length;

      return {
        ...prev,
        clues: {
          ...prev.clues,
          list: newList,
          revealed: revealedCount,
        },
      };
    });
  };

  const handleImageUpload = (e) => {
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
      setImagePreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        imageUrl: {
          ...prev.imageUrl,
          url: reader.result,
          alt: formData.name || "Fragment image",
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.chronicle) {
      toast.error("Please select a parent chronicle");
      return;
    }
    if (!formData.number) {
      toast.error("Fragment number is required");
      return;
    }
    if (!formData.name) {
      toast.error("Fragment name is required");
      return;
    }
    if (!formData.description) {
      toast.error("Description is required");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("Valid price is required");
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

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "rare":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
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
                {mode === "add" ? "Create New Fragment" : "Edit Fragment"}
              </h2>
              <p className="text-gray-600 mt-1">
                {mode === "add"
                  ? "Add a new fragment to a chronicle"
                  : mode === "edit" &&
                    fragment &&
                    `Editing Fragment #${fragment.number}`}
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
                    Parent Chronicle *
                  </label>
                  <select
                    name="chronicle"
                    value={formData.chronicle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    required
                  >
                    <option value="">Select a chronicle</option>
                    {chronicles.map((chronicle) => (
                      <option key={chronicle._id} value={chronicle._id}>
                        {chronicle.name} (
                        {chronicle.enigma?.name || "Unknown Enigma"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fragment Number *
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="number"
                        value={formData.number}
                        onChange={handleNumberChange}
                        min="1"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                        placeholder="1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., Fragment #1 - Luffy"
                      required
                    />
                  </div>
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
                    placeholder="Describe this fragment and its significance..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <option value="claimed">Claimed</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rarity
                    </label>
                    <select
                      name="rarity"
                      value={formData.rarity}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none ${getRarityColor(
                        formData.rarity
                      )}`}
                    >
                      <option value="common">Common</option>
                      <option value="rare">Rare</option>
                      <option value="legendary">Legendary</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handlePriceChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                        placeholder="299.99"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Delivery
                    </label>
                    <input
                      type="text"
                      name="estimatedDelivery"
                      value={formData.estimatedDelivery}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., 6-8 weeks"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isFeatured" className="text-sm text-gray-700">
                    <span className="font-medium">Featured Fragment</span>
                    <p className="text-xs text-gray-500">
                      Featured fragments appear prominently
                    </p>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Claimed Information (shown only if claimed) */}
          {formData.status === "claimed" && (
            <div className="border border-purple-200 rounded-xl overflow-hidden bg-purple-50">
              <div className="p-4">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Claimed Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      Claimed By
                    </label>
                    <input
                      type="text"
                      value={
                        formData.claimedBy?.firstName ||
                        formData.claimedBy?.email ||
                        "Unknown"
                      }
                      readOnly
                      className="w-full px-4 py-3 bg-white border border-purple-300 rounded-xl text-purple-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      Claimed At
                    </label>
                    <input
                      type="text"
                      value={
                        formData.claimedAt
                          ? new Date(formData.claimedAt).toLocaleString()
                          : "Unknown"
                      }
                      readOnly
                      className="w-full px-4 py-3 bg-white border border-purple-300 rounded-xl text-purple-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("features")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Features</span>
              </div>
              {expandedSections.features ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.features && (
              <div className="p-4">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddFeature())
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    placeholder="Add a feature..."
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.features.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No features added yet
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Clues */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("clues")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Clues</span>
              </div>
              {expandedSections.clues ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.clues && (
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Clues
                  </label>
                  <input
                    type="number"
                    name="clues.total"
                    value={formData.clues.total}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clues: {
                          ...formData.clues,
                          total: parseInt(e.target.value) || 3,
                        },
                      })
                    }
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Clue List
                    </label>
                    <span className="text-sm text-gray-500">
                      Revealed: {formData.clues.revealed}/{formData.clues.total}
                    </span>
                  </div>

                  <div className="space-y-3 mb-3">
                    {formData.clues.list.map((clue, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          clue.revealedAt
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p
                              className={`text-sm ${
                                clue.revealedAt
                                  ? "text-gray-900"
                                  : "text-gray-600"
                              }`}
                            >
                              {clue.text}
                            </p>
                            {clue.revealedAt && (
                              <p className="text-xs text-green-600 mt-1">
                                Revealed:{" "}
                                {new Date(clue.revealedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleToggleClueRevealed(index)}
                              className={`p-2 rounded-lg transition-colors ${
                                clue.revealedAt
                                  ? "text-green-600 hover:bg-green-100"
                                  : "text-gray-400 hover:bg-gray-200"
                              }`}
                              title={
                                clue.revealedAt
                                  ? "Mark as hidden"
                                  : "Mark as revealed"
                              }
                            >
                              {clue.revealedAt ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveClue(index)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={clueInput}
                      onChange={(e) => setClueInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddClue())
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                      placeholder="Add a clue..."
                    />
                    <button
                      type="button"
                      onClick={handleAddClue}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {formData.clues.list.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No clues added yet. Add clues to reveal progressively.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Dimensions & Materials */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("dimensions")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">
                  Dimensions & Materials
                </span>
              </div>
              {expandedSections.dimensions ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.dimensions && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (g)
                    </label>
                    <input
                      type="number"
                      name="dimensions.weight"
                      value={formData.dimensions.weight}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (cm)
                    </label>
                    <input
                      type="number"
                      name="dimensions.width"
                      value={formData.dimensions.width}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="dimensions.height"
                      value={formData.dimensions.height}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Depth (cm)
                    </label>
                    <input
                      type="number"
                      name="dimensions.depth"
                      value={formData.dimensions.depth}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Materials
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={materialInput}
                      onChange={(e) => setMaterialInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddMaterial())
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                      placeholder="Add a material..."
                    />
                    <button
                      type="button"
                      onClick={handleAddMaterial}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.materials.map((material, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {material}
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(material)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
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
                <span className="font-semibold text-gray-900">
                  Fragment Image
                </span>
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
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Fragment preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="fragment-image-upload"
                    />
                    <label
                      htmlFor="fragment-image-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended size: 400x300px, max 5MB
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    name="imageUrl.alt"
                    value={formData.imageUrl.alt}
                    onChange={handleChange}
                    placeholder="Alt text for image"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Metadata (for editing only) */}
          {mode === "edit" && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("metadata")}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-900">Metadata</span>
                </div>
                {expandedSections.metadata ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {expandedSections.metadata && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      View Count
                    </label>
                    <input
                      type="number"
                      name="metadata.viewCount"
                      value={formData.metadata.viewCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metadata: {
                            ...formData.metadata,
                            viewCount: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Save Count
                    </label>
                    <input
                      type="number"
                      name="metadata.saveCount"
                      value={formData.metadata.saveCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          metadata: {
                            ...formData.metadata,
                            saveCount: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

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
              {mode === "add" ? "Create Fragment" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FragmentModal;
