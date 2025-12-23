// Images are ordered / labeled as different phone views (front, back, left, right, top, bottom)
const sampleImages = [
  { view: 'front', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80' },
  { view: 'back', url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80' },
  { view: 'left', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&q=80' },
  { view: 'right', url: 'https://images.unsplash.com/photo-1510557880182-3d4d3e4c9a7c?w=1200&q=80' },
  { view: 'top', url: 'https://images.unsplash.com/photo-1526178616685-2c1d45a5a9d7?w=1200&q=80' },
  { view: 'bottom', url: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?w=1200&q=80' }
];

function minutesAgo(date) {
  const ms = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.floor(ms / 60000));
}

export const mockTickets = [
  {
    id: 1,
    brand: 'Apple',
    model: 'iPhone X',
    storage: '64GB',
    color: 'Space Gray',
    baseValue: 250,
    feNotes: 'Returned by customer; screen looks intact initially.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    // images correspond to views: front, back, left, right, top, bottom
    images: sampleImages,
    scenarios: {
      accept: [
        'No visible screen cracks',
        'Battery powers on and holds charge',
        'Only light surface scratches'
      ],
      reject: [
        'Severe screen crack across display',
        'Missing critical components (charging port, camera)',
        'Water damage visible'
      ]
    }
  },
  {
    id: 2,
    brand: 'Samsung',
    model: 'Galaxy S9',
    storage: '128GB',
    color: 'Midnight Black',
    baseValue: 180,
    feNotes: 'Front panel dented near power button.',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 120 minutes ago
    images: sampleImages,
    scenarios: {
      accept: [
        'Screen shows no functional damage',
        'Minor cosmetic body dents only',
        'All buttons functional'
      ],
      reject: [
        'Severe body dent compromising frame',
        'Cracked LCD with touch failure',
        'Missing back panel or adhesive'
      ]
    }
  },
  {
    id: 3,
    brand: 'Google',
    model: 'Pixel 3',
    storage: '64GB',
    color: 'Clearly White',
    baseValue: 160,
    feNotes: 'Battery health unknown.',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    images: sampleImages,
    scenarios: {
      accept: [
        'No functional issues on boot',
        'Minor cosmetic wear acceptable'
      ],
      reject: [
        'Non-functional due to water ingress',
        'Severe screen delamination or burn-in'
      ]
    }
  },
];

export function getWaitingMinutes(ticket) {
  return minutesAgo(ticket.createdAt);
}

export function submitAssessment(ticketId, assessment) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const t = mockTickets.find((m) => m.id === ticketId);
      if (t) {
        t.assessed = true;
        t.assessment = assessment;
      }
      resolve({ success: true, ticket: t });
    }, 1000);
  });
}

export function requestMoreImages(ticketId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const t = mockTickets.find((m) => m.id === ticketId);
      if (t) {
        const extra = { view: 'detail', url: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=1200&q=80' };
        t.images = [...(t.images || []), extra];
      }
      resolve({ success: true, ticket: t });
    }, 800);
  });
}

export function escalateTicket(ticketId, reason) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const t = mockTickets.find((m) => m.id === ticketId);
      if (t) {
        t.escalated = true;
        t.escalation = { reason, at: new Date().toISOString() };
      }
      resolve({ success: true, ticket: t });
    }, 800);
  });
}

