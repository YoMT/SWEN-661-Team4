import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/core/error/error_bus.dart';

void main() {
  setUp(() => ErrorBus.instance.clear());

  test('starts empty', () {
    expect(ErrorBus.instance.current, isNull);
    expect(ErrorBus.instance.errors, isEmpty);
  });

  test('push appends a message and notifies listeners', () {
    var notified = 0;
    void listener() => notified++;
    ErrorBus.instance.addListener(listener);

    ErrorBus.instance.push('Something failed');

    expect(ErrorBus.instance.current, 'Something failed');
    expect(notified, 1);
    ErrorBus.instance.removeListener(listener);
  });

  test('dismiss removes messages first-in-first-out', () {
    ErrorBus.instance.push('first');
    ErrorBus.instance.push('second');

    expect(ErrorBus.instance.current, 'first');
    ErrorBus.instance.dismiss();
    expect(ErrorBus.instance.current, 'second');
    ErrorBus.instance.dismiss();
    expect(ErrorBus.instance.current, isNull);
  });

  test('dismiss on an empty queue is a no-op', () {
    ErrorBus.instance.dismiss();
    expect(ErrorBus.instance.current, isNull);
  });

  test('clear empties the queue', () {
    ErrorBus.instance.push('a');
    ErrorBus.instance.push('b');
    ErrorBus.instance.clear();
    expect(ErrorBus.instance.errors, isEmpty);
  });
}
