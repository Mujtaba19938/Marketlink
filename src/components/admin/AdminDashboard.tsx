import React from 'react';
import { AdminDashboardPage, AdminDashboardPageProps } from '../../pages/admin/AdminDashboardPage';

export type AdminDashboardProps = AdminDashboardPageProps;

/**
 * Backward compatibility wrapper for AdminDashboard
 * Delegates to the dedicated view page in src/pages/admin/
 */
export const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  return <AdminDashboardPage {...props} />;
};

export default AdminDashboard;
