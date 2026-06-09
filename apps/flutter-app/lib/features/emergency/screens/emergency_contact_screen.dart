import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/emergency_provider.dart';
import '../widgets/contact_card.dart';
import '../../../core/theme/app_colors.dart';
import '../../ai_assistant/widgets/assistant_toggle_button.dart';
import '../../ai_assistant/widgets/assistant_panel.dart';

class EmergencyContactScreen extends StatefulWidget {
  const EmergencyContactScreen({super.key});

  @override
  State<EmergencyContactScreen> createState() => _EmergencyContactScreenState();
}

class _EmergencyContactScreenState extends State<EmergencyContactScreen> {
  final _noteController = TextEditingController();
  bool _calling = false;
  int _countdown = 0;

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  void _startCall911() async {
    setState(() {
      _calling = true;
      _countdown = 3;
    });
    for (int i = 3; i > 0; i--) {
      await Future.delayed(const Duration(seconds: 1));
      if (!mounted || !_calling) return;
      setState(() => _countdown = i - 1);
    }
    if (!mounted || !_calling) return;
    setState(() => _calling = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Calling 911…'), backgroundColor: AppColors.error),
      );
    }
  }

  void _cancelCall() => setState(() => _calling = false);

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<EmergencyProvider>();

    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(
        title: const Text('Emergency'),
        actions: [
          Semantics(
            label: 'Add emergency contact',
            child: IconButton(
              icon: const Icon(Icons.add),
              onPressed: () => _showAddContact(context),
              tooltip: 'Add contact',
            ),
          ),
        ],
      ),
      floatingActionButton: const AssistantToggleButton(),
      body: Stack(
        children: [
          ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // SOS Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.error, width: 2),
                ),
                child: Column(
                  children: [
                    const Text('EMERGENCY SOS',
                        style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textMuted,
                            letterSpacing: 1)),
                    const SizedBox(height: 6),
                    const Text('Hold button for 2 seconds to call 911',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                    const SizedBox(height: 16),
                    Semantics(
                      label: 'Call 911 — hold for 2 seconds to confirm',
                      button: true,
                      child: SizedBox(
                        width: double.infinity,
                        height: 64,
                        child: _calling
                            ? ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.error,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12)),
                                ),
                                onPressed: _cancelCall,
                                icon: const Icon(Icons.close),
                                label: Text(
                                  'Calling in $_countdown… (tap to cancel)',
                                  style: const TextStyle(
                                      fontSize: 15, fontWeight: FontWeight.w600),
                                ),
                              )
                            : GestureDetector(
                                onLongPress: _startCall911,
                                child: Container(
                                  decoration: BoxDecoration(
                                    color: AppColors.error,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(Icons.phone, color: Colors.white, size: 24),
                                      SizedBox(width: 12),
                                      Text('Call 911',
                                          style: TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.w600,
                                              color: Colors.white)),
                                    ],
                                  ),
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text('Press and hold to confirm — prevents accidental calls',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Emergency contacts list
              const Text('Emergency Contacts',
                  style: TextStyle(
                      fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.text)),
              const SizedBox(height: 12),
              Container(
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.borderSubtle, width: 1.5),
                ),
                child: provider.contacts.isEmpty
                    ? const Padding(
                        padding: EdgeInsets.all(24),
                        child: Center(
                            child: Text('No contacts added',
                                style: TextStyle(color: AppColors.textMuted))),
                      )
                    : Column(
                        children: [
                          for (int i = 0; i < provider.contacts.length; i++) ...[
                            ContactCard(contact: provider.contacts[i]),
                            if (i < provider.contacts.length - 1)
                              const Divider(height: 1, color: AppColors.borderSubtle),
                          ],
                        ],
                      ),
              ),

              const SizedBox(height: 20),

              // Quick incident log
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderSubtle, width: 1.5),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Quick Incident Log',
                        style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: AppColors.text)),
                    const SizedBox(height: 4),
                    const Text('Record what happened — auto-timestamped',
                        style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                    const SizedBox(height: 14),
                    const Text('Notes',
                        style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.text)),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _noteController,
                      onChanged: (v) =>
                          context.read<EmergencyProvider>().setIncidentNote(v),
                      style: const TextStyle(fontSize: 16, color: AppColors.text),
                      decoration: const InputDecoration(
                        hintText: 'Describe the incident…',
                      ),
                    ),
                    const SizedBox(height: 14),
                    SizedBox(
                      width: double.infinity,
                      height: 64,
                      child: FilledButton(
                        onPressed: provider.incidentSaved
                            ? null
                            : () async {
                                await context
                                    .read<EmergencyProvider>()
                                    .saveIncident();
                                _noteController.clear();
                              },
                        child: provider.incidentSaved
                            ? const Text('Saved ✓')
                            : const Text('Save Incident Log',
                                style: TextStyle(
                                    fontSize: 16, fontWeight: FontWeight.w600)),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),
            ],
          ),
          const AssistantPanel(),
        ],
      ),
    );
  }

  void _showAddContact(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Add contact — coming soon')),
    );
  }
}