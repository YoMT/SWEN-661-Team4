export type DoseTimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';
export type DoseStatus = 'upcoming' | 'dueNow' | 'given' | 'missed';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  instruction: string;
  scheduledTime: string;
  timeSlot: DoseTimeSlot;
  status: DoseStatus;
  takenAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
