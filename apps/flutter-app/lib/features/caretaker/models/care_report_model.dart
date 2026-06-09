class CareReport {
  final String patientName;
  final int totalDoses;
  final int takenDoses;
  final int missedDoses;
  final String symptomSummary;
  final String nextAppointment;

  CareReport({
    required this.patientName,
    required this.totalDoses,
    required this.takenDoses,
    required this.missedDoses,
    required this.symptomSummary,
    required this.nextAppointment,
  });

  double get adherenceRate {
    if (totalDoses == 0) return 0;
    return (takenDoses / totalDoses) * 100;
  }
}
