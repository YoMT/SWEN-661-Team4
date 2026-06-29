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
    <div className="card">
      <p className="card-eyebrow">
        {appt.type === 'video' ? '🎥 Video visit' : '🏥 In person'} · {formatWhen(appt.dateTime)}
      </p>
      <p className="card-main">{appt.doctorName}</p>
      <p className="card-sub">
        {appt.specialty} · {appt.location}
      </p>
      {appt.notes && (
        <p className="card-sub" style={{ marginTop: 6 }}>
          📌 {appt.notes}
        </p>
      )}
    </div>
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
          <p className="section-label">Today</p>
          {todayAppointments.length === 0 ? (
            <p className="muted">No appointments today.</p>
          ) : (
            todayAppointments.map((a) => <ApptCard key={a.id} appt={a} />)
          )}

          <p className="section-label">Upcoming</p>
          {upcomingAppointments.length === 0 ? (
            <p className="muted">Nothing else scheduled.</p>
          ) : (
            upcomingAppointments.map((a) => <ApptCard key={a.id} appt={a} />)
          )}
        </>
      )}
    </div>
  )
}
