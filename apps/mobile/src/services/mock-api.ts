import type { User } from '@/features/auth/user';
import type { Profile } from '@/features/profile/profile';
import type { Medication } from '@/features/medications/medication';
import type { Appointment } from '@/features/appointments/appointment';
import type { SymptomLog } from '@/features/symptoms/symptom-log';
import type { EmergencyContact } from '@/features/emergency/emergency-contact';
import type { CaretakerNote } from '@/features/caretaker/caretaker-note';

export const DEMO_EMAIL = 'demo@careconnect.com';
export const DEMO_PASSWORD = 'demo123';
export const DEMO_TOKEN = 'cc-demo-token';

const now = new Date().toISOString();

const DEMO_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: DEMO_EMAIL,
  createdAt: now,
  updatedAt: now,
};

const todayAt = (h: number, m: number) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const hoursAgo = (n: number) => new Date(Date.now() - n * 3600000).toISOString();

const daysFromNow = (n: number, h = 10, m = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

let _profile: Profile = {
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

let _medications: Medication[] = [
  {
    id: 'm1',
    name: 'Metoprolol',
    dosage: '50 mg',
    instruction: 'Take with water, before meals',
    scheduledTime: todayAt(8, 0),
    timeSlot: 'morning',
    status: 'given',
    takenAt: todayAt(8, 5),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'm2',
    name: 'Lisinopril',
    dosage: '10 mg',
    instruction: 'Take once daily with food',
    scheduledTime: todayAt(12, 0),
    timeSlot: 'afternoon',
    status: 'dueNow',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'm3',
    name: 'Atorvastatin',
    dosage: '20 mg',
    instruction: 'Take at bedtime',
    scheduledTime: todayAt(21, 0),
    timeSlot: 'night',
    status: 'upcoming',
    createdAt: now,
    updatedAt: now,
  },
];

let _appointments: Appointment[] = [
  {
    id: 'a1',
    doctorName: 'Dr. Sarah Chen',
    specialty: 'Cardiologist',
    location: 'City Heart Clinic, 200 Medical Dr',
    dateTime: todayAt(15, 0),
    type: 'inPerson',
    status: 'upcoming',
    notes: 'Bring recent blood pressure log',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'a2',
    doctorName: 'Dr. Michael Torres',
    specialty: 'General Practice',
    location: 'Video call — link sent by email',
    dateTime: daysFromNow(7, 14, 0),
    type: 'video',
    status: 'upcoming',
    createdAt: now,
    updatedAt: now,
  },
];

let _symptoms: SymptomLog[] = [
  {
    id: 's1',
    symptom: 'dizzy',
    severity: 3,
    note: 'Brief dizzy spell after standing up',
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
  },
  {
    id: 's2',
    symptom: 'tired',
    severity: 4,
    note: 'Low energy since morning',
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(6),
  },
];

let _contacts: EmergencyContact[] = [
  {
    id: 'c1',
    name: 'Sarah Johnson',
    phone: '(555) 234-5678',
    relationship: 'Daughter',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'c2',
    name: 'Dr. Sarah Chen',
    phone: '(555) 987-6543',
    relationship: 'Primary Doctor',
    createdAt: now,
    updatedAt: now,
  },
];

let _notes: CaretakerNote[] = [
  {
    id: 'n1',
    authorName: 'Maria (Day Nurse)',
    content: 'Margaret had a good morning. Ate breakfast well and took all morning meds. Small tremor in right hand around 10am — noted in chart.',
    createdAt: hoursAgo(4),
    updatedAt: hoursAgo(4),
  },
  {
    id: 'n2',
    authorName: 'Maria (Day Nurse)',
    content: 'Blood pressure was 138/85 at noon — slightly elevated. Afternoon walk cancelled due to weather. Margaret watching TV, calm and comfortable.',
    replyContent: "Thanks Maria. I'll check BP again when I arrive at 5pm.",
    createdAt: hoursAgo(24),
    updatedAt: hoursAgo(24),
  },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function aiReply(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('medication') || m.includes('med') || m.includes('pill')) {
    return "Margaret has 3 medications today. Metoprolol (50mg) was taken this morning. Lisinopril (10mg) is due now — please remind her to take it with food. Atorvastatin (20mg) is scheduled for tonight at 9pm.";
  }
  if (m.includes('appointment') || m.includes('doctor') || m.includes('visit')) {
    return "There's an appointment with Dr. Sarah Chen (Cardiologist) today at 3pm at City Heart Clinic. Remember to bring the blood pressure log. Dr. Torres has a video call booked for next week.";
  }
  if (m.includes('symptom') || m.includes('feeling') || m.includes('pain')) {
    return "Margaret logged dizziness (severity 3/10) about 2 hours ago and fatigue (severity 4/10) this morning. The dizziness after standing can indicate orthostatic hypotension — worth mentioning to Dr. Chen at today's appointment.";
  }
  if (m.includes('blood pressure') || m.includes('bp')) {
    return "Blood pressure was 138/85 at noon — slightly elevated. Normal target is under 130/80 for Margaret's profile. Monitor again this evening and flag anything above 145/90.";
  }
  if (m.includes('emergency') || m.includes('contact') || m.includes('call')) {
    return "Emergency contacts on file: Sarah Johnson (daughter) at (555) 234-5678, and Dr. Sarah Chen's office at (555) 987-6543.";
  }
  return "I'm here to help with Margaret's care. You can ask me about today's medications, upcoming appointments, recent symptoms, or blood pressure readings.";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mockRequest<T>(method: string, path: string, body?: unknown): T {
  const ts = new Date().toISOString();

  // ── Auth ────────────────────────────────────────────────────────────────
  if (method === 'POST' && path === '/auth/login') {
    const { email, password } = body as { email: string; password: string };
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      return { token: DEMO_TOKEN, user: DEMO_USER } as T;
    }
    throw new Error('Invalid email or password.');
  }

  if (method === 'POST' && path === '/auth/signup') {
    const { name, email } = body as { name: string; email: string };
    const user: User = { id: uid(), name, email, createdAt: ts, updatedAt: ts };
    return { token: DEMO_TOKEN, user } as T;
  }

  if (method === 'GET' && path === '/auth/me') {
    return DEMO_USER as T;
  }

  // ── Profile ─────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/profile') return _profile as T;
  if (method === 'PATCH' && path === '/profile') {
    _profile = { ..._profile, ...(body as Partial<Profile>), updatedAt: ts };
    return _profile as T;
  }

  // ── Medications ─────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/medications') return _medications as T;
  if (method === 'POST' && path === '/medications') {
    const med: Medication = {
      id: uid(),
      ...(body as Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>),
      createdAt: ts,
      updatedAt: ts,
    };
    _medications = [..._medications, med];
    return med as T;
  }
  const takenMatch = path.match(/^\/medications\/([^/]+)\/taken$/);
  if (method === 'PATCH' && takenMatch) {
    const id = takenMatch[1];
    _medications = _medications.map((m) =>
      m.id === id ? { ...m, status: 'given', takenAt: ts, updatedAt: ts } : m,
    );
    return {} as T;
  }

  // ── Appointments ─────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/appointments') return _appointments as T;
  if (method === 'POST' && path === '/appointments') {
    const appt: Appointment = {
      id: uid(),
      ...(body as Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>),
      createdAt: ts,
      updatedAt: ts,
    };
    _appointments = [..._appointments, appt];
    return appt as T;
  }
  const apptPatchMatch = path.match(/^\/appointments\/([^/]+)$/);
  if (method === 'PATCH' && apptPatchMatch) {
    const id = apptPatchMatch[1];
    _appointments = _appointments.map((a) =>
      a.id === id ? { ...a, ...(body as Partial<Appointment>), updatedAt: ts } : a,
    );
    return _appointments.find((a) => a.id === id) as T;
  }

  // ── Symptoms ─────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/symptoms') return _symptoms as T;
  if (method === 'POST' && path === '/symptoms') {
    const log: SymptomLog = {
      id: uid(),
      ...(body as Omit<SymptomLog, 'id' | 'createdAt' | 'updatedAt'>),
      createdAt: ts,
      updatedAt: ts,
    };
    _symptoms = [log, ..._symptoms];
    return log as T;
  }

  // ── Emergency contacts ───────────────────────────────────────────────────
  if (method === 'GET' && path === '/emergency-contacts') return _contacts as T;
  if (method === 'POST' && path === '/incidents') return {} as T;

  // ── Caretaker notes ──────────────────────────────────────────────────────
  if (method === 'GET' && path === '/caretaker-notes') return _notes as T;
  const replyMatch = path.match(/^\/caretaker-notes\/([^/]+)\/reply$/);
  if (method === 'PATCH' && replyMatch) {
    const id = replyMatch[1];
    const { reply } = body as { reply: string };
    _notes = _notes.map((n) =>
      n.id === id ? { ...n, replyContent: reply, updatedAt: ts } : n,
    );
    return _notes.find((n) => n.id === id) as T;
  }

  // ── AI assistant ─────────────────────────────────────────────────────────
  if (method === 'POST' && path === '/ai/chat') {
    const { message } = body as { message: string };
    return { reply: aiReply(message) } as T;
  }

  throw new Error(`[mock] Unhandled ${method} ${path}`);
}
