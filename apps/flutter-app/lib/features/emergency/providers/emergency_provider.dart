import 'package:flutter/foundation.dart';
import '../models/emergency_contact_model.dart';

class EmergencyProvider extends ChangeNotifier {
  List<EmergencyContactModel> contacts = _sampleContacts();
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
    }
    notifyListeners();
  }

  Future<void> remove(String id) async {
    errorMessage = null;
    try {
      contacts = contacts.where((c) => c.id != id).toList();
    } catch (e) {
      errorMessage = 'Failed to remove contact.';
    }
    notifyListeners();
  }
}

List<EmergencyContactModel> _sampleContacts() {
  final now = DateTime.now();
  return [
    EmergencyContactModel(
      id: '1',
      createdAt: now,
      updatedAt: now,
      name: 'Sarah Carter',
      phone: '(678) 555-0192',
      relationship: 'Daughter',
    ),
    EmergencyContactModel(
      id: '2',
      createdAt: now,
      updatedAt: now,
      name: 'Dr. Lin',
      phone: '(404) 555-0138',
      relationship: 'Neurologist',
    ),
    EmergencyContactModel(
      id: '3',
      createdAt: now,
      updatedAt: now,
      name: 'Marcus Washington',
      phone: '(770) 555-0247',
      relationship: 'Son',
    ),
  ];
}
