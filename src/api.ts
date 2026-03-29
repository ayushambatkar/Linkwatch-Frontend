import { clearAuthState, loadAuthState, saveAuthState } from './auth';
import type { AuthState, Link, LinkAnalytics, OverviewAnalytics } from './types';
import { AppConstants } from './config/appConstants';

const API_BASE_URL = AppConstants.API_BASE_URL;
const SHORT_LINK_BASE_URL = AppConstants.SHORT_LINK_BASE_URL;

type RequestConfig = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  accessToken?: string;
};

async function request<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: config.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(config.accessToken ? { Authorization: `Bearer ${config.accessToken}` } : {}),
    },
    body: config.body ? JSON.stringify(config.body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

export function getGoogleSignInUrl(): string {
  return `${API_BASE_URL}/auth/google`;
}

export async function getMe(accessToken: string): Promise<AuthState['user']> {
  return request<AuthState['user']>('/auth/me', { accessToken });
}

export async function updateMe(
  accessToken: string,
  payload: { name?: string; image?: string },
): Promise<AuthState['user']> {
  return request<AuthState['user']>('/auth/me', {
    method: 'PATCH',
    accessToken,
    body: payload,
  });
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const result = await request<{ accessToken: string }>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  });

  return result.accessToken;
}

export async function withAutoRefresh<T>(
  operation: (accessToken: string) => Promise<T>,
): Promise<T> {
  const authState = loadAuthState();
  if (!authState) {
    throw new Error('No auth state found.');
  }

  try {
    return await operation(authState.accessToken);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const mightBeAuthError = message.includes('401') || message.toLowerCase().includes('unauthorized');

    if (!mightBeAuthError) {
      throw error;
    }

    try {
      const newAccessToken = await refreshAccessToken(authState.refreshToken);
      const updatedState: AuthState = {
        ...authState,
        accessToken: newAccessToken,
      };
      saveAuthState(updatedState);

      return operation(newAccessToken);
    } catch {
      clearAuthState();

      if (typeof window !== 'undefined') {
        window.location.replace('/');
      }

      throw new Error('Session expired. Please sign in again.');
    }
  }
}

export async function fetchLinks(accessToken: string): Promise<Link[]> {
  return request<Link[]>('/links', { accessToken });
}

export async function fetchLinkDetail(accessToken: string, shortCode: string): Promise<Link> {
  return request<Link>(`/links/${shortCode}`, { accessToken });
}

export async function createLink(
  accessToken: string,
  payload: { redirectUrl: string; shortCode: string; description?: string },
): Promise<Link> {
  return request<Link>('/links', {
    method: 'POST',
    accessToken,
    body: payload,
  });
}

export async function updateLink(
  accessToken: string,
  shortCode: string,
  payload: { redirectUrl?: string; description?: string; isActive?: boolean },
): Promise<Link> {
  return request<Link>(`/links/${shortCode}`, {
    method: 'PATCH',
    accessToken,
    body: payload,
  });
}

export async function deactivateLink(accessToken: string, shortCode: string): Promise<Link> {
  return request<Link>(`/links/${shortCode}`, {
    method: 'DELETE',
    accessToken,
  });
}

export async function hydrateLinksWithClicks(accessToken: string): Promise<Link[]> {
  return fetchLinks(accessToken);
}

export async function fetchOverviewAnalytics(accessToken: string): Promise<OverviewAnalytics> {
  return request<OverviewAnalytics>('/links/analytics/overview', { accessToken });
}

export async function fetchLinkAnalytics(accessToken: string, shortCode: string): Promise<LinkAnalytics> {
  return request<LinkAnalytics>(`/links/${shortCode}/analytics`, { accessToken });
}

export function getPublicShortUrl(shortCode: string): string {
  return `${SHORT_LINK_BASE_URL}/${shortCode}`;
}
