import 'package:flutter/foundation.dart';
import '../models/symptom_log_model.dart';

class SymptomProvider extends ChangeNotifier {
  SymptomType? selectedSymptom;
  int severity = 3;
  String overallStatus = 'Stable';
  List<SymptomLogModel> logs = _sampleLogs();

  void selectSymptom(SymptomType symptom) {
    selectedSymptom = symptom;
    notifyListeners();
  }

  void setSeverity(int value) {
    severity = value.clamp(1, 5);
    notifyListeners();
  }

  Future<void> save(String? note) async {
    if (selectedSymptom == null) return;
    final now = DateTime.now();
    final log = SymptomLogModel(
      id: now.millisecondsSinceEpoch.toString(),
      createdAt: now,
      updatedAt: now,
      symptom: selectedSymptom!,
      severity: severity,
      note: note,
    );
    logs = [log, ...logs];
    _updateStatus();
    selectedSymptom = null;
    severity = 3;
    notifyListeners();
  }

  void _updateStatus() {
    if (logs.isEmpty) {
      overallStatus = 'No data';
      return;
    }
    final recentSeverity = logs.take(3).map((l) => l.severity).reduce((a, b) => a + b) / 3;
    overallStatus = recentSeverity <= 2 ? 'Good' : recentSeverity <= 3.5 ? 'Stable' : 'High';
  }
}

List<SymptomLogModel> _sampleLogs() {
  final now = DateTime.now();
  return [
    SymptomLogModel(
      id: '1',
      createdAt: now.subtract(const Duration(days: 1)),
      updatedAt: now.subtract(const Duration(days: 1)),
      symptom: SymptomType.pain,
      severity: 2,
      note: 'After lunch, lasted 10 min',
    ),
    SymptomLogModel(
      id: '2',
      createdAt: now.subtract(const Duration(days: 2)),
      updatedAt: now.subtract(const Duration(days: 2)),
      symptom: SymptomType.dizzy,
      severity: 3,
    ),
  ];
}
