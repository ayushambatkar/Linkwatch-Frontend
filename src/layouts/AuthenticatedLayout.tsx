import { useMemo, useState } from 'react';
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthState, loadAuthState } from '../auth';
import type { AuthState } from '../types';
import { FactsFooter } from '../components/FactsFooter';
import headerImage from '../../assets/image.png';

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState | null>(() => loadAuthState());
  const isHomeRoute = location.pathname === '/home';

  const profileInitial = useMemo(() => {
    const name = authState?.user.name?.trim();
    if (name && name.length > 0) {
      return name[0].toUpperCase();
    }

    return authState?.user.email?.[0]?.toUpperCase() || 'U';
  }, [authState]);

  if (!authState) {
    return <Navigate to="/" replace />;
  }

  function onSignOut() {
    clearAuthState();
    setAuthState(null);
    navigate('/', { replace: true });
  }

  return (
    <main className="dashboard-shell">
      <header className="site-nav panel">
        <div className="nav-brand">
          <span className="moon" aria-hidden="true" />
          <div>
            <p className="eyebrow">LinkWatch</p>
            <h1>Watch Ya' Links</h1>
          </div>
        </div>

        

        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/home" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Dashboard
          </NavLink>
          <NavLink to="/links" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            All Links
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Contact
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Profile
          </NavLink>
          
        </nav>

        {isHomeRoute ? (
          <img className="home-header-image" src={headerImage} alt="Home header" />
        ) : null}

        <div className="hero-actions right-actions">
          <button onClick={onSignOut} className="btn-danger" type="button">
            Sign out
          </button>
          <span className="avatar-chip" title={authState.user.name || authState.user.email}>
            {authState.user.image ? <img src={authState.user.image} alt="Profile" /> : <b>{profileInitial}</b>}
          </span>
        </div>
      </header>

      <Outlet context={{ authState, setAuthState }} />
      <FactsFooter />
    </main>
  );
}
