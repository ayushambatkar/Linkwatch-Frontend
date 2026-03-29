import { Navigate } from 'react-router-dom';
import GoogleButton from 'react-google-button';
import { loadAuthState } from '../auth';
import { getGoogleSignInUrl } from '../api';
import { FactsFooter } from '../components/FactsFooter';

export function LandingPage() {
  const authState = loadAuthState();

  if (authState) {
    return <Navigate to="/home" replace />;
  }

  function onGoogleSignIn() {
    window.location.assign(getGoogleSignInUrl());
  }

  return (
    <main className="landing-shell">
      <section className="landing-card">
        <p className="eyebrow">LinkWatch</p>
        <h1>Track every short-link click in one place</h1>
        <p>
          Sign in with Google to create links, monitor click analytics, and manage your profile from a single dashboard.
        </p>
        <div className="google-btn-wrap">
          <GoogleButton onClick={onGoogleSignIn} label="Continue with Google" />
        </div>
      </section>
      <FactsFooter />
    </main>
  );
}
