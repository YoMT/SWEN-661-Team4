import {
  mockRequest,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  DEMO_TOKEN
} from '@renderer/services/mock-api'
import type { Appointment, CaretakerNote, Medication, Profile, SymptomLog } from '@renderer/types'

describe('mock-api: auth', () => {
  test('logs in the demo user', () => {
    const res = mockRequest<{ token: string; user: { email: string } }>('POST', '/auth/login', {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD
    })
    expect(res.token).toBe(DEMO_TOKEN)
    expect(res.user.email).toBe(DEMO_EMAIL)
  })

  test('rejects bad credentials', () => {
    expect(() =>
      mockRequest('POST', '/auth/login', { email: 'x@y.com', password: 'nope' })
    ).toThrow('Invalid email or password.')
  })

  test('signs up a new user with a generated id', () => {
    const res = mockRequest<{ token: string; user: { id: string; name: string } }>(
      'POST',
      '/auth/signup',
      { name: 'Jamie', email: 'jamie@example.com', password: 'secret1' }
    )
    expect(res.token).toBe(DEMO_TOKEN)
    expect(res.user.name).toBe('Jamie')
    expect(res.user.id).toBeTruthy()
  })

  test('returns the current user', () => {
    const me = mockRequest<{ email: string }>('GET', '/auth/me')
    expect(me.email).toBe(DEMO_EMAIL)
  })
})

describe('mock-api: profile', () => {
  test('reads and patches the profile', () => {
    const before = mockRequest<Profile>('GET', '/profile')
    expect(before.name).toBeTruthy()

    const after = mockRequest<Profile>('PATCH', '/profile', { phone: '(555) 000-0000' })
    expect(after.phone).toBe('(555) 000-0000')
    expect(after.updatedAt).not.toBe(before.updatedAt)
  })
})

describe('mock-api: medications', () => {
  test('lists, adds, and marks a medication taken', () => {
    const initial = mockRequest<Medication[]>('GET', '/medications')
    expect(initial.length).toBeGreaterThan(0)

    const created = mockRequest<Medication>('POST', '/medications', {
      name: 'Aspirin',
      dosage: '81 mg',
      instruction: 'Daily',
      scheduledTime: '7:00 AM',
      timeSlot: 'morning',
      status: 'upcoming'
    } as Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>)
    expect(created.id).toBeTruthy()

    const afterAdd = mockRequest<Medication[]>('GET', '/medications')
    expect(afterAdd.length).toBe(initial.length + 1)

    mockRequest('PATCH', `/medications/${created.id}/taken`)
    const taken = mockRequest<Medication[]>('GET', '/medications').find((m) => m.id === created.id)
    expect(taken?.status).toBe('given')
    expect(taken?.takenAt).toBeTruthy()
  })
})

describe('mock-api: appointments', () => {
  test('lists, adds, and reschedules an appointment', () => {
    const created = mockRequest<Appointment>('POST', '/appointments', {
      doctorName: 'Dr. Test',
      specialty: 'GP',
      location: 'Clinic',
      dateTime: new Date().toISOString(),
      type: 'inPerson',
      status: 'upcoming'
    } as Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>)
    expect(created.id).toBeTruthy()

    const newTime = new Date(Date.now() + 86400000).toISOString()
    const patched = mockRequest<Appointment>('PATCH', `/appointments/${created.id}`, {
      dateTime: newTime
    })
    expect(patched.dateTime).toBe(newTime)
  })
})

describe('mock-api: symptoms', () => {
  test('lists and prepends a new symptom log', () => {
    const created = mockRequest<SymptomLog>('POST', '/symptoms', {
      symptom: 'headache',
      severity: 2,
      note: 'mild'
    } as Omit<SymptomLog, 'id' | 'createdAt' | 'updatedAt'>)
    const logs = mockRequest<SymptomLog[]>('GET', '/symptoms')
    expect(logs[0].id).toBe(created.id)
  })
})

describe('mock-api: contacts, incidents, notes', () => {
  test('returns emergency contacts', () => {
    expect(mockRequest<unknown[]>('GET', '/emergency-contacts').length).toBeGreaterThan(0)
  })

  test('accepts an incident report', () => {
    expect(mockRequest('POST', '/incidents', {})).toEqual({})
  })

  test('lists notes and records a reply', () => {
    const notes = mockRequest<CaretakerNote[]>('GET', '/caretaker-notes')
    const target = notes[0]
    const replied = mockRequest<CaretakerNote>('PATCH', `/caretaker-notes/${target.id}/reply`, {
      reply: 'On my way'
    })
    expect(replied.replyContent).toBe('On my way')
  })
})

describe('mock-api: ai assistant', () => {
  test.each([
    ['what medication is due', 'medications'],
    ['any appointment today', 'appointment'],
    ['how are her symptoms', 'symptom'],
    ['what is her blood pressure', 'blood pressure'],
    ['who is the emergency contact', 'emergency'],
    ['hello there', 'help']
  ])('replies to "%s"', (message) => {
    const res = mockRequest<{ reply: string }>('POST', '/ai/chat', { message })
    expect(typeof res.reply).toBe('string')
    expect(res.reply.length).toBeGreaterThan(0)
  })
})

describe('mock-api: unknown routes', () => {
  test('throws on an unhandled path', () => {
    expect(() => mockRequest('DELETE', '/nope')).toThrow('[mock] Unhandled DELETE /nope')
  })
})
