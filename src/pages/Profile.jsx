import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Package,
  Heart,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  Eye,
  EyeOff,
  Upload,
  Camera,
  Save,
  Lock,
  Bell,
  CreditCard,
  Star,
  ShoppingBag,
} from "lucide-react";
import Button from "../components/common/Button";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [editingField, setEditingField] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    avatar: "",
    emailVerified: false,
    newsletter: false,
    marketingEmails: true,
    role: "customer",
    orderCount: 0,
    totalSpent: 0,
    cartCount: 0,
    wishlistCount: 0,
    addresses: [],
    createdAt: "",
    googleId: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [addressForm, setAddressForm] = useState({
    _id: "",
    label: "Home",
    firstName: "",
    lastName: "",
    phone: "",
    governorate: "",
    city: "",
    zipCode: "",
    address: "",
    address2: "",
    isDefault: false,
  });

  const governorates = [
    "Ariana",
    "Béja",
    "Ben Arous",
    "Bizerte",
    "Gabès",
    "Gafsa",
    "Jendouba",
    "Kairouan",
    "Kasserine",
    "Kébili",
    "Kef",
    "Mahdia",
    "Manouba",
    "Médenine",
    "Monastir",
    "Nabeul",
    "Sfax",
    "Sidi Bouzid",
    "Siliana",
    "Sousse",
    "Tataouine",
    "Tozeur",
    "Tunis",
    "Zaghouan",
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      setProfile(response.data.user);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      // Add profile fields
      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("phone", profile.phone);
      formData.append("dateOfBirth", profile.dateOfBirth);
      formData.append("newsletter", profile.newsletter);
      formData.append("marketingEmails", profile.marketingEmails);

      // Add avatar if uploaded
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await authAPI.updateProfile(formData);
      setProfile(response.data.user);
      setUser(response.data.user); // Update auth context
      toast.success("Profile updated successfully");
      setAvatarFile(null);
      setAvatarPreview("");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setSaving(true);
      await authAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password updated successfully");
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to update password:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    // Validate required fields
    if (
      !addressForm.firstName ||
      !addressForm.lastName ||
      !addressForm.phone ||
      !addressForm.governorate ||
      !addressForm.city ||
      !addressForm.address
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);
      const response = await authAPI.addAddress(addressForm);
      setProfile((prev) => ({
        ...prev,
        addresses: response.data.addresses,
      }));
      toast.success("Address saved successfully");
      setShowAddressForm(false);
      resetAddressForm();
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleEditAddress = (address) => {
    setAddressForm({ ...address });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      setSaving(true);
      const response = await authAPI.deleteAddress(addressId);
      setProfile((prev) => ({
        ...prev,
        addresses: response.data.addresses,
      }));
      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error(error.response?.data?.message || "Failed to delete address");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setSaving(true);
      const address = profile.addresses.find((addr) => addr._id === addressId);
      const updatedAddress = { ...address, isDefault: true };
      const response = await authAPI.addAddress(updatedAddress);
      setProfile((prev) => ({
        ...prev,
        addresses: response.data.addresses,
      }));
      toast.success("Default address updated");
    } catch (error) {
      console.error("Failed to update address:", error);
      toast.error("Failed to set default address");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      _id: "",
      label: "Home",
      firstName: "",
      lastName: "",
      phone: "",
      governorate: "",
      city: "",
      zipCode: "",
      address: "",
      address2: "",
      isDefault: false,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    return price.toFixed(3);
  };

  const getJoinedDate = () => {
    const date = new Date(profile.createdAt);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading && !profile.firstName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Profile
              </h1>
              <p className="text-gray-600">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              {/* User Info Card */}
              <div className="text-center mb-8">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mx-auto border-4 border-white shadow-md">
                    {avatarPreview || profile.avatar ? (
                      <img
                        src={avatarPreview || profile.avatar}
                        alt={profile.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 text-white text-3xl font-bold">
                        {profile.firstName?.charAt(0)}
                        {profile.lastName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Camera className="w-5 h-5 text-gray-700" />
                  </label>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600 text-sm mt-1">{profile.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                    <Shield className="w-3 h-3" />
                    {profile.role.charAt(0).toUpperCase() +
                      profile.role.slice(1)}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-3">
                  Member since {getJoinedDate()}
                </p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {[
                  { id: "personal", icon: User, label: "Personal Info" },
                  { id: "addresses", icon: MapPin, label: "Addresses" },
                  { id: "security", icon: Lock, label: "Security" },
                  { id: "preferences", icon: Bell, label: "Preferences" },
                  { id: "orders", icon: ShoppingBag, label: "My Orders" },
                  { id: "wishlist", icon: Heart, label: "Wishlist" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? "bg-purple-50 text-purple-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                    {item.id === "orders" && profile.orderCount > 0 && (
                      <span className="ml-auto bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
                        {profile.orderCount}
                      </span>
                    )}
                    {item.id === "wishlist" && profile.wishlistCount > 0 && (
                      <span className="ml-auto bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                        {profile.wishlistCount}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Your Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Orders</span>
                    <span className="font-medium">{profile.orderCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Total Spent</span>
                    <span className="font-medium">
                      {formatPrice(profile.totalSpent)} DT
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Cart Items</span>
                    <span className="font-medium">{profile.cartCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Wishlist</span>
                    <span className="font-medium">{profile.wishlistCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Personal Info Tab */}
            {activeTab === "personal" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Personal Information
                  </h3>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      className="input-modern w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      className="input-modern w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="input-modern w-full bg-gray-50"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {profile.emailVerified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-sm">
                            <Check className="w-4 h-4" />
                            Verified
                          </span>
                        ) : (
                          <span className="text-amber-600 text-sm">
                            Not verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      className="input-modern w-full"
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profile.dateOfBirth?.split("T")[0] || ""}
                      onChange={handleInputChange}
                      className="input-modern w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="px-4 py-2 bg-gray-100 rounded-lg flex-1">
                        <p className="font-medium text-gray-900">
                          {profile.googleId
                            ? "Google Account"
                            : "Email Account"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {profile.googleId
                            ? "Linked with Google"
                            : "Registered with email"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Avatar Upload Preview */}
                {avatarPreview && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      New Avatar Preview:
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={avatarPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          Click Save Changes to update your profile picture
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setAvatarPreview("");
                          setAvatarFile(null);
                        }}
                        className="p-2 text-gray-500 hover:text-red-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    My Addresses
                  </h3>
                  <Button
                    onClick={() => {
                      resetAddressForm();
                      setShowAddressForm(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Address
                  </Button>
                </div>

                {showAddressForm ? (
                  <div className="mb-8 p-6 border border-gray-200 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      {addressForm._id ? "Edit Address" : "Add New Address"}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Label
                        </label>
                        <select
                          name="label"
                          value={addressForm.label}
                          onChange={handleAddressChange}
                          className="input-modern w-full"
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="flex items-center mt-6">
                        <input
                          type="checkbox"
                          id="isDefault"
                          name="isDefault"
                          checked={addressForm.isDefault}
                          onChange={handleAddressChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="isDefault"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Set as default address
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={addressForm.firstName}
                          onChange={handleAddressChange}
                          className="input-modern w-full"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={addressForm.lastName}
                          onChange={handleAddressChange}
                          className="input-modern w-full"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={addressForm.phone}
                          onChange={handleAddressChange}
                          className="input-modern w-full"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Governorate *
                        </label>
                        <select
                          name="governorate"
                          value={addressForm.governorate}
                          onChange={handleAddressChange}
                          className="input-modern w-full"
                          required
                        >
                          <option value="">Select Governorate</option>
                          {governorates.map((gov) => (
                            <option key={gov} value={gov}>
                              {gov}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={addressForm.city}
                          onChange={handleAddressChange}
                          className="input-modern w-full"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={addressForm.zipCode}
                          onChange={handleAddressChange}
                          className="input-modern w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={addressForm.address}
                          onChange={handleAddressChange}
                          className="input-modern w-full"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          name="address2"
                          value={addressForm.address2}
                          onChange={handleAddressChange}
                          className="input-modern w-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6">
                      <Button
                        onClick={handleSaveAddress}
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Address
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAddressForm(false);
                          resetAddressForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}

                {profile.addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No addresses saved
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Add your first address to make checkout faster
                    </p>
                    <Button
                      onClick={() => {
                        resetAddressForm();
                        setShowAddressForm(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`border rounded-xl p-5 ${
                          address.isDefault
                            ? "border-purple-300 bg-purple-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                {address.label}
                              </span>
                              {address.isDefault && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  Default
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-gray-900">
                              {address.firstName} {address.lastName}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              {address.phone}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="p-2 text-gray-500 hover:text-purple-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="p-2 text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <p>{address.address}</p>
                          {address.address2 && <p>{address.address2}</p>}
                          <p>
                            {address.city}, {address.governorate}
                            {address.zipCode && `, ${address.zipCode}`}
                          </p>
                        </div>

                        {!address.isDefault && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() =>
                                handleSetDefaultAddress(address._id)
                              }
                              className="w-full"
                            >
                              Set as Default
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Security Settings
                </h3>

                {!showPasswordForm ? (
                  <div className="max-w-lg">
                    <div className="p-6 border border-gray-200 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Password
                          </h4>
                          <p className="text-gray-600 text-sm">
                            Last changed: {formatDate(profile.updatedAt)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => setShowPasswordForm(true)}
                          className="flex items-center gap-2"
                        >
                          <Lock className="w-4 h-4" />
                          Change Password
                        </Button>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          For security reasons, your password is not displayed
                          here. Click "Change Password" to update it.
                        </p>
                      </div>
                    </div>

                    {profile.googleId && (
                      <div className="mt-6 p-6 border border-gray-200 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Google Account
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Your account is linked with Google
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                            Connected
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="max-w-lg">
                    <div className="p-6 border border-gray-200 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-6">
                        Change Password
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="input-modern w-full pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="input-modern w-full pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Must be at least 8 characters long
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="input-modern w-full"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-6">
                        <Button
                          onClick={handleChangePassword}
                          disabled={saving}
                          className="flex items-center gap-2"
                        >
                          {saving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Update Password
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordData({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Preferences
                </h3>

                <div className="max-w-lg space-y-6">
                  <div className="p-6 border border-gray-200 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Email Preferences
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Control what emails you receive from DAR ENNAR Tunisia
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Newsletter
                          </p>
                          <p className="text-gray-600 text-sm">
                            Receive updates about new arrivals, sales, and
                            fashion tips
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="newsletter"
                            checked={profile.newsletter}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Marketing Emails
                          </p>
                          <p className="text-gray-600 text-sm">
                            Receive personalized product recommendations and
                            promotions
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="marketingEmails"
                            checked={profile.marketingEmails}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Account Actions
                    </h4>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:bg-red-50 border-red-200"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to deactivate your account?"
                            )
                          ) {
                            toast.success(
                              "Account deactivation feature coming soon"
                            );
                          }
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Deactivate Account
                      </Button>
                      <p className="text-sm text-gray-500">
                        Deactivating your account will hide your profile and
                        disable login. You can reactivate it anytime by logging
                        in.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      My Orders
                    </h3>
                    <p className="text-gray-600">
                      You have {profile.orderCount} order
                      {profile.orderCount !== 1 ? "s" : ""} in total
                    </p>
                  </div>
                  <Button onClick={() => navigate("/orders")}>
                    View All Orders
                  </Button>
                </div>

                {profile.orderCount === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No orders yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start shopping to see your orders here
                    </p>
                    <Button onClick={() => navigate("/")}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <p className="text-gray-700 mb-4">
                      You've spent{" "}
                      <span className="font-bold">
                        {formatPrice(profile.totalSpent)} DT
                      </span>{" "}
                      in total
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/orders")}
                      className="w-full"
                    >
                      View Complete Order History
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      My Wishlist
                    </h3>
                    <p className="text-gray-600">
                      {profile.wishlistCount} item
                      {profile.wishlistCount !== 1 ? "s" : ""} saved for later
                    </p>
                  </div>
                  <Button onClick={() => navigate("/wishlist")}>
                    View Wishlist
                  </Button>
                </div>

                {profile.wishlistCount === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Your wishlist is empty
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Save items you love to buy them later
                    </p>
                    <Button onClick={() => navigate("/")}>
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/wishlist")}
                      className="w-full"
                    >
                      View All Saved Items
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
