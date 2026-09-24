import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MarketDataProvider } from './context/MarketDataContext';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { RoleGuard } from './components/common/RoleGuard';
import { ToastContainer } from './components/common/ToastContainer';
import { MarketAiAssistant } from './components/ai/MarketAiAssistant';
import { AppSidebar } from './components/layout/AppSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { RightSidePanel } from './components/layout/RightSidePanel';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';

function MainAppContent() {
  const { currentRole } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('market');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-full min-h-screen bg-white text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Edge-to-Edge Top Role Switcher Toolbar */}
      <div className="w-full border-b border-slate-200/80 bg-white sticky top-0 z-50">
        <RoleSwitcher />
      </div>

      {/* Full-Fit Edge-to-Edge Dashboard Container (No rounded outer corners or margins) */}
      <div className="w-full flex-1 flex flex-col md:flex-row min-w-0 bg-white">
        {/* Left Sidebar stretching full height */}
        <AppSidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Main Content & Right Column Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Top Bar Header */}
          <AppHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          {/* 3-Column Grid Layout: Center Main Feed + Right Side Auxiliary Panel */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col xl:flex-row gap-6 sm:gap-8 bg-white min-w-0">
            {/* Center Content Column (~65-70% width) */}
            <div className="flex-1 space-y-6 min-w-0">
              {currentRole === 'admin' && (
                <RoleGuard allowedRoles={['admin']}>
                  <AdminDashboard currentTab={currentTab} onSelectTab={setCurrentTab} />
                </RoleGuard>
              )}

              {currentRole === 'vendor' && (
                <RoleGuard allowedRoles={['vendor']}>
                  <VendorDashboard currentTab={currentTab} onSelectTab={setCurrentTab} />
                </RoleGuard>
              )}

              {currentRole === 'customer' && (
                <RoleGuard allowedRoles={['customer']}>
                  <CustomerDashboard currentTab={currentTab} onSelectTab={setCurrentTab} />
                </RoleGuard>
              )}
            </div>

            {/* Right Side Column (~30-35% width) matching MarketEase screenshot: Income/Metrics + Notifications + Latest Order */}
            <RightSidePanel />
          </div>
        </div>
      </div>

      {/* Floating AI Assistant Widget (Matching Emerald Theme) */}
      <MarketAiAssistant />

      {/* Floating Real-Time Action Toasts */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MarketDataProvider>
        <MainAppContent />
      </MarketDataProvider>
    </AuthProvider>
  );
}
