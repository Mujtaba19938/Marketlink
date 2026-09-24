import React from 'react';
import { UserRole } from '../types/auth';
import { LayoutTemplateType } from '../layouts';

export interface RouteMeta {
  title: string;
  description?: string;
  badge?: string;
}

export interface AppRoute {
  id: string;
  path: string;
  role: UserRole;
  label: string;
  defaultTab: string;
  allowedRoles: UserRole[];
  component: React.ComponentType<{
    currentTab?: string;
    onSelectTab?: (tab: string) => void;
  }>;
  layoutTemplate?: LayoutTemplateType;
  meta?: RouteMeta;
}

export interface RouteGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface RouterContextType {
  activeRoute: AppRoute;
  currentTab: string;
  setCurrentTab: (tabId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigate: (role: UserRole, tab?: string) => void;
  routes: AppRoute[];
}
