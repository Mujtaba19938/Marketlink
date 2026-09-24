import React from 'react';
import { RouterProvider, useAppRouter } from './RouterContext';
import { RouteGuard } from './RouteGuard';
import { LayoutWrapper } from '../layouts';

/**
 * Route View Renderer
 * Dynamically resolves the active page component, applies route guard,
 * and nests within the configured layout template.
 */
const RouteView: React.FC = () => {
  const { activeRoute, currentTab, setCurrentTab, searchQuery, setSearchQuery } = useAppRouter();
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
