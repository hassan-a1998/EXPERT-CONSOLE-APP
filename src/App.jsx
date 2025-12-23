import React, { useState } from 'react';
import TicketQueue from './components/TicketQueue';
import TicketDetail from './components/TicketDetail';
import { mockTickets } from './services/mockApi';
// Tailwind will be loaded via CDN in public/index.html

export default function App() {
  const [selectedTicket, setSelectedTicket] = useState(mockTickets[0]);
  const [assessment, setAssessment] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setAssessment(null);
  };

  const handleSubmitAssessment = (assessmentData) => {
    console.log('Submitting assessment:', assessmentData);
    setSubmitted(true);
    setTimeout(() => {
      handleSelectTicket(mockTickets[1]);
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <TicketQueue
        tickets={mockTickets}
        selectedTicket={selectedTicket}
        onSelectTicket={handleSelectTicket}
      />
      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          assessment={assessment}
          setAssessment={setAssessment}
          onSubmit={handleSubmitAssessment}
          submitted={submitted}
        />
      )}
    </div>
  );
}
