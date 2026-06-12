import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Profile } from '@/features/profile/profile';
import { api } from '@/services/api';
import { useRefreshContext } from '@/shared/context/refresh-context';

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  update: (patch: Partial<Profile>) => Promise<void>;
}

const ProfileContext = createContext<ProfileState | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { refreshKey } = useRefreshContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    api.get<Profile>('/profile')
      .then(setProfile)
      .catch(() => setError('Could not load profile'))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  const update = useCallback(async (patch: Partial<Profile>) => {
    const updated = await api.patch<Profile>('/profile', patch);
    setProfile(updated);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, isLoading, error, update }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfileContext must be used within ProfileProvider');
  return ctx;
}
