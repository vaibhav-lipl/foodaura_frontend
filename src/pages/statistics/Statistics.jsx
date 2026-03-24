import { useState, useEffect } from 'react';
import { statisticsAPI } from '../../api/statistics.api';
import Card from '../../components/common/Card';
import MetricCard from '../../components/common/MetricCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import { formatCurrency } from '../../utils/format';
import './Statistics.css';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of current month
    endDate: new Date().toISOString().split('T')[0], // Today
  });

  useToastNotifications({
    error,
    setError: stats ? setError : undefined,
  });

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };
      const response = await statisticsAPI.getStatistics(params);
      if (response.success) {
        setStats(response.data);
      } else {
        setError('Failed to load statistics55555');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loading size="lg" />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="error-container">
        <Alert type="error" message={error} />
        <Button onClick={fetchStatistics} className="retry-button">
          Retry
        </Button>
      </div>
    );
  }

  const { summary, ratings, mostSoldItems, ordersByStatus, dailySales } = stats || {};

  return (
    <div className="statistics-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Statistics</h1>
          <p className="page-subtitle">View your restaurant performance metrics</p>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <div className="date-filter-grid">
          <Input
            label="Start Date"
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
          />
          <Input
            label="End Date"
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
          />
          <div className="date-filter-button">
            <Button onClick={fetchStatistics} className="w-full">
              Apply Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Metrics */}
      {summary && (
        <div className="metrics-grid">
          <MetricCard
            title="Total Earnings"
            value={formatCurrency(summary.totalEarnings || 0)}
            icon={<span className="metric-icon">💵</span>}
          />
          <MetricCard
            title="Total Sales"
            value={formatCurrency(summary.totalSales || 0)}
            icon={<span className="metric-icon">💰</span>}
          />
          <MetricCard
            title="Total Orders"
            value={summary.totalOrders || 0}
            icon={<span className="metric-icon">📦</span>}
          />
          <MetricCard
            title="Average Rating"
            value={summary.averageRating ? summary.averageRating.toFixed(1) : '0.0'}
            icon={<span className="metric-icon">⭐</span>}
          />
          <MetricCard
            title="Total Reviews"
            value={summary.totalReviews || 0}
            icon={<span className="metric-icon">💬</span>}
          />
        </div>
      )}

      <div className="statistics-grid">
        {/* Ratings & Reviews */}
        {ratings && (
          <Card title="Ratings & Reviews">
            <div className="ratings-content">
              <div className="ratings-summary">
                <div className="ratings-average">
                  {ratings.average ? ratings.average.toFixed(1) : '0.0'}
                </div>
                <div className="ratings-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${
                        star <= Math.round(ratings.average) ? 'star-filled' : 'star-empty'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="ratings-count">
                  Based on {summary?.totalReviews || 0} reviews
                </p>
              </div>

              {ratings.distribution && (
                <div className="ratings-distribution">
                  <h4 className="distribution-title">Rating Distribution</h4>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="distribution-item">
                      <span className="distribution-label">
                        {rating} ★
                      </span>
                      <div className="distribution-bar-container">
                        <div
                          className="distribution-bar"
                          style={{
                            width: `${
                              ratings.distribution[rating]
                                ? (ratings.distribution[rating] / summary.totalReviews) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="distribution-count">
                        {ratings.distribution[rating] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {ratings.reviews && ratings.reviews.length > 0 && (
                <div className="reviews-section">
                  <h4 className="reviews-title">Recent Reviews</h4>
                  <div className="reviews-list">
                    {ratings.reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <p className="review-author">{review.customerName}</p>
                          <div className="review-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`review-star ${
                                  star <= review.rating ? 'star-filled' : 'star-empty'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        <p className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Most Sold Items */}
        {mostSoldItems && mostSoldItems.length > 0 && (
          <Card title="Most Sold Items">
            <div className="sold-items-list">
              {mostSoldItems.map((item, index) => (
                <div
                  key={item.menuId}
                  className="sold-item-card"
                >
                  <div className="sold-item-info">
                    <div className="sold-item-rank">
                      {index + 1}
                    </div>
                    <div>
                      <p className="sold-item-name">{item.menu?.name}</p>
                      <p className="sold-item-quantity">
                        {item.totalQuantity} sold
                      </p>
                    </div>
                  </div>
                  <div className="sold-item-revenue">
                    <p className="sold-item-revenue-value">
                      {formatCurrency(item.totalRevenue)}
                    </p>
                    <p className="sold-item-revenue-label">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="statistics-grid">
        {/* Orders by Status */}
        {ordersByStatus && ordersByStatus.length > 0 && (
          <Card title="Orders by Status">
            <div className="status-list">
              {ordersByStatus.map((statusItem) => (
                <div
                  key={statusItem.status}
                  className="status-item"
                >
                  <span className="status-label">
                    {statusItem.status}
                  </span>
                  <span className="status-count">{statusItem.count}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Daily Sales */}
        {dailySales && dailySales.length > 0 && (
          <Card title="Daily Sales">
            <div className="sales-list">
              {dailySales.slice(-7).map((day) => (
                <div
                  key={day.date}
                  className="sales-item"
                >
                  <div>
                    <p className="sales-date">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="sales-orders">{day.orders} orders</p>
                  </div>
                  <p className="sales-amount">
                    {formatCurrency(day.sales)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Statistics;
