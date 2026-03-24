import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../../api/restaurant.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import ImageUpload from '../../components/common/ImageUpload';
import Loading from '../../components/common/Loading';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import './RestaurantProfile.css';

const RestaurantProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    cuisineType: '',
  });
  const [restaurantImage, setRestaurantImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useToastNotifications({ error, success, setError, setSuccess });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await restaurantAPI.getProfile();
      
      // Handle different response structures
      // The API might return: { success: true, data: {...} } or just the data object
      let profile = null;
      
      if (response && typeof response === 'object') {
        // Check if response has success and data properties
        if (response.success !== undefined && response.data) {
          // Response structure: { success: true, data: {...} }
          profile = response.data.restaurant || response.data;
        } else if (response.name || response.id) {
          // Response is the restaurant object directly
          profile = response;
        } else if (response.data) {
          // Response structure: { data: {...} }
          profile = response.data.restaurant || response.data;
        }
      }
      
      if (profile) {
        setFormData({
          name: profile.name || '',
          description: profile.description || '',
          address: profile.address || '',
          city: profile.city || '',
          state: profile.state || '',
          zipCode: profile.zipCode || profile.zip || '',
          phone: profile.phone || '',
          email: profile.email || '',
          cuisineType: profile.cuisineType || '',
        });
        // Set current image URL for preview
        if (profile.imageUrl) {
          setCurrentImageUrl(profile.imageUrl);
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load restaurant profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const response = await restaurantAPI.updateProfile(formData, restaurantImage);
      if (response.success) {
        setSuccess('Restaurant profile updated successfully');
        // Update current image URL if new image was uploaded
        if (response.data?.restaurant?.imageUrl) {
          setCurrentImageUrl(response.data.restaurant.imageUrl);
        }
        // Clear the image file state after successful upload
        setRestaurantImage(null);
        // Optionally refresh the profile data
        // await fetchProfile();
      } else {
        setError('Failed to update restaurant profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update restaurant profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="restaurant-profile-page">
        <div className="loading-container">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-profile-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Restaurant Profile</h1>
          <p className="page-subtitle">Manage your restaurant information</p>
        </div>
        <div className="page-actions">
          <Link to="/restaurant/schedule">
            <Button variant="outline">Schedule</Button>
          </Link>
          <Link to="/restaurant/offers">
            <Button variant="outline">Offers</Button>
          </Link>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="form-grid">
              <Input
                label="Restaurant Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Pizza Palace"
                required
              />

              <Input
                label="Cuisine Type"
                name="cuisineType"
                value={formData.cuisineType}
                onChange={handleChange}
                placeholder="e.g., Italian"
              />
            </div>

            <div className="form-section-field">
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your restaurant"
                rows={4}
              />
            </div>

            <div className="form-section-field">
              <ImageUpload
                label="Restaurant Image"
                value={restaurantImage}
                onChange={setRestaurantImage}
                previewUrl={currentImageUrl}
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Contact Information</h3>
            <div className="form-grid">
              <Input
                label="Phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                required
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="info@restaurant.com"
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Address</h3>
            <div className="form-section-field">
              <Input
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="form-grid form-grid-three">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
                required
              />

              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="NY"
                required
              />

              <Input
                label="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="10001"
                required
              />
            </div>
          </div>

          <div className="form-footer">
            <Button type="submit" loading={submitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RestaurantProfile;
