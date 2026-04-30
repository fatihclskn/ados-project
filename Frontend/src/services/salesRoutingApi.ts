import { apiFetch } from '../utils/api';

export type SalesRoutingRequest = {
  id: number;
  requestId: number;
  customerId?: string | null;
  customerBrandName?: string | null;
  requestTitle: string;
  requestSource?: string | null;
  priority: string;
  requestStatus?: string | null;
  routingStatus: string;
  salesStatus?: string | null;
  assignedTo?: string | null;
  notes?: string | null;
  routedAt: string;
  routedByUserId?: string | null;
  routedByUserName?: string | null;
  sentToSalesAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  customerContactName?: string | null;
  customerContactPhone?: string | null;
  customerContactEmail?: string | null;
  customerContactTitle?: string | null;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type ApiItemsEnvelope<T> = {
  items?: T[];
  data?: T[] | T;
  totalCount?: number;
};

function unwrapResponse<T>(response: T | ApiEnvelope<T>): T {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiEnvelope<T>).data;
  }

  return response as T;
}

function unwrapItems<T>(response: T[] | ApiItemsEnvelope<T>): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (response && typeof response === 'object') {
    if (Array.isArray(response.items)) {
      return response.items;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }
  }

  return [];
}

export function getSalesRoutingRequests() {
  return apiFetch<SalesRoutingRequest[] | ApiItemsEnvelope<SalesRoutingRequest>>('/api/sales-routing').then(unwrapItems);
}

export function getSalesRoutingRequestById(id: number) {
  return apiFetch<SalesRoutingRequest | ApiEnvelope<SalesRoutingRequest>>(`/api/sales-routing/${id}`).then(unwrapResponse);
}

export async function createSalesRoutingFromRequest(requestId: number) {
  const numericRequestId = Number(requestId);
  const response = await apiFetch<SalesRoutingRequest | ApiEnvelope<SalesRoutingRequest>>(`/api/sales-routing/from-request/${numericRequestId}`, {
    method: 'POST',
  });

  return unwrapResponse(response);
}

export async function sendSalesRoutingToSales(id: number) {
  const response = await apiFetch<SalesRoutingRequest | ApiEnvelope<SalesRoutingRequest>>(`/api/sales-routing/${id}/send-to-sales`, {
    method: 'POST',
  });

  return unwrapResponse(response);
}

export async function updateSalesRoutingHandoff(id: number, payload: { handoffNote?: string; expectedOfferDate?: string }) {
  const response = await apiFetch<SalesRoutingRequest | ApiEnvelope<SalesRoutingRequest>>(`/api/sales-routing/${id}/handoff`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return unwrapResponse(response);
}
