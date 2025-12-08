import React from "react";
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
} from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";

const Dashboard = () => {
  // Mock data - in real app, fetch from API
  const stats = [
    {
      title: "Total Revenue",
      value: "45,231.89 DT",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Total Orders",
      value: "2,351",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingBag,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Total Customers",
      value: "3,245",
      change: "+5.2%",
      trend: "up",
      icon: Users,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Products Sold",
      value: "8,932",
      change: "-2.1%",
      trend: "down",
      icon: Package,
      color: "from-amber-500 to-orange-600",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "Ahmed Ben Ali",
      date: "2024-12-01",
      amount: "149.99 DT",
      status: "Delivered",
    },
    {
      id: "#ORD-002",
      customer: "Fatima Khaled",
      date: "2024-12-01",
      amount: "89.99 DT",
      status: "Processing",
    },
    {
      id: "#ORD-003",
      customer: "Mohamed Said",
      date: "2024-11-30",
      amount: "234.50 DT",
      status: "Pending",
    },
    {
      id: "#ORD-004",
      customer: "Leila Mansour",
      date: "2024-11-30",
      amount: "67.99 DT",
      status: "Delivered",
    },
    {
      id: "#ORD-005",
      customer: "Youssef Hamdi",
      date: "2024-11-29",
      amount: "189.99 DT",
      status: "Processing",
    },
  ];

  const topProducts = [
    { name: "Premium Cotton T-Shirt", sales: 234, revenue: "4,212.66 DT" },
    { name: "Designer Denim Jacket", sales: 189, revenue: "16,991.11 DT" },
    { name: "Casual Hoodie", sales: 167, revenue: "8,349.33 DT" },
    { name: "Slim Fit Jeans", sales: 145, revenue: "8,699.55 DT" },
    { name: "Floral Maxi Dress", sales: 128, revenue: "8,959.72 DT" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
              <p className="opacity-90">
                Here's what's happening with your store today.
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
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
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Revenue Overview
                </h2>
                <p className="text-sm text-gray-600">Last 30 days</p>
              </div>
              <button className="text-sm text-purple-600 hover:text-purple-700">
                View Details
              </button>
            </div>

            {/* Chart Placeholder */}
            <div className="h-64 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Revenue chart will appear here</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <p className="text-sm text-gray-600">Latest 5 orders</p>
              </div>
              <button className="text-sm text-purple-600 hover:text-purple-700">
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
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="py-4">
                        <span className="font-medium text-gray-900">
                          {order.id}
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
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
              <button className="text-sm text-purple-600 hover:text-purple-700">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
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
                    <p className="font-bold text-gray-900">{product.revenue}</p>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Quick Actions
            </h2>

            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors">
                <Package className="w-5 h-5" />
                <span className="font-medium">Add New Product</span>
              </button>

              <button className="w-full flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Process Orders</span>
              </button>

              <button className="w-full flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors">
                <Users className="w-5 h-5" />
                <span className="font-medium">View Customers</span>
              </button>

              <button className="w-full flex items-center gap-3 p-4 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Generate Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
