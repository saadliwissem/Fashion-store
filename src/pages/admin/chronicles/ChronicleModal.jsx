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
  AlertTriangle,
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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [mode, chronicle, enigmas, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

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
      if (rewardForm.name.length > 100) {
        toast.error("Reward name cannot exceed 100 characters");
        return;
      }
      if (rewardForm.description.length > 500) {
        toast.error("Reward description cannot exceed 500 characters");
        return;
      }
      if (rewardForm.image && !rewardForm.image.match(/^https?:\/\/.+/)) {
        toast.error(
          "Reward image must be a valid URL starting with http:// or https://"
        );
        return;
      }
      setFormData((prev) => ({
        ...prev,
        rewards: [...prev.rewards, { ...rewardForm }],
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

  const handleRemoveReward = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      rewards: prev.rewards.filter((_, index) => index !== indexToRemove),
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
          publicId: "",
        },
      }));
      if (errors["coverImage.url"]) {
        setErrors((prev) => ({ ...prev, "coverImage.url": undefined }));
      }
    };
    reader.readAsDataURL(file);
  };
  // Add this function to ChronicleModal component
  const handleRemoveCoverImage = () => {
    setCoverPreview("");
    setFormData((prev) => ({
      ...prev,
      coverImage: {
        url: "",
        alt: "",
        publicId: "",
      },
    }));
    // Clear any errors
    if (errors["coverImage.url"]) {
      setErrors((prev) => ({ ...prev, "coverImage.url": undefined }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.enigma)
      validationErrors.enigma = "Please select a parent enigma";
    if (!formData.name) validationErrors.name = "Chronicle name is required";
    if (!formData.description)
      validationErrors.description = "Description is required";
    if (!formData.basePrice || formData.basePrice <= 0)
      validationErrors.basePrice = "Valid base price is required";
    if (
      !formData.stats.requiredFragments ||
      formData.stats.requiredFragments < 1
    ) {
      validationErrors["stats.requiredFragments"] =
        "Required fragments must be at least 1";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
    } catch (error) {
      if (error.response?.data?.errors) {
        const backendErrors = {};
        error.response.data.errors.forEach((err) => {
          let fieldName = err.field || err.param || err.path;

          if (!fieldName) {
            const message = err.message.toLowerCase();
            if (message.includes("name")) fieldName = "name";
            else if (message.includes("description")) fieldName = "description";
            else if (message.includes("enigma")) fieldName = "enigma";
            else if (message.includes("price")) fieldName = "basePrice";
            else if (message.includes("fragment"))
              fieldName = "stats.requiredFragments";
            else if (message.includes("avatar")) fieldName = "author.avatar";
            else fieldName = "general";
          }

          backendErrors[fieldName] = err.message;
        });
        setErrors(backendErrors);

        const sectionsToExpand = new Set();
        Object.keys(backendErrors).forEach((field) => {
          if (
            field === "name" ||
            field === "description" ||
            field === "enigma" ||
            field === "lore"
          ) {
            sectionsToExpand.add("basic");
          } else if (
            field === "difficulty" ||
            field === "status" ||
            field === "timeline" ||
            field === "basePrice" ||
            field === "featured"
          ) {
            sectionsToExpand.add("details");
          } else if (
            field === "productionStatus" ||
            field === "estimatedStartDate" ||
            field === "estimatedCompletion"
          ) {
            sectionsToExpand.add("production");
          } else if (field.includes("location")) {
            sectionsToExpand.add("location");
          } else if (field.includes("author")) {
            sectionsToExpand.add("author");
          } else if (field.includes("stats")) {
            sectionsToExpand.add("stats");
          } else if (field.includes("rewards")) {
            sectionsToExpand.add("rewards");
          } else if (field.includes("waitlist")) {
            sectionsToExpand.add("waitlist");
          } else if (field.includes("coverImage")) {
            sectionsToExpand.add("media");
          }
        });

        setExpandedSections((prev) => ({
          ...prev,
          ...Object.fromEntries([...sectionsToExpand].map((s) => [s, true])),
        }));

        toast.error("Please fix the validation errors");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to save chronicle"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) => {
    return errors[fieldName];
  };

  const isFieldInvalid = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
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

    let value;
    if (name.includes(".")) {
      const parts = name.split(".");
      if (parts.length === 2) {
        value = formData[parts[0]]?.[parts[1]] || "";
      } else if (parts.length === 3) {
        value = formData[parts[0]]?.[parts[1]]?.[parts[2]] || "";
      } else {
        value = "";
      }
    } else {
      value = formData[name];
    }

    const inputProps = {
      type,
      name,
      value,
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

  const renderTextarea = (name, rows, placeholder) => {
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div
            className={`border rounded-xl overflow-hidden ${
              getFieldError("name") ||
              getFieldError("description") ||
              getFieldError("enigma")
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
                    getFieldError("name") || getFieldError("description")
                      ? "text-red-500"
                      : "text-purple-600"
                  }`}
                />
                <span className="font-semibold text-gray-900">
                  Basic Information
                </span>
                {(getFieldError("name") ||
                  getFieldError("description") ||
                  getFieldError("enigma")) && (
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
                    Parent Enigma *
                  </label>
                  <select
                    name="enigma"
                    value={formData.enigma}
                    onChange={handleChange}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, enigma: true }))
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none ${
                      isFieldInvalid("enigma")
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-purple-500"
                    }`}
                  >
                    <option value="">Select an enigma</option>
                    {enigmas?.map((enigma) => (
                      <option key={enigma._id} value={enigma._id}>
                        {enigma.name}
                      </option>
                    ))}
                  </select>
                  {getFieldError("enigma") && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{getFieldError("enigma")}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chronicle Name *
                  </label>
                  {renderInput(
                    "name",
                    "text",
                    "e.g., The Straw Hat Legacy",
                    true
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  {renderTextarea(
                    "description",
                    3,
                    "Brief description of the chronicle..."
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lore
                  </label>
                  {renderTextarea(
                    "lore",
                    4,
                    "The deep story and mythology of this chronicle..."
                  )}
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
                    <option value="available">Available</option>
                    <option value="forging">Forging</option>
                    <option value="cipher">Cipher</option>
                    <option value="solved">Solved</option>
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
                    Timeline
                  </label>
                  {renderInput("timeline", "text", "e.g., 6-8 weeks")}
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
                      onBlur={() =>
                        setTouched((prev) => ({ ...prev, basePrice: true }))
                      }
                      min="0"
                      step="0.01"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none ${
                        isFieldInvalid("basePrice")
                          ? "border-red-500 focus:border-red-500 bg-red-50"
                          : "border-gray-300 focus:border-purple-500"
                      }`}
                      placeholder="299.99"
                    />
                  </div>
                  {getFieldError("basePrice") && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{getFieldError("basePrice")}</span>
                    </div>
                  )}
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
                      onBlur={() =>
                        setTouched((prev) => ({
                          ...prev,
                          productionStatus: true,
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none ${
                        isFieldInvalid("productionStatus")
                          ? "border-red-500 focus:border-red-500 bg-red-50"
                          : "border-gray-300 focus:border-purple-500"
                      }`}
                    >
                      <option value="awaiting">Awaiting</option>
                      <option value="design">Design</option>
                      <option value="forging">Forging</option>
                      <option value="enchanting">Enchanting</option>
                      <option value="shipping">Shipping</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    {getFieldError("productionStatus") && (
                      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{getFieldError("productionStatus")}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Start Date
                    </label>
                    {renderInput("estimatedStartDate", "date", "")}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Completion
                    </label>
                    {renderInput("estimatedCompletion", "date", "")}
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
                  {renderInput("location.country", "text", "e.g., Japan")}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  {renderInput("location.city", "text", "e.g., Tokyo")}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  {renderInput(
                    "location.coordinates.lat",
                    "number",
                    "35.6895",
                    false,
                    { step: "any" }
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  {renderInput(
                    "location.coordinates.lng",
                    "number",
                    "139.6917",
                    false,
                    { step: "any" }
                  )}
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
                  {renderInput(
                    "author.name",
                    "text",
                    "e.g., Mystery Weaver #42"
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Avatar URL
                  </label>
                  {renderInput(
                    "author.avatar",
                    "url",
                    "https://example.com/avatar.jpg"
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Role
                  </label>
                  {renderInput("author.role", "text", "e.g., Chronicle Keeper")}
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
                    onBlur={() =>
                      setTouched((prev) => ({
                        ...prev,
                        "stats.fragmentCount": true,
                      }))
                    }
                    min="0"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none ${
                      isFieldInvalid("stats.fragmentCount")
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-purple-500"
                    }`}
                    readOnly={mode === "edit"}
                  />
                  {mode === "edit" && (
                    <p className="text-xs text-gray-500 mt-1">
                      Automatically updated based on fragments
                    </p>
                  )}
                  {getFieldError("stats.fragmentCount") && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{getFieldError("stats.fragmentCount")}</span>
                    </div>
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
                    onBlur={() =>
                      setTouched((prev) => ({
                        ...prev,
                        "stats.fragmentsClaimed": true,
                      }))
                    }
                    min="0"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none ${
                      isFieldInvalid("stats.fragmentsClaimed")
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-purple-500"
                    }`}
                    readOnly={mode === "edit"}
                  />
                  {getFieldError("stats.fragmentsClaimed") && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{getFieldError("stats.fragmentsClaimed")}</span>
                    </div>
                  )}
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
                    onBlur={() =>
                      setTouched((prev) => ({
                        ...prev,
                        "stats.requiredFragments": true,
                      }))
                    }
                    min="1"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none ${
                      isFieldInvalid("stats.requiredFragments")
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-purple-500"
                    }`}
                  />
                  {getFieldError("stats.requiredFragments") && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{getFieldError("stats.requiredFragments")}</span>
                    </div>
                  )}
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
                    onBlur={() =>
                      setTouched((prev) => ({
                        ...prev,
                        "stats.uniqueKeepers": true,
                      }))
                    }
                    min="0"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none ${
                      isFieldInvalid("stats.uniqueKeepers")
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "border-gray-300 focus:border-purple-500"
                    }`}
                    readOnly={mode === "edit"}
                  />
                  {getFieldError("stats.uniqueKeepers") && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{getFieldError("stats.uniqueKeepers")}</span>
                    </div>
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
                          <span className="text-xs text-gray-500">
                            Threshold: {reward.unlockThreshold}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {reward.description}
                        </p>
                        {reward.image && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {reward.image}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveReward(index)}
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
                      {renderInput(
                        "waitlist.maxCapacity",
                        "number",
                        "Leave empty for unlimited",
                        false,
                        { min: 0 }
                      )}
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
                        onBlur={() =>
                          setTouched((prev) => ({
                            ...prev,
                            "waitlist.currentCount": true,
                          }))
                        }
                        min="0"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:outline-none ${
                          isFieldInvalid("waitlist.currentCount")
                            ? "border-red-500 focus:border-red-500 bg-red-50"
                            : "border-gray-300 focus:border-purple-500"
                        }`}
                        readOnly={mode === "edit"}
                      />
                      {mode === "edit" && (
                        <p className="text-xs text-gray-500 mt-1">
                          Automatically updated when keepers join/leave
                        </p>
                      )}
                      {getFieldError("waitlist.currentCount") && (
                        <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{getFieldError("waitlist.currentCount")}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Media */}
          {/* Media */}
          <div
            className={`border rounded-xl overflow-hidden ${
              getFieldError("coverImage.url")
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
                    getFieldError("coverImage.url")
                      ? "text-red-500"
                      : "text-purple-600"
                  }`}
                />
                <span className="font-semibold text-gray-900">Cover Image</span>
                {getFieldError("coverImage.url") && (
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
              <div className="p-4">
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
                        <BookOpen className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-2">
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
                      {coverPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveCoverImage}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended size: 800x600px, max 5MB
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
            )}
          </div>

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
                  {mode === "add" ? "Create Chronicle" : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChronicleModal;
