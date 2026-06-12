import type { Medication } from '@/models/medication';
import type { Appointment } from '@/models/appointment';
import type { EmergencyContact } from '@/models/emergency-contact';
import type { CaretakerNote } from '@/models/caretaker-note';

const now = new Date().toISOString();
const today = new Date();
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

export const MEDICATION_SEEDS: Medication[] = [
  { id: '1', name: 'Levodopa', dosage: '100mg', instruction: 'Take with water', scheduledTime: '8:00 AM', timeSlot: 'morning', status: 'upcoming', createdAt: now, updatedAt: now },
  { id: '2', name: 'Carbidopa', dosage: '25mg', instruction: 'Take with food', scheduledTime: '12:00 PM', timeSlot: 'afternoon', status: 'upcoming', createdAt: now, updatedAt: now },
  { id: '3', name: 'Amantadine', dosage: '100mg', instruction: 'Take before bed', scheduledTime: '9:00 PM', timeSlot: 'evening', status: 'given', takenAt: now, createdAt: now, updatedAt: now },
];

export const APPOINTMENT_SEEDS: Appointment[] = [
  { id: '1', doctorName: 'Dr. Sarah Chen', specialty: 'Neurology', location: 'City Medical Center', dateTime: today.toISOString(), type: 'inPerson', status: 'upcoming', createdAt: now, updatedAt: now },
  { id: '2', doctorName: 'Dr. Michael Torres', specialty: 'Physical Therapy', location: 'Virtual Visit', dateTime: nextWeek.toISOString(), type: 'video', status: 'upcoming', createdAt: now, updatedAt: now },
];

export const EMERGENCY_CONTACT_SEEDS: EmergencyContact[] = [
  { id: '1', name: 'James Washington', phone: '+1 (555) 234-5678', relationship: 'Spouse', createdAt: now, updatedAt: now },
  { id: '2', name: 'Dr. Sarah Chen', phone: '+1 (555) 987-6543', relationship: 'Primary Physician', createdAt: now, updatedAt: now },
];

export const CARETAKER_NOTE_SEEDS: CaretakerNote[] = [
  { id: '1', authorName: 'Dr. Sarah Chen', content: 'Patient showed improvement in fine motor skills during today\'s session. Continue current medication regimen.', createdAt: now, updatedAt: now },
  { id: '2', authorName: 'Physical Therapist', content: 'Tremors slightly worse in the morning. Suggest scheduling therapy after medication peak.', createdAt: now, updatedAt: now },
];
