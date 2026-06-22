import 'package:flutter/foundation.dart';
import '../models/emergency_contact_model.dart';
import '../../../core/data/seeds.dart';
import '../../../core/error/error_bus.dart';

class EmergencyProvider extends ChangeNotifier {
  List<EmergencyContactModel> contacts = Seeds.emergencyContacts();
  String incidentNote = '';
  bool incidentSaved = false;
  bool isLoading = false;
  String? errorMessage;

  void setIncidentNote(String value) {
    incidentNote = value;
    notifyListeners();
  }

  Future<void> saveIncident() async {
    errorMessage = null;
    isLoading = true;
    notifyListeners();
    try {
      await Future.delayed(const Duration(seconds: 2));
      incidentSaved = true;
      incidentNote = '';
    } catch (e) {
      errorMessage = 'Failed to save incident log.';
      ErrorBus.instance.push(errorMessage!);
    } finally {
      isLoading = false;
      notifyListeners();
    }
    if (incidentSaved) {
      await Future.delayed(const Duration(seconds: 1));
      incidentSaved = false;
      notifyListeners();
    }
  }

  Future<void> add(EmergencyContactModel contact) async {
    errorMessage = null;
    try {
      contacts = [...contacts, contact];
    } catch (e) {
      errorMessage = 'Failed to add contact.';
      ErrorBus.instance.push(errorMessage!);
    }
    notifyListeners();
  }

  Future<void> remove(String id) async {
    errorMessage = null;
    try {
      contacts = contacts.where((c) => c.id != id).toList();
    } catch (e) {
      errorMessage = 'Failed to remove contact.';
      ErrorBus.instance.push(errorMessage!);
    }
    notifyListeners();
  }
}
