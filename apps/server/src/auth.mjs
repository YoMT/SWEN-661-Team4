// Dependency-free auth helpers: scrypt password hashing + HMAC-signed tokens.
import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'

const SECRET = process.env.AUTH_SECRET ?? 'dev-secret'
const TOKEN_TTL_MS = 30 * 24 * 3600000 // 30 days

export const newId = () => randomUUID()

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 32).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(':')
  if (!salt || !hash) return false
  const candidate = scryptSync(password, salt, 32)
  const expected = Buffer.from(hash, 'hex')
  return candidate.length === expected.length && timingSafeEqual(candidate, expected)
}

const sign = (payload) => createHmac('sha256', SECRET).update(payload).digest('base64url')

/** Stateless bearer token: base64url(userId.expiry).signature */
export function issueToken(userId) {
  const payload = Buffer.from(`${userId}.${Date.now() + TOKEN_TTL_MS}`).toString('base64url')
  return `${payload}.${sign(payload)}`
}

/** Returns the userId for a valid, unexpired token, else null. */
export function verifyToken(token) {
  const [payload, sig] = String(token).split('.')
  if (!payload || !sig) return null
  const expected = sign(payload)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  const [userId, expiry] = Buffer.from(payload, 'base64url').toString().split('.')
  if (!userId || Number(expiry) < Date.now()) return null
  return userId
}
