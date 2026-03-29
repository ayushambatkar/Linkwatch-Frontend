import type { AnalyticsBucket } from '../types';

function sortBucketsByDate(buckets: AnalyticsBucket[]): AnalyticsBucket[] {
  return [...buckets].sort((a, b) => new Date(a.key).valueOf() - new Date(b.key).valueOf());
}

export function ChartLine({ buckets }: { buckets: AnalyticsBucket[] }) {
  const pointsData = sortBucketsByDate(buckets);

  if (pointsData.length === 0) {
    return <p className="muted">No click timeline yet.</p>;
  }

  const width = 560;
  const height = 200;
  const pad = 24;
  const maxY = Math.max(...pointsData.map((item) => item.count), 1);

  const points = pointsData
    .map((item, index) => {
      const x = pad + (index * (width - pad * 2)) / Math.max(pointsData.length - 1, 1);
      const y = height - pad - (item.count / maxY) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" role="img" aria-label="Clicks over time">
        <polyline fill="none" stroke="url(#chartGradient)" strokeWidth="4" points={points} />
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#7dc9ff" />
            <stop offset="100%" stopColor="#6affd7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="chart-labels">
        <span>{pointsData[0]?.key}</span>
        <span>{pointsData[pointsData.length - 1]?.key}</span>
      </div>
    </div>
  );
}

export function TopList({ title, buckets }: { title: string; buckets: AnalyticsBucket[] }) {
  return (
    <article className="panel mini-panel">
      <h3>{title}</h3>
      <ul className="sources-list">
        {buckets.length === 0 ? <li>No data yet.</li> : null}
        {buckets.slice(0, 6).map((item) => (
          <li key={item.key}>
            <span>{item.key}</span>
            <strong>{item.count}</strong>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function formatDate(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.valueOf())) {
    return '-';
  }

  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}
