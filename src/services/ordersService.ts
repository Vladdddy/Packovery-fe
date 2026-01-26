const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface Order {
    id: number;
    trackingCode: string;
    creationDate: string;
    deliveryCity: string | null;
    deliveryProvince: string | null;
    pickUpCity: string | null;
    pickUpProvince: string | null;
    size: string;
    status: string;
    weight: string;
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
        const token = localStorage.getItem("accessToken");

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

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching orders: ${response.statusText}`);
        }

        const data: Order[] = await response.json();

        return data;
    },

    async getOrderById(id: string): Promise<Order[]> {
        return this.fetchOrders({ id });
    },
};
