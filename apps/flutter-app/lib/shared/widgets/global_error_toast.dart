import 'package:flutter/material.dart';
import '../../core/error/error_bus.dart';
import '../../core/theme/app_colors.dart';

/// A dismissible red toast pinned to the top of the screen that surfaces the
/// first queued [ErrorBus] message. Renders nothing when the queue is empty.
///
/// Designed to be placed in a [Stack] above the app's [Navigator] (see
/// `CareConnectApp.build`) so it floats over every route, matching the mobile
/// app's `GlobalErrorToast`.
class GlobalErrorToast extends StatelessWidget {
  const GlobalErrorToast({super.key});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: ErrorBus.instance,
      builder: (context, _) {
        final message = ErrorBus.instance.current;
        if (message == null) return const SizedBox.shrink();
        final topInset = MediaQuery.of(context).padding.top;
        return Positioned(
          top: topInset + 8,
          left: 16,
          right: 16,
          child: Material(
            color: Colors.transparent,
            child: Semantics(
              liveRegion: true,
              container: true,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: AppColors.error,
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: const [
                    BoxShadow(
                        color: Colors.black26,
                        blurRadius: 4,
                        offset: Offset(0, 2)),
                  ],
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        message,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w500),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Semantics(
                      label: 'Dismiss error',
                      button: true,
                      child: InkWell(
                        onTap: ErrorBus.instance.dismiss,
                        child: const Padding(
                          padding: EdgeInsets.all(4),
                          child:
                              Icon(Icons.close, color: Colors.white, size: 20),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
