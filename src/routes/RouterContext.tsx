import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { AppRoute, RouterContextType, AppViewMode, WebsitePageId } from './routes.types';
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

  // Dedicated Website Page Routing ('home' | 'markets' | 'shop' | 'farmers' | 'about' | 'contact' | 'cart' | 'checkout')
  const [websitePage, setWebsitePage] = useState<WebsitePageId>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('cart') || hash.includes('basket')) return 'cart';
      if (hash.includes('checkout')) return 'checkout';
      if (hash.includes('market') || hash.includes('map')) return 'markets';
      if (hash.includes('shop') || hash.includes('produce') || hash.includes('store')) return 'shop';
      if (hash.includes('farmer') || hash.includes('grower')) return 'farmers';
      if (hash.includes('about') || hash.includes('how-it-works')) return 'about';
      if (hash.includes('contact') || hash.includes('support')) return 'contact';
    }
    return 'home';
  });

  const activeRoute = getRouteByRole(currentRole);

  // Sync default tab whenever the user switches roles
  useEffect(() => {
    if (activeRoute) {
      setCurrentTab(activeRoute.defaultTab);
    }
  }, [currentRole]);

  // Sync hash changes across full application
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('login')) {
        setViewMode('login');
      } else if (hash.includes('dashboard')) {
        setViewMode('dashboard');
      } else {
        setViewMode('website');
        if (hash.includes('cart') || hash.includes('basket')) setWebsitePage('cart');
        else if (hash.includes('checkout')) setWebsitePage('checkout');
        else if (hash.includes('market') || hash.includes('map')) setWebsitePage('markets');
        else if (hash.includes('shop') || hash.includes('produce') || hash.includes('store')) setWebsitePage('shop');
        else if (hash.includes('farmer') || hash.includes('grower')) setWebsitePage('farmers');
        else if (hash.includes('about') || hash.includes('how-it-works')) setWebsitePage('about');
        else if (hash.includes('contact') || hash.includes('support')) setWebsitePage('contact');
        else setWebsitePage('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const openWebsite = () => {
    setViewMode('website');
    setWebsitePage('home');
    if (typeof window !== 'undefined') {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateWebsite = (page: WebsitePageId) => {
    setViewMode('website');
    setWebsitePage(page);
    if (typeof window !== 'undefined') {
      window.location.hash = page === 'home' ? '#/' : `#/${page}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        websitePage,
        setWebsitePage,
        navigateWebsite,
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
