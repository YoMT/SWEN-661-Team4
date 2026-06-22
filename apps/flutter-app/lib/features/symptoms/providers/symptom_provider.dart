import 'package:flutter/foundation.dart';
import '../models/symptom_log_model.dart';
import '../../../core/data/seeds.dart';
import '../../../core/error/error_bus.dart';

class SymptomProvider extends ChangeNotifier {
  SymptomType? selectedSymptom;
  int severity = 5;
  String overallStatus = 'Stable';
  List<SymptomLogModel> logs = Seeds.symptomLogs();
  bool isLoading = false;
  String? errorMessage;

  void selectSymptom(SymptomType symptom) {
    selectedSymptom = symptom;
    notifyListeners();
  }

  void setSeverity(int value) {
    severity = value.clamp(1, 10);
    notifyListeners();
  }

  Future<void> save(String? note) async {
    if (selectedSymptom == null) return;
    isLoading = true;
    errorMessage = null;
    notifyListeners();
    try {
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
      severity = 5;
    } catch (e) {
      errorMessage = 'Failed to save symptom log.';
      ErrorBus.instance.push(errorMessage!);
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void _updateStatus() {
    if (logs.isEmpty) {
      overallStatus = 'No data';
      return;
    }
    final recentSeverity = logs.take(3).map((l) => l.severity).reduce((a, b) => a + b) / 3;
    overallStatus = recentSeverity <= 4 ? 'Good' : recentSeverity <= 7 ? 'Stable' : 'High';
  }
}
