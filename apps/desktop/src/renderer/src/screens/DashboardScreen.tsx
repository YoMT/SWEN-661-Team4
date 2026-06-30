import React from 'react'
import { useDashboard } from '@renderer/state/use-dashboard'
import { useUI } from '@renderer/state/ui-context'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function StatTile({
  label,
  value,
  color
}: {
  label: string
  value: string
  color: string
}): React.JSX.Element {
  return (
    <div className="stat-tile" style={{ borderLeftColor: color }}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export function DashboardScreen(): React.JSX.Element {
  const { setView } = useUI()
  const {
    careeName,
    givenDoses,
    totalDoses,
    todayAppointmentsCount,
    logsCount,
    nextMed,
    nextAppt
  } = useDashboard()

  return (
    <div className="content-inner">
      <p className="page-sub" style={{ margin: 0 }}>
        {greeting()} · caring for
      </p>
      <h1 className="page-title">{careeName}</h1>
      <div style={{ height: 'var(--space-6)' }} />

      <div className="stats-grid">
        <StatTile
          label="Doses today"
          value={`${givenDoses}/${totalDoses}`}
          color="var(--color-success)"
        />
        <StatTile
          label="Appointments"
          value={String(todayAppointmentsCount)}
          color="var(--color-primary)"
        />
        <StatTile label="Symptom logs" value={String(logsCount)} color="var(--color-warning)" />
      </div>

      {nextMed && (
        <div className="card">
          <p className="card-eyebrow">💊 Next medication</p>
          <p className="card-main">
            {nextMed.name} · {nextMed.dosage}
          </p>
          <p className="card-sub">
            {nextMed.scheduledTime} · {nextMed.instruction}
          </p>
          <button type="button" className="card-link" onClick={() => setView('medications')}>
            View all medications →
          </button>
        </div>
      )}

      {nextAppt && (
        <div className="card">
          <p className="card-eyebrow">📅 Today&apos;s appointment</p>
          <p className="card-main">{nextAppt.doctorName}</p>
          <p className="card-sub">
            {nextAppt.specialty} · {nextAppt.location}
          </p>
          <button type="button" className="card-link" onClick={() => setView('appointments')}>
            View schedule →
          </button>
        </div>
      )}

      <p className="section-label">Quick actions</p>
      <div className="quick-grid">
        <button type="button" className="quick-btn" onClick={() => setView('medications')}>
          💊 Medications
        </button>
        <button type="button" className="quick-btn" onClick={() => setView('appointments')}>
          📅 Schedule
        </button>
        <button type="button" className="quick-btn" onClick={() => setView('symptoms')}>
          📝 Log symptom
        </button>
      </div>
    </div>
  )
}
