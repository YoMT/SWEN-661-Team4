import 'package:flutter/foundation.dart';

class DashboardProvider extends ChangeNotifier {
  bool isLoading = false;
  String careeName = 'Eleanor Reyes';

  Future<void> refresh() async {
    isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(milliseconds: 600));
    isLoading = false;
    notifyListeners();
  }
}
