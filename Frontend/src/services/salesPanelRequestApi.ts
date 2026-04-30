import { apiFetch } from '../utils/api';

export type SalesPanelRequest = {
  id: number;
  salesRoutingRequestId: number;
  sourceMarketingRequestId: number;
  requestCode?: string | null;
  customerId?: string | null;
  customerBrandName?: string | null;
  requestTitle: string;
  requestSource?: string | null;
  priority: string;
  requestStatus?: string | null;
  salesStatus: string;
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
  notes?: string | null;
  expectedOfferDate?: string | null;
  transferredAt: string;
  transferredByUserId?: string | null;
  transferredByUserName?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  isDeleted: boolean;
};

export type TransferSalesRoutingToSalesPanelResponse = {
  success: boolean;
  message: string;
  salesPanelRequestId?: number;
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

export function getSalesPanelRequests() {
  return apiFetch<SalesPanelRequest[] | ApiItemsEnvelope<SalesPanelRequest>>('/api/sales-panel-requests').then(unwrapItems);
}

export function getSalesPanelRequestById(id: number) {
  return apiFetch<SalesPanelRequest | { data?: SalesPanelRequest }>(`/api/sales-panel-requests/${Number(id)}`).then(unwrapItem);
}

export function getSalesPanelRequestsByCustomer(customerId: string) {
  const normalizedCustomerId = String(customerId ?? '').toLowerCase();

  return apiFetch<SalesPanelRequest[] | ApiItemsEnvelope<SalesPanelRequest>>(`/api/sales-panel-requests/by-customer/${customerId}`)
    .then(unwrapItems)
    .catch(async (error) => {
      console.error('SalesPanelRequests by-customer endpoint failed:', error);
      const allRequests = await getSalesPanelRequests();
      return allRequests.filter((request) => String(request.customerId ?? '').toLowerCase() === normalizedCustomerId);
    });
}

export function transferSalesRoutingToSalesPanel(salesRoutingRequestId: number) {
  return apiFetch<TransferSalesRoutingToSalesPanelResponse>(`/api/sales-panel-requests/from-routing/${Number(salesRoutingRequestId)}`, {
    method: 'POST',
  });
}
