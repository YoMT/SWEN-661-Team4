import 'package:flutter/foundation.dart';
import '../../../core/data/seeds.dart';

class DashboardProvider extends ChangeNotifier {
  bool isLoading = false;
  String careeName = Seeds.careeName;
  String? errorMessage;

  Future<void> refresh() async {
    isLoading = true;
    errorMessage = null;
    notifyListeners();
    try {
      await Future.delayed(const Duration(milliseconds: 600));
    } catch (e) {
      errorMessage = 'Failed to refresh dashboard.';
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}
