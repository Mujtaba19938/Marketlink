import React from 'react';
import { RouterProvider, useAppRouter } from './RouterContext';
import { RouteGuard } from './RouteGuard';
import { LayoutWrapper } from '../layouts';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from '../pages/auth/LoginPage';
import { PublicWebsitePage } from '../pages/public/PublicWebsitePage';

/**
 * Route View Renderer
 * Dynamically resolves the active page component, applies route guard,
 * and nests within the configured layout template.
 */
const RouteView: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const {
    activeRoute,
    currentTab,
    setCurrentTab,
    searchQuery,
    setSearchQuery,
    viewMode,
    openWebsite,
    openDashboard,
    openLogin,
  } = useAppRouter();

  // 1. By default or when requested, render the public website storefront
  if (viewMode === 'website') {
    return (
      <PublicWebsitePage
        onOpenLogin={openLogin}
        onOpenDashboard={openDashboard}
      />
    );
  }

  // 2. If user requests login or is unauthenticated for dashboard access
  if (viewMode === 'login' || !isAuthenticated) {
    return (
      <LoginPage
        onBackToWebsite={openWebsite}
        onLoginSuccess={openDashboard}
      />
    );
  }

  const PageComponent = activeRoute.component;

  return (
    <LayoutWrapper
      template={activeRoute.layoutTemplate || 'dashboard'}
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <RouteGuard allowedRoles={activeRoute.allowedRoles}>
        <PageComponent currentTab={currentTab} onSelectTab={setCurrentTab} />
      </RouteGuard>
    </LayoutWrapper>
  );
};

/**
 * Unified App Router
 * Isolates all route resolution, guards, layout composition, and navigation logic.
 */
export const AppRouter: React.FC = () => {
  return (
    <RouterProvider>
      <RouteView />
    </RouterProvider>
  );
};
