/**
 * MarketEase - Express Backend Client Service
 * Connects the MarketEase React frontend with the Express.js / MongoDB backend.
 */
import { API_CONFIG, API_ENDPOINTS, getApiHeaders } from '../config/api.config';

export interface BackendProduct {
  _id?: string;
  productID?: number;
  productName: string;
  productLine: string;
  productVendor: string;
  buyPrice: number;
  image?: string;
}

export interface BackendCustomer {
  customerNumber?: number;
  customerName: string;
  email: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  customers?: BackendCustomer[];
  msg?: string;
}

export const expressApiService = {
  /**
   * Fetch all products without pagination
   */
  async getProducts(): Promise<BackendProduct[]> {
    try {
      const res = await fetch(API_ENDPOINTS.getProducts, {
        headers: getApiHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.products || [];
    } catch (err) {
      console.warn('Express API getProducts offline, using fallback:', err);
      return [];
    }
  },

  /**
   * Fetch paginated and categorized products (Protected with x-api-key)
   */
  async getFilteredProducts(
    page = 1,
    pageSize = 10,
    sortBy = 'popular',
    cat = 'all'
  ): Promise<any> {
    try {
      const res = await fetch(
        API_ENDPOINTS.getAllProductsWithFilter(page, pageSize, sortBy, cat),
        {
          headers: getApiHeaders(),
        }
      );
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Express API getFilteredProducts offline:', err);
      return null;
    }
  },

  /**
   * Authenticate customer with Express backend
   */
  async loginCustomer(email: string, pwd: string): Promise<LoginResponse> {
    try {
      const res = await fetch(API_ENDPOINTS.authLogin, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({ email, pwd }),
      });
      return await res.json();
    } catch (err) {
      console.error('Express API login failed:', err);
      return { success: false, msg: 'Could not connect to Express backend server.' };
    }
  },

  /**
   * Register customer in Express backend
   */
  async registerCustomer(payload: {
    name: string;
    email: string;
    pwd: string;
    address: string;
  }): Promise<{ success: boolean; msg: string }> {
    try {
      const res = await fetch(API_ENDPOINTS.addCustomer, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (err) {
      console.error('Express API registration failed:', err);
      return { success: false, msg: 'Failed to communicate with Express server.' };
    }
  },

  /**
   * Submit pre-order / order to Express & initiate Stripe checkout session
   */
  async submitOrder(orderData: {
    customer: string;
    items: {
      name: string;
      buyPrice: number;
      qty: number;
    }[];
    total: number;
    paymentmethod: string;
  }): Promise<{ url?: string; error?: string }> {
    try {
      const res = await fetch(API_ENDPOINTS.addOrder, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(orderData),
      });
      return await res.json();
    } catch (err) {
      console.error('Express API submitOrder error:', err);
      return { error: 'Failed to place order via Express backend.' };
    }
  },
};
