// components/checkout/AddressForm.jsx
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  User,
  Check,
  ChevronDown,
  Home,
  Briefcase,
  Plus,
} from "lucide-react";

const AddressForm = ({
  formData,
  handleInputChange,
  governorates,
  savedAddresses = [],
  onSelectSavedAddress,
  onUseNewAddress,
  loadingAddresses = false,
}) => {
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [useSavedAddress, setUseSavedAddress] = useState(
    savedAddresses.length > 0
  );
  const [showAddressForm, setShowAddressForm] = useState(
    savedAddresses.length === 0
  );

  // When a saved address is selected, populate the form
  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    const address = savedAddresses.find((addr) => addr._id === addressId);
    if (address) {
      onSelectSavedAddress(address);
    }
  };

  // Toggle between saved address and new address form
  const handleToggleAddressMode = (useSaved) => {
    setUseSavedAddress(useSaved);
    setShowAddressForm(!useSaved);
    if (!useSaved) {
      // Reset form when switching to new address
      onUseNewAddress();
    }
    setSelectedAddressId("");
  };

  // Get address label icon
  const getAddressIcon = (label) => {
    switch (label) {
      case "Home":
        return <Home className="w-4 h-4" />;
      case "Work":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  // Auto-select default address when saved addresses load
  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId) {
      const defaultAddress = savedAddresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
        onSelectSavedAddress(defaultAddress);
      }
    }
  }, [savedAddresses]);

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="input-modern"
              placeholder="Ahmed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="input-modern"
              placeholder="Ben Ali"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="input-modern"
              placeholder="ahmed@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number *
            </label>
            <div className="flex">
              <div className="flex items-center justify-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-gray-600">
                +216
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="input-modern rounded-l-none"
                placeholder="20 000 000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Shipping Address
          </h3>
          {savedAddresses.length > 0 && (
            <button
              type="button"
              onClick={() => handleToggleAddressMode(!useSavedAddress)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              {useSavedAddress ? (
                <>
                  <Plus className="w-4 h-4" />
                  Use New Address
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Use Saved Address
                </>
              )}
            </button>
          )}
        </div>

        {/* Loading State */}
        {loadingAddresses && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">
              Loading your saved addresses...
            </p>
          </div>
        )}

        {/* Saved Addresses Selection */}
        {savedAddresses.length > 0 && useSavedAddress && !loadingAddresses && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select a saved address
            </label>
            <div className="space-y-3">
              {savedAddresses.map((address) => (
                <div
                  key={address._id}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedAddressId === address._id
                      ? "border-primary-500 bg-primary-50 shadow-sm"
                      : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelectAddress(address._id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAddressId === address._id
                            ? "border-primary-500 bg-primary-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAddressId === address._id && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-gray-900">
                          {address.firstName} {address.lastName}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                          {getAddressIcon(address.label)}
                          {address.label}
                        </span>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {address.address}
                        {address.address2 && `, ${address.address2}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.governorate}
                        {address.zipCode && `, ${address.zipCode}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        📞 {address.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Select an address above or click "Use New Address" to add a
              different one.
            </p>
          </div>
        )}

        {/* New Address Form - Show when no saved addresses or user clicks "Use New Address" */}
        {(showAddressForm || savedAddresses.length === 0) && (
          <div
            className={`space-y-4 ${
              savedAddresses.length > 0 ? "border-t border-gray-200 pt-6" : ""
            }`}
          >
            {savedAddresses.length > 0 && (
              <p className="text-sm text-gray-600 mb-4">
                📝 Fill in your new address details below:
              </p>
            )}

            {/* Governorate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Governorate *
              </label>
              <select
                name="governorate"
                value={formData.governorate}
                onChange={handleInputChange}
                required
                className="input-modern"
              >
                <option value="">Select your governorate</option>
                {governorates.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            {/* City and Zip Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="input-modern"
                  placeholder="e.g., Tunis, Sfax, Sousse"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="input-modern"
                  placeholder="1000"
                  pattern="[0-9]{4}"
                  title="4-digit Tunisian postal code"
                />
              </div>
            </div>

            {/* Address Lines */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="input-modern mb-3"
                placeholder="Rue Habib Bourguiba, Building No."
              />
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleInputChange}
                className="input-modern"
                placeholder="Apartment, suite, etc. (optional)"
              />
            </div>

            {/* Address Label and Save */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Label
                </label>
                <select
                  name="addressLabel"
                  value={formData.addressLabel || "Home"}
                  onChange={handleInputChange}
                  className="input-modern"
                >
                  <option value="Home">🏠 Home</option>
                  <option value="Work">💼 Work</option>
                  <option value="Other">📍 Other</option>
                </select>
              </div>
              <div className="flex items-end">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    name="saveAddress"
                    checked={formData.saveAddress}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label
                    htmlFor="saveAddress"
                    className="text-sm text-gray-600"
                  >
                    Save this address for future orders
                  </label>
                </div>
              </div>
            </div>

            {/* Set as Default (only if saving) */}
            {formData.saveAddress && (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="setDefault"
                  name="setDefault"
                  checked={formData.setDefault}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="setDefault" className="text-sm text-gray-600">
                  Set as default address
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tunisian Address Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tips for Tunisian addresses:</strong> Use standard Tunisian
          address format. Include building number, floor, and apartment when
          applicable. Postal codes are 4 digits.
        </p>
      </div>
    </div>
  );
};

export default AddressForm;
