import { authService } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface RiderCommunication {
  id?: string;
  _id?: string;
  senderId?: number;
  riderId?: number;
  messageContent?: string;
  messageSentTime?: string;
  messageReadStatus?: boolean;
}

export const communicationService = {
  async sendMessage(riderId: number, content: string): Promise<void> {
    const url = `${API_BASE_URL}/communications`;
    await authService.fetchWithAuth(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ riderId, content }),
    });
  },

  async getMessagesForRider(riderId: number): Promise<RiderCommunication[]> {
    const url = `${API_BASE_URL}/communications/rider/${riderId}`;
    const res = await authService.fetchWithAuth(url);
    if (res.status === 404) return [];
    if (!res.ok) throw new Error("Errore nel recupero messaggi");
    const data = await res.json();
    return data as RiderCommunication[];
  },

  async markAsRead(messageId: string): Promise<void> {
    const url = `${API_BASE_URL}/communications/${messageId}/read`;
    const res = await authService.fetchWithAuth(url, { method: "PUT" });
    if (!res.ok) throw new Error("Impossibile marcare come letto");
  },
};

export default communicationService;
