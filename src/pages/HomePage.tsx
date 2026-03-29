import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLink, getPublicShortUrl, withAutoRefresh } from '../api';
import { buildUrlWithMeta, createMetaRow, QueryMetaEditor } from '../components/QueryMetaEditor';

export function HomePage() {
  const navigate = useNavigate();
  const [creatingLink, setCreatingLink] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCreatedShortUrl, setLastCreatedShortUrl] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [showMetaEditor, setShowMetaEditor] = useState(false);
  const [metaRows, setMetaRows] = useState([createMetaRow()]);

  const [shortCode, setShortCode] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [description, setDescription] = useState('');

  async function onCreateLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatingLink(true);
    setError(null);

    try {
      const created = await withAutoRefresh((token) =>
        createLink(token, {
          shortCode: shortCode.trim(),
          redirectUrl: redirectUrl.trim(),
          description: description.trim() || undefined,
        }),
      );

      const baseUrl = getPublicShortUrl(created.shortCode);
      const shareUrl = buildUrlWithMeta(baseUrl, metaRows);
      setLastCreatedShortUrl(shareUrl);
      setShortCode('');
      setRedirectUrl('');
      setDescription('');
      setCopyStatus('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create link.';
      setError(message);
    } finally {
      setCreatingLink(false);
    }
  }

  async function onCopyLatestLink() {
    if (!lastCreatedShortUrl) {
      return;
    }

    await navigator.clipboard.writeText(lastCreatedShortUrl);
    setCopyStatus('Copied');
    window.setTimeout(() => {
      setCopyStatus('');
    }, 2000);
  }

  return (
    <>
      {error ? <p className="error-banner">{error}</p> : null}
      <section className="dashboard-grid home-layout">
        <article className="panel">
          <h2>Create short link</h2>
          <form onSubmit={onCreateLink} className="stack-form">
            <label>
              Short code
              <input value={shortCode} onChange={(event) => setShortCode(event.target.value)} placeholder="spring-sale" required />
            </label>
            <label>
              Redirect URL
              <input
                type="url"
                value={redirectUrl}
                onChange={(event) => setRedirectUrl(event.target.value)}
                placeholder="https://example.com/landing"
                required
              />
            </label>
            <label>
              Description
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Campaign purpose"
              />
            </label>
            <button disabled={creatingLink} className="btn-primary" type="submit">
              {creatingLink ? 'Creating...' : 'Create link'}
            </button>

            <button
              className="btn-secondary"
              type="button"
              onClick={() => setShowMetaEditor((prev) => !prev)}
            >
              {showMetaEditor ? 'Hide meta' : 'Add meta'}
            </button>

            {showMetaEditor ? <QueryMetaEditor rows={metaRows} setRows={setMetaRows} /> : null}
          </form>

          {lastCreatedShortUrl ? (
            <div className="copy-row">
              <span className="truncate">{lastCreatedShortUrl}</span>
              <button
                className={`btn-secondary copy-btn ${copyStatus ? 'copied' : ''}`}
                type="button"
                onClick={onCopyLatestLink}
              >
                <span className="copy-icon" aria-hidden="true">⧉</span>
                {copyStatus ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          ) : null}
        </article>

        <article className="panel quick-actions">
          <h2>Quick navigation</h2>
          <p className="muted">
            Fun internet fact: the very first webcam streamed a coffee pot, because even brilliant engineers fear walking to an empty machine.
          </p>
          <div className="quick-action-grid">
            <button className="btn-secondary" type="button" onClick={() => navigate('/dashboard')}>
              Open dashboard analytics
            </button>
            <button className="btn-secondary" type="button" onClick={() => navigate('/links')}>
              See all links
            </button>
            <button className="btn-secondary" type="button" onClick={() => navigate('/profile')}>
              Manage profile
            </button>
          </div>
        </article>
      </section>
    </>
  );
}
