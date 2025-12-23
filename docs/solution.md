# Expert Assessment Console — Solution Document

Date: 2025-12-24

## Executive Summary

This document describes the design, architecture, prototype, and backend strategy for a Remote Assessment Model to replace on-site grading errors for high-value used electronics. The Expert Assessment Console allows a Central Expert to evaluate device condition using six standardized images captured by Field Executives (FEs) while the FE remains at the customer's door.

## Part 1 — Product Definition & Metrics

### Functional Requirements (FR)
- FR1 — Ticket ingestion: FE uploads 6 images (front, back, left, right, top, bottom) with metadata.
- FR2 — Expert Console: view images, zoom, mark defects, add notes, and submit grades.
- FR3 — Real-time UX: decisions communicated to FE promptly; low-res preview shown immediately.
- FR4 — Ticket actions: Request More Images, Escalate to Senior, Reset, Submit.
- FR5 — Audit/Logging: timestamped actions with Expert ID.
- FR6 — Offline handling: low-res first, resume high-res in background.
- FR7 — Concurrency control: ticket locking to avoid double-assignment.
- FR8 — Responsive UI and accessibility.

### Non-Functional Requirements (NFR)
- NFR1 — Latency: low-res view <2s; usable experience <5s.
- NFR2 — Throughput: scale to hundreds of concurrent Experts.
- NFR3 — Availability: aim 99.9% uptime.
- NFR4 — Security: TLS, RBAC, encrypted storage.
- NFR5 — Observability: metrics and tracing.

### Success Metrics
- North Star: Reduce incorrect grading rate from 18% to <5%.
- Guardrail: Mean expert decision time; keep under target (e.g., <120s) while monitoring accuracy.

### Unhappy Paths & Mitigations
- Poor FE network: upload low-res immediately, background high-res, resumable uploads.
- Wrong image orientation: FE app enforces view-tagging; Expert can request more images.
- Expert indecision: provide “Needs more images” and Escalate workflow.
- Concurrent open: Redis lock with TTL and heartbeat.

## Part 2 — System Design & Architecture

### Data Flow (FE → Cloud → Expert)
1. FE app captures 6 images and sends low-res thumbnails + metadata to API.
2. Thumbnails are stored in object storage and CDN and ticket created in DB.
3. Notification (WebSocket / PubSub) triggers Expert Console to fetch ticket; console loads thumbnails and then full-res as available.
4. Expert submits assessment → API stores result and notifies FE.

### Key Decisions
- Image latency: progressive uploads (thumbnail first), CDN for delivery, resumable for reliability.
- Concurrency: Redis SETNX locks with TTL and heartbeat.

### Ticket JSON (example)

```json
{
  "ticketId":"T12345",
  "createdAt":"2025-12-23T10:00:00Z",
  "feId":"FE-987",
  "brand":"Apple",
  "model":"iPhone X",
  "storage":"64GB",
  "color":"Space Gray",
  "baseValue":250,
  "images":[
    {"id":"img-1","view":"front","url":"https://.../front_thumb.jpg","fullUrl":"https://.../front_full.jpg"},
    {"id":"img-2","view":"back","url":"..."},
    {"id":"img-3","view":"left","url":"..."},
    {"id":"img-4","view":"right","url":"..."},
    {"id":"img-5","view":"top","url":"..."},
    {"id":"img-6","view":"bottom","url":"..."}
  ]
}
```

### Overall System Components
- Frontend: React SPA (Expert Console)
- API Gateway: REST endpoints for tickets and assessments
- Object Storage + CDN: S3 + CloudFront
- Realtime: WebSocket or PubSub
- Locking: Redis
- DB: NoSQL/SQL for tickets and assessments

## Part 3 — The Build (Prototype)

The prototype in this repository implements the Expert Assessment Console with the following features:

- Left sidebar ticket queue with brand, model, storage, color, waiting time, and status badges.
- Main area with device header (brand/model/storage/color/base value/FE notes).
- Image carousel with 6 images, thumbnails, prev/next, and zoom controls.
- Defect checklist covering: Screen Crack, Body Dent, Scratch on Body, Screen Discoloration, Missing/Damaged Part (with note field).
- Real-time grade calculation (A/B/C/D) and estimated price.
- Buttons: Submit assessment (with confirmation modal), Request more images, Escalate to senior (with reason input).

### Prototype file references
- `src/components/TicketQueue.jsx` — ticket list UI
- `src/components/TicketDetail.jsx` — main expert UI and flows
- `src/components/ImageCarousel.jsx` — image viewer
- `src/components/DefectChecklist.jsx` — defect input
- `src/components/GradeCalculator.jsx` — grade calculation
- `src/components/SubmitModal.jsx` — confirmation modal
- `src/services/mockApi.js` — mock back-end flows

### Grade Calculation Formula

- severityWeight: none=0, light=1, moderate=2, severe=3
- score = max(0, 100 - totalSeverity * 12)
- grades: A (>=85), B (70-84), C (50-69), D (<50)
- price multiplier: A=1.0, B=0.8, C=0.6, D=0.3

## Part 4 — Backend Implementation Strategy

### POST /submit-grade
Payload links each defect to image IDs and includes computed score/grade:

```json
POST /api/v1/tickets/T12345/assessments
{
  "expertId":"E-111",
  "assessments":{
    "screen_crack":{"severity":"moderate","imageIds":["img-1"],"notes":""},
    "body_dent":{"severity":"light","imageIds":["img-3"]}
  },
  "computed":{"score":76,"grade":"C","price":150}
}
```

### DB Schema (NoSQL)
- `tickets` collection: ticket metadata, images, status, assignedExpertId
- `assessments` collection: ticketId, expertId, timestamp, assessments, computed

### Ticket Locking (Redis)
- Acquire lock with SETNX + TTL. Store token. Heartbeats to renew. Release with compare-and-delete.

## Code & UI Logic — Interview Notes

- `useMemo` for grade calculation to avoid unnecessary recalculations.
- `useEffect` for side-effects like syncing images on ticket change.
- Keep hooks at top-level — avoid conditional hooks.
- Lift state to parent when multiple components share data (defect values).

## How to run the prototype

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm start
```

3. To generate a PDF of this document (requires additional dev dependencies):

```bash
npm install
npm run genpdf
```

This will create `docs/solution.pdf` from this Markdown file.

## Next steps & Enhancements

- Replace mock backend with real APIs and persistent storage.
- Integrate authentication, RBAC, audit logs, and QA sampling.
- Add ML pre-highlighting and automated QA flags.

---

Generated by prototype tooling on 2025-12-24.
