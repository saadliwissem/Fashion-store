import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/common/LoadingSpinner";
import "./App.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

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
//admin imports
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const OrdersManagement = lazy(() =>
  import("./pages/admin/orders/OrdersManagement")
);
const Categories = lazy(() => import("./pages/admin/Categories"));
const Inventory = lazy(() => import("./pages/admin/Inventory"));
const Customers = lazy(() => import("./pages/admin/Customers"));

import AdminRoute from "./components/common/AdminRoute";
import TestConnection from "./components/TestConnection";
import PublicRoute from "./components/common/PublicRoute";
import Profile from "./pages/Profile";
const GoogleCallback = lazy(() => import("./pages/GoogleCallback"));

// const Dashboard = lazy(() => import("./pages/Dashboard"));
const Orders = lazy(() => import("./components/orders/OrdersList"));
const OrderDetails = lazy(() => import("./components/orders/OrderDetails"));

const Wishlist = lazy(() => import("./pages/Wishlist"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Layout>
                <Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <LoadingSpinner size="large" color="purple" />
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route
                      path="/test-connection"
                      element={<TestConnection />}
                    />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route
                      path="/product/slug/:slug"
                      element={<ProductDetails />}
                    />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
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
                          {" "}
                          <Register />{" "}
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
                    {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="*" element={<NotFound />} />
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
                      path="/admin/orders"
                      element={
                        <AdminRoute>
                          <OrdersManagement />
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
                          <Orders />
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
                      path="/admin/products"
                      element={
                        <AdminRoute>
                          <AdminProducts />
                        </AdminRoute>
                      }
                    />
                    // Also add other admin sub-routes for products
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
                          <div>Inventory Management Page</div>
                        </AdminRoute>
                      }
                    />
                  </Routes>
                </Suspense>
              </Layout>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
