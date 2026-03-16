import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Mail, Lock, Home, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import Button from '../../components/common/Button';
import { getToken } from "firebase/messaging";
import { restaurantAPI } from '../../api/restaurant.api';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

//   const requestPermission = async () => {
//   const permission = await Notification.requestPermission();
//   console.log("Notification permission:", permission);
//   if (permission === "granted") {
//     const token = await getToken(messaging, {
//       vapidKey: "BNSwGsVXsmtu73xaO2qrsGlhe5tVCpHw6fc4JmDZdtzMgUe6ps1xhEh7jrV9G6nsLQK8SsAvMTfpdWwg-81Cp-o"
//     });

//     // Send token to backend and save in DB
//     if (token) {
//       console.log("FCM Token:", token);
//       await restaurantAPI.SaveRestaurantToken(token);
//     } else {
//       console.log("No registration token available. Request permission to generate one.");
//     }
//   }
// };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    const result = await login(formData);

    if (result.success) {
      // Redirect based on user role
      // Check user from localStorage as it's set synchronously in AuthContext
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        // Notification permission request for restaurant users
        // await requestPermission();
        navigate('/dashboard');
      }
    } else {
      setApiError(result.message || 'Login failed. Please try again.');
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
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              </svg>
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue to FoodAura</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label required">Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  name="email"
                  className={`form-input-icon ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
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
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
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

            <div className="form-row">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
            </div>

            {apiError && <div className="auth-error">{apiError}</div>}

            <Button 
              type="submit" 
              className="auth-btn w-full" 
              loading={loading}
            >
              <LogIn size={18} />
              Sign In
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Create account
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-info">
          <div className="auth-info-icon">
            <UtensilsCrossed size={48} />
          </div>
          <h2>Manage Your Restaurant</h2>
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

export default Login;
