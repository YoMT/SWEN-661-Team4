import React from 'react'
import { useAppointmentContext } from '@renderer/state/appointment-context'
import type { Appointment } from '@renderer/types'

function formatWhen(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

function ApptCard({ appt }: { appt: Appointment }): React.JSX.Element {
  return (
    <li className="card">
      <h3 className="card-eyebrow">
        <span aria-hidden="true">{appt.type === 'video' ? '🎥' : '🏥'}</span>{' '}
        {appt.type === 'video' ? 'Video visit' : 'In person'} · {formatWhen(appt.dateTime)}
      </h3>
      <p className="card-main">{appt.doctorName}</p>
      <p className="card-sub">
        {appt.specialty} · {appt.location}
      </p>
      {appt.notes && (
        <p className="card-sub" style={{ marginTop: 6 }}>
          <span aria-hidden="true">📌</span> {appt.notes}
        </p>
      )}
    </li>
  )
}

export function AppointmentsScreen(): React.JSX.Element {
  const { todayAppointments, upcomingAppointments, isLoading, error } = useAppointmentContext()

  return (
    <div className="main-inner">
      <div className="page-header">
        <h1 className="page-title">Appointments</h1>
        <p className="page-sub">Upcoming visits and video calls</p>
      </div>

      {isLoading && <p className="muted">Loading appointments…</p>}
      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      {!isLoading && (
        <>
          <h2 className="section-label">Today</h2>
          {todayAppointments.length === 0 ? (
            <p className="muted">No appointments today.</p>
          ) : (
            <ul className="list-reset">
              {todayAppointments.map((a) => (
                <ApptCard key={a.id} appt={a} />
              ))}
            </ul>
          )}

          <h2 className="section-label">Upcoming</h2>
          {upcomingAppointments.length === 0 ? (
            <p className="muted">Nothing else scheduled.</p>
          ) : (
            <ul className="list-reset">
              {upcomingAppointments.map((a) => (
                <ApptCard key={a.id} appt={a} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
