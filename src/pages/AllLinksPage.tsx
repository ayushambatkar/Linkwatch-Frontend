import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deactivateLink, fetchLinks, getPublicShortUrl, withAutoRefresh } from '../api';
import { formatDate } from '../components/AnalyticsWidgets';
import { buildUrlWithMeta, createMetaRow, QueryMetaEditor, type MetaRow } from '../components/QueryMetaEditor';
import type { Link } from '../types';

export function AllLinksPage() {
  const navigate = useNavigate();
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyStatusByLink, setCopyStatusByLink] = useState<Record<string, string>>({});
  const [shareMetaForLinkId, setShareMetaForLinkId] = useState<string | null>(null);
  const [metaRows, setMetaRows] = useState<MetaRow[]>([createMetaRow()]);

  async function loadLinks() {
    setLoading(true);
    setError(null);

    try {
      const result = await withAutoRefresh((token) => fetchLinks(token));
      setLinks(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load links.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLinks();
  }, []);

  async function onDeactivate(shortCode: string) {
    setError(null);
    try {
      await withAutoRefresh((token) => deactivateLink(token, shortCode));
      await loadLinks();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to deactivate link.';
      setError(message);
    }
  }

  async function onCopyLink(url: string, linkId: string) {
    await navigator.clipboard.writeText(url);
    setCopyStatusByLink((prev) => ({ ...prev, [linkId]: 'Copied' }));
    window.setTimeout(() => {
      setCopyStatusByLink((prev) => ({ ...prev, [linkId]: '' }));
    }, 2000);
  }

  function onToggleShareWithMeta(linkId: string) {
    setShareMetaForLinkId((prev) => {
      if (prev === linkId) {
        return null;
      }

      setMetaRows([createMetaRow()]);
      return linkId;
    });
  }

  return (
    <section className="panel links-panel">
      <h2>All links</h2>
      {error ? <p className="error-banner">{error}</p> : null}
      {loading ? <p className="muted">Loading links...</p> : null}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Short URL</th>
              <th>Destination</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <Fragment key={link.id}>
                <tr>
                  <td>
                    <a href={getPublicShortUrl(link.shortCode)} target="_blank" rel="noreferrer">
                      /{link.shortCode}
                    </a>
                  </td>
                  <td className="truncate">{link.redirectUrl}</td>
                  <td>{link.description || '-'}</td>
                  <td>{link.isActive ? 'Active' : 'Inactive'}</td>
                  <td>{formatDate(link.createdAt)}</td>
                  <td className="actions-cell">
                    <button
                      type="button"
                      className={`btn-secondary copy-btn ${copyStatusByLink[link.id] ? 'copied' : ''}`}
                      onClick={() => onCopyLink(getPublicShortUrl(link.shortCode), link.id)}
                    >
                      <span className="copy-icon" aria-hidden="true">⧉</span>
                      {copyStatusByLink[link.id] ? 'Copied ✓' : 'Copy'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => navigate(`/links/${link.shortCode}/analytics`)}
                    >
                      View analytics
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => onToggleShareWithMeta(link.id)}>
                      {shareMetaForLinkId === link.id ? 'Close meta' : 'Share with meta'}
                    </button>
                    {link.isActive ? (
                      <button type="button" className="btn-danger" onClick={() => onDeactivate(link.shortCode)}>
                        Disable
                      </button>
                    ) : null}
                  </td>
                </tr>
                {shareMetaForLinkId === link.id ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="meta-share-panel">
                        <p className="muted">Add query metadata and copy a share-ready short URL.</p>
                        <QueryMetaEditor rows={metaRows} setRows={setMetaRows} />
                        <div className="copy-row">
                          <span className="truncate">{buildUrlWithMeta(getPublicShortUrl(link.shortCode), metaRows)}</span>
                          <button
                            className={`btn-secondary copy-btn ${copyStatusByLink[link.id] ? 'copied' : ''}`}
                            type="button"
                            onClick={() =>
                              onCopyLink(buildUrlWithMeta(getPublicShortUrl(link.shortCode), metaRows), link.id)
                            }
                          >
                            <span className="copy-icon" aria-hidden="true">⧉</span>
                            {copyStatusByLink[link.id] ? 'Copied ✓' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
            {links.length === 0 ? (
              <tr>
                <td colSpan={6}>No links yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
