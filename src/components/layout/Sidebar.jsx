import { NavLink } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Store,
  BarChart3,
  X,
  Users,
  Shield,
  Ship,
  Truck,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, isCollapsed = false }) => {
  const { user, isAdmin, isRestaurant } = useAuth();

  // Admin menu items
  const adminMenuItems = [
    {
      section: 'Overview',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
      ],
    },
    {
      section: 'Management',
      items: [
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: Store, label: 'Restaurants', path: '/admin/restaurants' },
        { icon: UtensilsCrossed, label: 'Menu', path: '/admin/menus' },
        { icon: Truck, label: 'Delivery Partners', path: '/admin/delivery-partners' },
        { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
      ],
    },
  ];

  // Restaurant menu items
  const restaurantMenuItems = [
    {
      section: 'Overview',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      ],
    },
    {
      section: 'Management',
      items: [
        { icon: ShoppingCart, label: 'Orders', path: '/orders' },
        { icon: UtensilsCrossed, label: 'Menu', path: '/menu' },
        { icon: Store, label: 'Restaurant', path: '/restaurant' },
      ],
    },
    {
      section: 'Analytics',
      items: [
        { icon: BarChart3, label: 'Statistics', path: '/statistics' },
      ],
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : restaurantMenuItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-content">
          {/* Mobile Close Button */}
          <button className="sidebar-close" onClick={onClose}>
            <X size={24} />
          </button>

          {/* Logo */}
          <div className="sidebar-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
                <path
                  d="M8 12L16 8L24 12V20L16 24L8 20V12Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path d="M16 14L16 24" stroke="white" strokeWidth="2" />
                <path d="M8 12L16 16L24 12" stroke="white" strokeWidth="2" />
                <defs>
                  <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#e12364" />
                    <stop offset="1" stopColor="#c91a5a" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            {!isCollapsed && <span className="logo-text">FoodAura</span>}
          </div>

          {/* User Info */}
          {/* {user && (
            <div className="sidebar-user">
              <div className="avatar avatar-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="sidebar-user-info">
                  <h4 className="sidebar-user-name">{user.name}</h4>
                  <span className="sidebar-user-role">
                    {isAdmin ? 'Administrator' : isRestaurant ? 'Restaurant Owner' : user.role}
                  </span>
                </div>
              )}
            </div>
          )} */}

          {/* Navigation */}
          <nav className="sidebar-nav">
            {menuItems.map((section, idx) => (
              <div key={idx} className="nav-section">
                {!isCollapsed && (
                  <h5 className="nav-section-title">{section.section}</h5>
                )}
                <ul className="nav-list">
                  {section.items.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `nav-item ${isActive ? 'active' : ''}`
                        }
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            onClose();
                          }
                        }}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <item.icon size={20} className="nav-icon" />
                        {!isCollapsed && <span className="nav-label">{item.label}</span>}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
