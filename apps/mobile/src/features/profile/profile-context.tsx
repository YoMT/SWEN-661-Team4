import React, { createContext, useContext, useState } from 'react';
import type { Profile } from '@/features/profile/profile';

const DEFAULT: Profile = {
  id: '1',
  name: 'Alex Carter',
  email: 'alex.carter@email.com',
  phone: '+1 (555) 123-4567',
  careeName: 'Gloria Washington',
  bloodType: 'A+',
  allergies: ['Penicillin'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

interface ProfileState {
  profile: Profile;
  update: (patch: Partial<Profile>) => void;
}

const ProfileContext = createContext<ProfileState | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT);

  function update(patch: Partial<Profile>) {
    setProfile((prev) => ({ ...prev, ...patch, updatedAt: new Date().toISOString() }));
  }

  return (
    <ProfileContext.Provider value={{ profile, update }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfileContext must be used within ProfileProvider');
  return ctx;
}
