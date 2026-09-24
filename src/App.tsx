import React from 'react';
import { ThemeProvider } from './theme';
import { AuthProvider } from './context/AuthContext';
import { MarketDataProvider } from './context/MarketDataContext';
import { AppRouter } from './routes';

/**
 * Main Application Root
 * Assembles theme provider, authentication state, market data context,
 * and delegates application rendering to the unified router architecture.
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MarketDataProvider>
          <AppRouter />
        </MarketDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
