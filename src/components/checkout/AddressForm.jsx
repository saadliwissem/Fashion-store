import React from "react";
import { MapPin, Phone, Mail, User } from "lucide-react";

const AddressForm = ({ formData, handleInputChange, governorates }) => {
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Shipping Address
        </h3>
        <div className="space-y-4">
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

          {/* Save Address Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="saveAddress"
              name="saveAddress"
              checked={formData.saveAddress}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="saveAddress" className="text-sm text-gray-600">
              Save this address for future orders
            </label>
          </div>
        </div>
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
