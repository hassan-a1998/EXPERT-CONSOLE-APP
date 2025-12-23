import React, { useState, useEffect } from 'react';
import ImageCarousel from './ImageCarousel';
import DefectChecklist from './DefectChecklist';
import GradeCalculator from './GradeCalculator';
import SubmitModal from './SubmitModal';
import { submitAssessment, requestMoreImages, escalateTicket } from '../services/mockApi';

export default function TicketDetail({ ticket, assessment, setAssessment, onSubmit, submitted }) {
  // Hooks must be called unconditionally at the top level
  const [localDefects, setLocalDefects] = useState(assessment || {});
  const [calc, setCalc] = useState({ score: 100, grade: 'A', price: ticket?.baseValue || 0 });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localImages, setLocalImages] = useState(ticket.images || []);
  const [reqOpen, setReqOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');
  const [toast, setToast] = useState(null);

  // Do not return early — render placeholder when no ticket selected to keep hook order stable

  const handleDefectsChange = (next) => {
    setLocalDefects(next);
    setAssessment && setAssessment(next);
  };

  const handleGradeChange = (result) => {
    setCalc(result);
  };

  const handleSubmit = () => {
    setConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    setConfirmOpen(false);
    try {
      await submitAssessment(ticket.id, localDefects);
      setToast('Assessment submitted');
      await onSubmit && onSubmit(localDefects);
    } catch (err) {
      setToast('Submission failed');
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleRequestImages = () => setReqOpen(true);
  const confirmRequestImages = async () => {
    setReqOpen(false);
    setToast('Requesting more images...');
    const res = await requestMoreImages(ticket.id);
    if (res && res.ticket) setLocalImages(res.ticket.images || []);
    setTimeout(() => setToast(null), 1800);
  };

  const handleEscalate = () => setEscalateOpen(true);
  const confirmEscalate = async () => {
    setEscalateOpen(false);
    setToast('Escalating ticket...');
    await escalateTicket(ticket.id, escalateReason);
    setToast('Escalated to senior expert');
    setTimeout(() => setToast(null), 1800);
    setEscalateReason('');
  };

  useEffect(() => {
    setLocalImages(ticket.images || []);
  }, [ticket]);

  return (
    <main className="flex-1 p-6 overflow-auto">
      {!ticket ? (
        <div className="text-center text-gray-500">No ticket selected — choose one from the queue.</div>
      ) : (<>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="text-xl font-bold">{ticket.brand} {ticket.model}</div>
            <div className="text-sm text-gray-600">{ticket.storage} • {ticket.color}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Base value</div>
            <div className="font-semibold">${ticket.baseValue}</div>
            <div className="text-xs text-gray-400 mt-1">FE notes: {ticket.feNotes}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <ImageCarousel images={localImages || []} />
          <div className="mt-4 flex gap-2">
            <button className="px-3 py-1 border rounded" onClick={handleRequestImages}>Request more images</button>
            <button className="px-3 py-1 border rounded" onClick={handleEscalate}>Escalate to senior</button>
          </div>
        </div>

        <div className="space-y-4">
          <DefectChecklist value={localDefects} onChange={handleDefectsChange} />
          <GradeCalculator defects={localDefects} baseValue={ticket.baseValue} onChange={handleGradeChange} />

          <div className="flex gap-2">
            <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Submit assessment</button>
            <button onClick={()=>{ setLocalDefects({}); setAssessment && setAssessment(null); }} className="px-4 py-2 border rounded">Reset</button>
          </div>

          <div className="text-sm text-gray-600">Current estimate: <span className="font-medium">{calc.grade} — ${calc.price}</span></div>

          {/* Scenarios */}
          <div className="bg-white p-3 rounded shadow">
            <div className="font-semibold">Accept scenarios</div>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
              {(ticket.scenarios?.accept || []).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
            <div className="font-semibold mt-3">Reject scenarios</div>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
              {(ticket.scenarios?.reject || []).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <SubmitModal open={confirmOpen} onConfirm={confirmSubmit} onCancel={()=>setConfirmOpen(false)} submitting={submitting} />

      </>) }

      {/* Request images confirmation modal */}
      {reqOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-4 rounded w-96">
            <div className="font-semibold">Request more images</div>
            <p className="text-sm text-gray-600 mt-2">Send a request to the field engineer for additional close-up images?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-1 border rounded" onClick={()=>setReqOpen(false)}>Cancel</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={confirmRequestImages}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Escalation modal */}
      {escalateOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-4 rounded w-96">
            <div className="font-semibold">Escalate to senior expert</div>
            <p className="text-sm text-gray-600 mt-2">Provide reason for escalation:</p>
            <textarea value={escalateReason} onChange={(e)=>setEscalateReason(e.target.value)} className="w-full border mt-2 p-2 rounded" rows={4} />
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-1 border rounded" onClick={()=>setEscalateOpen(false)}>Cancel</button>
              <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={confirmEscalate}>Escalate</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed right-4 bottom-4 bg-black text-white px-4 py-2 rounded">{toast}</div>
      )}
    </main>
  );
}
