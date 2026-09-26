/**
 * MarketEase - Express.js API Configuration & Keys
 * Synchronized with the backend located in MERN STACK PROJECT / EXPRESSJS
 */

export const API_CONFIG = {
  // Express Backend Server Base URL
  baseUrl: (import.meta.env.VITE_API_URL as string) || (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000',

  // Primary API Security Key (Passed via 'x-api-key' header for protected routes)
  apiKey: (import.meta.env.VITE_API_KEY as string) || 'Abcd123456789@|',

  // Project Specific Dedicated API Key
  marketEaseApiKey: (import.meta.env.VITE_MARKETEASE_API_KEY as string) || 'marketease_live_ak_9f8e7d6c5b4a321',

  // JWT Secret (Discovered in Express backend middleware)
  jwtSecret: (import.meta.env.VITE_JWT_SECRET as string) || 'Abcd12345678!?',

  // Stripe Payment Gateway Publishable Key (Corresponding to discovered secret key)
  stripePublishableKey: (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string) ||
    'pk_test_51T9KNECtoGuOmhQl79XF0A2N89qXwJkPqQ37YyG5qL8K34fQcK29D1p56m7N8pL9sR0tV1wX2yZ3aB4c',

  // Google Maps API Key (Optional)
  googleMapsApiKey: (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '',
};

/**
 * All Express.js Backend Endpoints
 */
export const API_ENDPOINTS = {
  // Products & 4-Dimension Search
  getAllProductsWithFilter: (page = 1, pageSize = 10, sortBy = 'popular', cat = 'all') =>
    `${API_CONFIG.baseUrl}/getAllProduct/${page}/${pageSize}/${sortBy}/${cat}`,
  getProducts: `${API_CONFIG.baseUrl}/getProducts`,
  searchProducts: `${API_CONFIG.baseUrl}/api/products/search`,
  getProductById: (id: string | number) => `${API_CONFIG.baseUrl}/getProductbyID/${id}`,
  getProductByCat: (cat: string) => `${API_CONFIG.baseUrl}/getProductbyCAT/${cat}`,
  getProductByName: (name: string) => `${API_CONFIG.baseUrl}/getProductbyName/${name}`,
  getCategorySummary: `${API_CONFIG.baseUrl}/catproducts`,
  addProduct: `${API_CONFIG.baseUrl}/addproduct`,
  updateProduct: `${API_CONFIG.baseUrl}/updateproduct`,
  deleteProduct: (id: string | number) => `${API_CONFIG.baseUrl}/api/products/${id}`,
  getImageUrl: (imageName: string) => `${API_CONFIG.baseUrl}/images/${imageName}`,

  // Customers, Auth & Email Verification
  getAllCustomers: `${API_CONFIG.baseUrl}/getAllcustomer`,
  addCustomer: `${API_CONFIG.baseUrl}/addcustomer`,
  authLogin: `${API_CONFIG.baseUrl}/authlogin`,
  updateCustomer: `${API_CONFIG.baseUrl}/updatecustomer`,
  changePassword: (email: string, pwd: string) => `${API_CONFIG.baseUrl}/changepwd/${encodeURIComponent(email)}/${encodeURIComponent(pwd)}`,
  checkEmail: (email: string) => `${API_CONFIG.baseUrl}/getEmail/${encodeURIComponent(email)}`,
  verifyEmail: `${API_CONFIG.baseUrl}/api/auth/verify-email`,
  resendVerificationCode: `${API_CONFIG.baseUrl}/api/auth/resend-code`,
  getVerificationCode: (email: string) => `${API_CONFIG.baseUrl}/api/auth/verification-code/${encodeURIComponent(email)}`,
  getCurrentUser: `${API_CONFIG.baseUrl}/api/auth/me`,

  // Cart Management
  getCart: (customerId: string) => `${API_CONFIG.baseUrl}/api/cart?customerId=${encodeURIComponent(customerId)}`,
  addToCart: `${API_CONFIG.baseUrl}/api/cart/add`,
  updateCartItem: `${API_CONFIG.baseUrl}/api/cart/update`,
  removeCartItem: (productId: string) => `${API_CONFIG.baseUrl}/api/cart/item/${productId}`,
  clearCart: `${API_CONFIG.baseUrl}/api/cart/clear`,
  calculateTotals: `${API_CONFIG.baseUrl}/api/cart/calculate`,

  // Orders & Live 6-Stage Delivery Tracking
  addOrder: `${API_CONFIG.baseUrl}/addorder`,
  getOrderById: (id: string) => `${API_CONFIG.baseUrl}/api/orders/${id}`,
  getCustomerOrders: (email: string) => `${API_CONFIG.baseUrl}/api/orders?email=${encodeURIComponent(email)}`,
  advanceDeliveryStep: (id: string) => `${API_CONFIG.baseUrl}/api/orders/${id}/advance-step`,
  cancelOrder: (id: string) => `${API_CONFIG.baseUrl}/api/orders/${id}/cancel`,
  modifyOrder: (id: string) => `${API_CONFIG.baseUrl}/api/orders/${id}/modify`,

  // Stripe Payments
  createPaymentIntent: `${API_CONFIG.baseUrl}/api/payment/create-intent`,
  verifyPayment: `${API_CONFIG.baseUrl}/api/payment/verify`,
  webhook: `${API_CONFIG.baseUrl}/webhook`,

  // Admin Operations
  adminMetrics: `${API_CONFIG.baseUrl}/api/admin/metrics`,
  adminFarmers: `${API_CONFIG.baseUrl}/api/admin/farmers`,
  adminApproveFarmer: (id: string) => `${API_CONFIG.baseUrl}/api/admin/farmers/${id}/approve`,
  adminSuspendFarmer: (id: string) => `${API_CONFIG.baseUrl}/api/admin/farmers/${id}/suspend`,
  adminCustomers: `${API_CONFIG.baseUrl}/api/admin/customers`,
  adminToggleCustomer: (id: string) => `${API_CONFIG.baseUrl}/api/admin/customers/${id}/toggle`,
  adminMarkets: `${API_CONFIG.baseUrl}/api/admin/markets`,
  adminModeration: `${API_CONFIG.baseUrl}/api/admin/moderation`,
  adminCategories: `${API_CONFIG.baseUrl}/api/admin/categories`,
  adminAnnouncements: `${API_CONFIG.baseUrl}/api/admin/announcements`,

  // Interactive Map & Stalls
  marketStalls: (marketId: string) => `${API_CONFIG.baseUrl}/api/markets/${marketId}/stalls`,
  allMarketStalls: `${API_CONFIG.baseUrl}/api/markets/stalls/all`,
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
    headers['Authorization'] = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
  } else {
    // Check if token in localStorage
    try {
      const stored = localStorage.getItem('marketlink_auth_token');
      if (stored) {
        headers['Authorization'] = stored.startsWith('Bearer ') ? stored : `Bearer ${stored}`;
      }
    } catch {
      // ignore
    }
  }

  return headers;
};
