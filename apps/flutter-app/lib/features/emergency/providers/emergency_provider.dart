import 'package:flutter/foundation.dart';
import '../models/emergency_contact_model.dart';

class EmergencyProvider extends ChangeNotifier {
  List<EmergencyContactModel> contacts = _sampleContacts();
  String incidentNote = '';
  bool incidentSaved = false;

  void setIncidentNote(String value) {
    incidentNote = value;
    notifyListeners();
  }

  Future<void> saveIncident() async {
    // In production: persist to backend with timestamp
    incidentSaved = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 2));
    incidentSaved = false;
    incidentNote = '';
    notifyListeners();
  }

  Future<void> add(EmergencyContactModel contact) async {
    contacts = [...contacts, contact];
    notifyListeners();
  }

  Future<void> remove(String id) async {
    contacts = contacts.where((c) => c.id != id).toList();
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
