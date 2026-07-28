// CareConnect API server: the REST contract mirrors apps/web's mock-api so the
// web app switches backends purely via VITE_API_URL (see apps/web/src/services/api.ts).
import express from 'express'
import cors from 'cors'
import { q } from './db.mjs'
import { hashPassword, issueToken, newId, verifyPassword, verifyToken } from './auth.mjs'

const app = express()
app.use(express.json())
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN ?? '').split(',').filter(Boolean),
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

const iso = () => new Date().toISOString()

// Unauthenticated liveness probe for Render's health check (and uptime pings).
app.get('/health', (_req, res) => res.json({ status: 'ok', time: iso() }))

// ── Row → API shape mappers (DB is snake_case, the app camelCase) ──────────
const userOut = (r) => ({
  id: r.id,
  name: r.name,
  email: r.email,
  createdAt: r.created_at,
  updatedAt: r.updated_at
})
const profileOut = (r) => ({
  id: r.id,
  name: r.name,
  email: r.email,
  phone: r.phone ?? undefined,
  careeName: r.caree_name ?? undefined,
  bloodType: r.blood_type ?? undefined,
  allergies: r.allergies ? JSON.parse(r.allergies) : [],
  createdAt: r.created_at,
  updatedAt: r.updated_at
})
const medOut = (r) => ({
  id: r.id,
  name: r.name,
  dosage: r.dosage,
  instruction: r.instruction,
  scheduledTime: r.scheduled_time,
  timeSlot: r.time_slot,
  status: r.status,
  takenAt: r.taken_at ?? undefined,
  createdAt: r.created_at,
  updatedAt: r.updated_at
})
const apptOut = (r) => ({
  id: r.id,
  doctorName: r.doctor_name,
  specialty: r.specialty,
  location: r.location,
  dateTime: r.date_time,
  type: r.type,
  status: r.status,
  notes: r.notes ?? undefined,
  createdAt: r.created_at,
  updatedAt: r.updated_at
})
const symptomOut = (r) => ({
  id: r.id,
  symptom: r.symptom,
  severity: r.severity,
  note: r.note ?? undefined,
  createdAt: r.created_at,
  updatedAt: r.updated_at
})
const contactOut = (r) => ({
  id: r.id,
  name: r.name,
  phone: r.phone,
  relationship: r.relationship,
  createdAt: r.created_at,
  updatedAt: r.updated_at
})
const noteOut = (r) => ({
  id: r.id,
  authorName: r.author_name,
  content: r.content,
  replyContent: r.reply_content ?? undefined,
  createdAt: r.created_at,
  updatedAt: r.updated_at
})

// ── Auth ───────────────────────────────────────────────────────────────────
app.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {}
    const rows = await q('SELECT * FROM users WHERE email = ?', [email ?? ''])
    const user = rows[0]
    if (!user || !verifyPassword(password ?? '', user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }
    res.json({ token: issueToken(user.id), user: userOut(user) })
  } catch (err) {
    next(err)
  }
})

app.post('/auth/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body ?? {}
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
    const existing = await q('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length > 0) return res.status(409).json({ error: 'Email already registered' })
    const id = newId()
    const ts = iso()
    await q(
      'INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email, hashPassword(password), ts, ts]
    )
    // Every user gets a profile row seeded from their signup details.
    await q(
      'INSERT INTO profiles (id, user_id, name, email, allergies, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newId(), id, name, email, '[]', ts, ts]
    )
    res.json({ token: issueToken(id), user: { id, name, email, createdAt: ts, updatedAt: ts } })
  } catch (err) {
    next(err)
  }
})

// Everything below requires a Bearer token.
app.use((req, res, next) => {
  const token = (req.headers.authorization ?? '').replace(/^Bearer\s+/i, '')
  const userId = verifyToken(token)
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })
  req.userId = userId
  next()
})

app.get('/auth/me', async (req, res, next) => {
  try {
    const rows = await q('SELECT * FROM users WHERE id = ?', [req.userId])
    if (!rows[0]) return res.status(401).json({ error: 'Unauthorized' })
    res.json(userOut(rows[0]))
  } catch (err) {
    next(err)
  }
})

// ── Profile ────────────────────────────────────────────────────────────────
app.get('/profile', async (req, res, next) => {
  try {
    const rows = await q('SELECT * FROM profiles WHERE user_id = ?', [req.userId])
    if (!rows[0]) return res.status(404).json({ error: 'No profile' })
    res.json(profileOut(rows[0]))
  } catch (err) {
    next(err)
  }
})

app.patch('/profile', async (req, res, next) => {
  try {
    const { name, email, phone, careeName, bloodType, allergies } = req.body ?? {}
    await q(
      `UPDATE profiles SET
         name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone),
         caree_name = COALESCE(?, caree_name), blood_type = COALESCE(?, blood_type),
         allergies = COALESCE(?, allergies), updated_at = ?
       WHERE user_id = ?`,
      [
        name ?? null,
        email ?? null,
        phone ?? null,
        careeName ?? null,
        bloodType ?? null,
        allergies ? JSON.stringify(allergies) : null,
        iso(),
        req.userId
      ]
    )
    const rows = await q('SELECT * FROM profiles WHERE user_id = ?', [req.userId])
    res.json(profileOut(rows[0]))
  } catch (err) {
    next(err)
  }
})

// ── Medications ────────────────────────────────────────────────────────────
app.get('/medications', async (req, res, next) => {
  try {
    const rows = await q(
      'SELECT * FROM medications WHERE user_id = ? ORDER BY created_at',
      [req.userId]
    )
    res.json(rows.map(medOut))
  } catch (err) {
    next(err)
  }
})

app.post('/medications', async (req, res, next) => {
  try {
    const { name, dosage, instruction, scheduledTime, timeSlot, status } = req.body ?? {}
    const id = newId()
    const ts = iso()
    await q(
      `INSERT INTO medications (id, user_id, name, dosage, instruction, scheduled_time, time_slot, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, req.userId, name, dosage, instruction, scheduledTime, timeSlot, status ?? 'upcoming', ts, ts]
    )
    const rows = await q('SELECT * FROM medications WHERE id = ?', [id])
    res.json(medOut(rows[0]))
  } catch (err) {
    next(err)
  }
})

app.patch('/medications/:id/taken', async (req, res, next) => {
  try {
    const ts = iso()
    await q(
      "UPDATE medications SET status = 'given', taken_at = ?, updated_at = ? WHERE id = ? AND user_id = ?",
      [ts, ts, req.params.id, req.userId]
    )
    res.json({})
  } catch (err) {
    next(err)
  }
})

// ── Appointments ───────────────────────────────────────────────────────────
app.get('/appointments', async (req, res, next) => {
  try {
    const rows = await q(
      'SELECT * FROM appointments WHERE user_id = ? ORDER BY date_time',
      [req.userId]
    )
    res.json(rows.map(apptOut))
  } catch (err) {
    next(err)
  }
})

app.post('/appointments', async (req, res, next) => {
  try {
    const { doctorName, specialty, location, dateTime, type, status, notes } = req.body ?? {}
    const id = newId()
    const ts = iso()
    await q(
      `INSERT INTO appointments (id, user_id, doctor_name, specialty, location, date_time, type, status, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, req.userId, doctorName, specialty, location, dateTime, type, status ?? 'upcoming', notes ?? null, ts, ts]
    )
    const rows = await q('SELECT * FROM appointments WHERE id = ?', [id])
    res.json(apptOut(rows[0]))
  } catch (err) {
    next(err)
  }
})

app.patch('/appointments/:id', async (req, res, next) => {
  try {
    const { doctorName, specialty, location, dateTime, type, status, notes } = req.body ?? {}
    await q(
      `UPDATE appointments SET
         doctor_name = COALESCE(?, doctor_name), specialty = COALESCE(?, specialty),
         location = COALESCE(?, location), date_time = COALESCE(?, date_time),
         type = COALESCE(?, type), status = COALESCE(?, status), notes = COALESCE(?, notes),
         updated_at = ?
       WHERE id = ? AND user_id = ?`,
      [doctorName ?? null, specialty ?? null, location ?? null, dateTime ?? null, type ?? null, status ?? null, notes ?? null, iso(), req.params.id, req.userId]
    )
    const rows = await q('SELECT * FROM appointments WHERE id = ?', [req.params.id])
    res.json(rows[0] ? apptOut(rows[0]) : {})
  } catch (err) {
    next(err)
  }
})

// ── Symptoms ───────────────────────────────────────────────────────────────
app.get('/symptoms', async (req, res, next) => {
  try {
    const rows = await q(
      'SELECT * FROM symptom_logs WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    )
    res.json(rows.map(symptomOut))
  } catch (err) {
    next(err)
  }
})

app.post('/symptoms', async (req, res, next) => {
  try {
    const { symptom, severity, note } = req.body ?? {}
    const id = newId()
    const ts = iso()
    await q(
      'INSERT INTO symptom_logs (id, user_id, symptom, severity, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, req.userId, symptom, severity, note ?? null, ts, ts]
    )
    const rows = await q('SELECT * FROM symptom_logs WHERE id = ?', [id])
    res.json(symptomOut(rows[0]))
  } catch (err) {
    next(err)
  }
})

// ── Emergency contacts / incidents ─────────────────────────────────────────
app.get('/emergency-contacts', async (req, res, next) => {
  try {
    const rows = await q(
      'SELECT * FROM emergency_contacts WHERE user_id = ? ORDER BY created_at',
      [req.userId]
    )
    res.json(rows.map(contactOut))
  } catch (err) {
    next(err)
  }
})

app.post('/incidents', (_req, res) => res.json({}))

// ── Caretaker notes ────────────────────────────────────────────────────────
app.get('/caretaker-notes', async (req, res, next) => {
  try {
    const rows = await q(
      'SELECT * FROM caretaker_notes WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    )
    res.json(rows.map(noteOut))
  } catch (err) {
    next(err)
  }
})

app.patch('/caretaker-notes/:id/reply', async (req, res, next) => {
  try {
    const { reply } = req.body ?? {}
    await q(
      'UPDATE caretaker_notes SET reply_content = ?, updated_at = ? WHERE id = ? AND user_id = ?',
      [reply ?? '', iso(), req.params.id, req.userId]
    )
    const rows = await q('SELECT * FROM caretaker_notes WHERE id = ?', [req.params.id])
    res.json(rows[0] ? noteOut(rows[0]) : {})
  } catch (err) {
    next(err)
  }
})

// ── AI assistant (canned replies, grounded in the user's live data) ────────
app.post('/ai/chat', async (req, res, next) => {
  try {
    const m = String(req.body?.message ?? '').toLowerCase()
    let reply
    if (m.includes('medication') || m.includes('med') || m.includes('pill')) {
      const meds = await q('SELECT * FROM medications WHERE user_id = ?', [req.userId])
      const due = meds.filter((x) => x.status === 'dueNow').map((x) => `${x.name} (${x.dosage})`)
      reply =
        meds.length === 0
          ? 'There are no medications on file yet.'
          : `There are ${meds.length} medications today.` +
            (due.length ? ` Due now: ${due.join(', ')}.` : ' Nothing is due right now.')
    } else if (m.includes('appointment') || m.includes('doctor') || m.includes('visit')) {
      const appts = await q(
        "SELECT * FROM appointments WHERE user_id = ? AND status = 'upcoming' ORDER BY date_time LIMIT 1",
        [req.userId]
      )
      reply = appts[0]
        ? `The next appointment is with ${appts[0].doctor_name} (${appts[0].specialty}) at ${appts[0].location}.`
        : 'There are no upcoming appointments on the schedule.'
    } else if (m.includes('symptom') || m.includes('feeling') || m.includes('pain')) {
      const logs = await q(
        'SELECT * FROM symptom_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 2',
        [req.userId]
      )
      reply = logs.length
        ? `Recent symptoms: ${logs.map((l) => `${l.symptom} (severity ${l.severity}/5)`).join(', ')}.`
        : 'No symptoms have been logged recently.'
    } else if (m.includes('emergency') || m.includes('contact') || m.includes('call')) {
      const contacts = await q('SELECT * FROM emergency_contacts WHERE user_id = ?', [req.userId])
      reply = contacts.length
        ? `Emergency contacts on file: ${contacts.map((c) => `${c.name} (${c.relationship}) at ${c.phone}`).join(', ')}.`
        : 'No emergency contacts are on file yet.'
    } else {
      reply =
        "I'm here to help with care. You can ask me about today's medications, upcoming appointments, recent symptoms, or emergency contacts."
    }
    res.json({ reply })
  } catch (err) {
    next(err)
  }
})

// ── Errors ─────────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const port = Number(process.env.PORT ?? 8787)
app.listen(port, () => console.log(`CareConnect API listening on http://localhost:${port}`))
