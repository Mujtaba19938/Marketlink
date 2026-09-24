import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { AppRoute, RouterContextType } from './routes.types';
import { routesConfig, getRouteByRole } from './routes.config';

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: React.ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const { currentRole, setRole } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('market');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeRoute = getRouteByRole(currentRole);

  // Sync default tab whenever the user switches roles
  useEffect(() => {
    if (activeRoute) {
      setCurrentTab(activeRoute.defaultTab);
    }
  }, [currentRole]);

  const navigate = (role: UserRole, tab?: string) => {
    setRole(role);
    if (tab) {
      setCurrentTab(tab);
    } else {
      const targetRoute = getRouteByRole(role);
      setCurrentTab(targetRoute.defaultTab);
    }
  };

  return (
    <RouterContext.Provider
      value={{
        activeRoute,
        currentTab,
        setCurrentTab,
        searchQuery,
        setSearchQuery,
        navigate,
        routes: routesConfig,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useAppRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useAppRouter must be used within a RouterProvider');
  }
  return context;
};
