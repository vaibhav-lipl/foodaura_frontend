import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin.api';
import Card from '../../components/common/Card';
import MetricCard from '../../components/common/MetricCard';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import { Users, Store, ShoppingCart, UtensilsCrossed, Star, TrendingUp, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} onClose={() => setError('')} />;
  }

  if (!dashboardData) {
    return null;
  }

  const { overview, today, usersByRole, recentOrders } = dashboardData;

  return (
    <div className="admin-dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">System-wide overview and statistics</p>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="metrics-grid">
        <MetricCard
          title="Total Users"
          value={overview.totalUsers}
          icon={Users}
          trend={{ value: `${overview.activeUsers} Active`, positive: true }}
          color="primary"
          link="/admin/users"
        />
        <MetricCard
          title="Total Restaurants"
          value={overview.totalRestaurants}
          icon={Store}
          trend={{ value: `${overview.activeRestaurants} Active`, positive: true }}
          color="success"
          link="/admin/restaurants"
        />
        <MetricCard
          title="Total Orders"
          value={overview.totalOrders}
          icon={ShoppingCart}
          trend={{ value: `${today.orders} Today`, positive: true }}
          color="warning"
          link="/admin/orders"
        />
        <MetricCard
          title="Total Menus"
          value={overview.totalMenus}
          icon={UtensilsCrossed}
          color="info"
          link="/admin/menus"
        />
        <MetricCard
          title="Total Reviews"
          value={overview.totalReviews}
          icon={Star}
          color="primary"
          link="/admin/reviews"
        />
        <MetricCard
          title="Open Restaurants"
          value={overview.openRestaurants}
          icon={Store}
          color="success"
        />
      </div>

      {/* Today's Stats */}
      <div className="dashboard-section">
        <Card>
          <div className="section-header">
            <h2 className="section-title">Today's Activity</h2>
            <Clock size={20} className="section-icon" />
          </div>
          <div className="today-stats">
            <div className="today-stat-item">
              <span className="stat-label">Orders</span>
              <span className="stat-value">{today.orders}</span>
            </div>
            <div className="today-stat-item">
              <span className="stat-label">Revenue</span>
              <span className="stat-value">{formatCurrency(today.revenue)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Users by Role */}
      <div className="dashboard-section">
        <Card>
          <div className="section-header">
            <h2 className="section-title">Users by Role</h2>
            <Users size={20} className="section-icon" />
          </div>
          <div className="role-stats">
            {usersByRole.map((roleStat) => (
              <div key={roleStat.role} className="role-stat-item">
                <span className="role-label">{roleStat.role.replace('_', ' ').toUpperCase()}</span>
                <span className="role-value">{roleStat.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      {recentOrders && recentOrders.length > 0 && (
        <div className="dashboard-section">
          <Card>
            <div className="section-header">
              <h2 className="section-title">Recent Orders</h2>
              <ShoppingCart size={20} className="section-icon" />
            </div>
            <div className="recent-orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Restaurant</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.restaurant?.name || 'N/A'}</td>
                      <td>{order.customerName || 'N/A'}</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>
                        <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

