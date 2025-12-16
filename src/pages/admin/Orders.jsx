import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Printer,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  CheckSquare,
  XSquare,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Calendar,
  User,
  MapPin,
  ShoppingBag,
  ChevronDown,
  CreditCard,
  Phone,
  Mail,
  ExternalLink,
  Plus,
} from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/common/Button";
import DeleteConfirmation from "./DeleteConfirmation";
import toast from "react-hot-toast";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'
  const [sortBy, setSortBy] = useState("newest");

  // Mock orders data
  const orders = [
    {
      id: "ORD-2024-001",
      customer: {
        id: "CUST-001",
        name: "Ahmed Ben Ali",
        email: "ahmed.benali@example.com",
        phone: "+216 20 123 456",
      },
      items: [
        {
          id: 1,
          name: "Premium Cotton T-Shirt",
          sku: "FS-MEN-001-BLUE-M",
          price: 29.99,
          quantity: 2,
          color: "Navy Blue",
          size: "M",
          image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
        },
        {
          id: 2,
          name: "Designer Denim Jacket",
          sku: "FS-WOM-003-DARK-M",
          price: 89.99,
          quantity: 1,
          color: "Dark Wash",
          size: "M",
          image:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
        },
      ],
      shippingAddress: {
        name: "Ahmed Ben Ali",
        street: "123 Rue Habib Bourguiba",
        city: "Tunis",
        governorate: "Tunis",
        zipCode: "1000",
        country: "Tunisia",
        phone: "+216 20 123 456",
      },
      billingAddress: {
        sameAsShipping: true,
      },
      payment: {
        method: "credit_card",
        status: "paid",
        transactionId: "TXN-001234",
        amount: 149.97,
        currency: "DT",
        paidAt: "2024-12-01 14:30:00",
      },
      shipping: {
        method: "express",
        carrier: "Tunisie Post",
        trackingNumber: "TN123456789",
        cost: 15.0,
        estimatedDelivery: "2024-12-03",
        status: "in_transit",
      },
      totals: {
        subtotal: 149.97,
        shipping: 15.0,
        tax: 10.5,
        discount: 0.0,
        total: 175.47,
      },
      status: "processing",
      createdAt: "2024-12-01 14:20:00",
      updatedAt: "2024-12-01 15:45:00",
      notes: "Customer requested gift wrapping",
      tags: ["express", "gift"],
    },
    {
      id: "ORD-2024-002",
      customer: {
        id: "CUST-002",
        name: "Fatima Khaled",
        email: "fatima.khaled@example.com",
        phone: "+216 20 987 654",
      },
      items: [
        {
          id: 3,
          name: "Elegant Summer Dress",
          sku: "FS-WOM-002-PINK-S",
          price: 59.99,
          quantity: 1,
          color: "Floral Pink",
          size: "S",
          image:
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop",
        },
      ],
      shippingAddress: {
        name: "Fatima Khaled",
        street: "456 Avenue de la Liberté",
        city: "Sfax",
        governorate: "Sfax",
        zipCode: "3000",
        country: "Tunisia",
        phone: "+216 20 987 654",
      },
      billingAddress: {
        sameAsShipping: true,
      },
      payment: {
        method: "mobile_money",
        status: "paid",
        transactionId: "TXN-001235",
        amount: 74.99,
        currency: "DT",
        paidAt: "2024-12-01 11:15:00",
      },
      shipping: {
        method: "standard",
        carrier: "Tunisie Post",
        trackingNumber: "TN123456790",
        cost: 7.0,
        estimatedDelivery: "2024-12-05",
        status: "pending",
      },
      totals: {
        subtotal: 59.99,
        shipping: 7.0,
        tax: 4.2,
        discount: 5.0,
        total: 66.19,
      },
      status: "pending",
      createdAt: "2024-12-01 11:10:00",
      updatedAt: "2024-12-01 11:15:00",
      notes: "Applied promo code: SUMMER5",
      tags: ["promo"],
    },
    {
      id: "ORD-2024-003",
      customer: {
        id: "CUST-003",
        name: "Mohamed Said",
        email: "mohamed.said@example.com",
        phone: "+216 20 456 789",
      },
      items: [
        {
          id: 4,
          name: "Classic Polo Shirt",
          sku: "FS-MEN-004-NAVY-M",
          price: 34.99,
          quantity: 3,
          color: "Navy",
          size: "M",
          image:
            "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop",
        },
        {
          id: 5,
          name: "Casual Hoodie",
          sku: "FS-MEN-005-CHARCOAL-M",
          price: 49.99,
          quantity: 1,
          color: "Charcoal",
          size: "M",
          image:
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
        },
        {
          id: 6,
          name: "Leather Belt",
          sku: "FS-ACC-006-BLACK-REG",
          price: 24.99,
          quantity: 2,
          color: "Black",
          size: "Regular",
          image:
            "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=300&fit=crop",
        },
      ],
      shippingAddress: {
        name: "Mohamed Said",
        street: "789 Rue de Carthage",
        city: "Sousse",
        governorate: "Sousse",
        zipCode: "4000",
        country: "Tunisia",
        phone: "+216 20 456 789",
      },
      billingAddress: {
        sameAsShipping: false,
        name: "Mohamed Said Company",
        street: "789 Business Street",
        city: "Sousse",
        governorate: "Sousse",
        zipCode: "4001",
        country: "Tunisia",
      },
      payment: {
        method: "bank_transfer",
        status: "pending",
        transactionId: null,
        amount: 234.95,
        currency: "DT",
        paidAt: null,
      },
      shipping: {
        method: "express",
        carrier: "DHL Tunisia",
        trackingNumber: null,
        cost: 20.0,
        estimatedDelivery: "2024-12-04",
        status: "not_shipped",
      },
      totals: {
        subtotal: 234.95,
        shipping: 20.0,
        tax: 16.45,
        discount: 0.0,
        total: 271.4,
      },
      status: "pending_payment",
      createdAt: "2024-11-30 16:45:00",
      updatedAt: "2024-11-30 16:45:00",
      notes: "Business customer - needs invoice",
      tags: ["business", "invoice"],
    },
    {
      id: "ORD-2024-004",
      customer: {
        id: "CUST-004",
        name: "Leila Mansour",
        email: "leila.mansour@example.com",
        phone: "+216 20 321 654",
      },
      items: [
        {
          id: 7,
          name: "Floral Maxi Dress",
          sku: "FS-WOM-001-FLORAL-L",
          price: 69.99,
          quantity: 1,
          color: "Floral",
          size: "L",
          image:
            "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400&h=500&fit=crop",
        },
      ],
      shippingAddress: {
        name: "Leila Mansour",
        street: "321 Rue de la Marsa",
        city: "Ariana",
        governorate: "Ariana",
        zipCode: "2080",
        country: "Tunisia",
        phone: "+216 20 321 654",
      },
      billingAddress: {
        sameAsShipping: true,
      },
      payment: {
        method: "cash_on_delivery",
        status: "pending",
        transactionId: null,
        amount: 84.99,
        currency: "DT",
        paidAt: null,
      },
      shipping: {
        method: "standard",
        carrier: "Tunisie Post",
        trackingNumber: "TN123456791",
        cost: 7.0,
        estimatedDelivery: "2024-12-06",
        status: "shipped",
      },
      totals: {
        subtotal: 69.99,
        shipping: 7.0,
        tax: 4.9,
        discount: 0.0,
        total: 81.89,
      },
      status: "shipped",
      createdAt: "2024-11-30 09:20:00",
      updatedAt: "2024-12-01 10:30:00",
      notes: "",
      tags: ["cod"],
    },
    {
      id: "ORD-2024-005",
      customer: {
        id: "CUST-005",
        name: "Youssef Hamdi",
        email: "youssef.hamdi@example.com",
        phone: "+216 20 789 123",
      },
      items: [
        {
          id: 8,
          name: "Slim Fit Jeans",
          sku: "FS-MEN-002-DARK-32",
          price: 59.99,
          quantity: 2,
          color: "Dark Wash",
          size: "32",
          image:
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
        },
      ],
      shippingAddress: {
        name: "Youssef Hamdi",
        street: "654 Avenue Habib Bourguiba",
        city: "Monastir",
        governorate: "Monastir",
        zipCode: "5000",
        country: "Tunisia",
        phone: "+216 20 789 123",
      },
      billingAddress: {
        sameAsShipping: true,
      },
      payment: {
        method: "credit_card",
        status: "paid",
        transactionId: "TXN-001236",
        amount: 139.98,
        currency: "DT",
        paidAt: "2024-11-29 18:45:00",
      },
      shipping: {
        method: "express",
        carrier: "DHL Tunisia",
        trackingNumber: "TN123456792",
        cost: 15.0,
        estimatedDelivery: "2024-12-02",
        status: "delivered",
        deliveredAt: "2024-12-02 14:20:00",
      },
      totals: {
        subtotal: 119.98,
        shipping: 15.0,
        tax: 8.4,
        discount: 10.0,
        total: 133.38,
      },
      status: "delivered",
      createdAt: "2024-11-29 18:30:00",
      updatedAt: "2024-12-02 14:20:00",
      notes: "Customer happy with delivery",
      tags: ["express", "delivered"],
    },
    {
      id: "ORD-2024-006",
      customer: {
        id: "CUST-006",
        name: "Sara Ben Ahmed",
        email: "sara.benahmed@example.com",
        phone: "+216 20 654 987",
      },
      items: [
        {
          id: 9,
          name: "Knit Sweater",
          sku: "FS-WOM-004-GRAY-M",
          price: 45.99,
          quantity: 1,
          color: "Gray",
          size: "M",
          image:
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
        },
        {
          id: 10,
          name: "Baseball Cap",
          sku: "FS-ACC-007-BLACK-ONE",
          price: 19.99,
          quantity: 1,
          color: "Black",
          size: "One Size",
          image:
            "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop",
        },
      ],
      shippingAddress: {
        name: "Sara Ben Ahmed",
        street: "987 Rue de la Plage",
        city: "Nabeul",
        governorate: "Nabeul",
        zipCode: "8000",
        country: "Tunisia",
        phone: "+216 20 654 987",
      },
      billingAddress: {
        sameAsShipping: true,
      },
      payment: {
        method: "mobile_money",
        status: "failed",
        transactionId: null,
        amount: 75.98,
        currency: "DT",
        paidAt: null,
        failureReason: "Insufficient balance",
      },
      shipping: {
        method: "standard",
        carrier: null,
        trackingNumber: null,
        cost: 7.0,
        estimatedDelivery: null,
        status: "cancelled",
      },
      totals: {
        subtotal: 65.98,
        shipping: 7.0,
        tax: 4.62,
        discount: 0.0,
        total: 77.6,
      },
      status: "cancelled",
      createdAt: "2024-11-29 12:15:00",
      updatedAt: "2024-11-29 13:30:00",
      notes: "Payment failed - order cancelled",
      tags: ["cancelled", "payment_failed"],
    },
  ];

  const statusOptions = [
    { value: "all", label: "All Orders" },
    {
      value: "pending",
      label: "Pending",
      color: "bg-amber-100 text-amber-800",
      icon: Clock,
    },
    {
      value: "pending_payment",
      label: "Pending Payment",
      color: "bg-blue-100 text-blue-800",
      icon: CreditCard,
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-purple-100 text-purple-800",
      icon: RefreshCw,
    },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-indigo-100 text-indigo-800",
      icon: Truck,
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-rose-100 text-rose-800",
      icon: XCircle,
    },
    {
      value: "refunded",
      label: "Refunded",
      color: "bg-gray-100 text-gray-800",
      icon: ArrowDown,
    },
  ];

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "total_high", label: "Total: High to Low" },
    { value: "total_low", label: "Total: Low to High" },
    { value: "name_asc", label: "Customer: A to Z" },
    { value: "name_desc", label: "Customer: Z to A" },
  ];

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totals.total,
    0
  );
  const pendingOrders = orders.filter((order) =>
    ["pending", "pending_payment", "processing"].includes(order.status)
  ).length;
  const averageOrderValue = totalRevenue / totalOrders;

  const filteredOrders = orders
    .filter((order) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Status filter
      const matchesStatus =
        filterStatus === "all" || order.status === filterStatus;

      // Date filter
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      let matchesDate = true;

      switch (filterDate) {
        case "today":
          matchesDate = orderDate.toDateString() === now.toDateString();
          break;
        case "yesterday":
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          matchesDate = orderDate.toDateString() === yesterday.toDateString();
          break;
        case "this_week":
          const startOfWeek = new Date(now);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
          matchesDate = orderDate >= startOfWeek;
          break;
        case "this_month":
          matchesDate =
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear();
          break;
        case "last_month":
          const lastMonth = new Date(now);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          matchesDate =
            orderDate.getMonth() === lastMonth.getMonth() &&
            orderDate.getFullYear() === lastMonth.getFullYear();
          break;
      }

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "total_high":
          return b.totals.total - a.totals.total;
        case "total_low":
          return a.totals.total - b.totals.total;
        case "name_asc":
          return a.customer.name.localeCompare(b.customer.name);
        case "name_desc":
          return b.customer.name.localeCompare(a.customer.name);
        default:
          return 0;
      }
    });

  const getStatusConfig = (status) => {
    const config = statusOptions.find((option) => option.value === status);
    return config || statusOptions[0];
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "credit_card":
        return {
          icon: CreditCard,
          label: "Credit Card",
          color: "text-blue-600",
        };
      case "mobile_money":
        return { icon: Phone, label: "Mobile Money", color: "text-green-600" };
      case "bank_transfer":
        return {
          icon: DollarSign,
          label: "Bank Transfer",
          color: "text-purple-600",
        };
      case "cash_on_delivery":
        return {
          icon: Package,
          label: "Cash on Delivery",
          color: "text-amber-600",
        };
      default:
        return {
          icon: CreditCard,
          label: "Credit Card",
          color: "text-gray-600",
        };
    }
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id));
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
    // In real app, make API call to update order status
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handlePrintInvoice = (orderId) => {
    toast.success(`Printing invoice for order ${orderId}`);
    // In real app, generate and print invoice
  };

  const handleExportOrders = () => {
    toast.success("Orders exported successfully");
    // In real app, generate and download CSV/Excel file
  };
  //

  const getShippingStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "failed":
        return "text-rose-600";
      default:
        return "text-amber-600";
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-TN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  ////
  const handleBulkAction = (action) => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders first");
      return;
    }

    switch (action) {
      case "mark_processing":
        toast.success(`Marked ${selectedOrders.length} orders as processing`);
        break;
      case "mark_shipped":
        toast.success(`Marked ${selectedOrders.length} orders as shipped`);
        break;
      case "export":
        handleExportOrders();
        break;
      case "print":
        toast.success(`Printing ${selectedOrders.length} invoices`);
        break;
    }
  };

  const renderStatusBadge = (status) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const renderTableRow = (order) => {
    const statusConfig = getStatusConfig(order.status);
    const paymentMethod = getPaymentMethodIcon(order.payment.method);

    return (
      <tr
        key={order.id}
        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
      >
        <td className="p-4">
          <input
            type="checkbox"
            checked={selectedOrders.includes(order.id)}
            onChange={() => handleSelectOrder(order.id)}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
        </td>
        <td className="p-4">
          <div>
            <p className="font-bold text-gray-900">{order.id}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString("en-TN", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </td>
        <td className="p-4">
          <div>
            <p className="font-medium text-gray-900">{order.customer.name}</p>
            <p className="text-sm text-gray-500">{order.customer.email}</p>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <paymentMethod.icon className={`w-4 h-4 ${paymentMethod.color}`} />
            <span className="text-sm text-gray-700">{paymentMethod.label}</span>
          </div>
          <p
            className={`text-xs mt-1 ${
              order.payment.status === "paid"
                ? "text-green-600"
                : "text-amber-600"
            }`}
          >
            {order.payment.status === "paid" ? "Paid" : "Pending"}
          </p>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            {renderStatusBadge(order.status)}
          </div>
        </td>
        <td className="p-4">
          <div>
            <p className="font-medium text-gray-900">
              {order.items.length} items
            </p>
            <p className="text-xs text-gray-500 truncate max-w-xs">
              {order.items.map((item) => item.name).join(", ")}
            </p>
          </div>
        </td>
        <td className="p-4">
          <div>
            <p className="font-bold text-gray-900">
              {order.totals.total.toFixed(2)} DT
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Items: {order.totals.subtotal.toFixed(2)}</span>
              <span>•</span>
              <span>Ship: {order.totals.shipping.toFixed(2)}</span>
            </div>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleViewOrderDetails(order)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePrintInvoice(order.id)}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
              title="Print Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderCardView = (order) => {
    const statusConfig = getStatusConfig(order.status);
    const paymentMethod = getPaymentMethodIcon(order.payment.method);

    return (
      <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900">{order.id}</h3>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          {renderStatusBadge(order.status)}
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{order.customer.name}</p>
              <p className="text-sm text-gray-500">{order.customer.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Items</p>
              <p className="font-medium text-gray-900">
                {order.items.length} products
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-bold text-gray-900">
                {order.totals.total.toFixed(2)} DT
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment</p>
              <div className="flex items-center gap-1">
                <paymentMethod.icon
                  className={`w-4 h-4 ${paymentMethod.color}`}
                />
                <span className="text-sm text-gray-700">
                  {paymentMethod.label}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Shipping</p>
              <p className="font-medium text-gray-900">
                {order.shipping.method}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="small"
            className="flex-1"
            onClick={() => handleViewOrderDetails(order)}
          >
            View
          </Button>
          <Button
            size="small"
            className="flex-1"
            onClick={() => handlePrintInvoice(order.id)}
          >
            Invoice
          </Button>
        </div>
      </div>
    );
  };

  const renderOrderDetailsModal = () => {
    if (!selectedOrder) return null;

    const statusConfig = getStatusConfig(selectedOrder.status);
    const paymentMethod = getPaymentMethodIcon(selectedOrder.payment.method);
    const PaymentIcon = paymentMethod.icon;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setShowOrderDetails(false)}
        />

        {/* Modal Container */}
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ========== HEADER ========== */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h2>
                <p className="text-gray-600">{selectedOrder.id}</p>
              </div>

              <div className="flex items-center gap-3">
                {renderStatusBadge(selectedOrder.status)}
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  aria-label="Close modal"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ========== MAIN CONTENT ========== */}
            <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
              {/* SECTION 1: ORDER ITEMS & TOTALS */}
              <section>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Order Items */}
                  <div className="lg:col-span-2">
                    <div className="bg-gray-50 rounded-xl p-6">
                      {/* Items List */}
                      <div className="space-y-4">
                        {selectedOrder.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/placeholder-image.jpg";
                                    e.currentTarget.alt = "Image not available";
                                  }}
                                />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.color} • {item.size} • SKU: {item.sku}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                {(item.price * item.quantity).toFixed(2)} DT
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.price.toFixed(2)} DT each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Totals */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">
                              {selectedOrder.totals.subtotal.toFixed(2)} DT
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">
                              {selectedOrder.totals.shipping.toFixed(2)} DT
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">
                              {selectedOrder.totals.tax.toFixed(2)} DT
                            </span>
                          </div>
                          {selectedOrder.totals.discount > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Discount</span>
                              <span className="font-medium text-green-600">
                                -{selectedOrder.totals.discount.toFixed(2)} DT
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-lg font-bold pt-2 border-t">
                            <span>Total</span>
                            <span>
                              {selectedOrder.totals.total.toFixed(2)} DT
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Customer Information
                      </h3>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {selectedOrder.customer.name}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              {selectedOrder.customer.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              {selectedOrder.customer.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {selectedOrder.shippingAddress.name}
                            </p>
                            <p className="text-gray-600">
                              {selectedOrder.shippingAddress.street}
                            </p>
                            <p className="text-gray-600">
                              {selectedOrder.shippingAddress.city},{" "}
                              {selectedOrder.shippingAddress.governorate}{" "}
                              {selectedOrder.shippingAddress.zipCode}
                            </p>
                            <p className="text-gray-600">
                              {selectedOrder.shippingAddress.country}
                            </p>
                            <p className="text-gray-600 mt-2">
                              <Phone className="w-4 h-4 inline mr-1" />
                              {selectedOrder.shippingAddress.phone}
                            </p>
                          </div>
                        </div>

                        {/* Billing Address (if different) */}
                        {!selectedOrder.billingAddress.sameAsShipping && (
                          <div className="pt-4 border-t border-gray-200">
                            <p className="font-medium text-gray-900 mb-2">
                              Billing Address (Different)
                            </p>
                            <p className="text-gray-600">
                              {selectedOrder.billingAddress.street}
                            </p>
                            <p className="text-gray-600">
                              {selectedOrder.billingAddress.city},{" "}
                              {selectedOrder.billingAddress.governorate}{" "}
                              {selectedOrder.billingAddress.zipCode}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 2: SHIPPING & PAYMENT */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Status */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Shipping Status
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Truck className="w-6 h-6 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {selectedOrder.shipping.carrier || "Not Assigned"}
                          </p>
                          <p className="text-sm text-gray-600 capitalize">
                            {selectedOrder.shipping.method} Shipping
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getShippingStatusColor(
                          selectedOrder.shipping.status
                        )}`}
                      >
                        {selectedOrder.shipping.status
                          ?.replace("_", " ")
                          .toUpperCase() || "PENDING"}
                      </span>
                    </div>

                    {/* Tracking Information */}
                    {selectedOrder.shipping.trackingNumber && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">
                          Tracking Number
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="bg-white px-3 py-2 rounded-lg border border-gray-200 font-mono text-sm">
                            {selectedOrder.shipping.trackingNumber}
                          </code>
                          <button
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                            onClick={() =>
                              window.open(
                                `https://tracking.example.com/${selectedOrder.shipping.trackingNumber}`,
                                "_blank"
                              )
                            }
                            aria-label="Track package"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Shipping Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Shipping Cost</p>
                        <p className="font-medium">
                          {selectedOrder.shipping.cost.toFixed(2)} DT
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Estimated Delivery
                        </p>
                        <p className="font-medium">
                          {selectedOrder.shipping.estimatedDelivery
                            ? new Date(
                                selectedOrder.shipping.estimatedDelivery
                              ).toLocaleDateString()
                            : "Not available"}
                        </p>
                      </div>
                      {selectedOrder.shipping.deliveredAt && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600">Delivered On</p>
                          <p className="font-medium">
                            {formatDateTime(selectedOrder.shipping.deliveredAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Payment Information
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <PaymentIcon
                          className={`w-6 h-6 ${paymentMethod.color}`}
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {paymentMethod.label}
                          </p>
                          <p
                            className={`text-sm font-medium ${getPaymentStatusColor(
                              selectedOrder.payment.status
                            )}`}
                          >
                            {selectedOrder.payment.status?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedOrder.payment.amount.toFixed(2)} DT
                      </p>
                    </div>

                    <div className="space-y-3">
                      {selectedOrder.payment.transactionId && (
                        <div>
                          <p className="text-sm text-gray-600">
                            Transaction ID
                          </p>
                          <p className="font-medium font-mono">
                            {selectedOrder.payment.transactionId}
                          </p>
                        </div>
                      )}

                      {selectedOrder.payment.paidAt && (
                        <div>
                          <p className="text-sm text-gray-600">Paid On</p>
                          <p className="font-medium">
                            {formatDateTime(selectedOrder.payment.paidAt)}
                          </p>
                        </div>
                      )}

                      {selectedOrder.payment.failureReason && (
                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-rose-800">
                            Payment Failed
                          </p>
                          <p className="text-sm text-rose-600">
                            {selectedOrder.payment.failureReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: NOTES, TAGS & TIMELINE */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Order Notes
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedOrder.tags && selectedOrder.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrder.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 rounded-lg text-sm font-medium"
                        >
                          {tag.replace("_", " ").toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* SECTION 4: ORDER TIMELINE */}
              <section>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Timeline
                </h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="space-y-4">
                    {/* Order Placed */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Order Placed
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(selectedOrder.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Payment Confirmed */}
                    {selectedOrder.payment.paidAt && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Payment Confirmed
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(selectedOrder.payment.paidAt)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Order Updated */}
                    {selectedOrder.updatedAt !== selectedOrder.createdAt && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <RefreshCw className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Order Updated
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(selectedOrder.updatedAt)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status changed to {statusConfig.label}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* ========== FOOTER ACTIONS ========== */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handlePrintInvoice(selectedOrder.id)}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Invoice
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowOrderDetails(false)}
                  >
                    Close
                  </Button>
                  <Button>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper functions (add these outside the component)

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Orders Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track customer orders, shipping, and payments
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleExportOrders}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalOrders}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalRevenue.toFixed(2)} DT
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">
                  Pending Orders
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {pendingOrders}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">
                  Avg. Order Value
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {averageOrderValue.toFixed(2)} DT
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <ArrowUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID, customer, or product..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("table")}
                className={`p-3 rounded-xl ${
                  viewMode === "table"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`p-3 rounded-xl ${
                  viewMode === "cards"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

            {/* Bulk Actions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bulk Actions
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onChange={(e) => handleBulkAction(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  Select Action
                </option>
                <option value="mark_processing">Mark as Processing</option>
                <option value="mark_shipped">Mark as Shipped</option>
                <option value="print">Print Invoices</option>
                <option value="export">Export Selected</option>
              </select>
            </div>
          </div>

          {/* Selected Orders Info */}
          {selectedOrders.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-purple-600" />
                <p className="text-purple-700 font-medium">
                  {selectedOrders.length} order
                  {selectedOrders.length !== 1 ? "s" : ""} selected
                </p>
              </div>
              <button
                onClick={() => setSelectedOrders([])}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Orders List */}
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
                          selectedOrders.length === filteredOrders.length &&
                          filteredOrders.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">
                      Order ID
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">
                      Payment
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">
                      Items
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">
                      Total
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>{filteredOrders.map(renderTableRow)}</tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredOrders.map(renderCardView)}
            </div>
          )}

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-8">
                {searchTerm
                  ? "Try adjusting your search or filters"
                  : "Create your first order to get started"}
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Order
              </Button>
            </div>
          )}
        </div>
      </div>

      {showOrderDetails && renderOrderDetailsModal()}
    </AdminLayout>
  );
};

export default Orders;
