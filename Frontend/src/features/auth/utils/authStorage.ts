export type AuthInfo = {
  token: string;
  fullName: string;
  email: string;
  role: string;
  defaultRoute: string;
};

const AUTH_STORAGE_KEY = 'ados.auth';
const TOKEN_STORAGE_KEY = 'token';
const FULL_NAME_STORAGE_KEY = 'fullName';
const EMAIL_STORAGE_KEY = 'email';
const ROLE_STORAGE_KEY = 'role';
const DEFAULT_ROUTE_STORAGE_KEY = 'defaultRoute';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getAuthInfo(): AuthInfo | null {
  if (!canUseStorage()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<AuthInfo>;

    if (!parsedValue.token || !parsedValue.fullName || !parsedValue.email || !parsedValue.role || !parsedValue.defaultRoute) {
      return null;
    }

    return {
      token: parsedValue.token,
      fullName: parsedValue.fullName,
      email: parsedValue.email,
      role: parsedValue.role,
      defaultRoute: parsedValue.defaultRoute,
    };
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function isAuthenticated() {
  const authInfo = getAuthInfo();
  return Boolean(authInfo?.token && isTokenCurrent(authInfo.token));
}

export function setAuthInfo(authInfo: AuthInfo) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authInfo));
  window.localStorage.setItem(TOKEN_STORAGE_KEY, authInfo.token);
  window.localStorage.setItem(FULL_NAME_STORAGE_KEY, authInfo.fullName);
  window.localStorage.setItem(EMAIL_STORAGE_KEY, authInfo.email);
  window.localStorage.setItem(ROLE_STORAGE_KEY, authInfo.role);
  window.localStorage.setItem(DEFAULT_ROUTE_STORAGE_KEY, authInfo.defaultRoute);
}

export function clearAuthInfo() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(FULL_NAME_STORAGE_KEY);
  window.localStorage.removeItem(EMAIL_STORAGE_KEY);
  window.localStorage.removeItem(ROLE_STORAGE_KEY);
  window.localStorage.removeItem(DEFAULT_ROUTE_STORAGE_KEY);
}

export function getDefaultRoute() {
  return getAuthInfo()?.defaultRoute ?? '/login';
}

export function isRouteAllowed(pathname: string) {
  const role = getAuthInfo()?.role;

  if (!role) {
    return false;
  }

  if (role === 'MasterAdmin' || role === 'GenelMudur') {
    return true;
  }

  if (role === 'Pazarlama' || role === 'PazarlamaYonetim') {
    return pathname.startsWith('/dashboards/marketing');
  }

  if (role === 'Satis' || role === 'SatisYonetim') {
    return pathname.startsWith('/dashboards/sales');
  }

  if (role === 'Finans' || role === 'FinansYonetim') {
    return pathname.startsWith('/dashboards/finance');
  }

  return false;
}

function isTokenCurrent(token: string) {
  const [, payload] = token.split('.');
  if (!payload) {
    return false;
  }

  try {
    const base64Payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const normalizedPayload = base64Payload.padEnd(base64Payload.length + ((4 - (base64Payload.length % 4)) % 4), '=');
    const decodedPayload = JSON.parse(window.atob(normalizedPayload)) as { exp?: number };

    if (!decodedPayload.exp) {
      return true;
    }

    return decodedPayload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
