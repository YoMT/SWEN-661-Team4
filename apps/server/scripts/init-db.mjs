// Creates the CareConnect schema in TiDB and seeds the demo account with the
// same data the web app's in-memory mock uses. Idempotent: re-running resets
// the demo user's rows but leaves other users untouched.
// Run: pnpm --filter server init-db
import { q, pool } from '../src/db.mjs'
import { hashPassword, newId } from '../src/auth.mjs'

const DEMO_EMAIL = 'demo@careconnect.com'
const DEMO_PASSWORD = 'demo123'

const now = new Date().toISOString()
const todayAt = (h, m) => {
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}
const hoursAgo = (n) => new Date(Date.now() - n * 3600000).toISOString()
const daysFromNow = (n, h = 10, m = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

// ── Schema ─────────────────────────────────────────────────────────────────
// ISO-8601 strings in VARCHAR keep exact round-trips with the app, which only
// ever does `new Date(value)` on them.
const TABLES = [
  `CREATE TABLE IF NOT EXISTS users (
     id VARCHAR(36) PRIMARY KEY,
     name VARCHAR(120) NOT NULL,
     email VARCHAR(190) NOT NULL UNIQUE,
     password_hash VARCHAR(120) NOT NULL,
     created_at VARCHAR(32) NOT NULL,
     updated_at VARCHAR(32) NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS profiles (
     id VARCHAR(36) PRIMARY KEY,
     user_id VARCHAR(36) NOT NULL UNIQUE,
     name VARCHAR(120) NOT NULL,
     email VARCHAR(190) NOT NULL,
     phone VARCHAR(40),
     caree_name VARCHAR(120),
     blood_type VARCHAR(8),
     allergies TEXT,
     created_at VARCHAR(32) NOT NULL,
     updated_at VARCHAR(32) NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS medications (
     id VARCHAR(36) PRIMARY KEY,
     user_id VARCHAR(36) NOT NULL,
     name VARCHAR(120) NOT NULL,
     dosage VARCHAR(60) NOT NULL,
     instruction VARCHAR(255) NOT NULL,
     scheduled_time VARCHAR(20) NOT NULL,
     time_slot VARCHAR(20) NOT NULL,
     status VARCHAR(20) NOT NULL,
     taken_at VARCHAR(32),
     created_at VARCHAR(32) NOT NULL,
     updated_at VARCHAR(32) NOT NULL,
     INDEX idx_med_user (user_id)
   )`,
  `CREATE TABLE IF NOT EXISTS appointments (
     id VARCHAR(36) PRIMARY KEY,
     user_id VARCHAR(36) NOT NULL,
     doctor_name VARCHAR(120) NOT NULL,
     specialty VARCHAR(120) NOT NULL,
     location VARCHAR(255) NOT NULL,
     date_time VARCHAR(32) NOT NULL,
     type VARCHAR(20) NOT NULL,
     status VARCHAR(20) NOT NULL,
     notes VARCHAR(500),
     created_at VARCHAR(32) NOT NULL,
     updated_at VARCHAR(32) NOT NULL,
     INDEX idx_appt_user (user_id)
   )`,
  `CREATE TABLE IF NOT EXISTS symptom_logs (
     id VARCHAR(36) PRIMARY KEY,
     user_id VARCHAR(36) NOT NULL,
     symptom VARCHAR(40) NOT NULL,
     severity INT NOT NULL,
     note VARCHAR(500),
     created_at VARCHAR(32) NOT NULL,
     updated_at VARCHAR(32) NOT NULL,
     INDEX idx_sym_user (user_id)
   )`,
  `CREATE TABLE IF NOT EXISTS emergency_contacts (
     id VARCHAR(36) PRIMARY KEY,
     user_id VARCHAR(36) NOT NULL,
     name VARCHAR(120) NOT NULL,
     phone VARCHAR(40) NOT NULL,
     relationship VARCHAR(60) NOT NULL,
     created_at VARCHAR(32) NOT NULL,
     updated_at VARCHAR(32) NOT NULL,
     INDEX idx_ec_user (user_id)
   )`,
  `CREATE TABLE IF NOT EXISTS caretaker_notes (
     id VARCHAR(36) PRIMARY KEY,
     user_id VARCHAR(36) NOT NULL,
     author_name VARCHAR(120) NOT NULL,
     content TEXT NOT NULL,
     reply_content TEXT,
     created_at VARCHAR(32) NOT NULL,
     updated_at VARCHAR(32) NOT NULL,
     INDEX idx_cn_user (user_id)
   )`
]

async function main() {
  console.log(`Connecting to ${process.env.TIDB_HOST}/${process.env.TIDB_DATABASE}…`)
  for (const ddl of TABLES) await q(ddl)
  console.log('Tables ready.')

  // ── Demo user (reset on every run) ───────────────────────────────────────
  const existing = await q('SELECT id FROM users WHERE email = ?', [DEMO_EMAIL])
  const userId = existing[0]?.id ?? newId()
  if (existing[0]) {
    for (const t of [
      'profiles',
      'medications',
      'appointments',
      'symptom_logs',
      'emergency_contacts',
      'caretaker_notes'
    ]) {
      await q(`DELETE FROM ${t} WHERE user_id = ?`, [userId])
    }
    await q('DELETE FROM users WHERE id = ?', [userId])
  }

  await q(
    'INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, 'Alex Johnson', DEMO_EMAIL, hashPassword(DEMO_PASSWORD), now, now]
  )

  await q(
    `INSERT INTO profiles (id, user_id, name, email, phone, caree_name, blood_type, allergies, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [newId(), userId, 'Alex Johnson', DEMO_EMAIL, '(555) 012-3456', 'Margaret Johnson', 'A+', JSON.stringify(['Penicillin']), now, now]
  )

  const meds = [
    ['Metoprolol', '50 mg', 'Take with water, before meals', '8:00 AM', 'morning', 'given', todayAt(8, 5)],
    ['Lisinopril', '10 mg', 'Take once daily with food', '12:00 PM', 'afternoon', 'dueNow', null],
    ['Atorvastatin', '20 mg', 'Take at bedtime', '9:00 PM', 'night', 'upcoming', null]
  ]
  for (const [name, dosage, instruction, time, slot, status, takenAt] of meds) {
    await q(
      `INSERT INTO medications (id, user_id, name, dosage, instruction, scheduled_time, time_slot, status, taken_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newId(), userId, name, dosage, instruction, time, slot, status, takenAt, now, now]
    )
  }

  const appts = [
    ['Dr. Sarah Chen', 'Cardiologist', 'City Heart Clinic, 200 Medical Dr', todayAt(15, 0), 'inPerson', 'upcoming', 'Bring recent blood pressure log'],
    ['Dr. Michael Torres', 'General Practice', 'Video call — link sent by email', daysFromNow(7, 14, 0), 'video', 'upcoming', null]
  ]
  for (const [doctor, specialty, location, dateTime, type, status, notes] of appts) {
    await q(
      `INSERT INTO appointments (id, user_id, doctor_name, specialty, location, date_time, type, status, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newId(), userId, doctor, specialty, location, dateTime, type, status, notes, now, now]
    )
  }

  const symptoms = [
    ['dizzy', 3, 'Brief dizzy spell after standing up', hoursAgo(2)],
    ['tired', 4, 'Low energy since morning', hoursAgo(6)]
  ]
  for (const [symptom, severity, note, ts] of symptoms) {
    await q(
      'INSERT INTO symptom_logs (id, user_id, symptom, severity, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newId(), userId, symptom, severity, note, ts, ts]
    )
  }

  const contacts = [
    ['Sarah Johnson', '(555) 234-5678', 'Daughter'],
    ['Dr. Sarah Chen', '(555) 987-6543', 'Primary Doctor']
  ]
  for (const [name, phone, relationship] of contacts) {
    await q(
      'INSERT INTO emergency_contacts (id, user_id, name, phone, relationship, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newId(), userId, name, phone, relationship, now, now]
    )
  }

  const notes = [
    ['Maria (Day Nurse)', 'Margaret had a good morning. Ate breakfast well and took all morning meds. Small tremor in right hand around 10am — noted in chart.', null, hoursAgo(4)],
    ['Maria (Day Nurse)', 'Blood pressure was 138/85 at noon — slightly elevated. Afternoon walk cancelled due to weather. Margaret watching TV, calm and comfortable.', "Thanks Maria. I'll check BP again when I arrive at 5pm.", hoursAgo(24)]
  ]
  for (const [author, content, reply, ts] of notes) {
    await q(
      'INSERT INTO caretaker_notes (id, user_id, author_name, content, reply_content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newId(), userId, author, content, reply, ts, ts]
    )
  }

  const counts = await q(
    `SELECT
       (SELECT COUNT(*) FROM users) AS users,
       (SELECT COUNT(*) FROM medications WHERE user_id = ?) AS meds,
       (SELECT COUNT(*) FROM appointments WHERE user_id = ?) AS appts,
       (SELECT COUNT(*) FROM symptom_logs WHERE user_id = ?) AS symptoms`,
    [userId, userId, userId]
  )
  console.log('Seeded demo account:', DEMO_EMAIL, '/', DEMO_PASSWORD)
  console.log('Row counts:', counts[0])
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
