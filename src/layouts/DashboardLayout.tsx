import React from 'react';
import { RoleSwitcher } from '../components/common/RoleSwitcher';
import { AppSidebar } from '../components/layout/AppSidebar';
import { AppHeader } from '../components/layout/AppHeader';
import { RightSidePanel } from '../components/layout/RightSidePanel';
import { MarketAiAssistant } from '../components/ai/MarketAiAssistant';
import { ToastContainer } from '../components/common/ToastContainer';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  customHeader?: React.ReactNode;
  customSidebar?: React.ReactNode;
  customRightPanel?: React.ReactNode;
  hideRightPanel?: boolean;
  hideSidebar?: boolean;
  hideRoleSwitcher?: boolean;
  hideAiAssistant?: boolean;
}

/**
 * Standard 3-Column Dashboard Layout
 * Encapsulates the top persona toolbar, responsive sidebar, top bar header,
 * central content area, auxiliary right metrics panel, and floating utilities.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentTab,
  onSelectTab,
  searchQuery = '',
  onSearchChange = () => {},
  customHeader,
  customSidebar,
  customRightPanel,
  hideRightPanel = false,
  hideSidebar = false,
  hideRoleSwitcher = false,
  hideAiAssistant = false,
}) => {
  return (
    <div className="w-full min-h-screen bg-white text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Edge-to-Edge Persona Switcher Toolbar */}
      {!hideRoleSwitcher && (
        <div className="w-full border-b border-slate-200/80 bg-white sticky top-0 z-50">
          <RoleSwitcher />
        </div>
      )}

      {/* Full-Fit Edge-to-Edge Dashboard Container */}
      <div className="w-full flex-1 flex flex-col md:flex-row min-w-0 bg-white">
        {/* Left Sidebar */}
        {!hideSidebar && (customSidebar || (
          <AppSidebar currentTab={currentTab} onSelectTab={onSelectTab} />
        ))}

        {/* Main Content & Right Column Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Top Bar Header */}
          {customHeader || (
            <AppHeader searchQuery={searchQuery} onSearchChange={onSearchChange} />
          )}

          {/* Grid Layout: Center Main Feed + Right Side Auxiliary Panel */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col xl:flex-row gap-6 sm:gap-8 bg-white min-w-0">
            {/* Center Content Column */}
            <div className="flex-1 space-y-6 min-w-0">
              {children}
            </div>

            {/* Right Side Column (~30-35% width) */}
            {!hideRightPanel && (customRightPanel || <RightSidePanel />)}
          </div>
        </div>
      </div>

      {/* Floating AI Assistant Widget */}
      {!hideAiAssistant && <MarketAiAssistant />}

      {/* Floating Real-Time Action Toasts */}
      <ToastContainer />
    </div>
  );
};
