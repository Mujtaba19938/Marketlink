import React, { useState } from 'react';
import { useMarketData } from '../../context/MarketDataContext';
import { AdminHeroBanner } from '../../components/admin/AdminHeroBanner';
import { AdminMetricChips } from '../../components/admin/AdminMetricChips';
import { AdminTabNavigation, AdminTabKey } from '../../components/admin/AdminTabNavigation';
import { BroadcastAnnouncementModal } from '../../components/admin/BroadcastAnnouncementModal';
import { FarmerManagement } from '../../components/admin/FarmerManagement';
import { CustomerManagement } from '../../components/admin/CustomerManagement';
import { MarketManagement } from '../../components/admin/MarketManagement';
import { ContentModeration } from '../../components/admin/ContentModeration';
import { SystemConfig } from '../../components/admin/SystemConfig';
import { AdminAnalytics } from '../../components/admin/AdminAnalytics';

export interface AdminDashboardPageProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
}

/**
 * Admin Dashboard Page
 * Central layout and data orchestration page for SuperAdmin governance.
 */
export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { farmers, customers, markets, moderationItems, broadcastAnnouncement } = useMarketData();
  const [selectedMetricTab, setSelectedMetricTab] = useState('farmers');
  const [internalTab, setInternalTab] = useState<AdminTabKey>('analytics');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const validTabs: AdminTabKey[] = ['analytics', 'farmers', 'customers', 'markets', 'moderation', 'config'];
  const activeAdminTab: AdminTabKey = currentTab && validTabs.includes(currentTab as AdminTabKey)
    ? (currentTab as AdminTabKey)
    : internalTab;

  const handleSelectTab = (tab: AdminTabKey) => {
    setInternalTab(tab);
    onSelectTab?.(tab);
  };

  const handleSelectMetric = (chipId: string) => {
    setSelectedMetricTab(chipId);
    if (chipId === 'farmers') handleSelectTab('farmers');
    else if (chipId === 'customers') handleSelectTab('customers');
    else if (chipId === 'markets') handleSelectTab('markets');
    else handleSelectTab('analytics');
  };

  const handleBroadcast = (data: {
    title: string;
    message: string;
    targetAudience: 'all' | 'vendors' | 'customers';
  }) => {
    broadcastAnnouncement({
      title: data.title,
      message: data.message,
      targetAudience: data.targetAudience,
      priority: 'important',
    });
  };

  const pendingFarmersCount = farmers.filter((f) => f.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* 1. Hero Governance Card */}
      <AdminHeroBanner onOpenBroadcastModal={() => setShowBroadcastModal(true)} />

      {/* 2. Platform Key Metrics 5-Chip Layout */}
      <AdminMetricChips
        farmersCount={farmers.length}
        customersCount={customers.length}
        marketsCount={markets.length}
        selectedMetricTab={selectedMetricTab}
        onSelectMetric={handleSelectMetric}
      />

      {/* 3. Tabbed Operations Panel */}
      <div className="space-y-4 pt-2">
        <AdminTabNavigation
          activeTab={activeAdminTab}
          onSelectTab={handleSelectTab}
          pendingFarmersCount={pendingFarmersCount}
          moderationItemsCount={moderationItems.length}
        />

        {/* Panel View */}
        <div>
          {activeAdminTab === 'analytics' && <AdminAnalytics />}
          {activeAdminTab === 'farmers' && <FarmerManagement />}
          {activeAdminTab === 'customers' && <CustomerManagement />}
          {activeAdminTab === 'markets' && <MarketManagement />}
          {activeAdminTab === 'moderation' && <ContentModeration />}
          {activeAdminTab === 'config' && <SystemConfig />}
        </div>
      </div>

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <BroadcastAnnouncementModal
          isOpen={showBroadcastModal}
          onClose={() => setShowBroadcastModal(false)}
          onBroadcast={handleBroadcast}
        />
      )}
    </div>
  );
};
