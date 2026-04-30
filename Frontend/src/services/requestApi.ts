import { apiFetch } from '../utils/api';

export type CustomerRequestPayload = {
  customerId?: string | null;
  customerBrandName?: string | null;
  requestTitle: string;
  requestSource: string;
  priority?: string | null;
  status?: string | null;
  department?: string | null;
  assignedTo?: string | null;
  description?: string | null;
  services?: string[];
  contactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  customerContactName?: string | null;
  customerContactPhone?: string | null;
  customerContactEmail?: string | null;
  customerContactTitle?: string | null;
};

export type CustomerRequest = CustomerRequestPayload & {
  id: number;
  requestCode: string;
  priority: string;
  status: string;
  services: string[];
  createdByUserId?: string | null;
  createdByUserName?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  isDeleted: boolean;
  isSentToSalesRouting: boolean;
  sentToSalesRoutingAt?: string | null;
  isSentToSales: boolean;
  sentToSalesAt?: string | null;
  salesStatus?: string | null;
};

export function getRequests() {
  return apiFetch<CustomerRequest[]>('/api/requests');
}

export function getReadyForSalesRequests() {
  return apiFetch<CustomerRequest[]>('/api/requests/ready-for-sales');
}

export function getSalesRoutingRequests() {
  return apiFetch<CustomerRequest[]>('/api/requests/sales-routing');
}

export function getSalesRequests() {
  return apiFetch<CustomerRequest[]>('/api/requests/sales');
}

export function getRequestById(id: number) {
  return apiFetch<CustomerRequest>(`/api/requests/${id}`);
}

export function createRequest(payload: CustomerRequestPayload) {
  return apiFetch<CustomerRequest>('/api/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function sendRequestToSales(id: number) {
  return apiFetch<CustomerRequest>(`/api/requests/${id}/send-to-sales`, {
    method: 'POST',
  });
}

export function sendRequestToSalesRouting(id: number) {
  return apiFetch<CustomerRequest>(`/api/requests/${id}/send-to-sales-routing`, {
    method: 'POST',
  });
}

export function updateRequest(id: number, payload: CustomerRequestPayload) {
  return apiFetch<CustomerRequest>(`/api/requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteRequest(id: number) {
  return apiFetch<void>(`/api/requests/${id}`, {
    method: 'DELETE',
  });
}
