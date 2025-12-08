import React from "react";
import { AlertTriangle } from "lucide-react";
import Button from "../../components/common/Button";

const DeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = "item",
  isBulk = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="p-6">
            {/* Icon */}
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-rose-600" />
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete {itemType}
                {isBulk ? "s" : ""}
              </h3>

              <p className="text-gray-600 mb-6">
                {isBulk
                  ? `Are you sure you want to delete the selected ${itemType}s? This action cannot be undone.`
                  : `Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
              </p>

              {!isBulk && itemType === "product" && (
                <div className="mb-6 p-4 bg-amber-50 rounded-xl">
                  <p className="text-sm text-amber-800">
                    ⚠️ Deleting this product will also remove it from any active
                    orders and customer wishlists.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  className="flex-1 bg-rose-600 hover:bg-rose-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
