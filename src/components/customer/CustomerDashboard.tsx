import React from 'react';
import { CustomerDashboardPage, CustomerDashboardPageProps } from '../../pages/customer/CustomerDashboardPage';

export type CustomerDashboardProps = CustomerDashboardPageProps;

/**
 * Backward compatibility wrapper for CustomerDashboard
 * Delegates to the dedicated view page in src/pages/customer/
 */
export const CustomerDashboard: React.FC<CustomerDashboardProps> = (props) => {
  return <CustomerDashboardPage {...props} />;
};

export default CustomerDashboard;
