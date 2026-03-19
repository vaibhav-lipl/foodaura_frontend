import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Phone, Home, UtensilsCrossed, MapPin, Building2, ChefHat, ArrowLeft, ArrowRight, Image } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import ImageUpload from '../../components/common/ImageUpload';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, setupRestaurant } = useAuth();
  const [step, setStep] = useState(1);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [restaurantFormData, setRestaurantFormData] = useState({
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
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateUserForm = () => {
    const newErrors = {};
    if (!userFormData.name) {
      newErrors.name = 'Full name is required';
    }
    if (!userFormData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userFormData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!userFormData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    if (!userFormData.password) {
      newErrors.password = 'Password is required';
    } else if (userFormData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRestaurantForm = () => {
    const newErrors = {};
    if (!restaurantFormData.name) {
      newErrors.name = 'Restaurant name is required';
    }
    if (!restaurantFormData.address) {
      newErrors.address = 'Address is required';
    }
    if (!restaurantFormData.city) {
      newErrors.city = 'City is required';
    }
    if (!restaurantFormData.state) {
      newErrors.state = 'State is required';
    }
    if (!restaurantFormData.zipCode) {
      newErrors.zipCode = 'Zip code is required';
    }
    if (!restaurantFormData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    if (!restaurantFormData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(restaurantFormData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const handleRestaurantFormChange = (e) => {
    const { name, value } = e.target;
    setRestaurantFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!validateUserForm()) return;

    setLoading(true);
    setApiError('');

    const result = await signup(userFormData);

    if (result.success) {
      // Pre-fill restaurant email and phone from user data
      setRestaurantFormData(prev => ({
        ...prev,
        email: userFormData.email,
        phone: userFormData.phone,
      }));
      setStep(2);
    } else {
      setApiError(result.message || 'Signup failed. Please try again.');
    }

    setLoading(false);
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    if (!validateRestaurantForm()) return;

    setLoading(true);
    setApiError('');

    const result = await setupRestaurant(restaurantFormData, restaurantImage);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiError(result.message || 'Restaurant setup failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-bg-pattern"></div>
        <div className="auth-bg-gradient"></div>
      </div>
      
      <div className="auth-container">
        <div className="auth-card">
          {/* <Link to="/" className="back-to-home">
            <Home size={18} />
            <span>Back to Home</span>
          </Link> */}
          
          <div className="auth-header">
            <div className="auth-logo">
                {/* <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="8" fill="url(#auth-logo-gradient)" />
                  <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M16 14L16 24" stroke="white" strokeWidth="2" />
                  <path d="M8 12L16 16L24 12" stroke="white" strokeWidth="2" />
                  <defs>
                    <linearGradient id="auth-logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#e12364" />
                      <stop offset="1" stopColor="#c91a5a" />
                    </linearGradient>
                  </defs>
                </svg> */}
              <img src="/foodaura_logo.png" alt="FoodAura Logo" className="logo-image logo-icon" />
            </div>
            <h1 className="auth-title">
              {step === 1 ? 'Create Account' : 'Restaurant Setup'}
            </h1>
            <p className="auth-subtitle">
              {step === 1 
                ? 'Step 1 of 2: Enter your personal details' 
                : 'Step 2 of 2: Complete your restaurant information'}
            </p>
            
            {/* Progress Indicator */}
            <div className="signup-progress">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <div className="progress-number">1</div>
                <span>User Details</span>
              </div>
              <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <div className="progress-number">2</div>
                <span>Restaurant</span>
              </div>
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleUserSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label required">Full Name</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    name="name"
                    className={`form-input-icon ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your full name"
                    value={userFormData.name}
                    onChange={handleUserFormChange}
                    autoComplete="name"
                  />
                </div>
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required">Email Address</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    name="email"
                    className={`form-input-icon ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                    value={userFormData.email}
                    onChange={handleUserFormChange}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required">Phone Number</label>
                <div className="input-with-icon">
                  <Phone className="input-icon" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    className={`form-input-icon ${errors.phone ? 'error' : ''}`}
                    placeholder="+1234567890"
                    value={userFormData.phone}
                    onChange={handleUserFormChange}
                    autoComplete="tel"
                  />
                </div>
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required">Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className={`form-input-icon ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    value={userFormData.password}
                    onChange={handleUserFormChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="input-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              {apiError && <div className="auth-error">{apiError}</div>}

              <Button 
                type="submit" 
                className="auth-btn w-full" 
                loading={loading}
              >
                <ArrowRight size={18} />
                Continue to Restaurant Setup
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRestaurantSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label required">Restaurant Name</label>
                <div className="input-with-icon">
                  <Building2 className="input-icon" size={20} />
                  <input
                    type="text"
                    name="name"
                    className={`form-input-icon ${errors.name ? 'error' : ''}`}
                    placeholder="e.g., Pizza Palace"
                    value={restaurantFormData.name}
                    onChange={handleRestaurantFormChange}
                  />
                </div>
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <div className="input-with-icon">
                  <UtensilsCrossed className="input-icon" size={20} />
                  <textarea
                    name="description"
                    className={`form-input-icon ${errors.description ? 'error' : ''}`}
                    placeholder="Describe your restaurant"
                    rows={3}
                    value={restaurantFormData.description}
                    onChange={handleRestaurantFormChange}
                  />
                </div>
                {errors.description && <span className="form-error">{errors.description}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required">Cuisine Type</label>
                <div className="input-with-icon">
                  <ChefHat className="input-icon" size={20} />
                  <input
                    type="text"
                    name="cuisineType"
                    className={`form-input-icon ${errors.cuisineType ? 'error' : ''}`}
                    placeholder="e.g., Italian, Chinese, Mexican"
                    value={restaurantFormData.cuisineType}
                    onChange={handleRestaurantFormChange}
                  />
                </div>
                {errors.cuisineType && <span className="form-error">{errors.cuisineType}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required">Street Address</label>
                <div className="input-with-icon">
                  <MapPin className="input-icon" size={20} />
                  <input
                    type="text"
                    name="address"
                    className={`form-input-icon ${errors.address ? 'error' : ''}`}
                    placeholder="123 Main Street"
                    value={restaurantFormData.address}
                    onChange={handleRestaurantFormChange}
                  />
                </div>
                {errors.address && <span className="form-error">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label required">City</label>
                  <input
                    type="text"
                    name="city"
                    className={`form-input-icon ${errors.city ? 'error' : ''}`}
                    placeholder="New York"
                    value={restaurantFormData.city}
                    onChange={handleRestaurantFormChange}
                  />
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label required">State</label>
                  <input
                    type="text"
                    name="state"
                    className={`form-input-icon ${errors.state ? 'error' : ''}`}
                    placeholder="NY"
                    value={restaurantFormData.state}
                    onChange={handleRestaurantFormChange}
                  />
                  {errors.state && <span className="form-error">{errors.state}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label required">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    className={`form-input-icon ${errors.zipCode ? 'error' : ''}`}
                    placeholder="10001"
                    value={restaurantFormData.zipCode}
                    onChange={handleRestaurantFormChange}
                  />
                  {errors.zipCode && <span className="form-error">{errors.zipCode}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">Restaurant Phone</label>
                <div className="input-with-icon">
                  <Phone className="input-icon" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    className={`form-input-icon ${errors.phone ? 'error' : ''}`}
                    placeholder="+1234567890"
                    value={restaurantFormData.phone}
                    onChange={handleRestaurantFormChange}
                  />
                </div>
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label required">Restaurant Email</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    name="email"
                    className={`form-input-icon ${errors.email ? 'error' : ''}`}
                    placeholder="info@restaurant.com"
                    value={restaurantFormData.email}
                    onChange={handleRestaurantFormChange}
                  />
                </div>
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <ImageUpload
                  label="Restaurant Image"
                  value={restaurantImage}
                  onChange={setRestaurantImage}
                  error={errors.imageUrl}
                />
              </div>

              {apiError && <div className="auth-error">{apiError}</div>}

              <div className="form-actions">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="auth-btn"
                >
                  <ArrowLeft size={18} />
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="auth-btn w-full" 
                  loading={loading}
                >
                  <UserPlus size={18} />
                  Complete Setup
                </Button>
              </div>
            </form>
          )}

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-info">
          <div className="auth-info-icon">
            <UtensilsCrossed size={48} />
          </div>
          <h2>Start Your Restaurant Journey</h2>
          <p>Join thousands of restaurant owners who trust FoodAura for efficient restaurant management.</p>
          <ul className="auth-features">
            <li>
              <span className="feature-icon">✓</span>
              Real-time order management
            </li>
            <li>
              <span className="feature-icon">✓</span>
              Menu & inventory control
            </li>
            <li>
              <span className="feature-icon">✓</span>
              Analytics & insights
            </li>
            <li>
              <span className="feature-icon">✓</span>
              24/7 Support available
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Signup;
