import React, { useRef } from 'react'
import { useMedicationContext } from '@renderer/state/medication-context'
import { useConfirm } from '@renderer/state/confirm-context'
import { useDebouncedAction } from '@renderer/lib/use-debounced-action'
import type { Medication, DoseStatus } from '@renderer/types'

const STATUS_META: Record<DoseStatus, { label: string; cls: string; icon: string }> = {
  given: { label: 'Taken', cls: 'badge-given', icon: '✓' },
  dueNow: { label: 'Due now', cls: 'badge-due', icon: '●' },
  upcoming: { label: 'Upcoming', cls: 'badge-upcoming', icon: '○' },
  missed: { label: 'Missed', cls: 'badge-due', icon: '!' }
}

// Sort so the doses that need attention surface first.
const ORDER: Record<DoseStatus, number> = { dueNow: 0, missed: 1, upcoming: 2, given: 3 }

/**
 * Medication list as a keyboard grid (§4.2). Rows are a single tab stop with
 * roving focus (↑/↓/Home/End); Space or T marks the focused dose Taken. The
 * "Mark as taken" button is also a real Tab-reachable control, so nothing
 * depends on hover. Mark-as-taken is a care write: ≥44px, 600ms debounce
 * (Pillar 3), and a two-step confirm (Pillar 2).
 */
export function MedicationsScreen(): React.JSX.Element {
  const { medications, givenDoses, totalDoses, isLoading, error, markTaken } =
    useMedicationContext()
  const { confirm } = useConfirm()
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  const sorted = [...medications].sort((a, b) => ORDER[a.status] - ORDER[b.status])

  const confirmMark = useDebouncedAction((med: Medication) => {
    void (async () => {
      const ok = await confirm({
        title: 'Mark dose as taken?',
        body: `Confirm ${med.name} ${med.dosage} (${med.scheduledTime}) was taken.`,
        confirmLabel: 'Mark as Taken'
      })
      if (ok) await markTaken(med.id)
    })()
  })

  const focusRow = (i: number): void => {
    const clamped = Math.max(0, Math.min(i, sorted.length - 1))
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
    <div className="main-inner">
      <div className="page-header">
        <h1 className="page-title">Medications</h1>
      </div>
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
        <div role="grid" aria-label="Medications" aria-rowcount={sorted.length}>
          {sorted.map((med, i) => {
            const meta = STATUS_META[med.status]
            return (
              <div
                key={med.id}
                role="row"
                className="card med-row"
                tabIndex={i === 0 ? 0 : -1}
                ref={(el) => {
                  rowRefs.current[i] = el
                }}
                aria-label={`${med.name}, ${med.dosage}, ${med.scheduledTime}, ${meta.label}`}
                onKeyDown={(e) => onRowKeyDown(e, i, med)}
              >
                <div className="list-row" role="gridcell">
                  <div>
                    <p className="card-main">
                      {med.name} · {med.dosage}
                    </p>
                    <p className="card-sub">
                      {med.scheduledTime} · {med.instruction}
                    </p>
                    <span
                      className={`badge ${meta.cls}`}
                      style={{ marginTop: 8, display: 'inline-block' }}
                    >
                      <span aria-hidden="true">{meta.icon}</span> {meta.label}
                    </span>
                  </div>
                  {med.status !== 'given' ? (
                    <button
                      type="button"
                      className="btn-pill med-mark"
                      onClick={() => confirmMark(med)}
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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
