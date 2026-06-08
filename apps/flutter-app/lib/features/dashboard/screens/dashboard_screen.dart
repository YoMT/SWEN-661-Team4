import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/dashboard_provider.dart';
import '../widgets/summary_card.dart';
import '../widgets/upcoming_appointment_card.dart';
import '../widgets/medication_reminder_card.dart';
import '../widgets/quick_actions_bar.dart';
import '../../../core/theme/app_colors.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  String _greeting() {
    final h = DateTime.now().hour;
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  @override
  Widget build(BuildContext context) {
    final dashboard = context.watch<DashboardProvider>();
    return Scaffold(
      backgroundColor: AppColors.bg,
      body: RefreshIndicator(
        onRefresh: () => context.read<DashboardProvider>().refresh(),
        color: AppColors.primary,
        child: CustomScrollView(
          slivers: [
            // App bar with greeting
            SliverAppBar(
              backgroundColor: AppColors.primary,
              pinned: false,
              floating: true,
              expandedHeight: 80,
              flexibleSpace: FlexibleSpaceBar(
                background: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                    child: Row(
                      children: [
                        const CircleAvatar(
                          radius: 20,
                          backgroundColor: Colors.white24,
                          child: Icon(Icons.person_outline, color: Colors.white, size: 22),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text('${_greeting()} · caring for',
                                  style: const TextStyle(fontSize: 13, color: Colors.white70)),
                              Text(
                                dashboard.careeName,
                                style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white),
                              ),
                            ],
                          ),
                        ),
                        Semantics(
                          label: 'Notifications',
                          child: IconButton(
                            icon: const Icon(Icons.notifications_none, color: Colors.white),
                            onPressed: () {},
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  // 3 summary stat tiles
                  const SummaryCard(),
                  const SizedBox(height: 20),

                  // Up next medication card
                  const MedicationReminderCard(),
                  const SizedBox(height: 20),

                  // Emergency button + manage care links
                  const UpcomingAppointmentCard(),
                  const SizedBox(height: 20),

                  // Quick links row
                  const QuickActionsBar(),
                  const SizedBox(height: 24),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
