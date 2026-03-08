import React from "react";
import {
  X,
  AlertTriangle,
  Trash2,
  AlertCircle,
  Shield,
  AlertOctagon,
} from "lucide-react";
import Button from "../../../components/common/Button";

const DeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName = "",
  itemType = "item",
  warningMessage = "",
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  severity = "danger", // 'danger', 'warning', 'info'
  showIcon = true,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getSeverityConfig = () => {
    const configs = {
      danger: {
        icon: AlertOctagon,
        iconColor: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-200",
        buttonColor:
          "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700",
        textColor: "text-red-700",
      },
      warning: {
        icon: AlertTriangle,
        iconColor: "text-yellow-600",
        bgColor: "bg-yellow-100",
        borderColor: "border-yellow-200",
        buttonColor:
          "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700",
        textColor: "text-yellow-700",
      },
      info: {
        icon: AlertCircle,
        iconColor: "text-blue-600",
        bgColor: "bg-blue-100",
        borderColor: "border-blue-200",
        buttonColor:
          "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
        textColor: "text-blue-700",
      },
    };
    return configs[severity] || configs.danger;
  };

  const severityConfig = getSeverityConfig();
  const Icon = severityConfig.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${severityConfig.bgColor}`}>
              {showIcon && (
                <Icon className={`w-6 h-6 ${severityConfig.iconColor}`} />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Main Message */}
            <div className="text-gray-700">{message}</div>

            {/* Item Name (if provided) */}
            {itemName && (
              <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Item to delete:
                </p>
                <p className="text-gray-900 font-semibold break-all">
                  {itemName}
                </p>
                <p className="text-xs text-gray-500 mt-1">Type: {itemType}</p>
              </div>
            )}

            {/* Custom Warning Message */}
            {warningMessage && (
              <div
                className={`p-4 ${severityConfig.bgColor} rounded-xl border ${severityConfig.borderColor}`}
              >
                <div className="flex items-start gap-3">
                  <Shield
                    className={`w-5 h-5 ${severityConfig.iconColor} flex-shrink-0 mt-0.5`}
                  />
                  <p className={`text-sm ${severityConfig.textColor}`}>
                    {warningMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Consequences */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">
                  This action cannot be undone.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelButtonText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center gap-2 text-white ${severityConfig.buttonColor}`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                {confirmButtonText}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
