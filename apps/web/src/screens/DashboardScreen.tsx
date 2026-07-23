import React from 'react'
import { useDashboard } from '@renderer/state/use-dashboard'
import type { View } from '@renderer/components/Sidebar'

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
    <li className="stat-tile" style={{ borderLeftColor: color }}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </li>
  )
}

interface DashboardProps {
  onNavigate: (view: View) => void
}

export function DashboardScreen({ onNavigate }: DashboardProps): React.JSX.Element {
  const {
    careeName,
    isLoading,
    refresh,
    givenDoses,
    totalDoses,
    todayAppointmentsCount,
    logsCount,
    nextMed,
    nextAppt
  } = useDashboard()

  return (
    <div className="main-inner">
      <div className="page-header row-between">
        <div>
          <p className="page-sub" style={{ margin: 0 }}>
            {greeting()} - caring for
          </p>
          <h1 className="page-title">{careeName}</h1>
        </div>

        <button
          type="button"
          className="btn-pill"
          onClick={refresh}
          disabled={isLoading}
          aria-label="Refresh dashboard"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <ul className="stats-row list-reset" style={{ marginTop: 18 }}>
        <StatTile label="Doses today" value={`${givenDoses}/${totalDoses}`} color="#4a7c59" />
        <StatTile label="Appointments" value={String(todayAppointmentsCount)} color="#2e5c8a" />
        <StatTile label="Symptom logs" value={String(logsCount)} color="#9e6e00" />
      </ul>

      {nextMed && (
        <div className="card">
          <h2 className="card-eyebrow">Next medication</h2>
          <p className="card-main">
            {nextMed.name} - {nextMed.dosage}
          </p>
          <p className="card-sub">
            {nextMed.scheduledTime} - {nextMed.instruction}
          </p>
          <button type="button" className="card-link" onClick={() => onNavigate('medications')}>
            View all medications
          </button>
        </div>
      )}

      {nextAppt && (
        <div className="card">
          <h2 className="card-eyebrow">Today&apos;s appointment</h2>
          <p className="card-main">{nextAppt.doctorName}</p>
          <p className="card-sub">
            {nextAppt.specialty} - {nextAppt.location}
          </p>
          <button type="button" className="card-link" onClick={() => onNavigate('appointments')}>
            View schedule
          </button>
        </div>
      )}

      <div className="quick-row">
        <button type="button" className="quick-btn" onClick={() => onNavigate('medications')}>
          Medications
        </button>
        <button type="button" className="quick-btn" onClick={() => onNavigate('appointments')}>
          Schedule
        </button>
        <button type="button" className="quick-btn" onClick={() => onNavigate('symptoms')}>
          Symptoms
        </button>
        <button type="button" className="quick-btn" onClick={() => onNavigate('profile')}>
          Profile
        </button>
      </div>
    </div>
  )
}