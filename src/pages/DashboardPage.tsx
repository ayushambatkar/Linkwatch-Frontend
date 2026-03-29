import { useEffect, useState } from 'react';
import { fetchOverviewAnalytics, withAutoRefresh } from '../api';
import { ChartLine, TopList } from '../components/AnalyticsWidgets';
import type { OverviewAnalytics } from '../types';

export function DashboardAnalyticsPage() {
  const [overview, setOverview] = useState<OverviewAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await withAutoRefresh((token) => fetchOverviewAnalytics(token));
        setOverview(response);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load dashboard analytics.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  return (
    <>
      {error ? <p className="error-banner">{error}</p> : null}
      {loading ? <p className="muted">Loading dashboard analytics...</p> : null}

      <section className="panel chart-panel">
        <h2>Overall click analytics</h2>
        <div className="grid-stats compact-stats">
          <article className="stat-card">
            <h2>Total links</h2>
            <strong>{overview?.totalLinks ?? 0}</strong>
          </article>
          <article className="stat-card">
            <h2>Active links</h2>
            <strong>{overview?.activeLinks ?? 0}</strong>
          </article>
          <article className="stat-card">
            <h2>Total clicks</h2>
            <strong>{overview?.totalClicks ?? 0}</strong>
          </article>
        </div>
        <ChartLine buckets={overview?.clicksByDay || []} />
      </section>

      <section className="dashboard-grid list-layout">
        <TopList title="Top Sources" buckets={overview?.topSources || []} />
        <TopList title="Top Locations" buckets={overview?.topLocations || []} />
      </section>
    </>
  );
}
