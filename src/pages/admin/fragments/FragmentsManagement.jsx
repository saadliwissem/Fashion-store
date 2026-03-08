import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Grid,
  List,
  Download,
  Copy,
  GripVertical,
  Filter,
  Check,
  X,
  RefreshCw,
  Star,
  Layers,
  BarChart3,
  Puzzle,
  Users,
  Lock,
  Sparkles,
  Eye,
  Tag,
  DollarSign,
  Calendar,
} from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";
import Button from "../../../components/common/Button";
import FragmentModal from "./FragmentModal";
import DeleteConfirmation from "../categories/DeleteConfirmation";
import toast from "react-hot-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  adminFragmentAPI,
  adminChronicleAPI,
} from "../../../services/adminApi";
import { formatDate, formatNumber } from "../../../utils/formatters";
import { Link } from "react-router-dom";

// Sortable Fragment Item Component
const SortableFragmentItem = ({
  fragment,
  isSelected,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fragment._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "claimed":
        return "bg-purple-100 text-purple-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "legendary":
        return "bg-gradient-to-r from-yellow-400 to-orange-400 text-white";
      case "rare":
        return "bg-gradient-to-r from-purple-400 to-purple-600 text-white";
      case "common":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getRarityBadge = (rarity) => {
    switch (rarity) {
      case "legendary":
        return "🏆";
      case "rare":
        return "✨";
      case "common":
        return "📦";
      default:
        return "📦";
    }
  };

  const clueProgress =
    fragment.clues?.total > 0
      ? ((fragment.clues?.revealed || 0) / fragment.clues?.total) * 100
      : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-2 ${isDragging ? "opacity-50" : ""}`}
    >
      <div
        className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
          isSelected
            ? "bg-purple-50 border border-purple-200"
            : "hover:bg-gray-50"
        }`}
      >
        {/* Drag Handle */}
        <div {...attributes} {...listeners} className="cursor-move">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(fragment._id)}
          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />

        {/* Icon with Rarity */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRarityColor(
            fragment.rarity
          )}`}
        >
          <span className="text-lg">{getRarityBadge(fragment.rarity)}</span>
        </div>

        {/* Fragment Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-gray-900">
              #{fragment.number} {fragment.name}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                fragment.status
              )}`}
            >
              {fragment.status}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                fragment.rarity === "legendary"
                  ? "bg-yellow-100 text-yellow-800"
                  : fragment.rarity === "rare"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {fragment.rarity}
            </span>
            {fragment.isFeatured && (
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium flex items-center gap-1">
                <Star className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600">
              {fragment.chronicle?.name || "Unknown Chronicle"}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">
              {fragment.chronicle?.enigma?.name || "Unknown Enigma"}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />${fragment.price?.toFixed(2)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Views: {fragment.metadata?.viewCount || 0}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Delivery: {fragment.estimatedDelivery || "TBD"}
            </span>
          </div>
          {fragment.clues?.total > 0 && (
            <div className="mt-2 w-48">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">Clues</span>
                <span className="font-medium text-purple-600">
                  {fragment.clues?.revealed || 0}/{fragment.clues?.total}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${clueProgress}%` }}
                />
              </div>
            </div>
          )}
          {fragment.claimedBy && (
            <div className="mt-2 text-xs text-purple-600 flex items-center gap-1">
              <Users className="w-3 h-3" />
              Claimed by:{" "}
              {fragment.claimedBy?.firstName ||
                fragment.claimedBy?.email ||
                "Unknown"}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/enigmas/${fragment.chronicle?.enigma?._id}/chronicles/${fragment.chronicle?._id}`}
            target="_blank"
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onEdit(fragment)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDuplicate(fragment)}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(fragment)}
            className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Grid View Card Component
const FragmentCard = ({ fragment, isSelected, onSelect, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "claimed":
        return "bg-purple-100 text-purple-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRarityGradient = (rarity) => {
    switch (rarity) {
      case "legendary":
        return "from-yellow-400 to-orange-500";
      case "rare":
        return "from-purple-400 to-purple-600";
      case "common":
        return "from-gray-400 to-gray-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const clueProgress =
    fragment.clues?.total > 0
      ? ((fragment.clues?.revealed || 0) / fragment.clues?.total) * 100
      : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      {/* Fragment Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {fragment.imageUrl?.url ? (
          <img
            src={fragment.imageUrl.url}
            alt={fragment.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Puzzle className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(fragment._id)}
            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
        </div>

        {/* Rarity Badge */}
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityGradient(
            fragment.rarity
          )} text-white shadow-lg`}
        >
          {fragment.rarity}
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              fragment.status
            )}`}
          >
            {fragment.status}
          </span>
        </div>

        {/* Featured Badge */}
        {fragment.isFeatured && (
          <div className="absolute bottom-4 right-4">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Fragment Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 text-lg">
            #{fragment.number} {fragment.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {fragment.chronicle?.name || "Unknown Chronicle"}
          </p>
        </div>

        <p className="text-gray-600 text-sm mb-6 line-clamp-2 h-10">
          {fragment.description || "No description"}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Price:
            </span>
            <span className="font-bold text-purple-600">
              ${fragment.price?.toFixed(2)}
            </span>
          </div>

          {fragment.features && fragment.features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {fragment.features.slice(0, 2).map((feature, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {feature}
                </span>
              ))}
              {fragment.features.length > 2 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{fragment.features.length - 2}
                </span>
              )}
            </div>
          )}

          {fragment.clues?.total > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">Clues Progress</span>
                <span className="font-medium text-purple-600">
                  {fragment.clues?.revealed || 0}/{fragment.clues?.total}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${clueProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Delivery: {fragment.estimatedDelivery || "TBD"}</span>
            <span>Views: {fragment.metadata?.viewCount || 0}</span>
          </div>
        </div>

        {fragment.claimedBy && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 text-sm text-purple-700">
              <Users className="w-4 h-4" />
              <span className="font-medium">Claimed by:</span>
              <span>
                {fragment.claimedBy?.firstName ||
                  fragment.claimedBy?.email ||
                  "Unknown"}
              </span>
            </div>
            {fragment.claimedAt && (
              <p className="text-xs text-purple-600 mt-1">
                {formatDate(fragment.claimedAt)}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(fragment)}
            className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(fragment)}
            className="flex-1 py-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors font-medium text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const FragmentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [fragments, setFragments] = useState([]);
  const [chronicles, setChronicles] = useState([]);
  const [stats, setStats] = useState({
    totalFragments: 0,
    byStatus: {
      available: 0,
      claimed: 0,
      reserved: 0,
    },
    byRarity: {
      common: 0,
      rare: 0,
      legendary: 0,
    },
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [chronicleFilter, setChronicleFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Fetch fragments from API
  const fetchFragments = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
        rarity: rarityFilter !== "all" ? rarityFilter : undefined,
        chronicleId: chronicleFilter !== "all" ? chronicleFilter : undefined,
        featured:
          featuredFilter !== "all" ? featuredFilter === "featured" : undefined,
        search: searchTerm || undefined,
      };

      const response = await adminFragmentAPI.getFragments(params);
      setFragments(response.data.data);
      setPagination({
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.total,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      console.error("Error fetching fragments:", error);
      toast.error("Failed to load fragments");
    } finally {
      setLoading(false);
    }
  };

  // Fetch chronicles for filter
  const fetchChronicles = async () => {
    try {
      const response = await adminChronicleAPI.getChronicles({ limit: 100 });
      setChronicles(response.data.data);
    } catch (error) {
      console.error("Error fetching chronicles:", error);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await adminFragmentAPI.getFragmentStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchFragments(1);
    fetchChronicles();
    fetchStats();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    fetchFragments(1);
  }, [statusFilter, rarityFilter, chronicleFilter, featuredFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFragments(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectAll = () => {
    if (selectedItems.length === fragments.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(fragments.map((item) => item._id));
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDuplicateItem = async (item) => {
    try {
      const {
        _id,
        createdAt,
        updatedAt,
        __v,
        claimedBy,
        claimedAt,
        metadata,
        ...itemData
      } = item;
      const duplicateData = {
        ...itemData,
        name: `${itemData.name} (Copy)`,
        number: itemData.number + 1000, // Add offset to avoid number conflicts
        status: "available",
        claimedBy: null,
        claimedAt: null,
        metadata: {
          viewCount: 0,
          saveCount: 0,
        },
        clues: {
          ...itemData.clues,
          revealed: 0,
          list: [],
        },
      };

      await adminFragmentAPI.createFragment(duplicateData);
      toast.success(`Fragment "${item.name}" duplicated successfully`);
      fetchFragments(pagination.page);
    } catch (error) {
      console.error("Error duplicating fragment:", error);
      toast.error(
        error.response?.data?.message || "Failed to duplicate fragment"
      );
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      toast.error("Please select items first");
      return;
    }

    try {
      switch (action) {
        case "activate":
          await adminFragmentAPI.bulkUpdateFragments({
            fragmentIds: selectedItems,
            updateData: { status: "available" },
          });
          toast.success(`Activated ${selectedItems.length} fragments`);
          break;
        case "deactivate":
          await adminFragmentAPI.bulkUpdateFragments({
            fragmentIds: selectedItems,
            updateData: { status: "reserved" },
          });
          toast.success(`Deactivated ${selectedItems.length} fragments`);
          break;
        case "feature":
          await adminFragmentAPI.bulkUpdateFragments({
            fragmentIds: selectedItems,
            updateData: { isFeatured: true },
          });
          toast.success(`Featured ${selectedItems.length} fragments`);
          break;
        case "unfeature":
          await adminFragmentAPI.bulkUpdateFragments({
            fragmentIds: selectedItems,
            updateData: { isFeatured: false },
          });
          toast.success(`Unfeatured ${selectedItems.length} fragments`);
          break;
        case "delete":
          setShowDeleteModal(true);
          break;
        case "export":
          const exportData = fragments.filter((item) =>
            selectedItems.includes(item._id)
          );
          const dataStr = JSON.stringify(exportData, null, 2);
          const dataBlob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `fragments-export-${
            new Date().toISOString().split("T")[0]
          }.json`;
          link.click();
          toast.success(`Exported ${selectedItems.length} fragments`);
          break;
      }

      if (action !== "delete" && action !== "export") {
        fetchFragments(pagination.page);
        fetchStats();
        setSelectedItems([]);
      }
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      toast.error(`Failed to ${action} fragments`);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedItems.map((id) => adminFragmentAPI.deleteFragment(id))
      );
      toast.success(`${selectedItems.length} fragments deleted successfully`);
      setShowDeleteModal(false);
      setSelectedItems([]);
      fetchFragments(1);
      fetchStats();
    } catch (error) {
      console.error("Error deleting fragments:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete fragments"
      );
    }
  };

  const handleSingleDelete = async () => {
    try {
      await adminFragmentAPI.deleteFragment(selectedItem._id);
      toast.success(`Fragment #${selectedItem.number} deleted successfully`);
      setShowDeleteModal(false);
      setSelectedItem(null);
      fetchFragments(pagination.page);
      fetchStats();
    } catch (error) {
      console.error("Error deleting fragment:", error);
      toast.error(error.response?.data?.message || "Failed to delete fragment");
    }
  };

  const handleAddFragment = async (fragmentData) => {
    try {
      await adminFragmentAPI.createFragment(fragmentData);
      toast.success(`Fragment #${fragmentData.number} added successfully`);
      setShowAddModal(false);
      fetchFragments(1);
      fetchStats();
    } catch (error) {
      console.error("Error adding fragment:", error);
      toast.error(error.response?.data?.message || "Failed to add fragment");
    }
  };

  const handleUpdateFragment = async (fragmentData) => {
    try {
      await adminFragmentAPI.updateFragment(selectedItem._id, fragmentData);
      toast.success(`Fragment #${fragmentData.number} updated successfully`);
      setShowEditModal(false);
      setSelectedItem(null);
      fetchFragments(pagination.page);
      fetchStats();
    } catch (error) {
      console.error("Error updating fragment:", error);
      toast.error(error.response?.data?.message || "Failed to update fragment");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const renderListView = () => {
    if (fragments.length === 0) {
      return (
        <div className="text-center py-12">
          <Puzzle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No fragments found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Header row */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-4">
            <div className="w-6"></div>
            <input
              type="checkbox"
              checked={
                selectedItems.length === fragments.length &&
                fragments.length > 0
              }
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <div className="w-10"></div>
            <div className="flex-1 font-semibold text-gray-900">Fragment</div>
            <div className="font-semibold text-gray-900 w-24">Number</div>
            <div className="font-semibold text-gray-900 w-24">Price</div>
            <div className="font-semibold text-gray-900 w-24">Status</div>
            <div className="font-semibold text-gray-900 w-24">Rarity</div>
            <div className="font-semibold text-gray-900 w-20">Actions</div>
          </div>

          <SortableContext
            items={fragments.map((item) => item._id)}
            strategy={verticalListSortingStrategy}
          >
            {fragments.map((fragment) => (
              <SortableFragmentItem
                key={fragment._id}
                fragment={fragment}
                isSelected={selectedItems.includes(fragment._id)}
                onSelect={handleSelectItem}
                onEdit={handleEditItem}
                onDuplicate={handleDuplicateItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </SortableContext>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} fragments
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchFragments(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchFragments(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </DndContext>
    );
  };

  const renderGridView = () => {
    if (fragments.length === 0) {
      return (
        <div className="text-center py-12">
          <Puzzle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No fragments found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fragments.map((fragment) => (
          <FragmentCard
            key={fragment._id}
            fragment={fragment}
            isSelected={selectedItems.includes(fragment._id)}
            onSelect={handleSelectItem}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>
    );
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = fragments.findIndex((item) => item._id === active.id);
    const newIndex = fragments.findIndex((item) => item._id === over.id);

    const reordered = [...fragments];
    const [movedItem] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, movedItem);

    setFragments(reordered);

    try {
      await adminFragmentAPI.updateFragmentsOrder({
        fragments: reordered.map((item, index) => ({
          id: item._id,
          order: index + 1,
        })),
      });
      toast.success("Order updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
      fetchFragments(pagination.page); // Revert on error
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Fragments Management
            </h1>
            <p className="text-gray-600">
              Create and manage fragments within chronicles
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                fetchFragments(pagination.page);
                fetchStats();
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleBulkAction("export")}
              disabled={selectedItems.length === 0}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4" />
              Add Fragment
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Fragments</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.totalFragments}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {stats.byStatus?.available || 0} available
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Puzzle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Claimed</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.byStatus?.claimed || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.byStatus?.reserved || 0} reserved
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Legendary</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.byRarity?.legendary || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.byRarity?.rare || 0} rare
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Common</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.byRarity?.common || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">Regular fragments</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Search and Filters */}
            <div className="flex-1 max-w-3xl">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search fragments by name, number, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="claimed">Claimed</option>
                    <option value="reserved">Reserved</option>
                  </select>

                  <select
                    value={rarityFilter}
                    onChange={(e) => setRarityFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Rarities</option>
                    <option value="common">Common</option>
                    <option value="rare">Rare</option>
                    <option value="legendary">Legendary</option>
                  </select>

                  <select
                    value={chronicleFilter}
                    onChange={(e) => setChronicleFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Chronicles</option>
                    {chronicles.map((chronicle) => (
                      <option key={chronicle._id} value={chronicle._id}>
                        {chronicle.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={featuredFilter}
                    onChange={(e) => setFeaturedFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Featured</option>
                    <option value="featured">Featured</option>
                    <option value="not-featured">Not Featured</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right: View Mode */}
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-3 transition-colors ${
                  viewMode === "list"
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 transition-colors ${
                  viewMode === "grid"
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg flex items-center justify-center font-semibold">
                  {selectedItems.length}
                </div>
                <span className="font-medium text-gray-900">
                  {selectedItems.length} fragment
                  {selectedItems.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="small"
                  onClick={() => handleBulkAction("activate")}
                >
                  Activate
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  onClick={() => handleBulkAction("deactivate")}
                >
                  Deactivate
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  onClick={() => handleBulkAction("feature")}
                >
                  Feature
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  onClick={() => handleBulkAction("delete")}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Fragments Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading fragments...</p>
          </div>
        ) : viewMode === "list" ? (
          renderListView()
        ) : (
          renderGridView()
        )}

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-2xl">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Fragment Management Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Each fragment must have a unique number within its
                      chronicle
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Set rarity to influence price and desirability</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Add features to highlight special attributes</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Clues can be revealed progressively as more are claimed
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Featured fragments appear prominently</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Track view counts to gauge interest</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <FragmentModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          mode="add"
          chronicles={chronicles}
          onSave={handleAddFragment}
        />
      )}

      {showEditModal && selectedItem && (
        <FragmentModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          mode="edit"
          fragment={selectedItem}
          chronicles={chronicles}
          onSave={handleUpdateFragment}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedItem(null);
          }}
          onConfirm={selectedItem ? handleSingleDelete : handleBulkDelete}
          title={
            selectedItem
              ? `Delete Fragment #${selectedItem.number}`
              : `Delete ${selectedItems.length} fragments`
          }
          message={
            selectedItem
              ? `Are you sure you want to delete "${selectedItem.name}"? This action cannot be undone.`
              : `Are you sure you want to delete ${selectedItems.length} selected fragments? This action cannot be undone.`
          }
        />
      )}
    </AdminLayout>
  );
};

export default FragmentsManagement;
