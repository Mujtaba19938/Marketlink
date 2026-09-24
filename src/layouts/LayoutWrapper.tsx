import React from 'react';
import { DashboardLayout, DashboardLayoutProps } from './DashboardLayout';
import { FullWidthLayout, FullWidthLayoutProps } from './FullWidthLayout';
import { MinimalLayout, MinimalLayoutProps } from './MinimalLayout';

export type LayoutTemplateType = 'dashboard' | 'fullwidth' | 'minimal';

export interface LayoutWrapperProps {
  template?: LayoutTemplateType;
  children: React.ReactNode;
  currentTab?: string;
  onSelectTab?: (tabId: string) => void;
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
 * Dynamic Layout Template Wrapper
 * Enables pages and routes to dynamically select or switch templates
 * (e.g., standard 3-column dashboard vs. full-width vs. minimal) in a single place.
 */
export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  template = 'dashboard',
  children,
  currentTab = 'market',
  onSelectTab = () => {},
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
  if (template === 'minimal') {
    return (
      <MinimalLayout hideRoleSwitcher={hideRoleSwitcher}>
        {children}
      </MinimalLayout>
    );
  }

  if (template === 'fullwidth') {
    return (
      <FullWidthLayout
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        customHeader={customHeader}
        customSidebar={customSidebar}
        hideSidebar={hideSidebar}
        hideRoleSwitcher={hideRoleSwitcher}
        hideAiAssistant={hideAiAssistant}
      >
        {children}
      </FullWidthLayout>
    );
  }

  // Default: DashboardLayout (3-column)
  return (
    <DashboardLayout
      currentTab={currentTab}
      onSelectTab={onSelectTab}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      customHeader={customHeader}
      customSidebar={customSidebar}
      customRightPanel={customRightPanel}
      hideRightPanel={hideRightPanel}
      hideSidebar={hideSidebar}
      hideRoleSwitcher={hideRoleSwitcher}
      hideAiAssistant={hideAiAssistant}
    >
      {children}
    </DashboardLayout>
  );
};
