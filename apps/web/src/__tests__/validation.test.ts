import { validate } from '@renderer/services/validation'

describe('validate', () => {
  test('email accepts anything containing @, rejects otherwise', () => {
    expect(validate.email('a@b.com')).toBeNull()
    expect(validate.email('nope')).toBe('Please enter a valid email address.')
  })

  test('password requires at least 6 characters', () => {
    expect(validate.password('123456')).toBeNull()
    expect(validate.password('12345')).toBe('Password must be at least 6 characters.')
  })

  test('required trims whitespace and uses the field label', () => {
    expect(validate.required('x')).toBeNull()
    expect(validate.required('   ')).toBe('This field is required.')
    expect(validate.required('', 'Name')).toBe('Name is required.')
  })

  test('loginForm returns the first failing rule, else null', () => {
    expect(validate.loginForm('a@b.com', '123456')).toBeNull()
    expect(validate.loginForm('bad', '123456')).toBe('Please enter a valid email address.')
    expect(validate.loginForm('a@b.com', '123')).toBe('Password must be at least 6 characters.')
  })

  test('signupForm validates name, then email, then password', () => {
    expect(validate.signupForm('Alex', 'a@b.com', '123456')).toBeNull()
    expect(validate.signupForm('', 'a@b.com', '123456')).toBe('Name is required.')
    expect(validate.signupForm('Alex', 'bad', '123456')).toBe('Please enter a valid email address.')
    expect(validate.signupForm('Alex', 'a@b.com', '123')).toBe(
      'Password must be at least 6 characters.'
    )
  })
})
