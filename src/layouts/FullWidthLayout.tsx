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
  return (
    <div className="w-full min-h-screen bg-white text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Edge-to-Edge Persona Switcher Toolbar */}
      {!hideRoleSwitcher && (
        <div className="w-full border-b border-slate-200/80 bg-white sticky top-0 z-50">
          <RoleSwitcher />
        </div>
      )}

      {/* Main Full-Fit Container */}
      <div className="w-full flex-1 flex flex-col md:flex-row min-w-0 bg-white">
        {!hideSidebar && (customSidebar || (
          <AppSidebar currentTab={currentTab} onSelectTab={onSelectTab} />
        ))}

        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {customHeader || (
            <AppHeader searchQuery={searchQuery} onSearchChange={onSearchChange} />
          )}

          <div className="flex-1 p-6 sm:p-8 bg-white min-w-0">
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
