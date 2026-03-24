import { useEffect, useState } from 'react';
import { restaurantAPI } from '../../api/restaurant.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import './RestaurantStatistics.css';

const RestaurantStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [range, setRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useToastNotifications({ error, setError });

  useEffect(() => {
    fetchStatistics();
  }, [range]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await restaurantAPI.getStatistics({ range });

      if (response.summary) {
        setStatistics(response);
      } else {
        setError('Failed to load statistics');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="restaurant-statistics-page">
        <div className="loading-container">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-statistics-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Statistics</h1>
          <p className="page-subtitle">Track your restaurant performance</p>
        </div>

        <div className="page-actions">
          <Button
            variant={range === 'today' ? 'primary' : 'outline'}
            onClick={() => setRange('today')}
          >
            Today
          </Button>
          <Button
            variant={range === 'week' ? 'primary' : 'outline'}
            onClick={() => setRange('week')}
          >
            Week
          </Button>
          <Button
            variant={range === 'month' ? 'primary' : 'outline'}
            onClick={() => setRange('month')}
          >
            Month
          </Button>
        </div>
      </div>

      {statistics && (
        <>
          {/* Summary Cards */}
          <div className="stats-grid">
            <Card>
              <h3>Total Orders</h3>
              <p className="stat-value">{statistics.summary.totalOrders}</p>
            </Card>

            <Card>
              <h3>Total Revenue</h3>
              <p className="stat-value">₹ {statistics.summary.totalRevenue}</p>
            </Card>

            <Card>
              <h3>Net Earnings</h3>
              <p className="stat-value">₹ {statistics.summary.netEarnings}</p>
            </Card>

            <Card>
              <h3>Avg Order Value</h3>
              <p className="stat-value">
                ₹ {statistics.summary.avgOrderValue?.toFixed(2)}
              </p>
            </Card>
          </div>

          {/* Order Breakdown */}
          <div className="stats-grid">
            <Card>
              <h3>Completed</h3>
              <p className="stat-value">
                {statistics.summary.completedOrders}
              </p>
            </Card>

            <Card>
              <h3>Cancelled</h3>
              <p className="stat-value">
                {statistics.summary.cancelledOrders}
              </p>
            </Card>

            <Card>
              <h3>Rejected</h3>
              <p className="stat-value">
                {statistics.summary.rejectedOrders}
              </p>
            </Card>
          </div>

          {/* Top Items */}
          <Card>
            <h3 className="section-title">Top Selling Items</h3>

            {statistics.topItems?.length === 0 && (
              <p className="no-data">No sales data available</p>
            )}

            <ul className="top-items-list">
              {statistics.topItems?.map((item, index) => (
                <li key={index} className="top-item">
                  <span>{item.menu?.name}</span>
                  <span>{item.totalSold} sold</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
};

export default RestaurantStatistics;
