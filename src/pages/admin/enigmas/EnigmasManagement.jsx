import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Grid,
  List,
  Upload,
  Download,
  Copy,
  MoreVertical,
  Eye,
  EyeOff,
  Move,
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
  Clock,
  Sparkles,
  Trophy,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";
import Button from "../../../components/common/Button";
import EnigmaModal from "./EnigmaModal";
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
import { adminEnigmaAPI } from "../../../services/adminApi";
import { formatDate, formatNumber } from "../../../utils/formatters";

// Sortable Enigma Item Component
const SortableEnigmaItem = ({
  enigma,
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
  } = useSortable({ id: enigma._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      case "solved":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "🟢";
      case "intermediate":
        return "🟡";
      case "advanced":
        return "🟠";
      case "expert":
        return "🔴";
      default:
        return "⚪";
    }
  };

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
          onChange={() => onSelect(enigma._id)}
          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />

        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            enigma.featured
              ? "bg-gradient-to-br from-amber-100 to-amber-200"
              : "bg-gray-100"
          }`}
        >
          <Puzzle className="w-5 h-5 text-gray-600" />
        </div>

        {/* Enigma Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-gray-900">{enigma.name}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                enigma.status
              )}`}
            >
              {enigma.status}
            </span>
            {enigma.featured && (
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium flex items-center gap-1">
                <Star className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 truncate max-w-2xl">
            {enigma.description}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Chronicles: {enigma.metadata?.totalChronicles || 0}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Keepers: {enigma.stats?.activeKeepers || 0}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span>{getDifficultyIcon(enigma.difficulty)}</span>
              <span className="capitalize">{enigma.difficulty}</span>
            </span>
            <span>•</span>
            <span>Created: {formatDate(enigma.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(enigma)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDuplicate(enigma)}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(enigma)}
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
const EnigmaCard = ({ enigma, isSelected, onSelect, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      case "solved":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const percentageClaimed =
    enigma.metadata?.totalFragments > 0
      ? ((enigma.metadata?.fragmentsClaimed || 0) /
          enigma.metadata?.totalFragments) *
        100
      : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      {/* Enigma Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {enigma.coverImage?.url ? (
          <img
            src={enigma.coverImage.url}
            alt={enigma.name}
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
            onChange={() => onSelect(enigma._id)}
            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              enigma.status
            )}`}
          >
            {enigma.status}
          </span>
        </div>

        {/* Featured Badge */}
        {enigma.featured && (
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Enigma Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 text-lg">{enigma.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {enigma.creator?.name || "Unknown Creator"}
          </p>
        </div>

        <p className="text-gray-600 text-sm mb-6 line-clamp-2 h-10">
          {enigma.description || "No description"}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Chronicles:
            </span>
            <span className="font-medium">
              {enigma.metadata?.totalChronicles || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Users className="w-3 h-3" />
              Keepers:
            </span>
            <span className="font-medium">
              {enigma.stats?.activeKeepers || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Claimed:
            </span>
            <span className="font-medium">
              {enigma.metadata?.fragmentsClaimed || 0}/
              {enigma.metadata?.totalFragments || 0}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all"
              style={{ width: `${percentageClaimed}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(enigma)}
            className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(enigma)}
            className="flex-1 py-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors font-medium text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const EnigmasManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [enigmas, setEnigmas] = useState([]);
  const [stats, setStats] = useState({
    totalEnigmas: 0,
    activeEnigmas: 0,
    upcomingEnigmas: 0,
    solvedEnigmas: 0,
    totalChronicles: 0,
    totalFragments: 0,
    claimedFragments: 0,
    claimRate: 0,
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch enigmas from API
  const fetchEnigmas = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
        difficulty: difficultyFilter !== "all" ? difficultyFilter : undefined,
        featured:
          featuredFilter !== "all" ? featuredFilter === "featured" : undefined,
        search: searchTerm || undefined,
      };

      const response = await adminEnigmaAPI.getEnigmas(params);
      setEnigmas(response.data.data);

      setPagination({
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.total,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      console.error("Error fetching enigmas:", error);
      toast.error("Failed to load enigmas");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await adminEnigmaAPI.getEnigmaStats();
      setStats(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchEnigmas(1);
    fetchStats();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    fetchEnigmas(1);
  }, [statusFilter, difficultyFilter, featuredFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEnigmas(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectAll = () => {
    if (selectedItems.length === enigmas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(enigmas.map((item) => item._id));
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
      const { _id, createdAt, updatedAt, __v, ...itemData } = item;
      const duplicateData = {
        ...itemData,
        name: `${itemData.name} (Copy)`,
        metadata: {
          ...itemData.metadata,
          totalChronicles: 0,
          fragmentsClaimed: 0,
        },
        stats: {
          ...itemData.stats,
          activeKeepers: 0,
          totalValueLocked: 0,
        },
      };

      await adminEnigmaAPI.createEnigma(duplicateData);
      toast.success(`Enigma "${item.name}" duplicated successfully`);
      fetchEnigmas(pagination.page);
    } catch (error) {
      console.error("Error duplicating enigma:", error);
      toast.error(
        error.response?.data?.message || "Failed to duplicate enigma"
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
          await adminEnigmaAPI.bulkUpdateEnigmas({
            enigmaIds: selectedItems,
            updateData: { status: "active" },
          });
          toast.success(`Activated ${selectedItems.length} enigmas`);
          break;
        case "deactivate":
          await adminEnigmaAPI.bulkUpdateEnigmas({
            enigmaIds: selectedItems,
            updateData: { status: "upcoming" },
          });
          toast.success(`Deactivated ${selectedItems.length} enigmas`);
          break;
        case "feature":
          await adminEnigmaAPI.bulkUpdateEnigmas({
            enigmaIds: selectedItems,
            updateData: { featured: true },
          });
          toast.success(`Featured ${selectedItems.length} enigmas`);
          break;
        case "unfeature":
          await adminEnigmaAPI.bulkUpdateEnigmas({
            enigmaIds: selectedItems,
            updateData: { featured: false },
          });
          toast.success(`Unfeatured ${selectedItems.length} enigmas`);
          break;
        case "delete":
          setShowDeleteModal(true);
          break;
        case "export":
          const exportData = enigmas.filter((item) =>
            selectedItems.includes(item._id)
          );
          const dataStr = JSON.stringify(exportData, null, 2);
          const dataBlob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `enigmas-export-${
            new Date().toISOString().split("T")[0]
          }.json`;
          link.click();
          toast.success(`Exported ${selectedItems.length} enigmas`);
          break;
      }

      if (action !== "delete" && action !== "export") {
        fetchEnigmas(pagination.page);
        fetchStats();
        setSelectedItems([]);
      }
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      toast.error(`Failed to ${action} enigmas`);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedItems.map((id) => adminEnigmaAPI.deleteEnigma(id))
      );
      toast.success(`${selectedItems.length} enigmas deleted successfully`);
      setShowDeleteModal(false);
      setSelectedItems([]);
      fetchEnigmas(1);
      fetchStats();
    } catch (error) {
      console.error("Error deleting enigmas:", error);
      toast.error(error.response?.data?.message || "Failed to delete enigmas");
    }
  };

  const handleSingleDelete = async () => {
    try {
      await adminEnigmaAPI.deleteEnigma(selectedItem._id);
      toast.success(`Enigma "${selectedItem.name}" deleted successfully`);
      setShowDeleteModal(false);
      setSelectedItem(null);
      fetchEnigmas(pagination.page);
      fetchStats();
    } catch (error) {
      console.error("Error deleting enigma:", error);
      toast.error(error.response?.data?.message || "Failed to delete enigma");
    }
  };

  const handleAddEnigma = async (enigmaData) => {
    try {
      await adminEnigmaAPI.createEnigma(enigmaData);
      toast.success(`Enigma "${enigmaData.name}" added successfully`);
      setShowAddModal(false);
      fetchEnigmas(1);
      fetchStats();
    } catch (error) {
      console.error("Error adding enigma:", error);
      toast.error(error.response?.data?.message || "Failed to add enigma");
    }
  };

  const handleUpdateEnigma = async (enigmaData) => {
    try {
      await adminEnigmaAPI.updateEnigma(selectedItem._id, enigmaData);
      toast.success(`Enigma "${enigmaData.name}" updated successfully`);
      setShowEditModal(false);
      setSelectedItem(null);
      fetchEnigmas(pagination.page);
      fetchStats();
    } catch (error) {
      console.error("Error updating enigma:", error);
      toast.error(error.response?.data?.message || "Failed to update enigma");
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

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = enigmas.findIndex((item) => item._id === active.id);
    const newIndex = enigmas.findIndex((item) => item._id === over.id);

    const reordered = [...enigmas];
    const [movedItem] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, movedItem);

    setEnigmas(reordered);

    try {
      await adminEnigmaAPI.updateEnigmasOrder({
        enigmas: reordered.map((item, index) => ({
          id: item._id,
          order: index + 1,
        })),
      });
      toast.success("Order updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
      fetchEnigmas(pagination.page); // Revert on error
    }
  };

  const renderListView = () => {
    if (enigmas.length === 0) {
      return (
        <div className="text-center py-12">
          <Puzzle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No enigmas found</p>
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
                selectedItems.length === enigmas.length && enigmas.length > 0
              }
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <div className="w-10"></div>
            <div className="flex-1 font-semibold text-gray-900">Enigma</div>
            <div className="font-semibold text-gray-900 w-32">Chronicles</div>
            <div className="font-semibold text-gray-900 w-32">Keepers</div>
            <div className="font-semibold text-gray-900 w-24">Status</div>
            <div className="font-semibold text-gray-900 w-20">Actions</div>
          </div>

          <SortableContext
            items={enigmas.map((item) => item._id)}
            strategy={verticalListSortingStrategy}
          >
            {enigmas.map((enigma) => (
              <SortableEnigmaItem
                key={enigma._id}
                enigma={enigma}
                isSelected={selectedItems.includes(enigma._id)}
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
                of {pagination.total} enigmas
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchEnigmas(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchEnigmas(pagination.page + 1)}
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
    if (enigmas.length === 0) {
      return (
        <div className="text-center py-12">
          <Puzzle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No enigmas found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enigmas.map((enigma) => (
          <EnigmaCard
            key={enigma._id}
            enigma={enigma}
            isSelected={selectedItems.includes(enigma._id)}
            onSelect={handleSelectItem}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Enigmas Management
            </h1>
            <p className="text-gray-600">
              Create and manage mystery collections
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                fetchEnigmas(pagination.page);
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
              Add Enigma
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Enigmas</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.totalEnigmas}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {stats.activeEnigmas} active
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
                <p className="text-sm text-gray-600">Total Chronicles</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.totalChronicles}
                </p>
                <p className="text-sm text-gray-600 mt-1">across all enigmas</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Fragments</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.totalFragments}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.claimedFragments} claimed
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Claim Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : `${stats.claimRate}%`}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.solvedEnigmas} solved
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
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
                      placeholder="Search enigmas by name or description..."
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
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="solved">Solved</option>
                    <option value="archived">Archived</option>
                  </select>

                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
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
                  {selectedItems.length} enigma
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

        {/* Enigmas Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading enigmas...</p>
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
                Enigma Management Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Create enigmas to group related chronicles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Featured enigmas appear on the homepage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Set difficulty level appropriate for the mystery
                    </span>
                  </li>
                </ul>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Add rich lore to engage keepers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Define rewards to motivate participation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Track stats to monitor engagement</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <EnigmaModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          mode="add"
          onSave={handleAddEnigma}
        />
      )}

      {showEditModal && selectedItem && (
        <EnigmaModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          mode="edit"
          enigma={selectedItem}
          onSave={handleUpdateEnigma}
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
              ? `Delete "${selectedItem.name}"`
              : `Delete ${selectedItems.length} enigmas`
          }
          message={
            selectedItem
              ? `Are you sure you want to delete "${selectedItem.name}"? This will also delete all associated chronicles and fragments. This action cannot be undone.`
              : `Are you sure you want to delete ${selectedItems.length} selected enigmas? This action cannot be undone.`
          }
        />
      )}
    </AdminLayout>
  );
};

export default EnigmasManagement;
