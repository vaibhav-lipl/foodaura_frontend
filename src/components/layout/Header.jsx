import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { authAPI } from '../../api/auth.api';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  /* ================= FETCH ================= */
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getNotifications();

      if (response.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLICK NOTIFICATION ================= */
  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read if unread
      if (!notification.isRead) {
        await authAPI.markNotificationAsRead(notification.id);
      }

      // Update UI instantly
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );

      // Close dropdown
      setIsNotificationOpen(false);

      // Navigate if actionUrl exists
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
      }
    } catch (error) {
      console.error('Notification click error:', error);
    }
  };

  /* ================= DELETE ================= */
  const handleDeleteNotification = async (id) => {
    try {
      const response = await authAPI.deleteNotification(id);

      if (response.success) {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== id)
        );
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ================= FETCH WHEN OPEN ================= */
  useEffect(() => {
    if (user && isNotificationOpen) {
      fetchNotifications();
    }
  }, [user, isNotificationOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button className="menu-toggle" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
        </div>

        <div className="header-right">
          {/* 🔔 NOTIFICATIONS */}
          <div className="notification-wrapper" ref={notificationRef}>
            <button
              className="header-icon-btn"
              onClick={() =>
                setIsNotificationOpen(!isNotificationOpen)
              }
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Notifications</h4>
                </div>

                <div className="notification-list">
                  {loading ? (
                    <div className="notification-empty">
                      Loading...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="notification-empty">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${notification.isRead ? '' : 'unread'
                          }`}
                        onClick={() =>
                          handleNotificationClick(notification)
                        }
                      >
                        <div className="notification-content">
                          <p className="notification-title">
                            {notification.title}
                          </p>
                          <p className="notification-message">
                            {notification.message}
                          </p>
                          <span className="notification-time">
                            {new Date(
                              notification.createdAt
                            ).toLocaleString()}
                          </span>
                        </div>

                        <Trash2
                          size={16}
                          className="delete-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PROFILE DROPDOWN (unchanged) */}
          {user && (
            <div className="profile-dropdown" ref={profileRef}>
              <button
                className="profile-trigger"
                onClick={() =>
                  setIsProfileOpen(!isProfileOpen)
                }
              >
                <div className="avatar avatar-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <span className="profile-name">
                    {user.name}
                  </span>
                  <span className="profile-role">
                    {user.role}
                  </span>
                </div>
                <ChevronDown size={16} />
              </button>

              {isProfileOpen &&
                (<div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="avatar">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="dropdown-user-name">{user.name}</p>
                      <p className="dropdown-user-email">{user.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => { setIsProfileOpen(false); if (user?.role === 'restaurant') { navigate('/restaurant'); } else { navigate('/admin/profile'); } }} > <User size={18} /> <span>My Profile</span> </button>
                  {user?.role === 'admin' &&
                    (<button className="dropdown-item" onClick={() => { setIsProfileOpen(false); navigate('/admin/settings'); }} >
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>)}
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}> <LogOut size={18} /> <span>Logout</span>
                  </button>
                </div>
                )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;