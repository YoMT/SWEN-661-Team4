import {
  mockRequest,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  DEMO_TOKEN
} from '../services/mock-api'

describe('mock API', () => {
  test('logs in demo user successfully', () => {
    const result = mockRequest<any>('POST', '/auth/login', {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD
    })

    expect(result.token).toBe(DEMO_TOKEN)
    expect(result.user.email).toBe(DEMO_EMAIL)
  })

  test('rejects invalid login', () => {
    expect(() =>
      mockRequest('POST', '/auth/login', {
        email: 'wrong@test.com',
        password: 'wrong'
      })
    ).toThrow('Invalid email or password.')
  })

  test('returns profile', () => {
    const profile = mockRequest<any>('GET', '/profile')

    expect(profile.name).toBeDefined()
    expect(profile.email).toBeDefined()
  })

  test('returns medications', () => {
    const meds = mockRequest<any[]>('GET', '/medications')

    expect(meds.length).toBeGreaterThan(0)
  })
})