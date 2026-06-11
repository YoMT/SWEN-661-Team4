export type AppointmentType = 'inPerson' | 'video';
export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  location: string;
  dateTime: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
