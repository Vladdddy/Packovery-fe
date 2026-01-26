import { authService } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface AlertPayload {
  name: string;
  description?: string;
  type: string;
  threshold: string; // HH:MM
  active?: boolean;
}

export interface Alert {
  id: string;
  name: string;
  description?: string;
  type: string;
  threshold: string;
  active: boolean;
  created?: string;
}

const normalizeRule = (r: any): Alert => {
  const id = r.id ?? r._id ?? (r._id && r._id.$oid) ?? "";
  const sanitizeThreshold = (v: any): string => {
    if (v === null || v === undefined) return "";
    const s = String(v).trim();
    // Accept formats like HH:mm, HH:mm:ss, HH:mm:ss.SSS
    const hhmmMatch = s.match(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d)(?:\.\d{1,3})?)?$/);
    if (hhmmMatch) return `${hhmmMatch[1]}:${hhmmMatch[2]}`;
    // Try to extract numbers (e.g. "2.0" -> "02:00", "8:30" variants)
    const nums = s.match(/(\d{1,2})[^0-9]?(\d{1,2})?$/);
    if (nums) {
      const hh = Number(nums[1]);
      const mm = nums[2] ? Number(nums[2]) : 0;
      if (!Number.isNaN(hh) && hh >= 0 && hh <= 23 && !Number.isNaN(mm) && mm >= 0 && mm <= 59) {
        return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
      }
    }
    // Single numeric value like "2" or "2.0" => interpret as hours
    const single = s.match(/^(\d{1,2})(?:\.\d+)?$/);
    if (single) {
      const hh = Number(single[1]);
      if (!Number.isNaN(hh) && hh >= 0 && hh <= 23) return `${String(hh).padStart(2, "0")}:00`;
    }
    return "";
  };
  const threshold = sanitizeThreshold(r.threshold ?? r.timeThreshold ?? "");
  const active =
    r.active ?? (typeof r.status === "string" ? r.status.toUpperCase() === "ACTIVE" : !!r.status);
  return {
    id: String(id),
    name: r.name ?? "",
    description: r.description,
    type: (() => {
      const ENUM_TO_LABEL: Record<string, string> = {
        DELAY_START: "Ritardo partenza ordine",
        DELAY_DELIVERY: "Ritardo consegna ordine",
        GPS_LOST: "Segnale GPS interrotto",
        CUSTOM: "Custom",
      };
      const raw = r.type ?? (r.type ? String(r.type) : "");
      if (!raw) return "";
      // If backend returns enum value, map to label
      if (ENUM_TO_LABEL[raw]) return ENUM_TO_LABEL[raw];
      // Otherwise assume it's already a label
      return String(raw);
    })(),
    threshold,
    active,
    created: r.created ?? r.createdAt ?? "",
  };
};

export const alertsService = {
  async listAlerts(): Promise<Alert[]> {
    const res = await authService.fetchWithAuth(`${API_BASE_URL}/alert-rules`);
    if (!res.ok) throw new Error(`Failed to load alerts: ${res.status}`);
    const data = await res.json();
    const map = new Map<string, any>();
    (data || []).forEach((r: any, idx: number) => {
      const key = String(r.id ?? r._id ?? (r._id && r._id.$oid) ?? idx);
      if (!map.has(key)) map.set(key, r);
    });
    return Array.from(map.values()).map(normalizeRule);
  },

  async getAlert(id: string): Promise<Alert> {
    // Some backends don't support GET /alert-rules/{id} (405) or may
    // return other non-OK statuses. Try direct GET first; if it fails
    // for any reason, fall back to listing all alerts and finding the
    // requested id.
    const res = await authService.fetchWithAuth(`${API_BASE_URL}/alert-rules/${id}`);
    if (res.ok) {
      const data = await res.json();
      return normalizeRule(data);
    }

    // Fallback: try to find the alert in the list endpoint
    try {
      const list = await this.listAlerts();
      const found = list.find((r) => String(r.id) === String(id));
      if (!found) throw new Error(`Alert ${id} not found`);
      return found;
    } catch (e) {
      throw new Error(`Failed to load alert ${id}: ${res.status}`);
    }
  },

  async createAlert(payload: AlertPayload): Promise<Alert> {
    const TYPE_LABEL_TO_ENUM: Record<string, string> = {
      "Ritardo partenza ordine": "DELAY_START",
      "Ritardo consegna ordine": "DELAY_DELIVERY",
      "Segnale GPS interrotto": "GPS_LOST",
    };

    const body = {
      name: payload.name,
      description: payload.description,
      type: TYPE_LABEL_TO_ENUM[payload.type] ?? payload.type ?? "CUSTOM",
      threshold: payload.threshold,
    };
    const res = await authService.fetchWithAuth(`${API_BASE_URL}/alert-rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Create failed: ${res.status}`);
    }
    // Try to parse JSON, but handle empty/invalid response
    let data: any = null;
    try {
      data = await res.json();
    } catch (e) {
      // Se la risposta è vuota, costruisci un alert di fallback dai dati inviati
      return normalizeRule({
        ...body,
        id: undefined,
        active: payload.active ?? true,
        created: undefined,
      });
    }
    if (!data) {
      return normalizeRule({
        ...body,
        id: undefined,
        active: payload.active ?? true,
        created: undefined,
      });
    }
    return normalizeRule(data);
  },

  async updateAlert(id: string, payload: AlertPayload | { active: boolean }): Promise<Alert> {
    const TYPE_LABEL_TO_ENUM: Record<string, string> = {
      "Ritardo partenza ordine": "DELAY_START",
      "Ritardo consegna ordine": "DELAY_DELIVERY",
      "Segnale GPS interrotto": "GPS_LOST",
    };

    const isStatusOnly = (p: any): p is { active: boolean } =>
      Object.keys(p).length === 1 && typeof p.active === "boolean";

    if (isStatusOnly(payload)) {
      const statusBody = { status: payload.active ? "ACTIVE" : "INACTIVE" };
      const res = await authService.fetchWithAuth(`${API_BASE_URL}/alert-rules/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statusBody),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Update status failed: ${res.status}`);
      }
      return { id, name: "", type: "", threshold: "", active: payload.active, description: "", created: undefined };
    }

    // Full update (PUT /alert-rules/{id})
    const full = payload as AlertPayload;
    const body = {
      name: full.name,
      description: full.description,
      type: TYPE_LABEL_TO_ENUM[full.type] ?? full.type ?? "CUSTOM",
      threshold: full.threshold,
    };

    const res = await authService.fetchWithAuth(`${API_BASE_URL}/alert-rules/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Update failed: ${res.status}`);
    }

    // Try to fetch the updated resource; if that fails, build a fallback
    const getRes = await authService.fetchWithAuth(`${API_BASE_URL}/alert-rules/${id}`);
    if (!getRes.ok) {
      return normalizeRule({ id, ...body, active: full.active ?? true, created: undefined });
    }
    const data = await getRes.json();
    return normalizeRule(data);
  },

  async deleteAlert(id: string): Promise<void> {
    const res = await authService.fetchWithAuth(`${API_BASE_URL}/alert-rules/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Delete failed: ${res.status}`);
    }
  },
};
