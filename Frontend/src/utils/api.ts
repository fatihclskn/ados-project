import { getAuthInfo } from '../features/auth/utils/authStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:44351/api';

export class ApiRequestError extends Error {
  response?: {
    data: unknown;
    status: number;
  };

  config?: {
    url: string;
  };

  url: string;

  constructor(message: string, status: number, data: unknown, url: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.response = { data, status };
    this.config = { url };
    this.url = url;
  }
}

export async function apiFetch<TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> {
  const authInfo = getAuthInfo();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (authInfo?.token) {
    headers.set('Authorization', `Bearer ${authInfo.token}`);
  }

  const normalizedPath = path.startsWith('/api/') ? path.slice(4) : path;
  const requestUrl = `${API_BASE_URL}${normalizedPath}`;
  const response = await fetch(requestUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = 'İşlem tamamlanamadı.';
    let errorBody: unknown = null;
    try {
      errorBody = await response.json();
      if (errorBody && typeof errorBody === 'object') {
        const body = errorBody as { detail?: string; errors?: Record<string, string[]>; message?: string; title?: string };
        const firstValidationMessage = body.errors ? Object.values(body.errors).flat()[0] : undefined;
        message = body.message ?? body.detail ?? firstValidationMessage ?? body.title ?? message;
      }
    } catch {
      message = response.statusText || message;
    }

    console.error('API request failed', {
      method: options.method ?? 'GET',
      url: requestUrl,
      status: response.status,
      body: errorBody,
      message,
    });

    throw new ApiRequestError(message, response.status, errorBody, requestUrl);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}
