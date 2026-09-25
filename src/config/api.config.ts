/**
 * MarketEase - Express.js API Configuration & Keys
 * Synchronized with the backend located in MERN STACK PROJECT / EXPRESSJS
 */

export const API_CONFIG = {
  // Express Backend Server Base URL
  baseUrl: (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000',

  // Primary API Security Key (Passed via 'x-api-key' header for protected routes)
  apiKey: (import.meta.env.VITE_API_KEY as string) || 'Abcd123456789@|',

  // Project Specific Dedicated API Key
  marketEaseApiKey: (import.meta.env.VITE_MARKETEASE_API_KEY as string) || 'marketease_live_ak_9f8e7d6c5b4a321',

  // JWT Secret (Discovered in Express backend middleware)
  jwtSecret: (import.meta.env.VITE_JWT_SECRET as string) || 'Abcd12345678!?',

  // Stripe Payment Gateway Publishable Key (Corresponding to discovered secret key)
  stripePublishableKey: (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string) ||
    'pk_test_51T9KNECtoGuOmhQl79XF0A2N89qXwJkPqQ37YyG5qL8K34fQcK29D1p56m7N8pL9sR0tV1wX2yZ3aB4c',

  // Google Maps API Key
  googleMapsApiKey: (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
    'AIzaSyD-MarketEase-MockGoogleMapsKey2026',
};

/**
 * All Express.js Backend Endpoints mapped from authRoutes.js
 */
export const API_ENDPOINTS = {
  // Products
  getAllProductsWithFilter: (page = 1, pageSize = 10, sortBy = 'popular', cat = 'all') =>
    `${API_CONFIG.baseUrl}/getAllProduct/${page}/${pageSize}/${sortBy}/${cat}`,
  getProducts: `${API_CONFIG.baseUrl}/getProducts`,
  getProductById: (id: string | number) => `${API_CONFIG.baseUrl}/getProductbyID/${id}`,
  getProductByCat: (cat: string) => `${API_CONFIG.baseUrl}/getProductbyCAT/${cat}`,
  getProductByName: (name: string) => `${API_CONFIG.baseUrl}/getProductbyName/${name}`,
  getCategorySummary: `${API_CONFIG.baseUrl}/catproducts`,
  addProduct: `${API_CONFIG.baseUrl}/addproduct`,
  updateProduct: `${API_CONFIG.baseUrl}/updateproduct`,
  getImageUrl: (imageName: string) => `${API_CONFIG.baseUrl}/images/${imageName}`,

  // Customers & Auth
  getAllCustomers: `${API_CONFIG.baseUrl}/getAllcustomer`,
  addCustomer: `${API_CONFIG.baseUrl}/addcustomer`,
  authLogin: `${API_CONFIG.baseUrl}/authlogin`,
  updateCustomer: `${API_CONFIG.baseUrl}/updatecustomer`,
  changePassword: (email: string, pwd: string) => `${API_CONFIG.baseUrl}/changepwd/${encodeURIComponent(email)}/${encodeURIComponent(pwd)}`,
  checkEmail: (email: string) => `${API_CONFIG.baseUrl}/getEmail/${encodeURIComponent(email)}`,

  // Orders & Stripe Checkout
  addOrder: `${API_CONFIG.baseUrl}/addorder`,
  webhook: `${API_CONFIG.baseUrl}/webhook`,
};

/**
 * Standard API Request Headers builder
 * Automatically injects the required 'x-api-key' and optional JWT 'Authorization' header.
 */
export const getApiHeaders = (authToken?: string): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': API_CONFIG.apiKey,
  };

  if (authToken) {
    headers['Authorization'] = authToken;
  }

  return headers;
};
