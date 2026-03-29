import { FormEvent, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { loadAuthState, saveAuthState } from '../auth';
import { updateMe, withAutoRefresh } from '../api';
import type { AuthState } from '../types';
import type { AppOutletContext } from '../layouts/types';

export function ProfilePage() {
  const { authState, setAuthState } = useOutletContext<AppOutletContext>();
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profileName, setProfileName] = useState(authState.user.name || '');
  const [profileImage, setProfileImage] = useState(authState.user.image || '');

  const profileInitial = useMemo(() => {
    const name = authState.user.name?.trim();
    if (name && name.length > 0) {
      return name[0].toUpperCase();
    }

    return authState.user.email[0]?.toUpperCase() || 'U';
  }, [authState.user.email, authState.user.name]);

  async function onSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);
    setError(null);

    try {
      const updatedUser = await withAutoRefresh((token) =>
        updateMe(token, {
          name: profileName.trim() || undefined,
          image: profileImage.trim() || undefined,
        }),
      );

      const currentAuth = loadAuthState() || authState;
      const nextAuth: AuthState = {
        ...currentAuth,
        user: {
          ...currentAuth.user,
          ...updatedUser,
        },
      };

      saveAuthState(nextAuth);
      setAuthState(nextAuth);
      setEditingProfile(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile.';
      setError(message);
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <section className="panel profile-panel">
      {error ? <p className="error-banner">{error}</p> : null}
      <div className="profile-head">
        <span className="avatar-large" title={authState.user.name || authState.user.email}>
          {authState.user.image ? <img src={authState.user.image} alt="Profile" /> : <b>{profileInitial}</b>}
        </span>
        <div>
          <h2>{authState.user.name || 'No name set'}</h2>
          <p className="muted">{authState.user.email}</p>
        </div>
      </div>

      <button className="btn-primary profile-edit-btn" type="button" onClick={() => setEditingProfile((prev) => !prev)}>
        {editingProfile ? 'Close' : 'Edit'}
      </button>

      {editingProfile ? (
        <form onSubmit={onSaveProfile} className="stack-form profile-form">
          <label>
            Name
            <input
              value={profileName}
              onChange={(event) => setProfileName(event.target.value)}
              placeholder="Your display name"
            />
          </label>
          <label>
            Avatar URL
            <input
              value={profileImage}
              onChange={(event) => setProfileImage(event.target.value)}
              placeholder="https://..."
            />
          </label>
          <button disabled={savingProfile} className="btn-primary" type="submit">
            {savingProfile ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      ) : null}
    </section>
  );
}
