import { authService } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface Order {
  trackingCode: string;
  status: string;
  pickUpCity: string | null;
  pickUpProvince: string | null;
  deliveryCity: string | null;
  deliveryProvince: string | null;
  weight: string;
  size: string;
  creationDate: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const ordersService = {
  async fetchOrders(params?: {
    id?: string;
    status?: string;
    pickUpCity?: string;
    pickUpProvince?: string;
    deliveryCity?: string;
    deliveryProvince?: string;
    weight?: string;
    size?: string;
    createdAt?: string;
  }): Promise<Order[]> {
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
    }

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/orders${queryString ? `?${queryString}` : ""}`;

    const response = await authService.fetchWithAuth(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error fetching orders: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Orders API response:", result);

    // Extract data from the response wrapper
    let orders = result;
    
    // Check if response has a data field (ApiResponse structure)
    if (result.data) {
      orders = result.data;
      console.log("Extracted orders from result.data:", orders);
    }

    // Ensure we always return an array
    if (!Array.isArray(orders)) {
      console.error("Orders is not an array:", orders);
      return [];
    }

    console.log(`Returning ${orders.length} orders`);
    return orders;
  },

  async getOrderById(id: string): Promise<Order[]> {
    return this.fetchOrders({ id });
  },
};
