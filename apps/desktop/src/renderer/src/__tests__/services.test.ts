// Unit tests for the API client (services/api.ts) exercised against the bundled
// in-memory mock backend (services/mock-api.ts). Because no VITE_API_URL is set
// under jsdom, api.ts runs in USE_MOCK mode and routes every call through
// mockRequest — so these tests cover both files end to end.
import {
  api,
  setAuthToken,
  registerErrorHandler,
  registerUnauthorizedHandler
} from '../services/api'
import { DEMO_EMAIL, DEMO_PASSWORD, DEMO_TOKEN } from '../services/mock-api'
import type {
  Appointment,
  CaretakerNote,
  EmergencyContact,
  Medication,
  Profile,
  SymptomLog,
  User
} from '../types'

afterEach(() => {
  registerErrorHandler(null)
  registerUnauthorizedHandler(null)
  setAuthToken(null)
})

describe('auth routes', () => {
  test('logs in the demo user and returns a token + user', async () => {
    const res = await api.post<{ token: string; user: User }>('/auth/login', {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD
    })
    expect(res.token).toBe(DEMO_TOKEN)
    expect(res.user.email).toBe(DEMO_EMAIL)
  })

  test('rejects invalid credentials and notifies the error handler', async () => {
    const onError = jest.fn()
    registerErrorHandler(onError)
    await expect(
      api.post('/auth/login', { email: 'nope@x.com', password: 'wrong' })
    ).rejects.toThrow(/invalid email or password/i)
    expect(onError).toHaveBeenCalledWith('Invalid email or password.')
  })

  test('signs up a new user with a generated id', async () => {
    const res = await api.post<{ token: string; user: User }>('/auth/signup', {
      name: 'New Person',
      email: 'new@care.com',
      password: 'secret123'
    })
    expect(res.user.id).toBeTruthy()
    expect(res.user.name).toBe('New Person')
    expect(res.token).toBe(DEMO_TOKEN)
  })

  test('returns the current user from /auth/me', async () => {
    const me = await api.get<User>('/auth/me')
    expect(me.email).toBe(DEMO_EMAIL)
  })
})

describe('profile routes', () => {
  test('reads and patches the profile', async () => {
    const before = await api.get<Profile>('/profile')
    expect(before.careeName).toBeTruthy()
    const after = await api.patch<Profile>('/profile', { phone: '(555) 000-1111' })
    expect(after.phone).toBe('(555) 000-1111')
  })
})

describe('medication routes', () => {
  test('lists, creates, and marks a dose taken', async () => {
    const list = await api.get<Medication[]>('/medications')
    expect(list.length).toBeGreaterThan(0)

    const created = await api.post<Medication>('/medications', {
      name: 'Aspirin',
      dosage: '81 mg',
      instruction: 'Daily',
      scheduledTime: '7:00 AM',
      timeSlot: 'morning',
      status: 'upcoming'
    })
    expect(created.id).toBeTruthy()

    await expect(api.patch(`/medications/${created.id}/taken`, {})).resolves.toBeDefined()
    const after = await api.get<Medication[]>('/medications')
    expect(after.find((m) => m.id === created.id)?.status).toBe('given')
  })
})

describe('appointment routes', () => {
  test('lists, creates, and reschedules', async () => {
    const list = await api.get<Appointment[]>('/appointments')
    expect(list.length).toBeGreaterThan(0)

    const created = await api.post<Appointment>('/appointments', {
      doctorName: 'Dr. Test',
      specialty: 'Neurology',
      location: 'Clinic',
      dateTime: new Date().toISOString(),
      type: 'inPerson',
      status: 'upcoming'
    })
    expect(created.id).toBeTruthy()

    const newTime = new Date(Date.now() + 86400000).toISOString()
    const updated = await api.patch<Appointment>(`/appointments/${created.id}`, {
      dateTime: newTime
    })
    expect(updated.dateTime).toBe(newTime)
  })
})

describe('symptom routes', () => {
  test('lists and creates a log', async () => {
    const list = await api.get<SymptomLog[]>('/symptoms')
    expect(Array.isArray(list)).toBe(true)
    const created = await api.post<SymptomLog>('/symptoms', {
      symptom: 'dizzy',
      severity: 2,
      note: 'mild'
    })
    expect(created.id).toBeTruthy()
    const after = await api.get<SymptomLog[]>('/symptoms')
    expect(after[0].id).toBe(created.id) // newest first
  })
})

describe('contacts, incidents and caretaker notes', () => {
  test('reads emergency contacts and posts an incident', async () => {
    const contacts = await api.get<EmergencyContact[]>('/emergency-contacts')
    expect(contacts.length).toBeGreaterThan(0)
    await expect(api.post('/incidents', { kind: 'fall' })).resolves.toBeDefined()
  })

  test('reads caretaker notes and posts a reply', async () => {
    const notes = await api.get<CaretakerNote[]>('/caretaker-notes')
    expect(notes.length).toBeGreaterThan(0)
    const replied = await api.patch<CaretakerNote>(`/caretaker-notes/${notes[0].id}/reply`, {
      reply: 'Thanks'
    })
    expect(replied.replyContent).toBe('Thanks')
  })
})

describe('ai assistant route', () => {
  test.each([
    ['what medication is due', /metoprolol/i],
    ['any appointment today', /dr\. sarah chen/i],
    ['how are her symptoms', /dizziness/i],
    ['what is her blood pressure', /138\/85/i],
    ['who is the emergency contact', /emergency contacts/i],
    ['hello there', /here to help/i]
  ])('replies contextually to "%s"', async (message, expected) => {
    const { reply } = await api.post<{ reply: string }>('/ai/chat', { message })
    expect(reply).toMatch(expected)
  })
})

describe('error handling', () => {
  test('throws on an unhandled route', async () => {
    await expect(api.get('/does-not-exist')).rejects.toThrow(/unhandled/i)
  })

  test('setAuthToken accepts a token and null without throwing', () => {
    expect(() => setAuthToken('abc')).not.toThrow()
    expect(() => setAuthToken(null)).not.toThrow()
  })

  test('api.delete routes through the client', async () => {
    await expect(api.delete('/does-not-exist')).rejects.toThrow(/unhandled/i)
  })
})
