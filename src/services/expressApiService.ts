/**
 * MarketEase - Express Backend Client Service
 * Connects the MarketEase React frontend with the Express.js / MongoDB backend.
 */
import { API_CONFIG, API_ENDPOINTS, getApiHeaders } from '../config/api.config';

export interface BackendProduct {
  _id?: string;
  id?: string;
  productID?: number;
  productName: string;
  name?: string;
  productLine: string;
  category?: string;
  productVendor: string;
  farmerName?: string;
  farmName?: string;
  buyPrice: number;
  price?: number;
  image?: string;
  imageType?: string;
  unit?: string;
  stock?: number;
  quantityInStock?: number;
  area?: string;
  marketName?: string;
  farmerRating?: number;
  description?: string;
  productDescription?: string;
}

export interface BackendCustomer {
  _id?: string;
  id?: string;
  customerNumber?: number;
  customerName: string;
  name?: string;
  email: string;
  phone?: string;
  addressLine1?: string;
  address?: string;
  city?: string;
  role?: string;
  status?: string;
  isEmailVerified?: boolean;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  customers?: BackendCustomer[];
  customer?: BackendCustomer;
  user?: any;
  msg?: string;
}

export const expressApiService = {
  /**
   * 1. Fetch all products without pagination
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
   * 2. 4-Dimension Produce Search Engine (Farmer, Category, Price Range, Area, Keyword)
   */
  async searchProducts(params: {
    q?: string;
    farmer?: string;
    category?: string;
    area?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    pageSize?: number;
    sortBy?: string;
  }): Promise<{ products: BackendProduct[]; totalCount: number; totalPages: number; facets?: any }> {
    try {
      const res = await fetch(API_ENDPOINTS.searchProducts, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Express API searchProducts offline:', err);
      return { products: [], totalCount: 0, totalPages: 0 };
    }
  },

  /**
   * 3. Fetch paginated and categorized products (Legacy)
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
   * 4. Authenticate customer with Express backend
   */
  async loginCustomer(email: string, pwd: string): Promise<LoginResponse> {
    try {
      const res = await fetch(API_ENDPOINTS.authLogin, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({ email, pwd }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('marketlink_auth_token', data.token);
      }
      return data;
    } catch (err) {
      console.error('Express API login failed:', err);
      return { success: false, msg: 'Could not connect to Express backend server.' };
    }
  },

  /**
   * 5. Register customer in Express backend & trigger email verification code
   */
  async registerCustomer(payload: {
    name: string;
    email: string;
    pwd?: string;
    password?: string;
    address: string;
    phone?: string;
    contactNumber?: string;
  }): Promise<{ success: boolean; msg: string; requiresVerification?: boolean; verificationCodePreview?: string }> {
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
   * 6. Validate 6-digit Email Verification Code
   */
  async verifyEmail(email: string, code: string): Promise<{ success: boolean; msg: string; user?: any }> {
    try {
      const res = await fetch(API_ENDPOINTS.verifyEmail, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({ email, code }),
      });
      return await res.json();
    } catch (err) {
      console.error('Email verification error:', err);
      return { success: false, msg: 'Failed to connect to verification service.' };
    }
  },

  /**
   * 7. Resend Verification Code
   */
  async resendVerificationCode(email: string): Promise<{ success: boolean; msg: string; verificationCodePreview?: string }> {
    try {
      const res = await fetch(API_ENDPOINTS.resendVerificationCode, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch (err) {
      console.error('Resend verification code error:', err);
      return { success: false, msg: 'Failed to resend code.' };
    }
  },

  /**
   * 8. Inspect Active Verification Code (For simulated inbox)
   */
  async getSimulatedVerificationCode(email: string): Promise<string | null> {
    try {
      const res = await fetch(API_ENDPOINTS.getVerificationCode(email), {
        headers: getApiHeaders(),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.code || null;
    } catch {
      return null;
    }
  },

  /**
   * 9. Submit pre-order / order to Express & initiate Stripe checkout session
   */
  async submitOrder(orderData: {
    customer: any;
    items: {
      name: string;
      buyPrice?: number;
      price?: number;
      qty?: number;
      quantity?: number;
    }[];
    total?: number;
    paymentmethod?: string;
    paymentMethod?: string;
    deliveryType?: string;
    deliveryAddress?: string;
    deliveryArea?: string;
    pickupDate?: string;
    pickupSlot?: string;
    notes?: string;
  }): Promise<{ success?: boolean; url?: string; orderId?: string; orderNumber?: string; order?: any; error?: string }> {
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

  /**
   * 10. Verify Stripe Payment Server-Side
   */
  async verifyPayment(orderId: string, sessionId?: string): Promise<{ success: boolean; order?: any; message?: string }> {
    try {
      const res = await fetch(API_ENDPOINTS.verifyPayment, {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({ orderId, sessionId }),
      });
      return await res.json();
    } catch (err) {
      console.error('Payment verification error:', err);
      return { success: false, message: 'Could not verify payment.' };
    }
  },

  /**
   * 11. Fetch Order Tracking Details & Live Status
   */
  async getOrderById(id: string): Promise<{ success: boolean; order?: any }> {
    try {
      const res = await fetch(API_ENDPOINTS.getOrderById(id), {
        headers: getApiHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false };
    }
  },

  /**
   * 12. Advance Delivery Step (Live Tracking Demo)
   */
  async advanceDeliveryStep(id: string): Promise<{ success: boolean; deliveryStep?: number; status?: string; order?: any }> {
    try {
      const res = await fetch(API_ENDPOINTS.advanceDeliveryStep(id), {
        method: 'POST',
        headers: getApiHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false };
    }
  },

  /**
   * 13. Fetch Admin Metrics
   */
  async getAdminMetrics(): Promise<any> {
    try {
      const res = await fetch(API_ENDPOINTS.adminMetrics, {
        headers: getApiHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false };
    }
  },

  /**
   * 14. Fetch Admin Farmers
   */
  async getAdminFarmers(status = 'all', search = ''): Promise<any> {
    try {
      const url = `${API_ENDPOINTS.adminFarmers}?status=${encodeURIComponent(status)}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url, { headers: getApiHeaders() });
      return await res.json();
    } catch (err) {
      return { success: false, farmers: [] };
    }
  },

  /**
   * 15. Approve Farmer
   */
  async approveFarmer(id: string): Promise<any> {
    try {
      const res = await fetch(API_ENDPOINTS.adminApproveFarmer(id), {
        method: 'POST',
        headers: getApiHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false };
    }
  },

  /**
   * 16. Suspend Farmer
   */
  async suspendFarmer(id: string): Promise<any> {
    try {
      const res = await fetch(API_ENDPOINTS.adminSuspendFarmer(id), {
        method: 'POST',
        headers: getApiHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false };
    }
  },
};
