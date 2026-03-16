import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { ordersAPI } from '../../api/orders.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import { formatCurrency, formatDateTime } from '../../utils/format';
import { useAuth } from '../../store/AuthContext';
import { Toaster, toast } from 'react-hot-toast';

import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isRestaurant } = useAuth();
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10,
  });
  const getStatusOptions = (order) => {
    if (!isRestaurant || !order) return [];

    const currentStatus = order.status?.toLowerCase();

    switch (currentStatus) {
      case 'pending':
        return [{ value: 'confirmed', label: 'Confirmed' }];

      case 'confirmed':
        return [{ value: 'preparing', label: 'Preparing' }];

      case 'preparing':
        return [{ value: 'ready', label: 'Ready' }];

      case 'assigned':
        return [{ value: 'preparing', label: 'Preparing' }, { value: 'ready', label: 'Ready' }];

      default:
        return [];
    }
  };


  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filters.status, filters.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;

      const response = await ordersAPI.getAllOrders(params);
      if (response.success) {
        setOrders(response.data.orders || []);
        setPagination(response.pagination);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleInlineStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await ordersAPI.updateOrderStatus(orderId, newStatus);

      if (response.success) {
        toast.success('Order status updated successfully');
        setOrders(prev =>
          prev.map(o =>
            o.id === orderId
              ? { ...o, status: response.data.order.status }
              : o
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };


  const handleStatusFilter = (e) => {
    setFilters({ ...filters, status: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatStatusLabel = (status) => {
    if (!status) return '';

    return status
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };


  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'ready', label: 'Ready' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'On the Way' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="orders-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">Manage and track all orders</p>
        </div>
      </div>

      <>
        <Toaster position="top-right" reverseOrder={false} />
        {/* rest of app */}
      </>


      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Filters */}
      <Card>
        <div className="filters-grid">
          <Select
            label="Filter by Status"
            name="status"
            value={filters.status}
            onChange={handleStatusFilter}
            options={statusOptions}
          />
        </div>
      </Card>

      {/* Orders Table */}
      <Card title={`Orders (${pagination?.total || 0})`}>
        {loading ? (
          <div className="loading-container">
            <Loading size="lg" />
          </div>
        ) : orders.length > 0 ? (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-semibold">{order.orderNumber}</td>
                      <td>
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-secondary">{order.customerPhone}</div>
                        </div>
                      </td>
                      <td>
                        {isRestaurant && getStatusOptions(order).length > 0 ? (
                          <Select
                            value={order.status}
                            onChange={(e) =>
                              handleInlineStatusUpdate(order.id, e.target.value)
                            }
                            options={[
                              { value: order.status, label: formatStatusLabel(order.status) },
                              ...getStatusOptions(order).map(s => ({
                                value: s.value,
                                label: formatStatusLabel(s.value)
                              }))
                            ]}

                          />
                        ) : (
                          <StatusBadge status={order.status} />
                        )}
                      </td>

                      <td>
                        <StatusBadge status={order.paymentStatus} type="payment" />
                      </td>
                      <td className="font-semibold text-primary">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="text-secondary">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td>
                        {isRestaurant ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            View
                            <ArrowRight size={14} />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                          >
                            View
                            <ArrowRight size={14} />
                          </Button>
                        )
                        }

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="pagination">
                <div className="pagination-info">
                  <span>
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} results
                  </span>
                </div>
                <div className="pagination-controls">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <span className="pagination-page">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders found</h3>
            <p>Orders will appear here once customers start placing orders.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Orders;
