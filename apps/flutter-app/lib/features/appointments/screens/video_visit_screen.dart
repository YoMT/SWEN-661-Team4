import 'package:flutter/material.dart';
import '../widgets/join_video_button.dart';

class VideoVisitScreen extends StatelessWidget {
  const VideoVisitScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Video Visit')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.videocam_outlined, size: 80),
            const SizedBox(height: 24),
            Text('Ready to join?', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 24),
            const JoinVideoButton(),
          ],
        ),
      ),
    );
  }
}
