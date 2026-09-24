import React from 'react';
import { VendorDashboardPage, VendorDashboardPageProps } from '../../pages/vendor/VendorDashboardPage';

export type VendorDashboardProps = VendorDashboardPageProps;

/**
 * Backward compatibility wrapper for VendorDashboard
 * Delegates to the dedicated view page in src/pages/vendor/
 */
export const VendorDashboard: React.FC<VendorDashboardProps> = (props) => {
  return <VendorDashboardPage {...props} />;
};

export default VendorDashboard;
