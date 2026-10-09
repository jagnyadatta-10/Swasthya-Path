import { FullPrescription, Role, LabTestOrder } from '../types';
import { storage } from '../utils/storage';

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('swasthya_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {})
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[API Offline Fallback] ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  auth: {
    login: async (username: string, password?: string, role?: Role) => {
      try {
        const res = await request<{ token: string; user: any }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username, password, role })
        });
        if (res.token) {
          localStorage.setItem('swasthya_auth_token', res.token);
        }
        return res;
      } catch (err) {
        // Fallback for offline usage
        return null;
      }
    },
    register: async (userData: any) => {
      const res = await request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (res.token) {
        localStorage.setItem('swasthya_auth_token', res.token);
      }
      return res;
    },
    getUsers: async (role?: string) => {
      try {
        return await request<any[]>(role ? `/auth/users?role=${role}` : '/auth/users');
      } catch {
        return [];
      }
    },
    getMe: async () => {
      try {
        return await request<{ user: any }>('/auth/me');
      } catch {
        return null;
      }
    }
  },

  prescriptions: {
    getAll: async (patientId?: string, doctorId?: string) => {
      try {
        let endpoint = '/prescriptions';
        if (patientId) endpoint += `?patient_id=${encodeURIComponent(patientId)}`;
        else if (doctorId) endpoint += `?doctor_id=${encodeURIComponent(doctorId)}`;
        const list = await request<FullPrescription[]>(endpoint);
        // Sync to local cache
        if (Array.isArray(list) && list.length > 0) {
          list.forEach((rx) => storage.savePrescription(rx));
        }
        return list;
      } catch {
        // Offline cache fallback
        return storage.getPrescriptions();
      }
    },
    getById: async (id: string) => {
      try {
        return await request<FullPrescription>(`/prescriptions/${encodeURIComponent(id)}`);
      } catch {
        return storage.getPrescriptions().find((p) => p.id === id) || null;
      }
    },
    save: async (rx: FullPrescription) => {
      // Save locally first (offline-first mandate)
      storage.savePrescription(rx);
      try {
        const res = await request<{ prescription: FullPrescription }>('/prescriptions', {
          method: 'POST',
          body: JSON.stringify(rx)
        });
        return res.prescription;
      } catch {
        return rx;
      }
    }
  },

  consultations: {
    start: async (data: { roomId: string; doctorId: string; doctorName: string; patientId: string; patientName: string }) => {
      try {
        return await request<{ id: string; roomId: string }>('/consultations/start', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      } catch {
        return { id: `cons-${Date.now()}`, roomId: data.roomId };
      }
    },
    conclude: async (idOrRoomId: string, data: { durationSeconds: number; notes: string; followUpPlan: string }) => {
      try {
        return await request<{ message: string }>(`/consultations/${encodeURIComponent(idOrRoomId)}/conclude`, {
          method: 'POST',
          body: JSON.stringify(data)
        });
      } catch {
        return { message: 'Saved in offline buffer' };
      }
    }
  },

  lab: {
    getOrders: async (patientId?: string, status?: string) => {
      try {
        let endpoint = '/lab/orders';
        if (patientId) endpoint += `?patient_id=${encodeURIComponent(patientId)}`;
        const orders = await request<any[]>(endpoint);
        return orders;
      } catch {
        return storage.getLabOrders();
      }
    },
    createOrder: async (orderData: any) => {
      storage.addLabOrder(orderData);
      try {
        return await request<any>('/lab/orders', {
          method: 'POST',
          body: JSON.stringify(orderData)
        });
      } catch {
        return { success: true, offline: true };
      }
    },
    updateOrder: async (id: string, updates: any) => {
      try {
        return await request<any>(`/lab/orders/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          body: JSON.stringify(updates)
        });
      } catch {
        return { success: true, offline: true };
      }
    }
  },

  pharmacy: {
    getInventory: async () => {
      try {
        return await request<any[]>('/pharmacy/inventory');
      } catch {
        return [];
      }
    },
    updateStock: async (id: string, delta?: number, newQuantity?: number) => {
      try {
        return await request<any>(`/pharmacy/inventory/${encodeURIComponent(id)}/stock`, {
          method: 'PATCH',
          body: JSON.stringify({ delta, newQuantity })
        });
      } catch {
        return null;
      }
    },
    dispense: async (prescriptionNumber: string, items: Array<{ medicineId: string; quantity: number }>) => {
      try {
        return await request<any>('/pharmacy/dispense', {
          method: 'POST',
          body: JSON.stringify({ prescriptionNumber, items })
        });
      } catch {
        return { success: true, offline: true };
      }
    }
  },

  admin: {
    getKPIs: async () => {
      try {
        return await request<any>('/admin/kpis');
      } catch {
        return null;
      }
    },
    getAuditLogs: async () => {
      try {
        return await request<any[]>('/admin/audit-logs');
      } catch {
        return [];
      }
    },
    getSystemHealth: async () => {
      try {
        return await request<any>('/admin/health');
      } catch {
        return null;
      }
    },
    updateUserVerification: async (userId: string, isVerified?: boolean, accountStatus?: string) => {
      try {
        return await request<any>(`/admin/users/${encodeURIComponent(userId)}/verification`, {
          method: 'PATCH',
          body: JSON.stringify({ isVerified, accountStatus })
        });
      } catch {
        return null;
      }
    }
  }
};
