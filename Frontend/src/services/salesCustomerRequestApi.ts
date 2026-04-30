import { apiFetch } from '../utils/api';

export type SalesCustomerRequest = {
  id: number;
  sourceMarketingRequestId: number;
  requestCode: string;
  customerId?: string | null;
  customerBrandName?: string | null;
  requestTitle: string;
  requestSource: string;
  priority: string;
  status: string;
  department?: string | null;
  assignedTo?: string | null;
  description?: string | null;
  services: string[];
  contactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  customerContactName?: string | null;
  customerContactPhone?: string | null;
  customerContactEmail?: string | null;
  customerContactTitle?: string | null;
  createdByUserId?: string | null;
  createdByUserName?: string | null;
  transferredAt: string;
  transferredByUserId?: string | null;
  transferredByUserName?: string | null;
  isTransferredFromMarketing: boolean;
  createdAt: string;
  updatedAt?: string | null;
  isDeleted: boolean;
  isSentToSalesRouting: boolean;
  sentToSalesRoutingAt?: string | null;
  isSentToSales: boolean;
  sentToSalesAt?: string | null;
  salesStatus?: string | null;
};

export type TransferMarketingRequestResponse = {
  success: boolean;
  message: string;
  salesRequestId?: number;
};

type ApiItemsEnvelope<T> = {
  items?: T[];
  data?: T[] | T;
  totalCount?: number;
};

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

function unwrapItem<T>(response: T | { data?: T }): T {
  if (response && typeof response === 'object' && 'data' in response && response.data) {
    return response.data;
  }

  return response as T;
}

export function getSalesCustomerRequests() {
  return apiFetch<SalesCustomerRequest[] | ApiItemsEnvelope<SalesCustomerRequest>>('/api/sales-requests').then(unwrapItems);
}

export function getSalesCustomerRequestById(id: number) {
  return apiFetch<SalesCustomerRequest | { data?: SalesCustomerRequest }>(`/api/sales-requests/${id}`).then(unwrapItem);
}

export function transferMarketingRequestToSales(marketingRequestId: number) {
  return apiFetch<TransferMarketingRequestResponse>(`/api/sales-requests/from-marketing-request/${Number(marketingRequestId)}`, {
    method: 'POST',
  });
}

export function sendSalesCustomerRequestToSales(id: number) {
  return apiFetch<SalesCustomerRequest | { data?: SalesCustomerRequest }>(`/api/sales-requests/${Number(id)}/send-to-sales`, {
    method: 'POST',
  }).then(unwrapItem);
}
