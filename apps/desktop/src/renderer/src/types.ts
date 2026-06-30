// Shared domain types for the CareConnect desktop app.
// Ported from apps/mobile so the data model stays in parity across platforms.

export interface User {
  id: string
  name: string
  email: string
  photoUrl?: string
  dateOfBirth?: string
  createdAt: string
  updatedAt: string
}

export interface Profile {
  id: string
  name: string
  email: string
  phone?: string
  careeName?: string
  dateOfBirth?: string
  photoUrl?: string
  bloodType?: string
  allergies: string[]
  createdAt: string
  updatedAt: string
}

export type DoseTimeSlot = 'morning' | 'afternoon' | 'evening' | 'night'
export type DoseStatus = 'upcoming' | 'dueNow' | 'given' | 'missed'

export interface Medication {
  id: string
  name: string
  dosage: string
  instruction: string
  scheduledTime: string
  timeSlot: DoseTimeSlot
  status: DoseStatus
  takenAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type AppointmentType = 'inPerson' | 'video'
export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  doctorName: string
  specialty: string
  location: string
  dateTime: string
  type: AppointmentType
  status: AppointmentStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export type SymptomType = 'pain' | 'dizzy' | 'breath' | 'tired' | 'nausea' | 'other'

export interface SymptomLog {
  id: string
  symptom: SymptomType
  severity: number
  note?: string
  createdAt: string
  updatedAt: string
}

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  createdAt: string
  updatedAt: string
}

export interface CaretakerNote {
  id: string
  authorName: string
  content: string
  replyContent?: string
  createdAt: string
  updatedAt: string
}
