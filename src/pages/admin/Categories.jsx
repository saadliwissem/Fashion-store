import React, { useState } from "react";
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
  } = useSortable({ id: category.id });

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
            onClick={() => onToggleExpand(category.id)}
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
          onChange={() => onSelect(category.id)}
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
            <span>{category.productCount} products</span>
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

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState("tree"); // 'tree', 'grid', 'list'
  const [expandedCategories, setExpandedCategories] = useState(["1", "2"]);
  const [dragging, setDragging] = useState(false);

  // Mock categories data with hierarchy
  const [categories, setCategories] = useState([
    {
      id: "1",
      name: "Men's Fashion",
      slug: "mens-fashion",
      description: "All men's clothing and accessories",
      image:
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400&h=300&fit=crop",
      parentId: null,
      displayOrder: 1,
      status: "active",
      featured: true,
      productCount: 256,
      seo: {
        title: "Men's Fashion - FashionStore Tunisia",
        description: "Shop latest men's fashion trends",
        keywords: ["men", "fashion", "clothing"],
      },
      createdAt: "2024-01-15",
      updatedAt: "2024-12-01",
      children: [
        {
          id: "11",
          name: "T-Shirts",
          slug: "mens-t-shirts",
          description: "Casual and formal t-shirts",
          image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w-300&h=200&fit=crop",
          parentId: "1",
          displayOrder: 1,
          status: "active",
          featured: true,
          productCount: 89,
          createdAt: "2024-02-10",
          updatedAt: "2024-11-30",
        },
        {
          id: "12",
          name: "Shirts",
          slug: "mens-shirts",
          description: "Formal and casual shirts",
          image:
            "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=200&fit=crop",
          parentId: "1",
          displayOrder: 2,
          status: "active",
          featured: false,
          productCount: 67,
          createdAt: "2024-02-12",
          updatedAt: "2024-11-28",
        },
        {
          id: "13",
          name: "Jeans & Pants",
          slug: "mens-jeans-pants",
          description: "Denim and casual pants",
          image:
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=200&fit=crop",
          parentId: "1",
          displayOrder: 3,
          status: "active",
          featured: true,
          productCount: 54,
          createdAt: "2024-02-15",
          updatedAt: "2024-11-25",
        },
        {
          id: "14",
          name: "Jackets",
          slug: "mens-jackets",
          description: "Winter and casual jackets",
          image:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=200&fit=crop",
          parentId: "1",
          displayOrder: 4,
          status: "active",
          featured: false,
          productCount: 32,
          createdAt: "2024-03-01",
          updatedAt: "2024-11-20",
          children: [
            {
              id: "141",
              name: "Denim Jackets",
              slug: "mens-denim-jackets",
              description: "Classic denim jackets",
              parentId: "14",
              displayOrder: 1,
              status: "active",
              productCount: 15,
              createdAt: "2024-03-05",
              updatedAt: "2024-11-15",
            },
            {
              id: "142",
              name: "Leather Jackets",
              slug: "mens-leather-jackets",
              description: "Premium leather jackets",
              parentId: "14",
              displayOrder: 2,
              status: "active",
              productCount: 17,
              createdAt: "2024-03-10",
              updatedAt: "2024-11-10",
            },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Women's Fashion",
      slug: "womens-fashion",
      description: "All women's clothing and accessories",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop",
      parentId: null,
      displayOrder: 2,
      status: "active",
      featured: true,
      productCount: 312,
      seo: {
        title: "Women's Fashion - FashionStore Tunisia",
        description: "Latest women's fashion trends",
        keywords: ["women", "fashion", "clothing"],
      },
      createdAt: "2024-01-20",
      updatedAt: "2024-12-01",
      children: [
        {
          id: "21",
          name: "Dresses",
          slug: "womens-dresses",
          description: "Evening and casual dresses",
          image:
            "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=300&h=200&fit=crop",
          parentId: "2",
          displayOrder: 1,
          status: "active",
          featured: true,
          productCount: 98,
          createdAt: "2024-02-05",
          updatedAt: "2024-11-29",
        },
        {
          id: "22",
          name: "Tops",
          slug: "womens-tops",
          description: "Casual and party tops",
          image:
            "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=200&fit=crop",
          parentId: "2",
          displayOrder: 2,
          status: "active",
          featured: false,
          productCount: 76,
          createdAt: "2024-02-08",
          updatedAt: "2024-11-27",
        },
        {
          id: "23",
          name: "Skirts",
          slug: "womens-skirts",
          description: "Various skirt styles",
          parentId: "2",
          displayOrder: 3,
          status: "active",
          featured: false,
          productCount: 45,
          createdAt: "2024-02-12",
          updatedAt: "2024-11-25",
        },
      ],
    },
    {
      id: "3",
      name: "Accessories",
      slug: "accessories",
      description: "Fashion accessories for all",
      image:
        "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=300&fit=crop",
      parentId: null,
      displayOrder: 3,
      status: "active",
      featured: false,
      productCount: 189,
      createdAt: "2024-01-25",
      updatedAt: "2024-11-30",
    },
    {
      id: "4",
      name: "Kids & Babies",
      slug: "kids-babies",
      description: "Clothing for kids and babies",
      parentId: null,
      displayOrder: 4,
      status: "draft",
      featured: false,
      productCount: 0,
      createdAt: "2024-02-01",
      updatedAt: "2024-11-15",
    },
    {
      id: "5",
      name: "Summer Collection",
      slug: "summer-collection",
      description: "Special summer collection",
      image:
        "https://images.unsplash.com/photo-1558769132-cb1fc458ddb8?w=400&h=300&fit=crop",
      parentId: null,
      displayOrder: 5,
      status: "active",
      featured: true,
      productCount: 124,
      createdAt: "2024-03-15",
      updatedAt: "2024-11-28",
    },
  ]);

  const statusOptions = [
    { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
    { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
    {
      value: "archived",
      label: "Archived",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  // Set up sensors for drag and drop
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

  // Flatten categories for filtering
  const flattenCategories = (cats, level = 0, parentName = "") => {
    return cats.reduce((acc, cat) => {
      const categoryWithLevel = {
        ...cat,
        level,
        parentName,
        path: parentName ? `${parentName} › ${cat.name}` : cat.name,
      };
      acc.push(categoryWithLevel);
      if (cat.children) {
        acc.push(...flattenCategories(cat.children, level + 1, cat.name));
      }
      return acc;
    }, []);
  };

  const allCategories = flattenCategories(categories);

  const filteredCategories = allCategories.filter((cat) => {
    const matchesSearch =
      searchTerm === "" ||
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
      setSelectedCategories(filteredCategories.map((cat) => cat.id));
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

  const handleDuplicateCategory = (category) => {
    toast.success(`Duplicated ${category.name}`);
    // In real app, make API call to duplicate
  };

  const handleBulkAction = (action) => {
    if (selectedCategories.length === 0) {
      toast.error("Please select categories first");
      return;
    }

    switch (action) {
      case "activate":
        toast.success(`Activated ${selectedCategories.length} categories`);
        break;
      case "deactivate":
        toast.success(`Deactivated ${selectedCategories.length} categories`);
        break;
      case "delete":
        setShowDeleteModal(true);
        break;
      case "export":
        toast.success(`Exported ${selectedCategories.length} categories`);
        break;
    }
  };

  const handleDragStart = () => {
    setDragging(true);
  };

  const handleDragEnd = (event) => {
    setDragging(false);
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      // Get top-level category IDs
      const topLevelIds = categories
        .filter((cat) => !cat.parentId)
        .map((cat) => cat.id);

      // Find indices of active and over items in top-level categories
      const oldIndex = topLevelIds.indexOf(active.id);
      const newIndex = topLevelIds.indexOf(over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Reorder top-level categories
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

        toast.success("Category order updated");
      }
    }
  };

  const renderCategoryTree = (cats, level = 0) => {
    // Get sortable items (top-level categories)
    const sortableItems = cats.map((cat) => cat.id);

    return (
      <SortableContext
        items={sortableItems}
        strategy={verticalListSortingStrategy}
      >
        {cats.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          const hasChildren = category.children && category.children.length > 0;
          const isSelected = selectedCategories.includes(category.id);

          return (
            <React.Fragment key={category.id}>
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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories
          .filter((cat) => !cat.parentId)
          .map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group"
            >
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
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleSelectCategory(category.id)}
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Category Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {category.slug}
                    </p>
                  </div>
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

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Products:</span>
                    <span className="font-medium">{category.productCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Order:</span>
                    <span className="font-medium">{category.displayOrder}</span>
                  </div>
                  {category.featured && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Featured:</span>
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="flex-1 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  };

  const renderListView = () => {
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
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleSelectCategory(category.id)}
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
                            <span className="text-xs text-gray-500">
                              ({category.parentName})
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <code className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      {category.slug}
                    </code>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900">
                      {category.productCount}
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
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-gray-400" />
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700">
                      {category.displayOrder}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
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

  const getTotalProducts = () => {
    return categories.reduce((sum, cat) => sum + cat.productCount, 0);
  };

  const getActiveCategories = () => {
    return categories.filter((cat) => cat.status === "active").length;
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
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleBulkAction("export")}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {allCategories.length}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +3 from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Folder className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {getActiveCategories()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  of {categories.length} main categories
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {getTotalProducts()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  across all categories
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {categories.filter((cat) => cat.featured).length}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  displayed on homepage
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Search */}
            <div className="flex-1 max-w-lg">
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

            {/* Right: Controls */}
            <div className="flex flex-wrap gap-3">
              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("tree")}
                  className={`px-4 py-3 ${
                    viewMode === "tree"
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-50"
                  }`}
                  title="Tree View"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-3 ${
                    viewMode === "grid"
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-50"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-3 ${
                    viewMode === "list"
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-50"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Expand All / Collapse All */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setExpandedCategories(allCategories.map((cat) => cat.id))
                  }
                  className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Expand All
                </button>
                <button
                  onClick={() => setExpandedCategories([])}
                  className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCategories.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center">
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
                  Activate Selected
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
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  onClick={() => handleBulkAction("delete")}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Categories Content */}
        {viewMode === "tree" ? (
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

              {filteredCategories.filter((cat) => !cat.parentId).length ===
              0 ? (
                <div className="text-center py-12">
                  <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No categories found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your search
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
                  {renderCategoryTree(
                    categories.filter((cat) => !cat.parentId)
                  )}
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
        ) : viewMode === "grid" ? (
          renderGridView()
        ) : (
          renderListView()
        )}

        {/* Category Hierarchy Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div>
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
          categories={categories}
          onSave={(newCategory) => {
            const allIds = allCategories
              .map((cat) => parseInt(cat.id))
              .filter((id) => !isNaN(id));
            const maxId = allIds.length > 0 ? Math.max(...allIds) : 0;
            const newId = (maxId + 1).toString();

            const newCategoryWithId = {
              ...newCategory,
              id: newId,
              productCount: 0,
              createdAt: new Date().toISOString().split("T")[0],
              updatedAt: new Date().toISOString().split("T")[0],
              children: [],
            };

            if (newCategory.parentId) {
              const addCategoryToParent = (cats) => {
                return cats.map((cat) => {
                  if (cat.id === newCategory.parentId) {
                    const updatedChildren = [
                      ...(cat.children || []),
                      newCategoryWithId,
                    ].sort((a, b) => a.displayOrder - b.displayOrder);
                    return {
                      ...cat,
                      children: updatedChildren,
                    };
                  }
                  if (cat.children && cat.children.length > 0) {
                    return {
                      ...cat,
                      children: addCategoryToParent(cat.children),
                    };
                  }
                  return cat;
                });
              };

              const updatedCategories = addCategoryToParent(categories);
              setCategories(updatedCategories);

              if (!expandedCategories.includes(newCategory.parentId)) {
                setExpandedCategories([
                  ...expandedCategories,
                  newCategory.parentId,
                ]);
              }
            } else {
              const displayOrder =
                categories.length > 0
                  ? Math.max(...categories.map((cat) => cat.displayOrder)) + 1
                  : 1;

              setCategories(
                [
                  ...categories,
                  {
                    ...newCategoryWithId,
                    displayOrder,
                  },
                ].sort((a, b) => a.displayOrder - b.displayOrder)
              );
            }

            setShowAddModal(false);
            toast.success(`Category "${newCategory.name}" added successfully`);
          }}
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
          categories={categories}
          onSave={(updatedCategory) => {
            const updateCategoryInTree = (cats) => {
              return cats.map((cat) => {
                if (cat.id === updatedCategory.id) {
                  return {
                    ...cat,
                    ...updatedCategory,
                    updatedAt: new Date().toISOString().split("T")[0],
                  };
                }
                if (cat.children && cat.children.length > 0) {
                  return {
                    ...cat,
                    children: updateCategoryInTree(cat.children),
                  };
                }
                return cat;
              });
            };

            setCategories(updateCategoryInTree(categories));
            setShowEditModal(false);
            setSelectedCategory(null);
            toast.success(
              `Category "${updatedCategory.name}" updated successfully`
            );
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCategory(null);
          }}
          onConfirm={() => {
            const categoriesToDelete = selectedCategory
              ? [selectedCategory.id]
              : selectedCategories;

            if (categoriesToDelete.length === 0) {
              toast.error("No categories selected");
              return;
            }

            const deleteCategoriesRecursive = (cats) => {
              return cats
                .filter((cat) => !categoriesToDelete.includes(cat.id))
                .map((cat) => {
                  if (cat.children && cat.children.length > 0) {
                    return {
                      ...cat,
                      children: deleteCategoriesRecursive(cat.children),
                    };
                  }
                  return cat;
                });
            };

            const updatedCategories = deleteCategoriesRecursive(categories);
            setCategories(updatedCategories);

            setSelectedCategories([]);
            setSelectedCategory(null);
            setShowDeleteModal(false);

            const message =
              categoriesToDelete.length === 1
                ? "Category deleted successfully"
                : `${categoriesToDelete.length} categories deleted successfully`;

            toast.success(message);
          }}
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
