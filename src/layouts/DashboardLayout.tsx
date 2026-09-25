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
  // Mobile drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  // Desktop sidebar collapse state
  const [desktopSidebarOpen, setDesktopSidebarOpen] = React.useState(true);

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setDesktopSidebarOpen((prev) => !prev);
    }
  };

  const handleSelectTab = (tabId: string) => {
    onSelectTab(tabId);
    setMobileSidebarOpen(false); // auto-close mobile drawer on link click
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Edge-to-Edge Persona Switcher Toolbar */}
      {!hideRoleSwitcher && (
        <div className="w-full border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-40">
          <RoleSwitcher />
        </div>
      )}

      {/* Full-Fit Edge-to-Edge Dashboard Container */}
      <div className="w-full flex-1 flex flex-col md:flex-row min-w-0 bg-[var(--color-bg)]">
        {/* Left Sidebar (with Mobile Drawer & Desktop Collapse) */}
        {!hideSidebar && (customSidebar || (
          <AppSidebar
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
            desktopOpen={desktopSidebarOpen}
            onToggleDesktop={() => setDesktopSidebarOpen(false)}
          />
        ))}

        {/* Main Content & Right Column Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg)] transition-all duration-300">
          {/* Top Bar Header with Hamburger Toggle */}
          {customHeader || (
            <AppHeader
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              onToggleSidebar={handleToggleSidebar}
              isSidebarOpen={desktopSidebarOpen}
            />
          )}

          {/* Grid Layout: Center Main Feed + Right Side Auxiliary Panel */}
          <div className="flex-1 p-3.5 sm:p-6 lg:p-8 flex flex-col xl:flex-row gap-5 sm:gap-8 bg-[var(--color-bg)] min-w-0">
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
