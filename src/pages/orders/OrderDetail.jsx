import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { ordersAPI } from '../../api/orders.api';
import { useAuth } from '../../store/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Select from '../../components/common/Select';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import { formatCurrency, formatDateTime } from '../../utils/format';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isRestaurant } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState('');

  useToastNotifications({
    error,
    success,
    setError: order ? setError : undefined,
    setSuccess,
  });

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ordersAPI.getOrder(id);
      if (response.success) {
        setOrder(response.data.order);
        setStatus(response.data.order.status);
      } else {
        setError('Failed to load order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      setError('');
      setSuccess('');
      const response = await ordersAPI.updateOrderStatus(id, status);
      if (response.success) {
        setOrder(response.data.order);
        setSuccess('Order status updated successfully');
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loading size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <Alert type="error" message={error || 'Order not found'} />
        <Button onClick={() => navigate('/orders')} className="mt-4">
          <ArrowLeft size={16} />
          Back to Orders
        </Button>
      </div>
    );
  }

  const getStatusOptions = () => {
    const allStatuses = [
      { value: 'pending', label: 'Pending' },
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'assigned', label: 'Assigned' },
      { value: 'preparing', label: 'Preparing' },
      { value: 'ready', label: 'Ready' },
      { value: 'cancelled', label: 'Cancelled' },
    ];

    if (isRestaurant && order) {
      const restaurantAllowedStatuses = ['confirmed', 'preparing', 'ready'];
      const currentStatus = order.status?.toLowerCase();

      if (currentStatus === 'pending' || currentStatus === 'confirmed') {
        return allStatuses.filter(s =>
          restaurantAllowedStatuses.includes(s.value) && s.value !== 'pending'
        );
      }
      if (currentStatus === 'preparing') {
        return allStatuses.filter(s => s.value === 'ready');
      }
      if (currentStatus === 'assigned') {
        return allStatuses.filter(s => s.value === 'preparing' || s.value === 'ready');
      }
      if (currentStatus === 'ready') {
        return [];
      }
      return [];
    }

    return allStatuses;
  };

  const statusOptions = getStatusOptions();

  return (
    <div className="order-detail-page">
      <div className="page-header">
        <div>
          <Button variant="outline" onClick={() => navigate('/orders')} className="mb-4">
            <ArrowLeft size={16} />
            Back to Orders
          </Button>
          <h1 className="page-title">Order {order.orderNumber}</h1>
        </div>
      </div>

      <div className="order-detail-grid">
        <div className="order-detail-main">
          <Card title="Order Information">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Order Number</span>
                <span className="info-value">{order.orderNumber}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="info-item">
                <span className="info-label">Payment Status</span>
                <StatusBadge status={order.paymentStatus} type="payment" />
              </div>
              <div className="info-item">
                <span className="info-label">Payment Method</span>
                <span className="info-value capitalize">{order.paymentMethod}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Order Date</span>
                <span className="info-value">{formatDateTime(order.createdAt)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Restaurant Name</span>
                <span className="info-value">{order.restaurant?.name}</span>
              </div>
            </div>
          </Card>

          <Card title="Customer Information">
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{order.customerName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">{order.customerPhone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Address</span>
                <span className="info-value">{order.customerAddress}</span>
              </div>
            </div>
          </Card>

          <Card title="Order Items">
            <div className="order-items">
              {order.items?.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="order-item-info">
                    <h4 className="order-item-name">{item.menu?.name}</h4>
                    <p className="order-item-details">
                      Quantity: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="order-item-price">
                    {formatCurrency(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="order-detail-sidebar">
          <Card title="Order Summary">
            <div className="summary-list">
              <div className="summary-item">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="summary-item">
                <span>Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="summary-item">
                <span>Delivery Fee</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              {parseFloat(order.discount) > 0 && (
                <div className="summary-item discount">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </Card>

          {isRestaurant && statusOptions.length > 0 && (
            <Card title="Update Status">
              <div className="status-update-form">
                <Select
                  label="Order Status"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={statusOptions}
                />
                <Button
                  onClick={handleStatusUpdate}
                  loading={updating}
                  disabled={status === order.status}
                  className="status-update-button"
                >
                  <Save size={16} />
                  Update Status
                </Button>
              </div>
            </Card>
          )}

          {isRestaurant && statusOptions.length === 0 && (
            <Card title="Status Update">
              <div className="status-info">
                {order.status !== 'delivered' && (
                  <>
                    <p className="status-info-text">
                      This order is ready and waiting for delivery partner to pick up.
                    </p>
                    <p className="status-info-note">
                      Delivery partner will handle status updates from here.
                    </p>
                  </>
                )}

                {order.status === 'delivered' && (
                  <p className="status-info-text">
                    This order has been delivered to the customer.
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
