import React from 'react';
import { getWaitingMinutes } from '../services/mockApi';

export default function TicketQueue({ tickets = [], selectedTicket, onSelectTicket }) {
  return (
    <aside className="w-80 border-r bg-white p-4">
      <h2 className="text-lg font-semibold mb-3">Ticket Queue</h2>
      <ul className="space-y-2">
        {tickets.map((t) => {
          const waiting = getWaitingMinutes(t);
          const selected = selectedTicket && selectedTicket.id === t.id;
          return (
            <li key={t.id}>
              <button
                onClick={() => onSelectTicket && onSelectTicket(t)}
                className={`w-full text-left p-3 rounded-lg border ${selected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{t.brand} {t.model}</div>
                    <div className="text-sm text-gray-500">{t.storage} • {t.color}</div>
                  </div>
                  <div className="text-xs text-gray-400">{waiting}m</div>
                </div>
                <div className="mt-2 text-sm text-gray-600">{t.feNotes}</div>
                <div className="mt-2 flex items-center gap-2">
                  {t.assessed ? <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Assessed</span> : <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Pending</span>}
                  {t.escalated && <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Escalated</span>}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
