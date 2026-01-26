import { authService } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface Order {
  id: string;
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

export interface OrderDetails extends Order {
  creatorName?: string;
  creatorSurname?: string;
  riderId?: number;
  riderName?: string;
  riderSurname?: string;
  riderTransport?: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  estimatedArrival?: string;
  plannedDeliveryTime?: string;
}

// API response interface
interface OrderDetailsResponse {
  orderId: number;
  trackingCode?: string;
  creatorFirstName?: string;
  creatorLastName?: string;
  orderStatus?: string;
  packageWeight?: number;
  packageSize?: number;
  riderFirstName?: string;
  riderLastName?: string;
  riderId?: number;
  vehicleType?: string;
  vehicleLicensePlate?: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  pickupCity?: string;
  pickupProvince?: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  deliveryCity?: string;
  deliveryProvince?: string;
  estimatedArrival?: string;
  creationDate?: string;
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

  async getOrderDetails(trackingCode: string): Promise<OrderDetails | null> {
    const url = `${API_BASE_URL}/api/orders/${trackingCode}`;
    console.log("Calling API:", url);

    const response = await authService.fetchWithAuth(url, {
      method: "GET",
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      if (response.status === 404) {
        console.log("Order not found (404)");
        return null;
      }
      throw new Error(`Error fetching order details: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("API response:", result);

    const apiData: OrderDetailsResponse = result.data || result;

    // Map API response to OrderDetails interface
    const orderDetails: OrderDetails = {
      id: String(apiData.orderId),
      trackingCode: apiData.trackingCode || String(apiData.orderId),
      status: apiData.orderStatus || "",
      pickUpCity: apiData.pickupCity || null,
      pickUpProvince: apiData.pickupProvince || null,
      deliveryCity: apiData.deliveryCity || null,
      deliveryProvince: apiData.deliveryProvince || null,
      weight: String(apiData.packageWeight || ""),
      size: String(apiData.packageSize || ""),
      creationDate: apiData.creationDate || "",
      creatorName: apiData.creatorFirstName || undefined,
      creatorSurname: apiData.creatorLastName || undefined,
      riderId: apiData.riderId,
      riderName: apiData.riderFirstName || undefined,
      riderSurname: apiData.riderLastName || undefined,
      riderTransport: apiData.vehicleType || undefined,
      pickupLatitude: apiData.pickupLatitude,
      pickupLongitude: apiData.pickupLongitude,
      deliveryLatitude: apiData.deliveryLatitude,
      deliveryLongitude: apiData.deliveryLongitude,
      estimatedArrival: apiData.estimatedArrival,
    };

    console.log("Mapped order details:", orderDetails);
    return orderDetails;
  },
};
