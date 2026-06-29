// Form validation helpers, ported from apps/mobile.
export const validate = {
  email: (v: string): string | null =>
    v.includes('@') ? null : 'Please enter a valid email address.',

  password: (v: string): string | null =>
    v.length >= 6 ? null : 'Password must be at least 6 characters.',

  required: (v: string, field = 'This field'): string | null =>
    v.trim() ? null : `${field} is required.`,

  loginForm: (email: string, password: string): string | null =>
    validate.email(email) ?? validate.password(password),

  signupForm: (name: string, email: string, password: string): string | null =>
    validate.required(name, 'Name') ?? validate.email(email) ?? validate.password(password)
}
