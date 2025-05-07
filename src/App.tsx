import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css'

// Lazy load main pages
const Home = lazy(() => import('./pages/Home'));
const OurWaters = lazy(() => import('./pages/OurWaters'));
const Cart = lazy(() => import('./pages/Cart'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Privacy = lazy(() => import('./pages/Privacy'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboardPage = lazy(() => import('./pages/admin/Dashboard'));
// Placeholder admin pages (replace with actual pages if available)
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'));

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <Suspense fallback={<div style={{textAlign:'center',marginTop:'4rem',color:'#3074db',fontWeight:600,fontSize:'1.2rem'}}>Loading...</div>}>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="analytics" element={<AdminAnalytics />} />
                        <Route path="settings" element={<div>Settings</div>} />
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* Public/User Routes */}
              <Route
                path="/*"
                element={
                  <>
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/our-waters" element={<OurWaters />} />
                      <Route path="/product/:name" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <Footer />
                  </>
                }
              />
            </Routes>
          </Suspense>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
