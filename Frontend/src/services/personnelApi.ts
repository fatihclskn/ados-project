import { apiFetch } from '../utils/api';

export type Personnel = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  position: string;
  department: string;
  startDate: string;
  birthDate: string | null;
  salary: number | null;
  reportsTo: string | null;
  role: string;
  isActive: boolean;
  hasAdosAccess: boolean;
  accessLevel: string | null;
  panelAccess: string | null;
  mfaEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type CreatePersonnelPayload = {
  fullName: string;
  email: string;
  password: string;
  phone: string | null;
  position: string;
  department: string;
  startDate: string;
  birthDate: string | null;
  salary: number | null;
  reportsTo: string | null;
  role: string;
  hasAdosAccess: boolean;
  accessLevel: string | null;
  panelAccess: string | null;
  mfaEnabled: boolean;
};

export type UpdatePersonnelPayload = Omit<CreatePersonnelPayload, 'password'> & {
  password?: string | null;
  isActive: boolean;
};

export function getPersonnel() {
  return apiFetch<Personnel[]>('/api/personnel');
}

export function getPersonnelById(id: number) {
  return apiFetch<Personnel>(`/api/personnel/${id}`);
}

export function createPersonnel(payload: CreatePersonnelPayload) {
  return apiFetch<Personnel>('/api/personnel', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updatePersonnel(id: number, payload: UpdatePersonnelPayload) {
  return apiFetch<Personnel>(`/api/personnel/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function updatePersonnelStatus(id: number, isActive: boolean) {
  return apiFetch<Personnel>(`/api/personnel/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
}
