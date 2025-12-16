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
} from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/common/Button";
import CategoryModal from "./CategoryModal";
import DeleteConfirmation from "./DeleteConfirmation";
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
import { adminAPI } from "../../services/api";
import {
  buildCategoryTree,
  flattenCategories,
} from "../../utils/categoryUtils";

// Sortable Category Item Component
const SortableCategoryItem = ({
  category,
  level = 0,
  isExpanded,
  hasChildren,
  isSelected,
  onToggleExpand,
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
  } = useSortable({ id: category._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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

        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={() => onToggleExpand(category._id)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(category._id)}
          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />

        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            category.featured
              ? "bg-gradient-to-br from-amber-100 to-amber-200"
              : "bg-gray-100"
          }`}
        >
          {isExpanded ? (
            <FolderOpen className="w-5 h-5 text-gray-600" />
          ) : (
            <Folder className="w-5 h-5 text-gray-600" />
          )}
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="font-medium text-gray-900">{category.name}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                category.status === "active"
                  ? "bg-green-100 text-green-800"
                  : category.status === "draft"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {category.status}
            </span>
            {category.featured && (
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                Featured
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 truncate">
            {category.description}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>Slug: {category.slug}</span>
            <span>•</span>
            <span>{category.productCount || 0} products</span>
            <span>•</span>
            <span>Order: {category.displayOrder}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDuplicate(category)}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category)}
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
const CategoryCard = ({ category, isSelected, onSelect, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      {/* Category Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Folder className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(category._id)}
            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              category.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {category.status}
          </span>
        </div>

        {/* Featured Badge */}
        {category.featured && (
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Category Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 text-lg">{category.name}</h3>
          <p className="text-sm text-gray-500 mt-1 truncate">{category.slug}</p>
        </div>

        <p className="text-gray-600 text-sm mb-6 line-clamp-2 h-10">
          {category.description || "No description"}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              Products:
            </span>
            <span className="font-medium">{category.productCount || 0}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Order:
            </span>
            <span className="font-medium">{category.displayOrder}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Level:</span>
            <span className="font-medium">
              {category.level === 1 ? "Main" : `Sub ${category.level}`}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(category)}
            className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(category)}
            className="flex-1 py-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors font-medium text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState("tree");
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalProducts: 0,
    featured: 0,
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCategories({
        includeChildren: true,
        sortBy: "displayOrder",
        sortOrder: "asc",
      });

      const categoriesData = response.data.data;
      const treeData = buildCategoryTree(categoriesData);
      const flattened = flattenCategories(treeData);

      setCategories(treeData);
      setFlatCategories(flattened);

      // Calculate stats
      const total = categoriesData.length;
      const active = categoriesData.filter(
        (cat) => cat.status === "active"
      ).length;
      const totalProducts = categoriesData.reduce(
        (sum, cat) => sum + (cat.productCount || 0),
        0
      );
      const featured = categoriesData.filter((cat) => cat.featured).length;

      setStats({ total, active, totalProducts, featured });
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Apply filters to categories
  const getFilteredCategories = () => {
    return flatCategories.filter((cat) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || cat.status === statusFilter;

      // Featured filter
      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && cat.featured) ||
        (featuredFilter === "not-featured" && !cat.featured);

      return matchesSearch && matchesStatus && matchesFeatured;
    });
  };

  const filteredCategories = getFilteredCategories();

  const toggleExpand = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map((cat) => cat._id));
    }
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleDuplicateCategory = async (category) => {
    try {
      const { _id, createdAt, updatedAt, __v, ...categoryData } = category;
      const duplicateData = {
        ...categoryData,
        name: `${categoryData.name} (Copy)`,
        slug: `${categoryData.slug}-copy`,
        productCount: 0,
      };

      await adminAPI.createCategory(duplicateData);
      toast.success(`Category "${category.name}" duplicated successfully`);
      fetchCategories();
    } catch (error) {
      console.error("Error duplicating category:", error);
      toast.error(
        error.response?.data?.message || "Failed to duplicate category"
      );
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedCategories.length === 0) {
      toast.error("Please select categories first");
      return;
    }

    try {
      switch (action) {
        case "activate":
          await adminAPI.bulkUpdateCategories({
            categoryIds: selectedCategories,
            updateData: { status: "active" },
          });
          toast.success(`Activated ${selectedCategories.length} categories`);
          break;
        case "deactivate":
          await adminAPI.bulkUpdateCategories({
            categoryIds: selectedCategories,
            updateData: { status: "draft" },
          });
          toast.success(`Deactivated ${selectedCategories.length} categories`);
          break;
        case "feature":
          await adminAPI.bulkUpdateCategories({
            categoryIds: selectedCategories,
            updateData: { featured: true },
          });
          toast.success(`Featured ${selectedCategories.length} categories`);
          break;
        case "unfeature":
          await adminAPI.bulkUpdateCategories({
            categoryIds: selectedCategories,
            updateData: { featured: false },
          });
          toast.success(`Unfeatured ${selectedCategories.length} categories`);
          break;
        case "delete":
          setShowDeleteModal(true);
          break;
        case "export":
          // Export functionality
          const exportData = flatCategories.filter((cat) =>
            selectedCategories.includes(cat._id)
          );
          const dataStr = JSON.stringify(exportData, null, 2);
          const dataBlob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `categories-export-${
            new Date().toISOString().split("T")[0]
          }.json`;
          link.click();
          toast.success(`Exported ${selectedCategories.length} categories`);
          break;
      }

      if (action !== "delete" && action !== "export") {
        fetchCategories();
        setSelectedCategories([]);
      }
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      toast.error(`Failed to ${action} categories`);
    }
  };

  const handleDragStart = () => {
    setDragging(true);
  };

  const handleDragEnd = async (event) => {
    setDragging(false);
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      // Get top-level category IDs
      const topLevelIds = categories
        .filter((cat) => !cat.parent)
        .map((cat) => cat._id);

      // Find indices of active and over items in top-level categories
      const oldIndex = topLevelIds.indexOf(active.id);
      const newIndex = topLevelIds.indexOf(over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        try {
          // Create order update data
          const orderUpdates = categories.map((cat, index) => ({
            id: cat._id,
            displayOrder: index + 1,
          }));

          await adminAPI.updateCategoriesOrder({ categories: orderUpdates });

          // Update local state
          setCategories((prev) => {
            const newCategories = [...prev];
            const [movedCategory] = newCategories.splice(oldIndex, 1);
            newCategories.splice(newIndex, 0, movedCategory);

            // Update displayOrder for all categories
            return newCategories.map((cat, index) => ({
              ...cat,
              displayOrder: index + 1,
            }));
          });

          toast.success("Category order updated successfully");
        } catch (error) {
          console.error("Error updating category order:", error);
          toast.error("Failed to update category order");
        }
      }
    }
  };

  const handleAddCategory = async (categoryData) => {
    try {
      await adminAPI.createCategory(categoryData);
      toast.success(`Category "${categoryData.name}" added successfully`);
      setShowAddModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };

  const handleUpdateCategory = async (categoryData) => {
    try {
      await adminAPI.updateCategory(selectedCategory._id, categoryData);
      toast.success(`Category "${categoryData.name}" updated successfully`);
      setShowEditModal(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedCategories.map((id) => adminAPI.deleteCategory(id))
      );
      toast.success(
        `${selectedCategories.length} categories deleted successfully`
      );
      setShowDeleteModal(false);
      setSelectedCategories([]);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting categories:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete categories"
      );
    }
  };

  const handleSingleDelete = async () => {
    try {
      await adminAPI.deleteCategory(selectedCategory._id);
      toast.success(`Category "${selectedCategory.name}" deleted successfully`);
      setShowDeleteModal(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
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

  const renderCategoryTree = (cats, level = 0) => {
    const sortableItems = cats.map((cat) => cat._id);

    return (
      <SortableContext
        items={sortableItems}
        strategy={verticalListSortingStrategy}
      >
        {cats.map((category) => {
          const isExpanded = expandedCategories.includes(category._id);
          const hasChildren = category.children && category.children.length > 0;
          const isSelected = selectedCategories.includes(category._id);

          return (
            <React.Fragment key={category._id}>
              <SortableCategoryItem
                category={category}
                level={level}
                isExpanded={isExpanded}
                hasChildren={hasChildren}
                isSelected={isSelected}
                onToggleExpand={toggleExpand}
                onSelect={handleSelectCategory}
                onEdit={handleEditCategory}
                onDuplicate={handleDuplicateCategory}
                onDelete={handleDeleteCategory}
              />

              {/* Children */}
              {hasChildren && isExpanded && (
                <div className="ml-12 mt-2">
                  {renderCategoryTree(category.children, level + 1)}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </SortableContext>
    );
  };

  const renderGridView = () => {
    // Get main categories for grid view (no parents or top-level)
    const mainCategories = filteredCategories.filter(
      (cat) => !cat.parent || cat.level === 0
    );

    if (mainCategories.length === 0) {
      return (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No categories found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainCategories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            isSelected={selectedCategories.includes(category._id)}
            onSelect={handleSelectCategory}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        ))}
      </div>
    );
  };

  const renderListView = () => {
    if (filteredCategories.length === 0) {
      return (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No categories found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={
                      selectedCategories.length === filteredCategories.length &&
                      filteredCategories.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Category
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Slug
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Level
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Products
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Featured
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Order
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => handleSelectCategory(category._id)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Folder className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            {category.name}
                          </p>
                          {category.parentName && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {category.parentName}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {category.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <code className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      /{category.slug}
                    </code>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                      {category.level === 0 ? "Main" : `Sub ${category.level}`}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900">
                      {category.productCount || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        category.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {category.featured ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className="text-xs text-amber-700">Yes</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700 font-medium">
                      {category.displayOrder}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateCategory(category)}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderViewContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      );
    }

    switch (viewMode) {
      case "tree":
        return (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900">
                  Category Hierarchy
                </h3>
                <p className="text-sm text-gray-600">
                  Drag and drop to reorder categories. Click arrows to
                  expand/collapse.
                </p>
              </div>

              {filteredCategories.filter((cat) => !cat.parent).length === 0 ? (
                <div className="text-center py-12">
                  <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No categories found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <>
                  {/* Header row */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-4">
                    <div className="w-6"></div>
                    <input
                      type="checkbox"
                      checked={
                        selectedCategories.length ===
                          filteredCategories.length &&
                        filteredCategories.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="w-10"></div>
                    <div className="flex-1 font-semibold text-gray-900">
                      Category
                    </div>
                    <div className="font-semibold text-gray-900 w-32">
                      Products
                    </div>
                    <div className="font-semibold text-gray-900 w-24">
                      Status
                    </div>
                    <div className="font-semibold text-gray-900 w-20">
                      Actions
                    </div>
                  </div>

                  {/* Render tree */}
                  {renderCategoryTree(categories.filter((cat) => !cat.parent))}
                </>
              )}

              {dragging && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800">
                    💡 Drop category to reorder. Sub-categories will move with
                    their parent.
                  </p>
                </div>
              )}
            </div>
          </DndContext>
        );

      case "grid":
        return renderGridView();

      case "list":
        return renderListView();

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Categories Management
            </h1>
            <p className="text-gray-600">
              Organize your products with categories and sub-categories
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchCategories}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleBulkAction("export")}
              disabled={selectedCategories.length === 0}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.total}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {loading ? "..." : `${stats.active} active`}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Folder className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.active}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {loading
                    ? "..."
                    : `${Math.round(
                        (stats.active / stats.total) * 100
                      )}% of total`}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.totalProducts.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  across all categories
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.featured}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  displayed on homepage
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600" />
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
                      placeholder="Search categories by name, slug, or description..."
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
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
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

            {/* Right: Controls */}
            <div className="flex flex-wrap gap-3">
              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("tree")}
                  className={`px-4 py-3 transition-colors ${
                    viewMode === "tree"
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                  title="Tree View"
                >
                  <ChevronDown className="w-4 h-4" />
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
              </div>

              {/* Expand All / Collapse All (only in tree view) */}
              {viewMode === "tree" && (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setExpandedCategories(
                        flatCategories.map((cat) => cat._id)
                      )
                    }
                    className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={() => setExpandedCategories([])}
                    className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Collapse All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCategories.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg flex items-center justify-center font-semibold">
                  {selectedCategories.length}
                </div>
                <span className="font-medium text-gray-900">
                  {selectedCategories.length} categor
                  {selectedCategories.length !== 1 ? "ies" : "y"} selected
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
                  Draft
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

        {/* Categories Content */}
        {renderViewContent()}

        {/* Category Management Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-2xl">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Category Management Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Use the tree view for hierarchy management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Featured categories appear on homepage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Set display order for custom sorting</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Draft categories are hidden from customers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Use SEO fields for better search visibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Organize products with relevant categories</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <CategoryModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          mode="add"
          categories={flatCategories}
          onSave={handleAddCategory}
        />
      )}

      {showEditModal && selectedCategory && (
        <CategoryModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCategory(null);
          }}
          mode="edit"
          category={selectedCategory}
          categories={flatCategories}
          onSave={handleUpdateCategory}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCategory(null);
          }}
          onConfirm={selectedCategory ? handleSingleDelete : handleBulkDelete}
          title={
            selectedCategory
              ? `Delete "${selectedCategory.name}"`
              : `Delete ${selectedCategories.length} categories`
          }
          message={
            selectedCategory
              ? `Are you sure you want to delete "${selectedCategory.name}"? This will also delete all sub-categories. This action cannot be undone.`
              : `Are you sure you want to delete ${selectedCategories.length} selected categories? This action cannot be undone.`
          }
        />
      )}
    </AdminLayout>
  );
};

export default Categories;
