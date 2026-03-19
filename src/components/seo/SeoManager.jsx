import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = 'FoodAura | Food Delivery & Restaurant Management Platform';
const DEFAULT_DESCRIPTION =
  'FoodAura is a complete food delivery and restaurant management application for handling orders, menus, restaurant operations, delivery workflows, and analytics.';

const ROUTE_SEO = [
  {
    match: /^\/login$/,
    title: 'Login | FoodAura',
    description:
      'Log in to FoodAura to manage restaurant orders, menus, schedules, offers, and delivery operations.',
  },
  {
    match: /^\/signup$/,
    title: 'Sign Up | FoodAura',
    description:
      'Create your FoodAura account to start managing your food delivery business, orders, and restaurant operations.',
  },
  {
    match: /^\/dashboard$/,
    title: 'Restaurant Dashboard | FoodAura',
    description:
      'Track live restaurant performance, recent orders, and operational insights from the FoodAura dashboard.',
  },
  {
    match: /^\/orders(?:\/[^/]+)?$/,
    title: 'Orders Management | FoodAura',
    description:
      'Monitor incoming orders, update order statuses, and review customer order details with FoodAura.',
  },
  {
    match: /^\/menu$/,
    title: 'Menu Management | FoodAura',
    description:
      'Create, update, and organize menu items, pricing, and categories for your restaurant in FoodAura.',
  },
  {
    match: /^\/restaurant$/,
    title: 'Restaurant Profile | FoodAura',
    description:
      'Manage restaurant profile details, branding, contact information, and business settings in FoodAura.',
  },
  {
    match: /^\/restaurant\/schedule$/,
    title: 'Restaurant Schedule | FoodAura',
    description:
      'Control restaurant opening hours and delivery availability with FoodAura schedule management.',
  },
  {
    match: /^\/restaurant\/offers$/,
    title: 'Restaurant Offers | FoodAura',
    description:
      'Create and manage promotional offers, discounts, and campaigns to grow food orders with FoodAura.',
  },
  {
    match: /^\/statistics$/,
    title: 'Restaurant Analytics | FoodAura',
    description:
      'Analyze sales, ratings, top-selling items, and performance trends with FoodAura statistics.',
  },
  {
    match: /^\/admin\/dashboard$/,
    title: 'Admin Dashboard | FoodAura',
    description:
      'Oversee platform activity, restaurants, users, and delivery operations from the FoodAura admin dashboard.',
  },
  {
    match: /^\/admin\/users$/,
    title: 'User Management | FoodAura',
    description:
      'Manage platform users and account access across the FoodAura food delivery ecosystem.',
  },
  {
    match: /^\/admin\/restaurants$/,
    title: 'Restaurant Administration | FoodAura',
    description:
      'Review and manage restaurant partners, operations, and platform listings with FoodAura admin tools.',
  },
  {
    match: /^\/admin\/delivery-partners(?:\/[^/]+)?$/,
    title: 'Delivery Partners | FoodAura',
    description:
      'Manage delivery partner performance, assignments, and operational details from FoodAura admin controls.',
  },
  {
    match: /^\/admin\/orders(?:\/[^/]+)?$/,
    title: 'Admin Orders | FoodAura',
    description:
      'Review platform-wide order activity, statuses, and order details from the FoodAura admin panel.',
  },
  {
    match: /^\/admin\/profile$/,
    title: 'Admin Profile | FoodAura',
    description:
      'Update account information and administrative profile settings inside the FoodAura platform.',
  },
  {
    match: /^\/admin\/settings$/,
    title: 'Platform Settings | FoodAura',
    description:
      'Configure FoodAura platform settings for restaurant operations, delivery management, and admin workflows.',
  },
];

const updateMetaTag = (selector, attribute, value) => {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, value);
  }
};

const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const seo =
      ROUTE_SEO.find((route) => route.match.test(location.pathname)) ?? {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
      };

    document.title = seo.title;

    updateMetaTag('meta[name="description"]', 'content', seo.description);
    updateMetaTag('meta[property="og:title"]', 'content', seo.title);
    updateMetaTag('meta[property="og:description"]', 'content', seo.description);
    updateMetaTag('meta[name="twitter:title"]', 'content', seo.title);
    updateMetaTag('meta[name="twitter:description"]', 'content', seo.description);
  }, [location.pathname]);

  return null;
};

export default SeoManager;
