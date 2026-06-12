import React from 'react';
import { MedicationProvider } from './medication-context';
import { AppointmentProvider } from './appointment-context';
import { SymptomProvider } from './symptom-context';
import { EmergencyProvider } from './emergency-context';
import { CaretakerProvider } from './caretaker-context';
import { ProfileProvider } from './profile-context';

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
