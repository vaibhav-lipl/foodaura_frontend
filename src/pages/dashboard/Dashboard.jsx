import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, ShoppingCart, ArrowRight } from 'lucide-react';
import { dashboardAPI } from '../../api/dashboard.api';
import MetricCard from '../../components/common/MetricCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import { formatCurrency, formatDateTime } from '../../utils/format';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [toggling, setToggling] = useState(false);

  useToastNotifications({
    error,
    success,
    setError: dashboardData ? setError : undefined,
    setSuccess,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await dashboardAPI.getDashboard();
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

  const handleToggleStatus = async () => {
    try {
      setToggling(true);
      setError('');
      setSuccess('');
      const response = await dashboardAPI.toggleRestaurantStatus();
      if (response.success) {
        setDashboardData((prev) => ({
          ...prev,
          restaurant: response.data.restaurant,
        }));
        setSuccess(`Restaurant ${response.data.restaurant?.isOpen ? 'opened' : 'closed'} successfully`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle restaurant status');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" />
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert type="error" message={error} />
        <Button onClick={fetchDashboard} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const { restaurant, todayStats, recentOrders } = dashboardData || {};

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, {restaurant?.name || 'Restaurant Owner'}
          </p>
        </div>

        <div className="header-actions">
          <div className="status-badge-wrapper">
            <span className="status-label">Status:</span>
            <span className={`status-badge ${restaurant?.isOpen ? 'open' : 'closed'}`}>
              {restaurant?.isOpen ? '🟢 Open' : '🔴 Closed'}
            </span>
          </div>
          <Button
            onClick={handleToggleStatus}
            loading={toggling}
            variant={restaurant?.isOpen ? 'danger' : 'success'}
          >
            {restaurant?.isOpen ? 'Close Restaurant' : 'Open Restaurant'}
          </Button>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard
          title="Today's Sales"
          value={formatCurrency(todayStats?.sales || 0)}
          icon={DollarSign}
          color="primary"
          className='text-center'
        />
        <MetricCard
          title="Today's Earnings"
          value={formatCurrency(todayStats?.earnings || 0)}
          icon={TrendingUp}
          color="success"
          className='text-center'
        />
        <MetricCard
          title="Today's Orders"
          value={todayStats?.orders || 0}
          icon={ShoppingCart}
          color="info"
          className='text-center'
          link="/orders?filter=today"
        />
      </div>

      <Card title="Recent Orders" actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
            View All
            <ArrowRight size={16} />
          </Button>
      }>
        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Order #
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200">
                    <td className="py-4 px-4 text-sm text-textPrimary font-bold">
                      {order.orderNumber}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700 font-medium">{order.customerName}</td>
                    <td className="py-4 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-primary">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 font-medium text-lg">No recent orders</p>
            <p className="text-gray-500 text-sm mt-2">Orders will appear here once customers start ordering</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
