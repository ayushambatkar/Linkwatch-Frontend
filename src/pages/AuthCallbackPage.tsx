import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAuthState } from '../auth';
import type { AuthUser } from '../types';

function parseHashFragment(hash: string): Record<string, string> {
  const fragment = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(fragment);
  const entries: Record<string, string> = {};

  params.forEach((value, key) => {
    entries[key] = value;
  });

  return entries;
}

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Finalizing sign in...');

  useEffect(() => {
    const parsed = parseHashFragment(window.location.hash);
    const error = parsed.error;

    if (error) {
      setMessage(error);
      return;
    }

    const accessToken = parsed.accessToken;
    const refreshToken = parsed.refreshToken;
    const rawUser = parsed.user;

    if (!accessToken || !refreshToken || !rawUser) {
      setMessage('Missing auth data from callback.');
      return;
    }

    try {
      const user = JSON.parse(rawUser) as AuthUser;
      saveAuthState({ accessToken, refreshToken, user });
      navigate('/home', { replace: true });
    } catch {
      setMessage('Could not parse user data from callback.');
    }
  }, [navigate]);

  return (
    <main className="auth-callback-shell">
      <section className="auth-callback-card">
        <h1>Google Sign-In</h1>
        <p>{message}</p>
      </section>
    </main>
  );
}
