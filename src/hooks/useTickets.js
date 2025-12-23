import { useState, useEffect } from 'react';
import { mockTickets } from '../services/mockApi';

export function useTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // mimic async fetch
    const t = mockTickets || [];
    setTickets(t);
  }, []);

  return { tickets, setTickets };
}
