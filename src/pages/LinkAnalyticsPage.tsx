import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchLinkAnalytics, withAutoRefresh } from '../api';
import { ChartLine, TopList } from '../components/AnalyticsWidgets';
import type { LinkAnalytics } from '../types';

export function LinkAnalyticsPage() {
  const navigate = useNavigate();
  const { shortCode } = useParams<{ shortCode: string }>();
  const [analytics, setAnalytics] = useState<LinkAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!shortCode) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await withAutoRefresh((token) => fetchLinkAnalytics(token, shortCode));
        setAnalytics(response);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load link analytics.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [shortCode]);

  return (
    <>
      <section className="panel">
        <div className="actions-cell">
          <button className="btn-secondary" type="button" onClick={() => navigate('/links')}>
            Back to all links
          </button>
        </div>

        {error ? <p className="error-banner">{error}</p> : null}
        {loading ? <p className="muted">Loading link analytics...</p> : null}

        {analytics ? (
          <>
            <h2>Analytics for /{analytics.link.shortCode}</h2>
            <p className="muted">{analytics.link.redirectUrl}</p>
            <div className="grid-stats compact-stats">
              <article className="stat-card">
                <h2>Total clicks</h2>
                <strong>{analytics.totalClicks}</strong>
              </article>
            </div>
            <ChartLine buckets={analytics.clicksByDay} />
          </>
        ) : null}
      </section>

      {analytics ? (
        <section className="dashboard-grid list-layout">
          <TopList title="Link Sources" buckets={analytics.topSources} />
          <TopList title="Link Locations" buckets={analytics.topLocations} />
        </section>
      ) : null}
    </>
  );
}
