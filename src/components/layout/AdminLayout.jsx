import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Home,
  Puzzle,
  BookOpen,
  Layers,
  Ticket,
  Clock,
  Sparkles,
  Globe,
  Star,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    ecommerce: true,
    enigma: true,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Navigation items organized by section
  const navSections = [
    {
      id: "ecommerce",
      title: "E-Commerce",
      icon: Package,
      items: [
        {
          name: "Dashboard",
          path: "/admin",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          name: "Products",
          path: "/admin/products",
          icon: Package,
          subItems: [
            { name: "All Products", path: "/admin/products" },
            { name: "Add New", path: "/admin/products/new" },
            { name: "Categories", path: "/admin/products/categories" },
            { name: "Inventory", path: "/admin/products/inventory" },
          ],
        },
        {
          name: "Orders",
          path: "/admin/orders",
          icon: ShoppingCart,
          subItems: [
            { name: "All Orders", path: "/admin/orders" },
            { name: "Pending", path: "/admin/orders/pending" },
            { name: "Processing", path: "/admin/orders/processing" },
            { name: "Completed", path: "/admin/orders/completed" },
          ],
        },
        {
          name: "Customers",
          path: "/admin/customers",
          icon: Users,
        },
        {
          name: "Analytics",
          path: "/admin/analytics",
          icon: BarChart3,
          subItems: [
            { name: "Sales", path: "/admin/analytics/sales" },
            { name: "Traffic", path: "/admin/analytics/traffic" },
            { name: "Products", path: "/admin/analytics/products" },
          ],
        },
      ],
    },
    {
      id: "enigma",
      title: "Puzzle Mysteries",
      icon: Puzzle,
      items: [
        {
          name: "Enigmas",
          path: "/admin/enigmas",
          icon: Globe,
          subItems: [
            { name: "All Enigmas", path: "/admin/enigmas" },
            { name: "Add New Enigma", path: "/admin/enigmas/new" },
            { name: "Featured", path: "/admin/enigmas/featured" },
            { name: "Stats", path: "/admin/enigmas/stats" },
          ],
        },
        {
          name: "Chronicles",
          path: "/admin/chronicles",
          icon: BookOpen,
          subItems: [
            { name: "All Chronicles", path: "/admin/chronicles" },
            { name: "Add New Chronicle", path: "/admin/chronicles/new" },
            { name: "Production Status", path: "/admin/chronicles/production" },
            { name: "Waitlists", path: "/admin/chronicles/waitlists" },
          ],
        },
        {
          name: "Fragments",
          path: "/admin/fragments",
          icon: Layers,
          subItems: [
            { name: "All Fragments", path: "/admin/fragments" },
            { name: "Add New Fragment", path: "/admin/fragments/new" },
            { name: "By Rarity", path: "/admin/fragments/rarity" },
            { name: "Claimed", path: "/admin/fragments/claimed" },
          ],
        },
        {
          name: "Claims",
          path: "/admin/claims",
          icon: Ticket,
          subItems: [
            { name: "All Claims", path: "/admin/claims" },
            { name: "Pending", path: "/admin/claims/pending" },
            { name: "Processing", path: "/admin/claims/processing" },
            { name: "Shipped", path: "/admin/claims/shipped" },
            { name: "Delivered", path: "/admin/claims/delivered" },
          ],
        },
        {
          name: "Waitlist",
          path: "/admin/waitlist",
          icon: Clock,
          subItems: [
            { name: "All Entries", path: "/admin/waitlist" },
            { name: "Active", path: "/admin/waitlist/active" },
            { name: "Notified", path: "/admin/waitlist/notified" },
            { name: "Fulfilled", path: "/admin/waitlist/fulfilled" },
          ],
        },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      items: [
        {
          name: "General",
          path: "/admin/settings",
          icon: Settings,
        },
        {
          name: "Payment",
          path: "/admin/settings/payment",
          icon: ShoppingCart,
        },
        {
          name: "Shipping",
          path: "/admin/settings/shipping",
          icon: Package,
        },
        {
          name: "Notifications",
          path: "/admin/settings/notifications",
          icon: Bell,
        },
      ],
    },
  ];

  // Flatten all items for page title lookup
  const allNavItems = navSections.flatMap((section) =>
    section.items.flatMap((item) => [item, ...(item.subItems || [])])
  );

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getCurrentPageTitle = () => {
    // Check exact matches first
    const exactMatch = allNavItems.find(
      (item) => item.exact && location.pathname === item.path
    );
    if (exactMatch) return exactMatch.name;

    // Then check starts with
    const match = allNavItems.find(
      (item) =>
        location.pathname.startsWith(item.path) && item.path !== "/admin"
    );
    if (match) return match.name;

    // Default to Dashboard
    return "Dashboard";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-gray-900">Admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full"></div>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:flex lg:flex-col lg:inset-y-0
        `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">DAR ENNAR Tunisia</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-4 space-y-4">
              {navSections.map((section) => {
                const SectionIcon = section.icon;
                const hasActiveItem = section.items.some(
                  (item) =>
                    isActive(item.path) ||
                    item.subItems?.some((sub) => isActive(sub.path))
                );

                return (
                  <div key={section.id} className="space-y-1">
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <SectionIcon className="w-4 h-4" />
                        <span>{section.title}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedSections[section.id] ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Section Items */}
                    {expandedSections[section.id] && (
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.path, item.exact);

                          return (
                            <div key={item.name} className="mb-1">
                              <Link
                                to={item.path}
                                className={`
                                  flex items-center gap-3 px-4 py-3 rounded-lg
                                  transition-colors
                                  ${
                                    active
                                      ? "bg-purple-50 text-purple-700"
                                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                  }
                                `}
                              >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium text-sm">
                                  {item.name}
                                </span>
                                {item.subItems && (
                                  <ChevronDown
                                    className={`w-4 h-4 ml-auto transition-transform ${
                                      active ? "rotate-180" : ""
                                    }`}
                                  />
                                )}
                              </Link>

                              {/* Sub Items */}
                              {item.subItems && active && (
                                <div className="ml-8 mt-1 space-y-1">
                                  {item.subItems.map((subItem) => (
                                    <Link
                                      key={subItem.name}
                                      to={subItem.path}
                                      className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                                        ${
                                          location.pathname === subItem.path
                                            ? "bg-purple-100 text-purple-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }
                                      `}
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                      {subItem.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Store</span>
            </Link>
            <Link
              to="/mysteries"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg mt-2"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">View Mysteries</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-lg mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen overflow-x-hidden">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-6">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  {getCurrentPageTitle()}
                </h1>
                <p className="text-gray-600 text-sm">
                  {location.pathname.startsWith("/admin/enigmas") &&
                    "Manage mystery collections"}
                  {location.pathname.startsWith("/admin/chronicles") &&
                    "Manage chronicles within enigmas"}
                  {location.pathname.startsWith("/admin/fragments") &&
                    "Manage individual fragments"}
                  {location.pathname.startsWith("/admin/claims") &&
                    "Track and manage fragment claims"}
                  {location.pathname.startsWith("/admin/waitlist") &&
                    "Monitor users waiting for chronicles"}
                  {location.pathname.startsWith("/admin/products") &&
                    "Manage your product catalog"}
                  {location.pathname.startsWith("/admin/orders") &&
                    "Process and track customer orders"}
                  {location.pathname === "/admin" &&
                    "Overview of your store and mysteries"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden lg:block">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search orders, products, mysteries..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none w-80"
                  />
                </div>

                {/* Notifications */}
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full"></div>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/admin/settings"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <Link
                        to="/"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        View Store
                      </Link>
                      <Link
                        to="/mysteries"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        View Mysteries
                      </Link>
                      <div className="border-t my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
