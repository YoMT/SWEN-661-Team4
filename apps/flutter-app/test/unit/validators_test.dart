import 'package:flutter_test/flutter_test.dart';
import 'package:care_connect/core/utils/validators.dart';

void main() {
  group('Validators.email', () {
    test('returns null for a valid email', () {
      expect(Validators.email('user@example.com'), isNull);
    });

    test('returns error for null input', () {
      expect(Validators.email(null), isNotNull);
    });

    test('returns error for empty string', () {
      expect(Validators.email(''), isNotNull);
    });

    test('returns error when @ is missing', () {
      expect(Validators.email('userexample.com'), isNotNull);
    });

    test('returns error for missing domain', () {
      expect(Validators.email('user@'), isNotNull);
    });
  });

  group('Validators.password', () {
    test('returns null for a valid password of 8 characters', () {
      expect(Validators.password('secure12'), isNull);
    });

    test('returns null for password longer than 8 characters', () {
      expect(Validators.password('supersecurepassword'), isNull);
    });

    test('returns error for null input', () {
      expect(Validators.password(null), isNotNull);
    });

    test('returns error for empty string', () {
      expect(Validators.password(''), isNotNull);
    });

    test('returns error for 7-character password (below minimum)', () {
      expect(Validators.password('short12'), isNotNull);
    });
  });

  group('Validators.required', () {
    test('returns null for a non-empty value', () {
      expect(Validators.required('hello'), isNull);
    });

    test('returns error for null input', () {
      expect(Validators.required(null), isNotNull);
    });

    test('returns error for empty string', () {
      expect(Validators.required(''), isNotNull);
    });

    test('returns error for whitespace-only string', () {
      expect(Validators.required('   '), isNotNull);
    });

    test('includes custom fieldName in the error message', () {
      final error = Validators.required('', fieldName: 'Username');
      expect(error, contains('Username'));
    });
  });

  group('Validators.phone', () {
    test('returns null for a valid phone number with country code', () {
      expect(Validators.phone('+1 404 555 0100'), isNull); // 14 chars after +, within regex {7,15}
    });

    test('returns null for a 10-digit phone number', () {
      expect(Validators.phone('4045550100'), isNull);
    });

    test('returns error for null input', () {
      expect(Validators.phone(null), isNotNull);
    });

    test('returns error for empty string', () {
      expect(Validators.phone(''), isNotNull);
    });

    test('returns error for a value with letters', () {
      expect(Validators.phone('call-me-now'), isNotNull);
    });
  });
}
