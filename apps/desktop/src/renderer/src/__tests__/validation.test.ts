import { validate } from '../services/validation'

describe('validation utilities', () => {
  test('validates email', () => {
    expect(validate.email('test@example.com')).toBeNull()
    expect(validate.email('bad-email')).toBe('Please enter a valid email address.')
  })

  test('validates required field', () => {
    expect(validate.required('hello')).toBeNull()
    expect(validate.required('')).toBe('This field is required.')
    expect(validate.required('   ', 'Name')).toBe('Name is required.')
  })

  test('validates password length', () => {
    expect(validate.password('password123')).toBeNull()
    expect(validate.password('123')).toBe('Password must be at least 6 characters.')
  })

  test('validates login form', () => {
    expect(validate.loginForm('test@example.com', 'password123')).toBeNull()
    expect(validate.loginForm('bad-email', 'password123')).toBe('Please enter a valid email address.')
  })
})