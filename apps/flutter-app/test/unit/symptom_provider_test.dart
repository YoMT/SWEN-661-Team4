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

    test('value above maximum (6) is clamped to 5', () {
      provider.setSeverity(6);
      expect(provider.severity, 5);
    });

    test('value within range is kept as-is', () {
      provider.setSeverity(3);
      expect(provider.severity, 3);
    });
  });

  group('SymptomProvider overallStatus via save()', () {
    // _updateStatus divides sum of the first 3 log severities by 3:
    //   avg ≤ 2.0  → 'Good'
    //   avg ≤ 3.5  → 'Stable'
    //   avg > 3.5  → 'High'

    Future<void> addLog(int severity) async {
      provider.selectSymptom(SymptomType.pain);
      provider.setSeverity(severity);
      await provider.save(null);
    }

    test('single log with low severity → Good (1/3 ≤ 2)', () async {
      await addLog(3); // sum=3, avg=1.0 → Good
      expect(provider.overallStatus, 'Good');
    });

    test('two logs with high severity → Stable (10/3 ≤ 3.5)', () async {
      await addLog(5); // sum=5, avg=1.67 → Good
      await addLog(5); // sum=10, avg=3.33 → Stable
      expect(provider.overallStatus, 'Stable');
    });

    test('three logs with high severities → High (13/3 > 3.5)', () async {
      await addLog(5); // logs=[5],  sum=5,  avg=1.67 → Good
      await addLog(4); // logs=[4,5], sum=9, avg=3.0  → Stable
      await addLog(4); // logs=[4,4,5], sum=13, avg=4.33 → High
      expect(provider.overallStatus, 'High');
    });

    test('selectedSymptom is reset to null after save()', () async {
      await addLog(3);
      expect(provider.selectedSymptom, isNull);
    });

    test('severity is reset to 3 after save()', () async {
      provider.setSeverity(5);
      await addLog(5);
      expect(provider.severity, 3);
    });
  });
}
