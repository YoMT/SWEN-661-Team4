import React from 'react';
import { MedicationProvider } from '@/features/medications/medication-context';
import { AppointmentProvider } from '@/features/appointments/appointment-context';
import { SymptomProvider } from '@/features/symptoms/symptom-context';
import { EmergencyProvider } from '@/features/emergency/emergency-context';
import { CaretakerProvider } from '@/features/caretaker/caretaker-context';
import { ProfileProvider } from '@/features/profile/profile-context';

// Compound provider for all care-domain data.
// Groups related contexts so _layout.tsx stays readable and
// the nesting depth stays manageable.
export function CareDataProvider({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <MedicationProvider>
        <AppointmentProvider>
          <SymptomProvider>
            <EmergencyProvider>
              <CaretakerProvider>
                {children}
              </CaretakerProvider>
            </EmergencyProvider>
          </SymptomProvider>
        </AppointmentProvider>
      </MedicationProvider>
    </ProfileProvider>
  );
}
