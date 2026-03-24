import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import StatusBadge from '../../components/common/StatusBadge';
import Loading from '../../components/common/Loading';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import { Search, Store, MapPin, Phone, Mail, ChefHat, ToggleLeft, ToggleRight } from 'lucide-react';
import './AdminRestaurants.css';

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    isActive: '',
    isOpen: '',
    search: '',
    page: 1,
    limit: 20,
  });

  useToastNotifications({ error, success, setError, setSuccess });

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getAllRestaurants(filters);
      if (response.success) {
        setRestaurants(response.data.restaurants || []);
      } else {
        setError('Failed to load restaurants');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handleToggleStatus = async (restaurantId, currentStatus) => {
    try {
      setError('');
      const response = await adminAPI.updateRestaurantStatus(restaurantId, {
        isActive: !currentStatus,
      });

      if (response.success) {
        setSuccess(`Restaurant ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchRestaurants();
      } else {
        setError(response.message || 'Failed to update restaurant status');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update restaurant status');
    }
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ];

  const openStatusOptions = [
    { value: '', label: 'All' },
    { value: 'true', label: 'Open' },
    { value: 'false', label: 'Closed' },
  ];

  if (loading && restaurants.length === 0) {
    return (
      <div className="loading-container">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="admin-restaurants-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Restaurant Management</h1>
          <p className="page-subtitle">Manage restaurants and their status</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <div className="filters-grid">
          <div className="filter-group">
            <Input
              label="Search"
              type="text"
              placeholder="Search by name, city, or cuisine..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <Select
              label="Active Status"
              name="isActive"
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              options={statusOptions}
            />
          </div>
          <div className="filter-group">
            <Select
              label="Open Status"
              name="isOpen"
              value={filters.isOpen}
              onChange={(e) => handleFilterChange('isOpen', e.target.value)}
              options={openStatusOptions}
            />
          </div>
        </div>
      </Card>

      {/* Restaurants Grid */}
      <div className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="restaurant-card">
            <div className="restaurant-card-header">
              <div className="restaurant-info">
                <div className="restaurant-icon">
                  <Store size={24} />
                </div>
                <div>
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  {restaurant.cuisineType && (
                    <div className="restaurant-cuisine">
                      <ChefHat size={14} />
                      <span>{restaurant.cuisineType}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="restaurant-statuses">
                <StatusBadge 
                  status={restaurant.isOpen}
                  type="restaurant"
                />
              </div>
            </div>

            {restaurant.description && (
              <p className="restaurant-description">{restaurant.description}</p>
            )}

            <div className="restaurant-details">
              {restaurant.address && (
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>
                    {restaurant.address}, {restaurant.city}, {restaurant.state} {restaurant.zipCode}
                  </span>
                </div>
              )}
              {restaurant.phone && (
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{restaurant.phone}</span>
                </div>
              )}
              {restaurant.email && (
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{restaurant.email}</span>
                </div>
              )}
            </div>

            <div className="restaurant-actions">
              <Button
                variant={restaurant.isActive ? 'danger' : 'success'}
                size="sm"
                onClick={() => handleToggleStatus(restaurant.id, restaurant.isActive)}
              >
                {restaurant.isActive ? (
                  <>
                    <ToggleLeft size={16} />
                    Deactivate
                  </>
                ) : (
                  <>
                    <ToggleRight size={16} />
                    Activate
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {restaurants.length === 0 && (
        <Card>
          <div className="empty-state">
            <Store size={48} />
            <h3>No restaurants found</h3>
            <p>Try adjusting your filters.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminRestaurants;

