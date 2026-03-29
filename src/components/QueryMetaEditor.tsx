import type { Dispatch, SetStateAction } from 'react';

export type MetaRow = {
  id: string;
  key: string;
  value: string;
};

export function createMetaRow(): MetaRow {
  return {
    id: `meta-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    key: '',
    value: '',
  };
}

export function buildUrlWithMeta(baseUrl: string, rows: MetaRow[]): string {
  const url = new URL(baseUrl);

  rows.forEach((row) => {
    const key = row.key.trim();
    const value = row.value.trim();
    if (!key) {
      return;
    }

    url.searchParams.set(key, value);
  });

  return url.toString();
}

type QueryMetaEditorProps = {
  rows: MetaRow[];
  setRows: Dispatch<SetStateAction<MetaRow[]>>;
};

export function QueryMetaEditor({ rows, setRows }: QueryMetaEditorProps) {
  function onUpdateRow(index: number, field: 'key' | 'value', nextValue: string) {
    setRows((prev) => prev.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: nextValue } : row)));
  }

  function onAddRow() {
    setRows((prev) => [...prev, createMetaRow()]);
  }

  function onRemoveRow(index: number) {
    setRows((prev) => {
      if (prev.length <= 1) {
        return [createMetaRow()];
      }

      return prev.filter((_, rowIndex) => rowIndex !== index);
    });
  }

  return (
    <div className="meta-editor">
      <table className="meta-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th className="meta-action-col">-</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td>
                <input
                  value={row.key}
                  onChange={(event) => onUpdateRow(index, 'key', event.target.value)}
                  placeholder="utm_source"
                />
              </td>
              <td>
                <input
                  value={row.value}
                  onChange={(event) => onUpdateRow(index, 'value', event.target.value)}
                  placeholder="newsletter"
                />
              </td>
              <td className="meta-remove-cell">
                <button type="button" className="btn-secondary meta-remove-btn" onClick={() => onRemoveRow(index)}>
                  -
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" className="btn-secondary meta-add-btn" onClick={onAddRow}>
        + Add row
      </button>
    </div>
  );
}
