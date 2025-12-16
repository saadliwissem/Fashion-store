import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  DollarSign,
  Calendar,
  Plus,
  ChevronDown,
  Star,
  Users,
  Activity,
  Award,
  MessageSquare,
  CreditCard,
  Package,
  Clock,
  UserPlus,
  UserCheck,
  UserX,
  ExternalLink,
} from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import toast from "react-hot-toast";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    date: "all",
    tier: "all",
  });
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [sortBy, setSortBy] = useState("newest");

  // Mock customers data
  const customers = [
    {
      id: "CUST-001",
      name: "Ahmed Ben Ali",
      email: "ahmed.benali@example.com",
      phone: "+216 20 123 456",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      joinDate: "2024-01-15",
      lastActive: "2024-12-01 14:30:00",
      totalOrders: 12,
      totalSpent: 2547.84,
      averageOrder: 212.32,
      status: "active",
      tier: "premium",
      location: {
        city: "Tunis",
        governorate: "Tunis",
        country: "Tunisia",
      },
      paymentMethods: ["credit_card", "mobile_money"],
      tags: ["frequent", "high_value", "tech_savvy"],
      notes: "Prefers express shipping. Always leaves reviews.",
    },
    {
      id: "CUST-002",
      name: "Fatima Khaled",
      email: "fatima.khaled@example.com",
      phone: "+216 20 987 654",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
      joinDate: "2024-02-20",
      lastActive: "2024-12-01 11:15:00",
      totalOrders: 8,
      totalSpent: 942.17,
      averageOrder: 117.77,
      status: "active",
      tier: "regular",
      location: {
        city: "Sfax",
        governorate: "Sfax",
        country: "Tunisia",
      },
      paymentMethods: ["mobile_money"],
      tags: ["budget", "sale_lover"],
      notes: "Often uses promo codes.",
    },
    {
      id: "CUST-003",
      name: "Mohamed Said",
      email: "mohamed.said@example.com",
      phone: "+216 20 456 789",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      joinDate: "2024-03-10",
      lastActive: "2024-11-30 16:45:00",
      totalOrders: 5,
      totalSpent: 1874.32,
      averageOrder: 374.86,
      status: "active",
      tier: "premium",
      location: {
        city: "Sousse",
        governorate: "Sousse",
        country: "Tunisia",
      },
      paymentMethods: ["credit_card", "bank_transfer"],
      tags: ["business", "wholesale", "invoice_needed"],
      notes: "Business customer - requires invoices.",
    },
    {
      id: "CUST-004",
      name: "Leila Mansour",
      email: "leila.mansour@example.com",
      phone: "+216 20 321 654",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
      joinDate: "2024-04-05",
      lastActive: "2024-11-30 09:20:00",
      totalOrders: 3,
      totalSpent: 326.45,
      averageOrder: 108.82,
      status: "inactive",
      tier: "regular",
      location: {
        city: "Ariana",
        governorate: "Ariana",
        country: "Tunisia",
      },
      paymentMethods: ["cash_on_delivery"],
      tags: ["cod"],
      notes: "Prefers cash on delivery.",
    },
    {
      id: "CUST-005",
      name: "Youssef Hamdi",
      email: "youssef.hamdi@example.com",
      phone: "+216 20 789 123",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      joinDate: "2024-05-12",
      lastActive: "2024-11-29 18:45:00",
      totalOrders: 7,
      totalSpent: 1125.67,
      averageOrder: 160.81,
      status: "active",
      tier: "regular",
      location: {
        city: "Monastir",
        governorate: "Monastir",
        country: "Tunisia",
      },
      paymentMethods: ["credit_card"],
      tags: ["loyal", "reviewer"],
      notes: "Always leaves 5-star reviews.",
    },
    {
      id: "CUST-006",
      name: "Sara Ben Ahmed",
      email: "sara.benahmed@example.com",
      phone: "+216 20 654 987",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      joinDate: "2024-06-18",
      lastActive: "2024-11-29 12:15:00",
      totalOrders: 2,
      totalSpent: 189.75,
      averageOrder: 94.88,
      status: "inactive",
      tier: "regular",
      location: {
        city: "Nabeul",
        governorate: "Nabeul",
        country: "Tunisia",
      },
      paymentMethods: ["mobile_money"],
      tags: ["payment_failed"],
      notes: "Had payment issues on last order.",
    },
    {
      id: "CUST-007",
      name: "Karim Trabelsi",
      email: "karim.trabelsi@example.com",
      phone: "+216 20 111 222",
      avatar:
        "https://images.unsplash.com/photo-1507591064344-4c6ce005-128?w=400&h=400&fit=crop",
      joinDate: "2024-07-22",
      lastActive: "2024-11-28 14:20:00",
      totalOrders: 15,
      totalSpent: 4892.15,
      averageOrder: 326.14,
      status: "active",
      tier: "vip",
      location: {
        city: "Tunis",
        governorate: "Tunis",
        country: "Tunisia",
      },
      paymentMethods: ["credit_card", "bank_transfer"],
      tags: ["vip", "wholesale", "influencer"],
      notes: "VIP customer - give priority support.",
    },
    {
      id: "CUST-008",
      name: "Nadia Boussaid",
      email: "nadia.boussaid@example.com",
      phone: "+216 20 333 444",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
      joinDate: "2024-08-30",
      lastActive: "2024-11-27 10:45:00",
      totalOrders: 4,
      totalSpent: 645.28,
      averageOrder: 161.32,
      status: "active",
      tier: "regular",
      location: {
        city: "Bizerte",
        governorate: "Bizerte",
        country: "Tunisia",
      },
      paymentMethods: ["credit_card"],
      tags: ["new", "exploring"],
      notes: "New customer - send welcome discount.",
    },
  ];

  // Status options
  const statusOptions = [
    { value: "all", label: "All Customers" },
    {
      value: "active",
      label: "Active",
      color: "bg-green-100 text-green-800",
      icon: UserCheck,
    },
    {
      value: "inactive",
      label: "Inactive",
      color: "bg-gray-100 text-gray-800",
      icon: UserX,
    },
    {
      value: "new",
      label: "New",
      color: "bg-blue-100 text-blue-800",
      icon: UserPlus,
    },
  ];

  // Tier options
  const tierOptions = [
    { value: "all", label: "All Tiers" },
    {
      value: "vip",
      label: "VIP",
      color: "bg-purple-100 text-purple-800",
      icon: Award,
    },
    {
      value: "premium",
      label: "Premium",
      color: "bg-amber-100 text-amber-800",
      icon: Star,
    },
    {
      value: "regular",
      label: "Regular",
      color: "bg-blue-100 text-blue-800",
      icon: Users,
    },
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "spent_high", label: "Total Spent: High to Low" },
    { value: "spent_low", label: "Total Spent: Low to High" },
    { value: "orders_high", label: "Orders: High to Low" },
    { value: "orders_low", label: "Orders: Low to High" },
    { value: "name_asc", label: "Name: A to Z" },
    { value: "name_desc", label: "Name: Z to A" },
  ];

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(
      (c) => c.status === "active"
    ).length;
    const newCustomers = customers.filter(
      (c) =>
        new Date(c.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;
    const totalRevenue = customers.reduce(
      (sum, customer) => sum + customer.totalSpent,
      0
    );
    const averageCustomerValue = totalRevenue / totalCustomers;

    return {
      totalCustomers,
      activeCustomers,
      newCustomers,
      totalRevenue,
      averageCustomerValue,
    };
  }, []);

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((customer) => {
        // Search filter
        const matchesSearch =
          !searchTerm ||
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm) ||
          customer.id.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        const matchesStatus =
          filters.status === "all" || customer.status === filters.status;

        // Tier filter
        const matchesTier =
          filters.tier === "all" || customer.tier === filters.tier;

        // Date filter
        const joinDate = new Date(customer.joinDate);
        const now = new Date();
        let matchesDate = true;

        switch (filters.date) {
          case "today":
            matchesDate = joinDate.toDateString() === now.toDateString();
            break;
          case "this_week":
            const startOfWeek = new Date(now);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            matchesDate = joinDate >= startOfWeek;
            break;
          case "this_month":
            matchesDate =
              joinDate.getMonth() === now.getMonth() &&
              joinDate.getFullYear() === now.getFullYear();
            break;
          case "last_30_days":
            const thirtyDaysAgo = new Date(now);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            matchesDate = joinDate >= thirtyDaysAgo;
            break;
        }

        return matchesSearch && matchesStatus && matchesTier && matchesDate;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.joinDate) - new Date(a.joinDate);
          case "oldest":
            return new Date(a.joinDate) - new Date(b.joinDate);
          case "spent_high":
            return b.totalSpent - a.totalSpent;
          case "spent_low":
            return a.totalSpent - b.totalSpent;
          case "orders_high":
            return b.totalOrders - a.totalOrders;
          case "orders_low":
            return a.totalOrders - b.totalOrders;
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }, [searchTerm, filters, sortBy]);

  // Handle selection
  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map((c) => c.id));
    }
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  // Bulk actions
  const handleBulkAction = (action) => {
    if (selectedCustomers.length === 0) {
      toast.error("Please select customers first");
      return;
    }

    switch (action) {
      case "export":
        toast.success(`Exported ${selectedCustomers.length} customers`);
        break;
      case "message":
        toast.success(`Message sent to ${selectedCustomers.length} customers`);
        break;
      case "add_tag":
        toast.success(`Tag added to ${selectedCustomers.length} customers`);
        break;
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: "all",
      date: "all",
      tier: "all",
    });
    setSearchTerm("");
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const config = statusOptions.find((option) => option.value === status);
    if (!config) return null;

    const Icon = config.icon || User;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // Render tier badge
  const renderTierBadge = (tier) => {
    const config = tierOptions.find((option) => option.value === tier);
    if (!config) return null;

    const Icon = config.icon || Star;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // View modes
  const viewModes = [
    { id: "table", label: "Table View" },
    { id: "cards", label: "Card View" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">
              Manage customer profiles, track activity, and build relationships
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => toast.success("Exporting customers...")}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Customers */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Total Customers
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statistics.totalCustomers}
                </p>
                <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <span>+12%</span>
                  <span className="text-gray-500">from last month</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Active Customers */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Active Customers
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statistics.activeCustomers}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {(
                    (statistics.activeCustomers / statistics.totalCustomers) *
                    100
                  ).toFixed(1)}
                  % of total
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>

          {/* New Customers */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">
                  New Customers
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statistics.newCustomers}
                </p>
                <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <span>+8</span>
                  <span className="text-gray-500">this month</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center">
                <UserPlus className="w-7 h-7 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">
                  Customer Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statistics.totalRevenue.toFixed(2)} DT
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Avg: {statistics.averageCustomerValue.toFixed(2)} DT
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-6">
            {/* Search and View Mode */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers by name, email, phone, or ID..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  {viewModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === mode.id
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Filters
                  </span>
                  {Object.values(filters).some((f) => f !== "all") && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                {Object.values(filters).some((f) => f !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <XCircle className="w-4 h-4" />
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tier Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tier
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.tier}
                    onChange={(e) => handleFilterChange("tier", e.target.value)}
                  >
                    {tierOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Join Date
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.date}
                    onChange={(e) => handleFilterChange("date", e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                    <option value="last_30_days">Last 30 Days</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedCustomers.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedCustomers.length} customer
                  {selectedCustomers.length !== 1 ? "s" : ""} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleBulkAction("message")}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </button>
                <button
                  onClick={() => handleBulkAction("add_tag")}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tag
                </button>
                <button
                  onClick={() => handleBulkAction("export")}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Selected
                </button>
                <button
                  onClick={() => setSelectedCustomers([])}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customers Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 w-12">
                      <input
                        type="checkbox"
                        checked={
                          filteredCustomers.length > 0 &&
                          selectedCustomers.length === filteredCustomers.length
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">
                      Tier
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">
                      Orders
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">
                      Total Spent
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">
                      Last Active
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => handleSelectCustomer(customer.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                            <img
                              src={customer.avatar}
                              alt={customer.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {customer.name}
                            </p>
                            <div className="flex flex-col text-sm text-gray-500">
                              <span>{customer.email}</span>
                              <span>{customer.phone}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              ID: {customer.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {renderStatusBadge(customer.status)}
                      </td>
                      <td className="p-4">{renderTierBadge(customer.tier)}</td>
                      <td className="p-4">
                        <div className="text-center">
                          <p className="font-bold text-gray-900">
                            {customer.totalOrders}
                          </p>
                          <p className="text-xs text-gray-500">orders</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-gray-900">
                            {customer.totalSpent.toFixed(2)} DT
                          </p>
                          <p className="text-xs text-gray-500">
                            Avg: {customer.averageOrder.toFixed(2)} DT
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-900">
                          {new Date(customer.lastActive).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(customer.lastActive).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              toast.success(`Message sent to ${customer.name}`)
                            }
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Send Message"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              toast.success(`Editing ${customer.name}`)
                            }
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 transition-all hover:shadow-md"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleSelectCustomer(customer.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {customer.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID: {customer.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {renderStatusBadge(customer.status)}
                      {renderTierBadge(customer.tier)}
                    </div>
                  </div>

                  {/* Avatar & Contact */}
                  <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{customer.location.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium mb-1">
                        Orders
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {customer.totalOrders}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600 font-medium mb-1">
                        Total Spent
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {customer.totalSpent.toFixed(2)} DT
                      </p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <p className="text-xs text-amber-600 font-medium mb-1">
                        Avg. Order
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {customer.averageOrder.toFixed(2)} DT
                      </p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-purple-600 font-medium mb-1">
                        Join Date
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(customer.joinDate).toLocaleDateString(
                          "en-US",
                          { month: "short", year: "numeric" }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  {customer.tags.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {customer.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                          >
                            {tag.replace("_", " ")}
                          </span>
                        ))}
                        {customer.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs font-medium">
                            +{customer.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() =>
                        toast.success(`Message sent to ${customer.name}`)
                      }
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || Object.values(filters).some((f) => f !== "all")
                  ? "No customers found"
                  : "No customers yet"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm || Object.values(filters).some((f) => f !== "all")
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Get started by adding your first customer."}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {(searchTerm ||
                  Object.values(filters).some((f) => f !== "all")) && (
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Clear Filters
                  </button>
                )}
                <button className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={selectedCustomer.avatar}
                      alt={selectedCustomer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCustomer.name}
                    </h2>
                    <p className="text-gray-600">{selectedCustomer.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {renderStatusBadge(selectedCustomer.status)}
                  {renderTierBadge(selectedCustomer.tier)}
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="p-2 hover:bg-gray-100 rounded-xl"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
                {/* Contact & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Contact Info */}
                  <div className="lg:col-span-2">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Contact Information
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Email</p>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <p className="font-medium text-gray-900">
                              {selectedCustomer.email}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Phone</p>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <p className="font-medium text-gray-900">
                              {selectedCustomer.phone}
                            </p>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600 mb-2">Location</p>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {selectedCustomer.location.city},{" "}
                                {selectedCustomer.location.governorate}
                              </p>
                              <p className="text-gray-600">
                                {selectedCustomer.location.country}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Quick Stats
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Join Date</p>
                        <p className="font-medium">
                          {new Date(
                            selectedCustomer.joinDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Active</p>
                        <p className="font-medium">
                          {new Date(
                            selectedCustomer.lastActive
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Methods</p>
                        <div className="flex gap-2 mt-1">
                          {selectedCustomer.paymentMethods.map(
                            (method, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium"
                              >
                                {method.replace("_", " ")}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Stats */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Financial Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">
                            Total Orders
                          </p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">
                            {selectedCustomer.totalOrders}
                          </p>
                        </div>
                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">
                            Total Spent
                          </p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">
                            {selectedCustomer.totalSpent.toFixed(2)} DT
                          </p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 font-medium">
                            Avg. Order Value
                          </p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">
                            {selectedCustomer.averageOrder.toFixed(2)} DT
                          </p>
                        </div>
                        <Activity className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCustomer.notes && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Notes
                      </h3>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <p className="text-gray-700 whitespace-pre-line">
                          {selectedCustomer.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 rounded-lg font-medium"
                        >
                          {tag.replace("_", " ").toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      toast.success(`Message sent to ${selectedCustomer.name}`)
                    }
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Orders
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                  <button className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Customer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Customers;
