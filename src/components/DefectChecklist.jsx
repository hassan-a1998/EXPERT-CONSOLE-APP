import React from 'react';

const SEVERITIES = ['none', 'light', 'moderate', 'severe'];

export default function DefectChecklist({ value = {}, onChange }) {
  const defects = [
    { key: 'screen_crack', label: 'Screen crack' },
    { key: 'body_dent', label: 'Body dent' },
    { key: 'body_scratch', label: 'Scratch on body' },
    { key: 'screen_discolor', label: 'Screen discoloration' },
    { key: 'missing_part', label: 'Missing/damaged part' },
  ];

  const setSeverity = (key, severity) => {
    const next = { ...(value || {}) };
    next[key] = { ...(next[key] || {}), severity };
    onChange && onChange(next);
  };

  const setNote = (key, note) => {
    const next = { ...(value || {}) };
    next[key] = { ...(next[key] || {}), note };
    onChange && onChange(next);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-lg font-semibold mb-3">Defect Checklist</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defects.map((d) => (
          <div key={d.key} className="border p-3 rounded">
            <div className="font-medium">{d.label}</div>
            <div className="mt-2 flex gap-2 flex-wrap">
              {SEVERITIES.map((s) => (
                <label key={s} className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name={`${d.key}-severity`}
                    checked={(value[d.key]?.severity || 'none') === s}
                    onChange={() => setSeverity(d.key, s)}
                  />
                  <span className="text-sm capitalize">{s}</span>
                </label>
              ))}
            </div>
            {d.key === 'missing_part' && (
              <div className="mt-2">
                <input
                  placeholder="Describe missing/damaged parts"
                  value={value[d.key]?.note || ''}
                  onChange={(e) => setNote(d.key, e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
