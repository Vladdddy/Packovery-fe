const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface Order {
    id: bigint;
    actual_size: number;
    actual_weight: number;
    created_at: string;
    creation_date: string;
    oversize: boolean;
    overweight: boolean;
    package_size: string;
    package_weight: string;
    sender_id: bigint;
    status: string;
    tracking_code: string;
    updated_at: string;
    rider_id: bigint;
    vehicle_id: bigint;
}

export const ordersService = {
    async fetchOrders(): Promise<Order[]> {
        const token = localStorage.getItem("accessToken");

        const response = await fetch(`${API_BASE_URL}/api/orders`, {
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
};
