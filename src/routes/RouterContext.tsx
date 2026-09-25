import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { AppRoute, RouterContextType, AppViewMode } from './routes.types';
import { routesConfig, getRouteByRole } from './routes.config';

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: React.ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const { currentRole, setRole } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('market');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Default to the public website storefront
  const [viewMode, setViewMode] = useState<AppViewMode>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('login')) return 'login';
      if (hash.includes('dashboard')) return 'dashboard';
    }
    return 'website';
  });

  const activeRoute = getRouteByRole(currentRole);

  // Sync default tab whenever the user switches roles
  useEffect(() => {
    if (activeRoute) {
      setCurrentTab(activeRoute.defaultTab);
    }
  }, [currentRole]);

  // Sync hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('login')) setViewMode('login');
      else if (hash.includes('dashboard')) setViewMode('dashboard');
      else if (!hash || hash === '#/' || hash === '#') setViewMode('website');
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const openWebsite = () => {
    setViewMode('website');
    if (typeof window !== 'undefined') {
      window.location.hash = '';
    }
  };

  const openDashboard = () => {
    setViewMode('dashboard');
    if (typeof window !== 'undefined') {
      window.location.hash = '#/dashboard';
    }
  };

  const openLogin = () => {
    setViewMode('login');
    if (typeof window !== 'undefined') {
      window.location.hash = '#/login';
    }
  };

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
        viewMode,
        setViewMode,
        openWebsite,
        openDashboard,
        openLogin,
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
