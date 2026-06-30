import React, { useState } from 'react'
import { useSymptomContext } from '@renderer/state/symptom-context'
import { useUI } from '@renderer/state/ui-context'
import type { SymptomType } from '@renderer/types'

const SYMPTOMS: { id: SymptomType; label: string; icon: string }[] = [
  { id: 'pain', label: 'Pain', icon: '🤕' },
  { id: 'dizzy', label: 'Dizzy', icon: '💫' },
  { id: 'breath', label: 'Short of breath', icon: '😮‍💨' },
  { id: 'tired', label: 'Tired', icon: '😴' },
  { id: 'nausea', label: 'Nausea', icon: '🤢' },
  { id: 'other', label: 'Other', icon: '📋' }
]

const LABEL: Record<SymptomType, string> = {
  pain: 'Pain',
  dizzy: 'Dizzy',
  breath: 'Short of breath',
  tired: 'Tired',
  nausea: 'Nausea',
  other: 'Other'
}

function timeAgo(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  return new Date(iso).toLocaleDateString()
}

export function SymptomsScreen(): React.JSX.Element {
  const { logs, isLoading, error, addLog } = useSymptomContext()
  const { announce } = useUI()
  const [symptom, setSymptom] = useState<SymptomType>('dizzy')
  const [severity, setSeverity] = useState(3)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setSaving(true)
    try {
      await addLog({ symptom, severity, note: note.trim() || undefined })
      setNote('')
      announce('Symptom logged')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="content-inner">
      <h1 className="page-title">Symptoms</h1>
      <p className="page-sub">What&apos;s bothering Margaret today?</p>

      <form className="card" id="log-symptom-form" onSubmit={handleSave}>
        <p className="card-eyebrow">Log a symptom</p>

        <div
          className="quick-grid"
          style={{ marginTop: 'var(--space-2)' }}
          role="group"
          aria-label="Symptom type"
        >
          {SYMPTOMS.map((s, i) => (
            <button
              key={s.id}
              id={i === 0 ? 'log-symptom-first' : undefined}
              type="button"
              className="quick-btn"
              aria-pressed={symptom === s.id}
              onClick={() => setSymptom(s.id)}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <p className="field-label" style={{ marginTop: 'var(--space-4)' }} id="severity-label">
          Severity: {severity}/5
        </p>
        <div
          style={{ display: 'flex', gap: 'var(--space-2)' }}
          role="group"
          aria-labelledby="severity-label"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className="quick-btn"
              aria-label={`Severity ${n}`}
              aria-pressed={severity === n}
              style={{
                flex: 1,
                background: severity >= n ? 'var(--color-warning)' : 'var(--color-surface)',
                color: severity >= n ? 'var(--color-on-warning)' : 'var(--color-text)'
              }}
              onClick={() => setSeverity(n)}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="field" style={{ marginTop: 'var(--space-4)' }}>
          <label className="field-label" htmlFor="note">
            Note (optional)
          </label>
          <input
            id="note"
            className="field-input"
            placeholder="Add any detail…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary critical" disabled={saving}>
          {saving ? 'Saving…' : 'Save to log'}
        </button>
      </form>

      <p className="section-label">Recent logs</p>
      {isLoading && <p className="muted">Loading logs…</p>}
      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}
      {!isLoading && logs.length === 0 && <p className="muted">No symptoms logged yet.</p>}
      {logs.map((log) => (
        <div className="card" key={log.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
            <div>
              <p className="card-main">{LABEL[log.symptom]}</p>
              {log.note && <p className="card-sub">{log.note}</p>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="severity-dots" aria-label={`Severity ${log.severity} of 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className={`severity-dot${n <= log.severity ? ' on' : ''}`} />
                ))}
              </div>
              <p className="card-sub" style={{ marginTop: 'var(--space-1)' }}>
                {timeAgo(log.createdAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
