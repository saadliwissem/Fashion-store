import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/common/LoadingSpinner";
import "./App.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { MysteryProvider } from "./context/MysteryContext";
import socketService from "./services/socket";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

const Shop = lazy(() => import("./pages/Shop"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

// Admin imports - E-commerce
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const OrdersManagement = lazy(() =>
  import("./pages/admin/orders/OrdersManagement")
);
const Categories = lazy(() => import("./pages/admin/Categories"));
const Inventory = lazy(() => import("./pages/admin/Inventory"));
const Customers = lazy(() => import("./pages/admin/Customers"));

// Admin imports - Enigma Platform
const EnigmasManagement = lazy(() =>
  import("./pages/admin/enigmas/EnigmasManagement")
);
const ChroniclesManagement = lazy(() =>
  import("./pages/admin/chronicles/ChroniclesManagement")
);
const FragmentsManagement = lazy(() =>
  import("./pages/admin/fragments/FragmentsManagement")
);
const ClaimsManagement = lazy(() =>
  import("./pages/admin/claims/ClaimsManagement")
);
const WaitlistManagement = lazy(() =>
  import("./pages/admin/waitlist/WaitlistManagement")
);

// Modal components (lazy loaded)
const EnigmaModal = lazy(() => import("./pages/admin/enigmas/EnigmaModal"));
const ChronicleModal = lazy(() =>
  import("./pages/admin/chronicles/ChronicleModal")
);
const FragmentModal = lazy(() =>
  import("./pages/admin/fragments/FragmentModal")
);
const ClaimDetailsModal = lazy(() =>
  import("./pages/admin/claims/ClaimDetailsModal")
);
const ClaimStatusModal = lazy(() =>
  import("./pages/admin/claims/ClaimStatusModal")
);
const WaitlistDetailsModal = lazy(() =>
  import("./pages/admin/waitlist/WaitlistDetailsModal")
);
const WaitlistNotifyModal = lazy(() =>
  import("./pages/admin/waitlist/WaitlistNotifyModal")
);

import AdminRoute from "./components/common/AdminRoute";
import TestConnection from "./components/TestConnection";
import PublicRoute from "./components/common/PublicRoute";
import Profile from "./pages/Profile";

const GoogleCallback = lazy(() => import("./pages/GoogleCallback"));
const Orders = lazy(() => import("./components/orders/OrdersList"));
const OrderDetails = lazy(() => import("./components/orders/OrderDetails"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Mystery pages
const EnigmasPage = lazy(() => import("./pages/EnigmasPage"));
const EnigmaDetailPage = lazy(() => import("./pages/EnigmaDetailPage"));
const ChronicleDetailPage = lazy(() => import("./pages/ChronicleDetailPage"));

function App() {
  useEffect(() => {
    // Connect to socket when app loads
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MysteryProvider>
              <Router>
                <Layout>
                  <Suspense
                    fallback={
                      <div className="min-h-screen flex items-center justify-center">
                        <LoadingSpinner size="large" color="gold" />
                      </div>
                    }
                  >
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route
                        path="/test-connection"
                        element={<TestConnection />}
                      />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/mysteries" element={<EnigmasPage />} />
                      <Route
                        path="/enigmas/:id"
                        element={<EnigmaDetailPage />}
                      />
                      <Route
                        path="/enigmas/:enigmaId/chronicles/:chronicleId"
                        element={<ChronicleDetailPage />}
                      />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route
                        path="/product/slug/:slug"
                        element={<ProductDetails />}
                      />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />

                      {/* Auth Routes */}
                      <Route
                        path="/login"
                        element={
                          <PublicRoute>
                            <Login />
                          </PublicRoute>
                        }
                      />
                      <Route
                        path="/register"
                        element={
                          <PublicRoute>
                            <Register />
                          </PublicRoute>
                        }
                      />
                      <Route
                        path="/auth/google/callback"
                        element={<GoogleCallback />}
                      />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                      />

                      {/* User Routes */}
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/orders/:id" element={<OrderDetails />} />
                      <Route path="/wishlist" element={<Wishlist />} />

                      {/* Admin Routes - E-commerce */}
                      <Route
                        path="/admin"
                        element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/products"
                        element={
                          <AdminRoute>
                            <AdminProducts />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/products/new"
                        element={
                          <AdminRoute>
                            <AdminProducts />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/products/categories"
                        element={
                          <AdminRoute>
                            <Categories />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/products/inventory"
                        element={
                          <AdminRoute>
                            <Inventory />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/orders"
                        element={
                          <AdminRoute>
                            <OrdersManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/orders/pending"
                        element={
                          <AdminRoute>
                            <OrdersManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/orders/processing"
                        element={
                          <AdminRoute>
                            <OrdersManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/orders/completed"
                        element={
                          <AdminRoute>
                            <OrdersManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/customers"
                        element={
                          <AdminRoute>
                            <Customers />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/analytics"
                        element={
                          <AdminRoute>
                            <div>Analytics Dashboard (Coming Soon)</div>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/analytics/sales"
                        element={
                          <AdminRoute>
                            <div>Sales Analytics (Coming Soon)</div>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/analytics/traffic"
                        element={
                          <AdminRoute>
                            <div>Traffic Analytics (Coming Soon)</div>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/analytics/products"
                        element={
                          <AdminRoute>
                            <div>Product Analytics (Coming Soon)</div>
                          </AdminRoute>
                        }
                      />

                      {/* Admin Routes - Enigma Platform */}
                      <Route
                        path="/admin/enigmas"
                        element={
                          <AdminRoute>
                            <EnigmasManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/enigmas/featured"
                        element={
                          <AdminRoute>
                            <EnigmasManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/enigmas/stats"
                        element={
                          <AdminRoute>
                            <EnigmasManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/enigmas/new"
                        element={
                          <AdminRoute>
                            <EnigmaModal
                              mode="add"
                              isOpen={true}
                              onClose={() => window.history.back()}
                            />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/enigmas/:id/edit"
                        element={
                          <AdminRoute>
                            <EnigmaModal
                              mode="edit"
                              isOpen={true}
                              onClose={() => window.history.back()}
                            />
                          </AdminRoute>
                        }
                      />

                      <Route
                        path="/admin/chronicles"
                        element={
                          <AdminRoute>
                            <ChroniclesManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/chronicles/production"
                        element={
                          <AdminRoute>
                            <ChroniclesManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/chronicles/waitlists"
                        element={
                          <AdminRoute>
                            <ChroniclesManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/chronicles/new"
                        element={
                          <AdminRoute>
                            <ChronicleModal
                              mode="add"
                              isOpen={true}
                              onClose={() => window.history.back()}
                            />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/chronicles/:id/edit"
                        element={
                          <AdminRoute>
                            <ChronicleModal
                              mode="edit"
                              isOpen={true}
                              onClose={() => window.history.back()}
                            />
                          </AdminRoute>
                        }
                      />

                      <Route
                        path="/admin/fragments"
                        element={
                          <AdminRoute>
                            <FragmentsManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/fragments/rarity"
                        element={
                          <AdminRoute>
                            <FragmentsManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/fragments/claimed"
                        element={
                          <AdminRoute>
                            <FragmentsManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/fragments/new"
                        element={
                          <AdminRoute>
                            <FragmentModal
                              mode="add"
                              isOpen={true}
                              onClose={() => window.history.back()}
                            />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/fragments/:id/edit"
                        element={
                          <AdminRoute>
                            <FragmentModal
                              mode="edit"
                              isOpen={true}
                              onClose={() => window.history.back()}
                            />
                          </AdminRoute>
                        }
                      />

                      <Route
                        path="/admin/claims"
                        element={
                          <AdminRoute>
                            <ClaimsManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/claims/pending"
                        element={
                          <AdminRoute>
                            <ClaimsManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/claims/processing"
                        element={
                          <AdminRoute>
                            <ClaimsManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/claims/shipped"
                        element={
                          <AdminRoute>
                            <ClaimsManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/claims/delivered"
                        element={
                          <AdminRoute>
                            <ClaimsManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/claims/:id"
                        element={
                          <AdminRoute>
                            <ClaimDetailsModal
                              isOpen={true}
                              onClose={() => window.history.back()}
                            />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/claims/:id/status"
                        element={
                          <AdminRoute>
                            <ClaimStatusModal
                              isOpen={true}
                              onClose={() => window.history.back()}
                            />
                          </AdminRoute>
                        }
                      />

                      <Route
                        path="/admin/waitlist"
                        element={
                          <AdminRoute>
                            <WaitlistManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/waitlist/active"
                        element={
                          <AdminRoute>
                            <WaitlistManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/waitlist/notified"
                        element={
                          <AdminRoute>
                            <WaitlistManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/waitlist/fulfilled"
                        element={
                          <AdminRoute>
                            <WaitlistManagement />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/waitlist/:id"
                        element={
                          <AdminRoute>
                            <WaitlistDetailsModal
                              isOpen={true}
                              onClose={() => window.history.back()}
                            />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/waitlist/notify"
                        element={
                          <AdminRoute>
                            <WaitlistNotifyModal
                              isOpen={true}
                              onClose={() => window.history.back()}
                            />
                          </AdminRoute>
                        }
                      />

                      {/* Settings Routes */}
                      <Route
                        path="/admin/settings"
                        element={
                          <AdminRoute>
                            <div>General Settings (Coming Soon)</div>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/settings/payment"
                        element={
                          <AdminRoute>
                            <div>Payment Settings (Coming Soon)</div>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/settings/shipping"
                        element={
                          <AdminRoute>
                            <div>Shipping Settings (Coming Soon)</div>
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/settings/notifications"
                        element={
                          <AdminRoute>
                            <div>Notification Settings (Coming Soon)</div>
                          </AdminRoute>
                        }
                      />

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </Layout>
              </Router>
            </MysteryProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
