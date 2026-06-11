export type SymptomType = 'pain' | 'dizzy' | 'breath' | 'tired' | 'nausea' | 'other';

export interface SymptomLog {
  id: string;
  symptom: SymptomType;
  severity: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
