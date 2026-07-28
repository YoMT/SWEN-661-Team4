import React from 'react'
import { useMedicationContext } from '@renderer/state/medication-context'
import type { Medication, DoseStatus } from '@renderer/types'

const STATUS_META: Record<DoseStatus, { label: string; cls: string }> = {
  given: { label: 'Taken', cls: 'badge-given' },
  dueNow: { label: 'Due now', cls: 'badge-due' },
  upcoming: { label: 'Upcoming', cls: 'badge-upcoming' },
  missed: { label: 'Missed', cls: 'badge-due' }
}

// Sort so the doses that need attention surface first.
const ORDER: Record<DoseStatus, number> = { dueNow: 0, missed: 1, upcoming: 2, given: 3 }

function MedRow({
  med,
  onMarkTaken
}: {
  med: Medication
  onMarkTaken: (id: string) => void
}): React.JSX.Element {
  const meta = STATUS_META[med.status]
  return (
    <li className="card">
      <div className="list-row">
        <div>
          <p className="card-main">
            {med.name} · {med.dosage}
          </p>
          <p className="card-sub">
            {med.scheduledTime} · {med.instruction}
          </p>
          <span className={`badge ${meta.cls}`} style={{ marginTop: 8, display: 'inline-block' }}>
            {meta.label}
          </span>
        </div>
        {med.status !== 'given' ? (
          <button
            type="button"
            className="btn-pill"
            onClick={() => onMarkTaken(med.id)}
            aria-label={`Mark ${med.name} as taken`}
          >
            Mark as taken
          </button>
        ) : (
          <span className="muted" aria-hidden="true">
            ✓
          </span>
        )}
      </div>
    </li>
  )
}

export function MedicationsScreen(): React.JSX.Element {
  const { medications, givenDoses, totalDoses, isLoading, error, markTaken } =
    useMedicationContext()

  const sorted = [...medications].sort((a, b) => ORDER[a.status] - ORDER[b.status])

  return (
    <div className="main-inner">
      <div className="page-header">
        <h1 className="page-title">Medications</h1>
        <p className="page-sub">
          {givenDoses} of {totalDoses} doses taken today
        </p>
      </div>

      {isLoading && <p className="muted">Loading medications…</p>}
      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      {!isLoading && (
        <ul className="list-reset">
          {sorted.map((med) => (
            <MedRow key={med.id} med={med} onMarkTaken={markTaken} />
          ))}
        </ul>
      )}
    </div>
  )
}
