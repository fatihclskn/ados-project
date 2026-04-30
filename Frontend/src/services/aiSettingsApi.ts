import { apiFetch } from '../utils/api';

export type AiSetting = {
  id: number;
  providerName: string;
  apiBaseUrl: string;
  apiEndpoint: string;
  apiKey?: string | null;
  modelName?: string | null;
  isActive: boolean;
  description?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  isDeleted: boolean;
};

export type UpdateAiSettingPayload = {
  providerName: string;
  apiBaseUrl: string;
  apiEndpoint: string;
  apiKey?: string | null;
  modelName?: string | null;
  isActive: boolean;
  description?: string | null;
};

export function getAiSettings() {
  return apiFetch<AiSetting[]>('/ai-settings');
}

export function getActiveAiSetting() {
  return apiFetch<AiSetting>('/ai-settings/active');
}

export function updateAiSetting(id: number, payload: UpdateAiSettingPayload) {
  return apiFetch<AiSetting>(`/ai-settings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
