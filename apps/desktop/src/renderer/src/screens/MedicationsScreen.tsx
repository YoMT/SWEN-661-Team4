import React, { useRef } from 'react'
import { useMedicationContext } from '@renderer/state/medication-context'
import { useUI } from '@renderer/state/ui-context'
import { useDebouncedAction } from '@renderer/lib/use-debounced-action'
import type { Medication, DoseStatus } from '@renderer/types'

const STATUS_META: Record<DoseStatus, { label: string; cls: string; icon: string }> = {
  given: { label: 'Taken', cls: 'badge-given', icon: '✓' },
  dueNow: { label: 'Due now', cls: 'badge-due', icon: '●' },
  upcoming: { label: 'Upcoming', cls: 'badge-upcoming', icon: '○' },
  missed: { label: 'Missed', cls: 'badge-due', icon: '!' }
}
const ORDER: Record<DoseStatus, number> = { dueNow: 0, missed: 1, upcoming: 2, given: 3 }

/**
 * Medication list as a keyboard grid (§4.2 / §3.8). Rows are one tab stop with
 * roving focus (↑/↓/Home/End); Space or T marks the focused dose Taken; → moves
 * to the row's action button (also Tab-reachable, so it never depends on hover).
 * Mark-as-taken is a care write: ≥44px, 600ms debounce, two-step confirm.
 */
export function MedicationsScreen(): React.JSX.Element {
  const { medications, givenDoses, totalDoses, isLoading, error, markTaken } =
    useMedicationContext()
  const { confirm, announce } = useUI()
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  const sorted = [...medications].sort((a, b) => ORDER[a.status] - ORDER[b.status])

  const confirmMark = useDebouncedAction((med: Medication) => {
    void (async () => {
      const ok = await confirm({
        title: 'Mark dose as taken?',
        body: `Confirm ${med.name} ${med.dosage} (${med.scheduledTime}) was taken.`,
        confirmLabel: 'Mark as Taken'
      })
      if (!ok) return
      await markTaken(med.id)
      announce(`${med.name} marked as taken`)
    })()
  })

  const focusRow = (i: number): void => {
    const max = sorted.length - 1
    const clamped = Math.max(0, Math.min(i, max))
    rowRefs.current[clamped]?.focus()
  }

  const onRowKeyDown = (e: React.KeyboardEvent, index: number, med: Medication): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusRow(index + 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusRow(index - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusRow(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      focusRow(sorted.length - 1)
    } else if ((e.key === ' ' || e.key === 't' || e.key === 'T') && med.status !== 'given') {
      e.preventDefault()
      confirmMark(med)
    }
  }

  return (
    <div className="content-inner">
      <h1 className="page-title">Medications</h1>
      <p className="page-sub" aria-live="polite">
        {givenDoses} of {totalDoses} doses taken today
      </p>

      {isLoading && <p className="muted">Loading medications…</p>}
      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      {!isLoading && (
        <div
          className="grid"
          role="grid"
          aria-label="Medications"
          aria-rowcount={sorted.length + 1}
        >
          <div className="grid-head" role="row">
            <span role="columnheader">Medication</span>
            <span role="columnheader">Dose</span>
            <span role="columnheader">Time</span>
            <span role="columnheader">Status</span>
            <span role="columnheader" aria-label="Actions" />
          </div>

          {sorted.map((med, i) => {
            const meta = STATUS_META[med.status]
            return (
              <div
                key={med.id}
                role="row"
                className="grid-row"
                tabIndex={i === 0 ? 0 : -1}
                ref={(el) => {
                  rowRefs.current[i] = el
                }}
                aria-label={`${med.name}, ${med.dosage}, ${med.scheduledTime}, ${meta.label}`}
                onKeyDown={(e) => onRowKeyDown(e, i, med)}
              >
                <span role="gridcell">
                  <span className="cell-name">{med.name}</span>
                  <span className="cell-sub" style={{ display: 'block' }}>
                    {med.instruction}
                  </span>
                </span>
                <span role="gridcell">{med.dosage}</span>
                <span role="gridcell">{med.scheduledTime}</span>
                <span role="gridcell">
                  <span className={`badge ${meta.cls}`}>
                    <span aria-hidden="true">{meta.icon}</span> {meta.label}
                  </span>
                </span>
                <span role="gridcell" style={{ textAlign: 'right' }}>
                  {med.status !== 'given' ? (
                    <button
                      type="button"
                      className="btn btn-primary critical"
                      aria-label={`Mark ${med.name} as taken`}
                      onClick={() => confirmMark(med)}
                    >
                      Mark as Taken
                    </button>
                  ) : (
                    <span className="muted">Done</span>
                  )}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
