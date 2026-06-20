import { rest } from 'msw';
import { setupServer } from 'msw/node';

// ── Seed data (mirrors mock-api.ts so assertions are predictable) ────────────

const now = new Date().toISOString();

const DEMO_USER = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'demo@careconnect.com',
  createdAt: now,
  updatedAt: now,
};

export const DEMO_EMAIL = 'demo@careconnect.com';
export const DEMO_PASSWORD = 'demo123';
export const DEMO_TOKEN = 'cc-demo-token';

const medications = [
  { id: 'm1', name: 'Metoprolol', dosage: '50 mg', instruction: 'Take with water, before meals', scheduledTime: '8:00 AM', timeSlot: 'morning', status: 'given', takenAt: now, createdAt: now, updatedAt: now },
  { id: 'm2', name: 'Lisinopril', dosage: '10 mg', instruction: 'Take once daily with food', scheduledTime: '12:00 PM', timeSlot: 'afternoon', status: 'dueNow', createdAt: now, updatedAt: now },
  { id: 'm3', name: 'Atorvastatin', dosage: '20 mg', instruction: 'Take at bedtime', scheduledTime: '9:00 PM', timeSlot: 'night', status: 'upcoming', createdAt: now, updatedAt: now },
];

const appointments = [
  { id: 'a1', doctorName: 'Dr. Sarah Chen', specialty: 'Cardiologist', location: 'City Heart Clinic, 200 Medical Dr', dateTime: new Date().toISOString(), type: 'inPerson', status: 'upcoming', notes: 'Bring recent blood pressure log', createdAt: now, updatedAt: now },
  { id: 'a2', doctorName: 'Dr. Michael Torres', specialty: 'General Practice', location: 'Video call — link sent by email', dateTime: new Date(Date.now() + 7 * 86400000).toISOString(), type: 'video', status: 'upcoming', createdAt: now, updatedAt: now },
];

const profile = {
  id: 'p1',
  name: 'Alex Johnson',
  email: DEMO_EMAIL,
  phone: '(555) 012-3456',
  careeName: 'Margaret Johnson',
  bloodType: 'A+',
  allergies: ['Penicillin'],
  createdAt: now,
  updatedAt: now,
};

const symptoms = [
  { id: 's1', symptom: 'dizzy', severity: 3, note: 'Brief dizzy spell after standing up', createdAt: now, updatedAt: now },
];

const emergencyContacts = [
  { id: 'c1', name: 'Sarah Johnson', phone: '(555) 234-5678', relationship: 'Daughter', createdAt: now, updatedAt: now },
];

const caretakerNotes = [
  { id: 'n1', authorName: 'Maria (Day Nurse)', content: 'Margaret had a good morning.', createdAt: now, updatedAt: now },
];

// ── Handlers ─────────────────────────────────────────────────────────────────

const BASE = 'http://localhost';

export const handlers = [
  // Auth
  rest.post(`${BASE}/auth/login`, async (req, res, ctx) => {
    const body = await req.json() as { email: string; password: string };
    if (body.email === DEMO_EMAIL && body.password === DEMO_PASSWORD) {
      return res(ctx.json({ token: DEMO_TOKEN, user: DEMO_USER }));
    }
    return res(ctx.status(400));
  }),

  rest.post(`${BASE}/auth/signup`, async (req, res, ctx) => {
    const body = await req.json() as { name: string; email: string };
    const user = { id: 'u-new', name: body.name, email: body.email, createdAt: now, updatedAt: now };
    return res(ctx.json({ token: DEMO_TOKEN, user }));
  }),

  rest.get(`${BASE}/auth/me`, (_req, res, ctx) => res(ctx.json(DEMO_USER))),

  // Profile
  rest.get(`${BASE}/profile`, (_req, res, ctx) => res(ctx.json(profile))),
  rest.patch(`${BASE}/profile`, async (req, res, ctx) => {
    const patch = await req.json();
    return res(ctx.json({ ...profile, ...(patch as object), updatedAt: now }));
  }),

  // Medications
  rest.get(`${BASE}/medications`, (_req, res, ctx) => res(ctx.json(medications))),
  rest.post(`${BASE}/medications`, async (req, res, ctx) => {
    const body = await req.json() as object;
    return res(ctx.json({ id: 'm-new', ...body, createdAt: now, updatedAt: now }));
  }),
  rest.patch(`${BASE}/medications/:id/taken`, (_req, res, ctx) => res(ctx.json({}))),

  // Appointments
  rest.get(`${BASE}/appointments`, (_req, res, ctx) => res(ctx.json(appointments))),
  rest.post(`${BASE}/appointments`, async (req, res, ctx) => {
    const body = await req.json() as object;
    return res(ctx.json({ id: 'a-new', ...body, createdAt: now, updatedAt: now }));
  }),
  rest.patch(`${BASE}/appointments/:id`, async (req, res, ctx) => {
    const body = await req.json() as object;
    return res(ctx.json({ ...appointments[0], ...body, updatedAt: now }));
  }),

  // Symptoms
  rest.get(`${BASE}/symptoms`, (_req, res, ctx) => res(ctx.json(symptoms))),
  rest.post(`${BASE}/symptoms`, async (req, res, ctx) => {
    const body = await req.json() as object;
    return res(ctx.json({ id: 's-new', ...body, createdAt: now, updatedAt: now }));
  }),

  // Emergency contacts
  rest.get(`${BASE}/emergency-contacts`, (_req, res, ctx) => res(ctx.json(emergencyContacts))),
  rest.post(`${BASE}/incidents`, (_req, res, ctx) => res(ctx.json({}))),

  // Caretaker notes
  rest.get(`${BASE}/caretaker-notes`, (_req, res, ctx) => res(ctx.json(caretakerNotes))),
  rest.patch(`${BASE}/caretaker-notes/:id/reply`, async (req, res, ctx) => {
    const body = await req.json() as { reply: string };
    return res(ctx.json({ ...caretakerNotes[0], replyContent: body.reply, updatedAt: now }));
  }),

  // AI assistant
  rest.post(`${BASE}/ai/chat`, (_req, res, ctx) =>
    res(ctx.json({ reply: "I'm here to help with Margaret's care." })),
  ),

  // Catch-all DELETE — test suite exercises this path to verify error handling
  rest.delete(`${BASE}/*`, (_req, res, ctx) => res(ctx.status(405))),
];

export const server = setupServer(...handlers);
