import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";

const Customers = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-2">Manage your customer database</p>
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-600">Customers page content coming soon...</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Customers;
