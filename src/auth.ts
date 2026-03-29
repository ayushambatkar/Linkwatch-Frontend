import type { AuthState } from './types';

const AUTH_STORAGE_KEY = 'linkwatch_auth';

export function loadAuthState(): AuthState | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthState;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function saveAuthState(state: AuthState): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
}

export function clearAuthState(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
