import React from 'react';

export default function SubmitModal({ open, onConfirm, onCancel, submitting }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold">Confirm submission</h3>
        <p className="text-sm text-gray-600 mt-2">Are you sure you want to submit this assessment?</p>
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onCancel} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-1 bg-blue-600 text-white rounded" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
