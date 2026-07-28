import { renderHook, act, waitFor } from '@testing-library/react'
import { AppProviders } from '@renderer/state/providers'
import { AuthedProviders } from './test-utils'
import { useRefreshContext } from '@renderer/state/refresh-context'
import { useAuthContext } from '@renderer/state/auth-context'
import { useProfileContext } from '@renderer/state/profile-context'
import { useMedicationContext } from '@renderer/state/medication-context'
import { useAppointmentContext } from '@renderer/state/appointment-context'
import { useSymptomContext } from '@renderer/state/symptom-context'
import { useAiAssistantContext } from '@renderer/state/ai-assistant-context'
import { useDashboard } from '@renderer/state/use-dashboard'

const wrapper = AppProviders

describe('refresh-context', () => {
  test('triggerRefresh increments the key', () => {
    const { result } = renderHook(() => useRefreshContext(), { wrapper })
    const start = result.current.refreshKey
    act(() => result.current.triggerRefresh())
    expect(result.current.refreshKey).toBe(start + 1)
  })
})

describe('auth-context', () => {
  test('starts logged out after the cold-start effect', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.isLoggedIn).toBe(false)
    expect(result.current.user).toBeNull()
  })

  test('login succeeds with demo credentials', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await act(async () => {
      await result.current.login('demo@careconnect.com', 'demo123')
    })
    expect(result.current.isLoggedIn).toBe(true)
    expect(result.current.user?.email).toBe('demo@careconnect.com')
  })

  test('login failure sets an error message', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await act(async () => {
      await result.current.login('bad@user.com', 'wrong')
    })
    expect(result.current.errorMessage).toBe('Invalid email or password.')
    expect(result.current.isLoggedIn).toBe(false)
  })

  test('signup then logout', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await act(async () => {
      await result.current.signup('New Person', 'new@person.com', 'secret1')
    })
    expect(result.current.isLoggedIn).toBe(true)
    await act(async () => {
      await result.current.logout()
    })
    expect(result.current.isLoggedIn).toBe(false)
  })
})

describe('profile-context', () => {
  test('loads the profile and applies an update', async () => {
    // Profile is a protected endpoint — the context only fetches once
    // authenticated, so render inside the signed-in providers and wait for the
    // data (isLoading flips false immediately while logged out).
    const { result } = renderHook(() => useProfileContext(), { wrapper: AuthedProviders })
    await waitFor(() => expect(result.current.profile?.name).toBeTruthy())
    await act(async () => {
      await result.current.update({ bloodType: 'B+' })
    })
    expect(result.current.profile?.bloodType).toBe('B+')
  })
})

describe('medication-context', () => {
  test('loads meds, exposes counts/byTimeSlot, adds and marks taken', async () => {
    // Meds are a protected endpoint; render authenticated and wait for the
    // loaded doses rather than the (immediate, logged-out) isLoading flip.
    const { result } = renderHook(() => useMedicationContext(), { wrapper: AuthedProviders })
    await waitFor(() => expect(result.current.totalDoses).toBeGreaterThan(0))

    expect(result.current.givenDoses).toBeGreaterThanOrEqual(0)
    expect(Array.isArray(result.current.byTimeSlot('morning'))).toBe(true)

    const before = result.current.totalDoses
    await act(async () => {
      await result.current.addMedication({
        name: 'Vitamin D',
        dosage: '1000 IU',
        instruction: 'Morning',
        scheduledTime: '8:00 AM',
        timeSlot: 'morning',
        status: 'upcoming'
      })
    })
    expect(result.current.totalDoses).toBe(before + 1)

    const target = result.current.medications.find((m) => m.status !== 'given')
    if (target) {
      await act(async () => {
        await result.current.markTaken(target.id)
      })
      expect(result.current.medications.find((m) => m.id === target.id)?.status).toBe('given')
    }
  })
})

describe('appointment-context', () => {
  test('loads, splits today/upcoming, adds and reschedules', async () => {
    // Appointments are a protected resource; render authenticated and wait for
    // the fetch to settle before mutating (data is empty until logged in).
    const { result } = renderHook(() => useAppointmentContext(), { wrapper: AuthedProviders })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(Array.isArray(result.current.todayAppointments)).toBe(true)
    expect(Array.isArray(result.current.upcomingAppointments)).toBe(true)

    const before = result.current.appointments.length
    await act(async () => {
      await result.current.addAppointment({
        doctorName: 'Dr. New',
        specialty: 'GP',
        location: 'Clinic',
        dateTime: new Date().toISOString(),
        type: 'inPerson',
        status: 'upcoming'
      })
    })
    expect(result.current.appointments.length).toBe(before + 1)

    const first = result.current.appointments[0]
    const newTime = new Date(Date.now() + 172800000).toISOString()
    await act(async () => {
      await result.current.reschedule(first.id, newTime)
    })
    expect(result.current.appointments.find((a) => a.id === first.id)?.dateTime).toBe(newTime)
  })
})

describe('symptom-context', () => {
  test('loads and prepends a new log', async () => {
    // Symptom logs are a protected resource; render authenticated and wait for
    // the fetch to settle before mutating (data is empty until logged in).
    const { result } = renderHook(() => useSymptomContext(), { wrapper: AuthedProviders })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    const before = result.current.logs.length
    await act(async () => {
      await result.current.addLog({ symptom: 'nausea', severity: 2, note: 'slight' })
    })
    expect(result.current.logs.length).toBe(before + 1)
    expect(result.current.logs[0].symptom).toBe('nausea')
  })
})

describe('ai-assistant-context', () => {
  test('sendMessage appends user + assistant messages, clearMessages empties', async () => {
    const { result } = renderHook(() => useAiAssistantContext(), { wrapper })
    await act(async () => {
      await result.current.sendMessage('what medication is due?')
    })
    expect(result.current.messages.length).toBe(2)
    expect(result.current.messages[0].role).toBe('user')
    expect(result.current.messages[1].role).toBe('assistant')
    expect(result.current.isTyping).toBe(false)

    act(() => result.current.clearMessages())
    expect(result.current.messages).toHaveLength(0)
  })
})

describe('use-dashboard', () => {
  test('aggregates cross-feature state', async () => {
    const { result } = renderHook(() => useDashboard(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.careeName).toBeTruthy()
    expect(typeof result.current.totalDoses).toBe('number')
    expect(typeof result.current.todayAppointmentsCount).toBe('number')
    expect(typeof result.current.logsCount).toBe('number')
    act(() => result.current.refresh())
  })
})

describe('context guards (used outside their provider)', () => {
  test('each hook throws a helpful error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useRefreshContext())).toThrow(/RefreshProvider/)
    expect(() => renderHook(() => useAuthContext())).toThrow(/AuthProvider/)
    expect(() => renderHook(() => useProfileContext())).toThrow(/ProfileProvider/)
    expect(() => renderHook(() => useMedicationContext())).toThrow(/MedicationProvider/)
    expect(() => renderHook(() => useAppointmentContext())).toThrow(/AppointmentProvider/)
    expect(() => renderHook(() => useSymptomContext())).toThrow(/SymptomProvider/)
    expect(() => renderHook(() => useAiAssistantContext())).toThrow(/AiAssistantProvider/)
    spy.mockRestore()
  })
})
