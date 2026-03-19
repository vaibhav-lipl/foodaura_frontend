import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';

// Auth pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';

// Dashboard
import Dashboard from '../pages/dashboard/Dashboard';

// Orders
import Orders from '../pages/orders/Orders';
import OrderDetail from '../pages/orders/OrderDetail';

// Menu
import Menu from '../pages/menu/Menu';

// Restaurant
import RestaurantProfile from '../pages/restaurant/RestaurantProfile';
import RestaurantSchedule from '../pages/restaurant/RestaurantSchedule';
import RestaurantOffers from '../pages/restaurant/RestaurantOffers';
import RestaurantStatistics from '../pages/restaurant/RestaurantStatistics';

// Statistics
import Statistics from '../pages/statistics/Statistics';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProfile from '../pages/admin/AdminProfile';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminRestaurants from '../pages/admin/AdminRestaurants';
import AdminDeliveryPartners from '../pages/admin/AdminDeliveryPartners';
import AdminDeliveryPartnerDetails from '../pages/admin/AdminDeliveryPartnerDetails';
import AdminFaqs from '../pages/admin/AdminFaqs';
import AdminSupportTickets from '../pages/admin/AdminSupportTickets';

const AppRoutes = () => {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />
          ) : (
            <Signup />
          )
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Layout>
              <AdminProfile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Layout>
              <AdminSettings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Layout>
              <AdminUsers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/restaurants"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Layout>
              <AdminRestaurants />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/menus"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Layout>
              <Menu />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/delivery-partners"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Layout>
              <AdminDeliveryPartners />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/delivery-partners/:id"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Layout>
              <AdminDeliveryPartnerDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Layout>
              <Orders />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/:id"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Layout>
              <OrderDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/faqs"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Layout>
              <AdminFaqs />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/support-tickets"
        element={
          <ProtectedRoute requireAdmin={true}>
            <Layout>
              <AdminSupportTickets />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* Restaurant Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireRestaurant={true}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute requireRestaurant={true}>
            <Layout>
              <Orders />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute requireRestaurant={true}>
            <Layout>
              <OrderDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <ProtectedRoute requireRestaurant={true}>
            <Layout>
              <Menu />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant"
        element={
          <ProtectedRoute requireRestaurant={true}>
            <Layout>
              <RestaurantProfile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/schedule"
        element={
          <ProtectedRoute requireRestaurant={true}>
            <Layout>
              <RestaurantSchedule />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/offers"
        element={
          <ProtectedRoute requireRestaurant={true}>
            <Layout>
              <RestaurantOffers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <ProtectedRoute requireRestaurant={true}>
            <Layout>
              <RestaurantStatistics />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
