import React from 'react';
import { RoleSwitcher } from '../components/common/RoleSwitcher';
import { AppSidebar } from '../components/layout/AppSidebar';
import { AppHeader } from '../components/layout/AppHeader';
import { MarketAiAssistant } from '../components/ai/MarketAiAssistant';
import { ToastContainer } from '../components/common/ToastContainer';

export interface FullWidthLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  customHeader?: React.ReactNode;
  customSidebar?: React.ReactNode;
  hideSidebar?: boolean;
  hideRoleSwitcher?: boolean;
  hideAiAssistant?: boolean;
}

/**
 * Full-Width Layout Template
 * Provides standard sidebar and header, but expands the main content area across
 * the full width without the right auxiliary metrics panel.
 */
export const FullWidthLayout: React.FC<FullWidthLayoutProps> = ({
  children,
  currentTab,
  onSelectTab,
  searchQuery = '',
  onSearchChange = () => {},
  customHeader,
  customSidebar,
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
    setMobileSidebarOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Edge-to-Edge Persona Switcher Toolbar */}
      {!hideRoleSwitcher && (
        <div className="w-full border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-40">
          <RoleSwitcher />
        </div>
      )}

      {/* Main Full-Fit Container */}
      <div className="w-full flex-1 flex flex-col md:flex-row min-w-0 bg-[var(--color-bg)]">
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

        <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg)] transition-all duration-300">
          {customHeader || (
            <AppHeader
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              onToggleSidebar={handleToggleSidebar}
              isSidebarOpen={desktopSidebarOpen}
            />
          )}

          <div className="flex-1 p-3.5 sm:p-6 lg:p-8 bg-[var(--color-bg)] min-w-0">
            <div className="w-full space-y-6">
              {children}
            </div>
          </div>
        </div>
      </div>

      {!hideAiAssistant && <MarketAiAssistant />}
      <ToastContainer />
    </div>
  );
};
