import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/features/caretaker/models/care_report_model.dart';

CareReport _report({int total = 10, int taken = 0}) => CareReport(
      patientName: 'Test Patient',
      totalDoses: total,
      takenDoses: taken,
      missedDoses: total - taken,
      symptomSummary: 'Stable',
      nextAppointment: '2026-07-01',
    );

void main() {
  group('CareReport.adherenceRate', () {
    test('10 taken out of 10 → 100.0%', () {
      expect(_report(total: 10, taken: 10).adherenceRate, 100.0);
    });

    test('5 taken out of 10 → 50.0%', () {
      expect(_report(total: 10, taken: 5).adherenceRate, 50.0);
    });

    test('0 taken out of 10 → 0.0%', () {
      expect(_report(total: 10, taken: 0).adherenceRate, 0.0);
    });

    test('0 taken out of 0 → 0.0% (division-by-zero guard)', () {
      expect(_report(total: 0, taken: 0).adherenceRate, 0.0);
    });

    test('3 taken out of 4 → 75.0%', () {
      expect(_report(total: 4, taken: 3).adherenceRate, 75.0);
    });
  });
}
