import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:care_connect/features/emergency/screens/emergency_contact_screen.dart';
import 'package:care_connect/features/emergency/providers/emergency_provider.dart';
import 'package:care_connect/features/accessibility/providers/accessibility_provider.dart';
import 'package:care_connect/features/ai_assistant/providers/ai_assistant_provider.dart';

Widget _subject(EmergencyProvider provider) => MultiProvider(
      providers: [
        ChangeNotifierProvider<EmergencyProvider>.value(value: provider),
        ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
        ChangeNotifierProvider(create: (_) => AiAssistantProvider()),
      ],
      child: const MaterialApp(home: EmergencyContactScreen()),
    );

void main() {
  testWidgets('add-contact dialog appends a new contact to the list',
      (tester) async {
    final provider = EmergencyProvider();
    final initialCount = provider.contacts.length;

    await tester.pumpWidget(_subject(provider));
    await tester.pumpAndSettle();

    // Open the dialog from the app-bar action.
    await tester.tap(find.byTooltip('Add contact'));
    await tester.pumpAndSettle();
    expect(find.text('Add Emergency Contact'), findsOneWidget);

    // Fill the form (name, phone, relationship) and submit.
    final fields = find.byType(TextFormField);
    await tester.enterText(fields.at(0), 'Jordan Rivera');
    await tester.enterText(fields.at(1), '5551234567');
    await tester.enterText(fields.at(2), 'Son');
    await tester.tap(find.widgetWithText(FilledButton, 'Add'));
    await tester.pumpAndSettle();

    expect(provider.contacts.length, initialCount + 1);
    expect(provider.contacts.any((c) => c.name == 'Jordan Rivera'), isTrue);
  });

  testWidgets('add-contact dialog blocks submit when required fields are empty',
      (tester) async {
    final provider = EmergencyProvider();
    final initialCount = provider.contacts.length;

    await tester.pumpWidget(_subject(provider));
    await tester.pumpAndSettle();

    await tester.tap(find.byTooltip('Add contact'));
    await tester.pumpAndSettle();

    // Submit with empty fields — validation should keep the dialog open.
    await tester.tap(find.widgetWithText(FilledButton, 'Add'));
    await tester.pumpAndSettle();

    expect(find.text('Add Emergency Contact'), findsOneWidget);
    expect(provider.contacts.length, initialCount);
  });
}
