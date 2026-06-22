import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/features/symptoms/providers/symptom_provider.dart';
import 'package:care_connect/features/symptoms/models/symptom_log_model.dart';

void main() {
  late SymptomProvider provider;

  setUp(() {
    provider = SymptomProvider();
    provider.logs = []; // start each test with a clean log list
  });

  group('SymptomProvider.setSeverity', () {
    test('value below minimum (0) is clamped to 1', () {
      provider.setSeverity(0);
      expect(provider.severity, 1);
    });

    test('value above maximum (11) is clamped to 10', () {
      provider.setSeverity(11);
      expect(provider.severity, 10);
    });

    test('value within range is kept as-is', () {
      provider.setSeverity(7);
      expect(provider.severity, 7);
    });
  });

  group('SymptomProvider overallStatus via save()', () {
    // _updateStatus divides the sum of the first 3 log severities by 3 (1-10):
    //   avg ≤ 4.0  → 'Good'
    //   avg ≤ 7.0  → 'Stable'
    //   avg > 7.0  → 'High'

    Future<void> addLog(int severity) async {
      provider.selectSymptom(SymptomType.pain);
      provider.setSeverity(severity);
      await provider.save(null);
    }

    test('low-severity log → Good (avg ≤ 4)', () async {
      await addLog(3); // [3]       sum=3,  avg=1.0 → Good
      expect(provider.overallStatus, 'Good');
    });

    test('mid-severity logs → Stable (4 < avg ≤ 7)', () async {
      await addLog(5); // [5]       sum=5,  avg=1.67 → Good
      await addLog(5); // [5,5]     sum=10, avg=3.33 → Good
      await addLog(5); // [5,5,5]   sum=15, avg=5.0  → Stable
      expect(provider.overallStatus, 'Stable');
    });

    test('high-severity logs → High (avg > 7)', () async {
      await addLog(8); // [8]       sum=8,  avg=2.67 → Good
      await addLog(8); // [8,8]     sum=16, avg=5.33 → Stable
      await addLog(8); // [8,8,8]   sum=24, avg=8.0  → High
      expect(provider.overallStatus, 'High');
    });

    test('selectedSymptom is reset to null after save()', () async {
      await addLog(3);
      expect(provider.selectedSymptom, isNull);
    });

    test('severity is reset to 5 after save()', () async {
      provider.setSeverity(8);
      await addLog(8);
      expect(provider.severity, 5);
    });
  });
}
