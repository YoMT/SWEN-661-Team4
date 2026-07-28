import {
  api,
  setAuthToken,
  registerErrorHandler,
  registerUnauthorizedHandler
} from '@renderer/services/api'

// Under Jest the import.meta.env transform makes VITE_API_URL undefined, so the
// client uses the in-memory mock backend (USE_MOCK = true).

describe('api client (mock backend)', () => {
  afterEach(() => {
    registerErrorHandler(null)
    registerUnauthorizedHandler(null)
    setAuthToken(null)
  })

  test('get resolves mock data', async () => {
    const profile = await api.get<{ name: string }>('/profile')
    expect(profile.name).toBeTruthy()
  })

  test('post routes through the mock backend', async () => {
    const res = await api.post<{ token: string }>('/auth/login', {
      email: 'demo@careconnect.com',
      password: 'demo123'
    })
    expect(res.token).toBeTruthy()
  })

  test('patch and delete are exposed', async () => {
    const updated = await api.patch<{ phone: string }>('/profile', { phone: '(555) 111-2222' })
    expect(updated.phone).toBe('(555) 111-2222')
    // /incidents is the only mock DELETE-safe no-op route via POST; delete an
    // unknown path surfaces through the error handler below instead.
    expect(typeof api.delete).toBe('function')
  })

  test('invokes the registered error handler and rethrows on failure', async () => {
    const onError = jest.fn()
    registerErrorHandler(onError)

    await expect(
      api.post('/auth/login', { email: 'wrong@test.com', password: 'wrong' })
    ).rejects.toThrow('Invalid email or password.')

    expect(onError).toHaveBeenCalledWith('Invalid email or password.')
  })

  test('setAuthToken and unauthorized handler registration are no-throw', () => {
    expect(() => setAuthToken('tok')).not.toThrow()
    expect(() => registerUnauthorizedHandler(() => {})).not.toThrow()
  })
})
