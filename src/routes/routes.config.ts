import { AppRoute } from './routes.types';
import { UserRole } from '../types/auth';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { VendorDashboardPage } from '../pages/vendor/VendorDashboardPage';
import { CustomerDashboardPage } from '../pages/customer/CustomerDashboardPage';

/**
 * Global Route Constants
 */
export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  VENDOR: '/vendor',
  CUSTOMER: '/customer',
  NOT_FOUND: '/404',
} as const;

/**
 * Unified Application Route Definitions
 */
export const routesConfig: AppRoute[] = [
  {
    id: 'admin',
    path: ROUTES.ADMIN,
    role: 'admin',
    label: 'Admin Dashboard',
    defaultTab: 'analytics',
    allowedRoles: ['admin'],
    component: AdminDashboardPage,
    layoutTemplate: 'dashboard',
    meta: {
      title: 'SuperAdmin Governance Hub',
      description: 'Platform oversight, farmer verification, and regional market administration.',
    },
  },
  {
    id: 'vendor',
    path: ROUTES.VENDOR,
    role: 'vendor',
    label: 'Vendor Stall & Operations',
    defaultTab: 'market',
    allowedRoles: ['vendor'],
    component: VendorDashboardPage,
    layoutTemplate: 'dashboard',
    meta: {
      title: 'Farmer & Stall Portal',
      description: 'Produce inventory catalog, pre-order fulfillment, and stall map configuration.',
    },
  },
  {
    id: 'customer',
    path: ROUTES.CUSTOMER,
    role: 'customer',
    label: 'Customer Market Hub',
    defaultTab: 'market',
    allowedRoles: ['customer'],
    component: CustomerDashboardPage,
    layoutTemplate: 'dashboard',
    meta: {
      title: 'Fresh Produce & Pre-Orders',
      description: 'Organic local harvest browsing, pickup scheduling, and stall discovery.',
    },
  },
];

/**
 * Helper to get route definition by role
 */
export const getRouteByRole = (role: UserRole): AppRoute => {
  const route = routesConfig.find((r) => r.role === role);
  return route || routesConfig[1]; // default to vendor if not found
};

/**
 * Check if current user role is authorized for route
 */
export const isRoleAllowedForRoute = (route: AppRoute, role: UserRole): boolean => {
  return route.allowedRoles.includes(role);
};
