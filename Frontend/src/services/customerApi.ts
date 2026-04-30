import { apiFetch } from '../utils/api';

export type CreateCustomerPayload = Record<string, string | string[] | null | undefined>;

export type CustomerResponse = Record<string, string | string[] | boolean | null | undefined> & {
  id: string;
  customerCode: string;
  brandName: string;
  officialTitle?: string | null;
  customerStatus: string;
  dataQualityStatus?: string | null;
  source: string;
  segment?: string | null;
  companyPhone?: string | null;
  companyWhatsapp?: string | null;
  services?: string[] | null;
  contact1FullName?: string | null;
  contact1Phone?: string | null;
  contact1Email?: string | null;
  contact1Title?: string | null;
  contact2FullName?: string | null;
  contact2Phone?: string | null;
  contact2Email?: string | null;
  contact2Title?: string | null;
  companyEmail?: string | null;
  website?: string | null;
  city?: string | null;
  country?: string | null;
  address?: string | null;
  newsletterPermission?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastUpdatedAt?: string | null;
  lastPriceUpdateAt?: string | null;
  isDeleted?: boolean;
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

export function getCustomers() {
  return apiFetch<CustomerResponse[] | ApiItemsEnvelope<CustomerResponse>>('/customers').then(unwrapItems);
}

export function getCustomerById(id: string) {
  return apiFetch<CustomerResponse>(`/customers/${id}`);
}

export function createCustomer(payload: CreateCustomerPayload) {
  return apiFetch<CustomerResponse>('/customers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateCustomer(id: string, payload: CreateCustomerPayload) {
  return apiFetch<CustomerResponse>(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
