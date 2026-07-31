// pages/admin/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  CreditCard,
  Calendar,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Eye,
  Loader,
  RefreshCw,
  Clock,
} from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/common/Button";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      today: { orders: 0, revenue: 0, customers: 0 },
      weekly: { orders: 0, revenue: 0 },
      monthly: { orders: 0, revenue: 0 },
      overall: { orders: 0, customers: 0, products: 0, revenue: 0 },
    },
    recentOrders: [],
    topProducts: [],
    lowStockProducts: [],
    distributions: {
      orderStatus: [],
      paymentMethod: [],
    },
  });

  // Stats for the cards
  const [stats, setStats] = useState([
    {
      title: "Total Revenue",
      value: "0.00 DT",
      change: "+0%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Total Orders",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: ShoppingBag,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Total Customers",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: Users,
      color: "from-primary-500 to-pink-600",
    },
    {
      title: "Products Sold",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: Package,
      color: "from-amber-500 to-orange-600",
    },
  ]);

  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [orderStatusDistribution, setOrderStatusDistribution] = useState([]);
  const [paymentMethodDistribution, setPaymentMethodDistribution] = useState(
    []
  );

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminAPI.dashboardStats();

      // Handle different response structures
      let data = {};
      if (response.data?.data) {
        data = response.data.data;
      } else if (response.data?.stats) {
        data = response.data;
      } else {
        data = response.data;
      }

      // Update stats
      const overall = data.stats?.overall || {};
      const monthly = data.stats?.monthly || {};
      const weekly = data.stats?.weekly || {};
      const today = data.stats?.today || {};

      setDashboardData(data);

      // Update card stats
      setStats([
        {
          title: "Total Revenue",
          value: `${(overall.revenue || 0).toFixed(2)} TND`,
          change: `+${
            monthly.revenue > 0
              ? ((monthly.revenue / (overall.revenue || 1)) * 100).toFixed(1)
              : 0
          }%`,
          trend: "up",
          icon: DollarSign,
          color: "from-green-500 to-emerald-600",
        },
        {
          title: "Total Orders",
          value: `${overall.orders || 0}`,
          change: `+${
            monthly.orders > 0
              ? ((monthly.orders / (overall.orders || 1)) * 100).toFixed(1)
              : 0
          }%`,
          trend: "up",
          icon: ShoppingBag,
          color: "from-blue-500 to-cyan-600",
        },
        {
          title: "Total Customers",
          value: `${overall.customers || 0}`,
          change: `+${
            today.customers > 0
              ? ((today.customers / (overall.customers || 1)) * 100).toFixed(1)
              : 0
          }%`,
          trend: "up",
          icon: Users,
          color: "from-primary-500 to-pink-600",
        },
        {
          title: "Products Sold",
          value: `${
            data.topProducts?.reduce(
              (sum, p) => sum + (p.purchaseCount || 0),
              0
            ) || 0
          }`,
          change: "+12.5%",
          trend: "up",
          icon: Package,
          color: "from-amber-500 to-orange-600",
        },
      ]);

      // Update recent orders
      const orders = data.recentOrders || [];
      setRecentOrders(
        orders.map((order) => ({
          id: order.orderNumber || order._id,
          customer: order.user?.firstName
            ? `${order.user.firstName} ${order.user.lastName || ""}`
            : order.shippingAddress?.firstName
            ? `${order.shippingAddress.firstName} ${
                order.shippingAddress.lastName || ""
              }`
            : "Guest",
          date: new Date(order.createdAt).toLocaleDateString(),
          amount: `${(order.total || 0).toFixed(2)} TND`,
          status: order.status || "pending",
          _id: order._id,
        }))
      );

      // Update top products
      const products = data.topProducts || [];
      setTopProducts(
        products.map((product) => ({
          name: product.name,
          sales: product.purchaseCount || 0,
          revenue: `${(
            (product.price || 0) * (product.purchaseCount || 0)
          ).toFixed(2)} TND`,
          _id: product._id,
          stock: product.stock || 0,
          image: product.images?.[0] || null,
        }))
      );

      // Update low stock products
      setLowStockProducts(data.lowStockProducts || []);

      // Update distributions
      setOrderStatusDistribution(data.distributions?.orderStatus || []);
      setPaymentMethodDistribution(data.distributions?.paymentMethod || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Helper to get status color
  const getStatusColor = (status) => {
    const colors = {
      delivered: "bg-green-100 text-green-800",
      shipped: "bg-blue-100 text-blue-800",
      processing: "bg-yellow-100 text-yellow-800",
      pending: "bg-orange-100 text-orange-800",
      confirmed: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  // Helper to get status label
  const getStatusLabel = (status) => {
    const labels = {
      delivered: "Delivered",
      shipped: "Shipped",
      processing: "Processing",
      pending: "Pending",
      confirmed: "Confirmed",
      cancelled: "Cancelled",
    };
    return labels[status?.toLowerCase()] || status || "Unknown";
  };

  // Loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <p className="mt-4 text-gray-600">{error}</p>
            <Button className="mt-4" onClick={fetchDashboardData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
              <p className="opacity-90">
                Here's what's happening with your store today.
              </p>
              <div className="flex gap-4 mt-3 text-sm opacity-80">
                <span>
                  📊 Today: {dashboardData.stats?.today?.orders || 0} orders
                </span>
                <span>
                  💰 Revenue:{" "}
                  {(dashboardData.stats?.today?.revenue || 0).toFixed(2)} TND
                </span>
                <span>
                  👤 {dashboardData.stats?.today?.customers || 0} new customers
                </span>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 flex gap-3">
              <button
                onClick={fetchDashboardData}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                View Reports
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-rose-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-rose-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500">
                        from last month
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts & Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Status Distribution
                </h2>
                <p className="text-sm text-gray-600">Current order statuses</p>
              </div>
            </div>

            {orderStatusDistribution.length > 0 ? (
              <div className="space-y-4">
                {orderStatusDistribution.map((item) => {
                  const total = orderStatusDistribution.reduce(
                    (sum, i) => sum + i.count,
                    0
                  );
                  const percentage =
                    total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
                  return (
                    <div key={item._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          {getStatusLabel(item._id)}
                        </span>
                        <span className="font-medium">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item._id === "delivered"
                              ? "bg-green-500"
                              : item._id === "shipped"
                              ? "bg-blue-500"
                              : item._id === "processing"
                              ? "bg-yellow-500"
                              : item._id === "pending"
                              ? "bg-orange-500"
                              : item._id === "confirmed"
                              ? "bg-purple-500"
                              : "bg-gray-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No order data available</p>
              </div>
            )}
          </div>

          {/* Payment Method Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment Methods
                </h2>
                <p className="text-sm text-gray-600">
                  Distribution by payment type
                </p>
              </div>
            </div>

            {paymentMethodDistribution.length > 0 ? (
              <div className="space-y-4">
                {paymentMethodDistribution.map((item) => {
                  const total = paymentMethodDistribution.reduce(
                    (sum, i) => sum + i.count,
                    0
                  );
                  const percentage =
                    total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
                  const methodLabels = {
                    cod: "Cash on Delivery",
                    card: "Credit Card",
                    edinar: "E-Dinar",
                    mobile: "Mobile Money",
                    bank: "Bank Transfer",
                  };
                  return (
                    <div key={item._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          {methodLabels[item._id] || item._id}
                        </span>
                        <span className="font-medium">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item._id === "card"
                              ? "bg-blue-500"
                              : item._id === "cod"
                              ? "bg-green-500"
                              : item._id === "edinar"
                              ? "bg-purple-500"
                              : "bg-gray-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No payment data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Top Selling Products
                </h2>
                <p className="text-sm text-gray-600">By revenue this month</p>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700">
                View All
              </button>
            </div>

            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product._id || index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {product.sales} units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {product.revenue}
                      </p>
                      <p className="text-sm text-gray-600">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No product data available</p>
              </div>
            )}
          </div>

          {/* Low Stock Alerts + Quick Actions */}
          <div className="space-y-6">
            {/* Low Stock Products */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Low Stock Alerts
                </h2>
              </div>

              {lowStockProducts.length > 0 ? (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {lowStockProducts.slice(0, 5).map((product, index) => (
                    <div
                      key={product._id || index}
                      className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          Stock: {product.stock || 0}
                        </p>
                      </div>
                      <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                        Reorder Soon
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-green-600">
                    ✅ All products have sufficient stock
                  </p>
                </div>
              )}
              {lowStockProducts.length > 5 && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  +{lowStockProducts.length - 5} more low stock items
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors">
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Add New Product</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">Process Orders</span>
                  {recentOrders.filter((o) => o.status === "pending").length >
                    0 && (
                    <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {
                        recentOrders.filter((o) => o.status === "pending")
                          .length
                      }
                    </span>
                  )}
                </button>

                <button className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">View Customers</span>
                </button>

                <button className="w-full flex items-center gap-3 p-3 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Generate Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        {recentOrders.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <p className="text-sm text-gray-600">
                  Latest {recentOrders.length} orders
                </p>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.slice(0, 10).map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4">
                        <span className="font-medium text-gray-900">
                          #{order.id}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-gray-700">{order.customer}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-gray-700">{order.date}</span>
                      </td>
                      <td className="py-4">
                        <span className="font-medium text-gray-900">
                          {order.amount}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
