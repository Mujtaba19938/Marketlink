import React from 'react';
import { MetricCard } from '../common/MetricCard';
import { Tractor, Users, Store, ShoppingBag, DollarSign } from 'lucide-react';
import { useMarketData } from '../../context/MarketDataContext';

export const AdminMetrics: React.FC = () => {
  const { farmers, customers, markets } = useMarketData();

  const totalFarmers = farmers.length;
  const approvedFarmers = farmers.filter((f) => f.status === 'approved').length;
  const pendingFarmers = farmers.filter((f) => f.status === 'pending').length;

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'active').length;

  const totalMarkets = markets.length;
  const totalOrders = 12490; // aggregate historical orders

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Farmers / Vendors"
        value={totalFarmers}
        subtext={`${approvedFarmers} active • ${pendingFarmers} pending approval`}
        change="+12.4%"
        isPositive={true}
        icon={Tractor}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-600"
      />

      <MetricCard
        title="Total Customers"
        value={totalCustomers.toLocaleString()}
        subtext={`${activeCustomers} verified accounts`}
        change="+18.2%"
        isPositive={true}
        icon={Users}
        iconBgColor="bg-sky-50"
        iconColor="text-sky-600"
      />

      <MetricCard
        title="Active Markets"
        value={totalMarkets}
        subtext="Operating across 5 city hubs"
        change="+2 new"
        isPositive={true}
        icon={Store}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-600"
      />

      <MetricCard
        title="Platform Orders"
        value={totalOrders.toLocaleString()}
        subtext="$184,250 platform gross volume"
        change="+24.8%"
        isPositive={true}
        icon={ShoppingBag}
        iconBgColor="bg-indigo-50"
        iconColor="text-indigo-600"
      />
    </div>
  );
};
