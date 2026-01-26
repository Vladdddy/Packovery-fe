import { authService } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface RiderLocation {
  id: number;
  riderId: number;
  latitude: number;
  longitude: number;
  positionTimestamp: string;
  distanceTraveled: number;
}

export interface OrderLocationData {
  pickupLatitude: string;
  pickupLongitude: string;
  pickupCity: string;
  pickupProvince: string;
  deliveryLatitude: string;
  deliveryLongitude: string;
  deliveryCity: string;
  deliveryProvince: string;
  estimatedArrival: string;
}

export const trackingService = {
  async getLastPosition(riderId: number): Promise<RiderLocation | null> {
    const url = `${API_BASE_URL}/api/tracking/last/${riderId}`;

    const response = await authService.fetchWithAuth(url, {
      method: "GET",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error fetching last position: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  },

  async getRouteHistory(riderId: number): Promise<RiderLocation[]> {
    const url = `${API_BASE_URL}/api/tracking/history/${riderId}`;

    const response = await authService.fetchWithAuth(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error fetching route history: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  },
};
