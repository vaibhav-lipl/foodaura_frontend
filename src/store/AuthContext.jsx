import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        setToken(storedToken);
        // Only set user if it exists in storage
        // If token exists but no user, it means signup step 1 completed but step 2 is pending
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            // Verify token with backend to ensure it's still valid
            const response = await authAPI.getCurrentUser();
            if (response.success) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            } else {
              // User data invalid, clear it but keep token (might be in signup flow)
              localStorage.removeItem('user');
              setUser(null);
            }
          } catch (error) {
            // If getCurrentUser fails, user might not have completed restaurant setup
            // Clear user but keep token for signup completion
            localStorage.removeItem('user');
            setUser(null);
          }
        }
        // If token exists but no user, user is in signup flow (step 2 pending)
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.success) {
        const { token: newToken, user: userData } = response.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors,
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      if (response.success) {
        const { token: newToken, user: newUser } = response.data;
        // Store token for API calls but DON'T set user yet
        // User will be set after restaurant setup is complete
        setToken(newToken);
        localStorage.setItem('token', newToken);
        // Store user data temporarily but don't mark as authenticated
        // This allows the token to be used for setup-restaurant API call
        // but prevents automatic login/redirect
        return { success: true, token: newToken, user: newUser };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed',
        errors: error.response?.data?.errors,
      };
    }
  };

  const setupRestaurant = async (restaurantData, imageFile) => {
    try {
      const response = await authAPI.setupRestaurant(restaurantData, imageFile);
      if (response.success) {
        // Now that restaurant setup is complete, fetch the full user data
        // and mark as authenticated
        const userResponse = await authAPI.getCurrentUser();
        if (userResponse.success && userResponse.data?.user) {
          const userData = userResponse.data.user;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else if (response.data?.user) {
          // Fallback: use user data from setup-restaurant response if available
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Restaurant setup failed',
        errors: error.response?.data?.errors,
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!token && !!user;
  const userRole = user?.role?.toLowerCase();
  const isAdmin = userRole === 'admin';
  // Check for restaurant role - can be 'restaurant', 'restaurant_owner', or any variation
  const isRestaurant = userRole === 'restaurant' || 
                       userRole === 'restaurant_owner' ||
                       (userRole && userRole.includes('restaurant'));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        setupRestaurant,
        logout,
        isAuthenticated,
        isAdmin,
        isRestaurant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

