import React, { createContext, useContext, useCallback } from 'react'
import type { Profile } from '@renderer/types'
import { api } from '@renderer/services/api'
import { useAuthedResource } from '@renderer/state/use-authed-resource'

interface ProfileState {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  update: (patch: Partial<Profile>) => Promise<void>
}

const ProfileContext = createContext<ProfileState | null>(null)

export function ProfileProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const {
    data: profile,
    isLoading,
    error,
    setData: setProfile
  } = useAuthedResource<Profile | null>('/profile', null, 'Could not load profile')

  const update = useCallback(
    async (patch: Partial<Profile>) => {
      const updated = await api.patch<Profile>('/profile', patch)
      setProfile(updated)
    },
    [setProfile]
  )

  return (
    <ProfileContext.Provider value={{ profile, isLoading, error, update }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileContext(): ProfileState {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfileContext must be used within ProfileProvider')
  return ctx
}
