import { authService } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface OrderLocation {
  id: number;
  pickupLongitude: number;
  pickupLatitude: number;
  pickupCity: string;
  pickupProvince: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  deliveryCity: string;
  deliveryProvince: string;
  province: string;
  zipCode: string;
  city: string;
  addressType: string;
  streetAddress: string;
  desiredPickupTime: string | null;
  deliveryTime: string | null;
  plannedDeliveryTime: string | null;
  deliveryDelay: number | null;
  estimatedArrival: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RiderLocation {
  id: string;
  riderId: number;
  positionTimestamp: string;
  latitude: number;
  longitude: number;
  distanceTraveled: number;
}

export interface UpdatePositionRequest {
  riderId: number;
  latitude: number;
  longitude: number;
}

export const locationService = {
  async getOrderLocation(orderId: number): Promise<OrderLocation> {
    const response = await authService.fetchWithAuth(
      `${API_BASE_URL}/api/orders/${orderId}/location`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch order location");
    }

    return response.json();
  },

  async getRiderLastPosition(riderId: number): Promise<RiderLocation | null> {
    const response = await authService.fetchWithAuth(
      `${API_BASE_URL}/tracking/last/${riderId}`,
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch rider position");
    }

    return response.json();
  },

  async getRiderHistory(riderId: number): Promise<RiderLocation[]> {
    const response = await authService.fetchWithAuth(
      `${API_BASE_URL}/tracking/history/${riderId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch rider history");
    }

    return response.json();
  },

  async updateRiderPosition(data: UpdatePositionRequest): Promise<void> {
    const response = await authService.fetchWithAuth(
      `${API_BASE_URL}/tracking`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update rider position");
    }
  },
};
