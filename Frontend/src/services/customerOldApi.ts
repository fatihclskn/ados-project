import { apiFetch } from '../utils/api';
import type { CreateCustomerPayload, CustomerResponse } from './customerApi';

export type CustomerOldResponse = {
  id: number;
  customerCode?: string | null;
  brandName?: string | null;
  officialTitle?: string | null;
  customerStatus?: string | null;
  dataQualityStatus?: string | null;
  source?: string | null;
  segment?: string | null;
  companyPhone?: string | null;
  companyEmail?: string | null;
  city?: string | null;
  country?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  isDeleted?: boolean;
};

export function getCustomersOld() {
  return apiFetch<CustomerOldResponse[]>('/customers-old');
}

export function getCustomerOldById(id: number) {
  return apiFetch<CustomerOldResponse>(`/customers-old/${id}`);
}

export function transferCustomerOldToCustomers(id: number, payload: CreateCustomerPayload) {
  return apiFetch<CustomerResponse>(`/customers-old/${id}/transfer-to-customers`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
