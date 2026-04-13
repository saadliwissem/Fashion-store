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
  Tag,
  FileText,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import Button from "../../../components/common/Button";
import toast from "react-hot-toast";

const EnigmaModal = ({ isOpen, onClose, mode, enigma, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    lore: "",
    status: "upcoming",
    difficulty: "intermediate",
    featured: false,
    coverImage: {
      url: "",
      alt: "",
      publicId: "",
    },
    bannerImage: {
      url: "",
      alt: "",
      publicId: "",
    },
    creator: {
      name: "",
      avatar: "",
      bio: "",
    },
    location: {
      country: "",
      city: "",
      virtual: false,
    },
    tags: [],
    rewards: [],
    startDate: "",
    estimatedEnd: "",
    seo: {
      title: "",
      description: "",
      keywords: [],
    },
    stats: {
      activeKeepers: 0,
      totalValueLocked: 0,
      completionRate: 0,
      averageTimeToComplete: 0,
    },
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [seoKeywordInput, setSeoKeywordInput] = useState("");
  const [rewardForm, setRewardForm] = useState({
    name: "",
    description: "",
    type: "physical",
    rarity: "common",
    image: "",
  });
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    media: true,
    creator: false,
    location: false,
    tags: false,
    rewards: false,
    dates: false,
    seo: false,
    stats: false,
  });
  const [coverPreview, setCoverPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && enigma) {
      setFormData({
        name: enigma.name || "",
        description: enigma.description || "",
        lore: enigma.lore || "",
        status: enigma.status || "upcoming",
        difficulty: enigma.difficulty || "intermediate",
        featured: enigma.featured || false,
        coverImage: enigma.coverImage || { url: "", alt: "", publicId: "" },
        bannerImage: enigma.bannerImage || { url: "", alt: "", publicId: "" },
        creator: enigma.creator || { name: "", avatar: "", bio: "" },
        location: enigma.location || { country: "", city: "", virtual: false },
        tags: enigma.tags || [],
        rewards: enigma.rewards || [],
        startDate: enigma.startDate ? enigma.startDate.split("T")[0] : "",
        estimatedEnd: enigma.estimatedEnd
          ? enigma.estimatedEnd.split("T")[0]
          : "",
        seo: enigma.seo || { title: "", description: "", keywords: [] },
        stats: enigma.stats || {
          activeKeepers: 0,
          totalValueLocked: 0,
          completionRate: 0,
          averageTimeToComplete: 0,
        },
      });
      setCoverPreview(enigma.coverImage?.url || "");
      setBannerPreview(enigma.bannerImage?.url || "");
    } else {
      setFormData({
        name: "",
        description: "",
        lore: "",
        status: "upcoming",
        difficulty: "intermediate",
        featured: false,
        coverImage: { url: "", alt: "", publicId: "" },
        bannerImage: { url: "", alt: "", publicId: "" },
        creator: { name: "", avatar: "", bio: "" },
        location: { country: "", city: "", virtual: false },
        tags: [],
        rewards: [],
        startDate: "",
        estimatedEnd: "",
        seo: { title: "", description: "", keywords: [] },
        stats: {
          activeKeepers: 0,
          totalValueLocked: 0,
          completionRate: 0,
          averageTimeToComplete: 0,
        },
      });
      setCoverPreview("");
      setBannerPreview("");
      setTagInput("");
      setSeoKeywordInput("");
      setRewardForm({
        name: "",
        description: "",
        type: "physical",
        rarity: "common",
        image: "",
      });
    }
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [mode, enigma, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      if (formData.tags.length >= 20) {
        toast.error("Maximum 20 tags allowed");
        return;
      }
      if (tagInput.trim().length > 30) {
        toast.error("Tag cannot exceed 30 characters");
        return;
      }
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
        setTagInput("");
        if (errors.tags) {
          setErrors((prev) => ({ ...prev, tags: undefined }));
        }
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddSeoKeyword = () => {
    if (seoKeywordInput.trim()) {
      if (seoKeywordInput.trim().length > 30) {
        toast.error("Keyword cannot exceed 30 characters");
        return;
      }
      if (!formData.seo.keywords.includes(seoKeywordInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          seo: {
            ...prev.seo,
            keywords: [...prev.seo.keywords, seoKeywordInput.trim()],
          },
        }));
        setSeoKeywordInput("");
      }
    }
  };

  const handleRemoveSeoKeyword = (keywordToRemove) => {
    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter((k) => k !== keywordToRemove),
      },
    }));
  };

  const handleAddReward = () => {
    if (rewardForm.name && rewardForm.description) {
      if (rewardForm.name.length > 100) {
        toast.error("Reward name cannot exceed 100 characters");
        return;
      }
      if (rewardForm.description.length > 500) {
        toast.error("Reward description cannot exceed 500 characters");
        return;
      }
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
          alt: prev.name || "Cover image",
          publicId: "",
        },
      }));
      if (errors["coverImage.url"]) {
        setErrors((prev) => ({ ...prev, "coverImage.url": undefined }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerImageUpload = (e) => {
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
      setBannerPreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        bannerImage: {
          ...prev.bannerImage,
          url: reader.result,
          alt: prev.name || "Banner image",
          publicId: "",
        },
      }));
      if (errors["bannerImage.url"]) {
        setErrors((prev) => ({ ...prev, "bannerImage.url": undefined }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.name) validationErrors.name = "Enigma name is required";
    if (!formData.description)
      validationErrors.description = "Description is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.log("Error response:", error.response?.data); // Debug log

      // Check if the error has the validation errors structure
      if (error.response?.data?.errors) {
        const backendErrors = {};

        error.response.data.errors.forEach((err) => {
          // Try to get field from different possible properties
          let fieldName = err.field || err.param || err.path;

          // If no field name, try to infer from message
          if (!fieldName) {
            const message = err.message.toLowerCase();
            if (message.includes("description")) fieldName = "description";
            else if (message.includes("name")) fieldName = "name";
            else if (message.includes("avatar")) fieldName = "creator.avatar";
            else if (message.includes("reward image"))
              fieldName = "rewards.0.image";
            else fieldName = "general";
          }

          backendErrors[fieldName] = err.message;
        });

        setErrors(backendErrors);

        // Auto-expand sections with errors
        const sectionsToExpand = new Set();
        Object.keys(backendErrors).forEach((field) => {
          if (
            field === "name" ||
            field === "description" ||
            field === "lore" ||
            field === "status" ||
            field === "difficulty"
          ) {
            sectionsToExpand.add("basic");
          } else if (
            field.includes("coverImage") ||
            field.includes("bannerImage")
          ) {
            sectionsToExpand.add("media");
          } else if (field.includes("creator")) {
            sectionsToExpand.add("creator");
          } else if (field.includes("location")) {
            sectionsToExpand.add("location");
          } else if (field === "tags") {
            sectionsToExpand.add("tags");
          } else if (field.includes("rewards")) {
            sectionsToExpand.add("rewards");
          } else if (
            field.includes("startDate") ||
            field.includes("estimatedEnd")
          ) {
            sectionsToExpand.add("dates");
          } else if (field.includes("seo")) {
            sectionsToExpand.add("seo");
          } else if (field.includes("stats")) {
            sectionsToExpand.add("stats");
          }
        });

        setExpandedSections((prev) => ({
          ...prev,
          ...Object.fromEntries([...sectionsToExpand].map((s) => [s, true])),
        }));

        toast.error("Please fix the validation errors");
      } else {
        toast.error(error.response?.data?.message || "Failed to save enigma");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName];
  };

  const isFieldInvalid = (fieldName) => {
    // Check if this specific field has an error
    if (touched[fieldName] && errors[fieldName]) {
      return true;
    }

    // For nested fields, also check if the error exists
    if (errors[fieldName]) {
      return true;
    }

    return false;
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderInput = (
    name,
    type = "text",
    placeholder,
    required = false,
    options = {}
  ) => {
    const error = getFieldError(name);
    const isInvalid = isFieldInvalid(name);

    const inputProps = {
      type,
      name,
      value: name.includes(".")
        ? name.split(".").reduce((obj, key) => obj?.[key], formData) || ""
        : formData[name],
      onChange: handleChange,
      onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
      className: `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors ${
        isInvalid
          ? "border-red-500 focus:border-red-500 bg-red-50"
          : "border-gray-300 focus:border-purple-500"
      }`,
      placeholder,
      ...options,
    };

    return (
      <div>
        <input {...inputProps} />
        {error && (
          <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
            <AlertTriangle className="w-3 h-3" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  };

  const renderTextarea = (name, rows, placeholder, required = false) => {
    const error = getFieldError(name);
    const isInvalid = isFieldInvalid(name);

    return (
      <div>
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onBlur={() => setTouched((prev) => ({ ...prev, [name]: true }))}
          rows={rows}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors ${
            isInvalid
              ? "border-red-500 focus:border-red-500 bg-red-50"
              : "border-gray-300 focus:border-purple-500"
          }`}
          placeholder={placeholder}
        />
        {error && (
          <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
            <AlertTriangle className="w-3 h-3" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === "add" ? "Create New Enigma" : "Edit Enigma"}
              </h2>
              <p className="text-gray-600 mt-1">
                {mode === "add"
                  ? "Add a new mystery collection to the platform"
                  : "Update the enigma details"}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div
            className={`border rounded-xl overflow-hidden ${
              getFieldError("name") || getFieldError("description")
                ? "border-red-200 bg-red-50/50"
                : "border-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleSection("basic")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText
                  className={`w-5 h-5 ${
                    getFieldError("name") ? "text-red-500" : "text-purple-600"
                  }`}
                />
                <span className="font-semibold text-gray-900">
                  Basic Information
                </span>
                {(getFieldError("name") || getFieldError("description")) && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    Has errors
                  </span>
                )}
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
                    Enigma Name *
                  </label>
                  {renderInput("name", "text", "e.g., Anime Chronicles", true)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  {renderTextarea(
                    "description",
                    3,
                    "Brief description of the enigma..."
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lore
                  </label>
                  {renderTextarea(
                    "lore",
                    5,
                    "The deep story and mythology of this enigma..."
                  )}
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
                      onBlur={() =>
                        setTouched((prev) => ({ ...prev, status: true }))
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none ${
                        isFieldInvalid("status")
                          ? "border-red-500 focus:border-red-500 bg-red-50"
                          : "border-gray-300 focus:border-purple-500"
                      }`}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="solved">Solved</option>
                      <option value="archived">Archived</option>
                    </select>
                    {getFieldError("status") && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{getFieldError("status")}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      onBlur={() =>
                        setTouched((prev) => ({ ...prev, difficulty: true }))
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none ${
                        isFieldInvalid("difficulty")
                          ? "border-red-500 focus:border-red-500 bg-red-50"
                          : "border-gray-300 focus:border-purple-500"
                      }`}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                    {getFieldError("difficulty") && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{getFieldError("difficulty")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    <span className="font-medium">Featured Enigma</span>
                    <p className="text-xs text-gray-500">
                      Featured enigmas appear on the homepage
                    </p>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Media */}
          <div
            className={`border rounded-xl overflow-hidden ${
              getFieldError("coverImage.url") ||
              getFieldError("bannerImage.url")
                ? "border-red-200 bg-red-50/50"
                : "border-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleSection("media")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ImageIcon
                  className={`w-5 h-5 ${
                    getFieldError("coverImage.url") ||
                    getFieldError("bannerImage.url")
                      ? "text-red-500"
                      : "text-purple-600"
                  }`}
                />
                <span className="font-semibold text-gray-900">Media</span>
                {(getFieldError("coverImage.url") ||
                  getFieldError("bannerImage.url")) && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    Has errors
                  </span>
                )}
              </div>
              {expandedSections.media ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.media && (
              <div className="p-4 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image
                  </label>
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-32 h-32 bg-gray-100 rounded-xl overflow-hidden border ${
                        getFieldError("coverImage.url")
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    >
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Cover preview"
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
                        Recommended size: 1200x800px, max 5MB
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    {renderInput(
                      "coverImage.alt",
                      "text",
                      "Alt text for cover image"
                    )}
                  </div>
                  {getFieldError("coverImage.url") && (
                    <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{getFieldError("coverImage.url")}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Image
                  </label>
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-32 h-32 bg-gray-100 rounded-xl overflow-hidden border ${
                        getFieldError("bannerImage.url")
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    >
                      {bannerPreview ? (
                        <img
                          src={bannerPreview}
                          alt="Banner preview"
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
                        onChange={handleBannerImageUpload}
                        className="hidden"
                        id="banner-upload"
                      />
                      <label
                        htmlFor="banner-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Banner Image
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Recommended size: 1600x600px, max 5MB
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    {renderInput(
                      "bannerImage.alt",
                      "text",
                      "Alt text for banner image"
                    )}
                  </div>
                  {getFieldError("bannerImage.url") && (
                    <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{getFieldError("bannerImage.url")}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Creator Information */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("creator")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">
                  Creator Information
                </span>
              </div>
              {expandedSections.creator ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.creator && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creator Name
                  </label>
                  {renderInput(
                    "creator.name",
                    "text",
                    "e.g., Arcane Weavers Collective"
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creator Avatar URL
                  </label>
                  {renderInput(
                    "creator.avatar",
                    "url",
                    "https://example.com/avatar.jpg"
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creator Bio
                  </label>
                  {renderTextarea(
                    "creator.bio",
                    3,
                    "Brief bio of the creator..."
                  )}
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
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="virtual"
                    name="location.virtual"
                    checked={formData.location.virtual}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="virtual" className="text-sm text-gray-700">
                    Virtual Location
                  </label>
                </div>

                {!formData.location.virtual && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      {renderInput("location.country", "text", "e.g., Japan")}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      {renderInput("location.city", "text", "e.g., Tokyo")}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("tags")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Tags</span>
              </div>
              {expandedSections.tags ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.tags && (
              <div className="p-4">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddTag())
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    placeholder="Add a tag..."
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.tags.length === 0 && (
                    <p className="text-sm text-gray-500">No tags added yet</p>
                  )}
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

          {/* Dates */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("dates")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Dates</span>
              </div>
              {expandedSections.dates ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.dates && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  {renderInput("startDate", "date", "")}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated End Date
                  </label>
                  {renderInput("estimatedEnd", "date", "")}
                </div>
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("seo")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">
                  SEO Settings
                </span>
              </div>
              {expandedSections.seo ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.seo && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  {renderInput(
                    "seo.title",
                    "text",
                    "SEO optimized title (max 60 chars)",
                    false,
                    { maxLength: 60 }
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seo.title.length}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  {renderTextarea(
                    "seo.description",
                    2,
                    "SEO meta description (max 160 chars)"
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seo.description.length}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={seoKeywordInput}
                      onChange={(e) => setSeoKeywordInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddSeoKeyword())
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                      placeholder="Add a keyword..."
                    />
                    <button
                      type="button"
                      onClick={handleAddSeoKeyword}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.seo.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => handleRemoveSeoKeyword(keyword)}
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

          {/* Stats (for editing only) */}
          {mode === "edit" && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("stats")}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-900">
                    Statistics
                  </span>
                </div>
                {expandedSections.stats ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {expandedSections.stats && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Active Keepers
                    </label>
                    {renderInput("stats.activeKeepers", "number", "", false, {
                      min: 0,
                    })}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Value Locked ($)
                    </label>
                    {renderInput(
                      "stats.totalValueLocked",
                      "number",
                      "",
                      false,
                      { min: 0, step: 0.01 }
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Completion Rate (%)
                    </label>
                    {renderInput("stats.completionRate", "number", "", false, {
                      min: 0,
                      max: 100,
                    })}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Time to Complete (days)
                    </label>
                    {renderInput(
                      "stats.averageTimeToComplete",
                      "number",
                      "",
                      false,
                      { min: 0 }
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === "add" ? "Creating..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {mode === "add" ? "Create Enigma" : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnigmaModal;
