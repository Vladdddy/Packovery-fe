import { authService } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface Issue {
  id: string;
  orderId?: number | string;
  alertName?: string;
  type?: string;
  createdAt?: string;
  notes?: string;
  adminId?: number;
  status?: string;
}

export const alertIssuesService = {
  async getOpen(): Promise<Issue[]> {
    const res = await authService.fetchWithAuth(`${API_BASE_URL}/alert-issues/open`);
    if (!res.ok) throw new Error(`Failed to load issues: ${res.status}`);
    const data = await res.json();
    return (data || []).map((i: any) => ({
      id: String(i.id ?? i._id ?? i.uuid ?? i.uuidString ?? ""),
      orderId: i.issueRelatedOrderId ?? i.orderId ?? i.order?.id ?? i.orderIdStr,
      alertName: i.snapshotAlertName ?? i.alertName ?? i.name,
      type: i.snapshotAlertType ?? i.type ?? (i.alertType ? String(i.alertType) : undefined),
      createdAt:
        // Backend provides Instant in `issueCreationTime` (ISO-8601). Format to `HH:mm`.
        (function () {
          const ts = i.issueCreationTime ?? i.createdAt ?? i.created ?? i.time;
          if (!ts) return "";
          try {
            const d = new Date(ts);
            if (isNaN(d.getTime())) return "";
            return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          } catch (e) {
            return String(ts);
          }
        })(),
      notes: i.notes,
      adminId: i.adminId,
      status: i.status,
    }));
  },

  async getByOrder(orderId: number | string): Promise<Issue[]> {
    const res = await authService.fetchWithAuth(`${API_BASE_URL}/alert-issues/order/${orderId}`);
    if (!res.ok) throw new Error(`Failed to load issues by order: ${res.status}`);
    const data = await res.json();
    return data;
  },

  async createIssue(payload: { orderId: number; alertName: string; type: string }) {
    const body = {
      orderId: payload.orderId,
      alertName: payload.alertName,
      type: payload.type,
    };
    const res = await authService.fetchWithAuth(`${API_BASE_URL}/alert-issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Create issue failed: ${res.status}`);
    }
  },

  async resolveIssue(id: string, payload: { notes?: string }) {
    // Backend reads admin id from JWT token; only send notes in body
    const body = { notes: payload.notes };
    const res = await authService.fetchWithAuth(`${API_BASE_URL}/alert-issues/${id}/resolve`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Resolve failed: ${res.status}`);
    }
  },
};

export default alertIssuesService;
