export interface CareReport {
  patientName: string;
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  symptomSummary: string;
  nextAppointment: string;
}

export function adherenceRate(report: CareReport): number {
  if (report.totalDoses === 0) return 0;
  return (report.takenDoses / report.totalDoses) * 100;
}
