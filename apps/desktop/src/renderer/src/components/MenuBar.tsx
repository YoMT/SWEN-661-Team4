import React, { useEffect, useRef, useState } from 'react'
import { useUI } from '@renderer/state/ui-context'
import type { ActionId } from '@renderer/actions'

type Row =
  | {
      kind: 'item'
      label: string
      action: ActionId
      accel?: string
      checked?: boolean
      role?: 'menuitemcheckbox' | 'menuitemradio'
    }
  | { kind: 'sep' }
  | { kind: 'heading'; label: string }

interface MenuDef {
  label: string
  rows: Row[]
}

const mod = navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl'

export function MenuBar({ run }: { run: (id: ActionId) => void }): React.JSX.Element {
  const ui = useUI()
  const [open, setOpen] = useState<number | null>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([])

  const menus: MenuDef[] = [
    {
      label: 'File',
      rows: [
        { kind: 'item', label: 'New Medication', action: 'new-medication', accel: `${mod}+N` },
        {
          kind: 'item',
          label: 'New Appointment',
          action: 'new-appointment',
          accel: `${mod}+Shift+N`
        },
        { kind: 'item', label: 'Log Symptom', action: 'log-symptom' },
        { kind: 'sep' },
        { kind: 'item', label: 'Export Report…', action: 'export-report', accel: `${mod}+E` },
        { kind: 'sep' },
        { kind: 'item', label: 'Sign Out', action: 'sign-out' }
      ]
    },
    {
      label: 'Edit',
      rows: [
        { kind: 'item', label: 'Edit Profile', action: 'edit-profile' },
        { kind: 'item', label: 'Emergency Contacts', action: 'emergency-contacts' },
        { kind: 'item', label: 'Caretaker Notes', action: 'caretaker-notes' }
      ]
    },
    {
      label: 'View',
      rows: [
        { kind: 'item', label: 'Dashboard', action: 'nav-dashboard', accel: `${mod}+1` },
        { kind: 'item', label: 'Medications', action: 'nav-medications', accel: `${mod}+2` },
        { kind: 'item', label: 'Appointments', action: 'nav-appointments', accel: `${mod}+3` },
        { kind: 'item', label: 'Symptoms', action: 'nav-symptoms', accel: `${mod}+4` },
        { kind: 'item', label: 'Profile', action: 'nav-profile', accel: `${mod}+5` },
        { kind: 'sep' },
        {
          kind: 'item',
          label: 'Show Sidebar',
          action: 'toggle-sidebar',
          accel: `${mod}+B`,
          role: 'menuitemcheckbox',
          checked: !ui.sidebarCollapsed
        },
        {
          kind: 'item',
          label: 'Show Assistant',
          action: 'toggle-assistant',
          accel: `${mod}+J`,
          role: 'menuitemcheckbox',
          checked: ui.assistantOpen
        },
        {
          kind: 'item',
          label: 'Tremor (Accessible) Mode',
          action: 'toggle-density',
          role: 'menuitemcheckbox',
          checked: ui.density === 'accessible'
        },
        {
          kind: 'item',
          label: 'Reduce Motion',
          action: 'toggle-motion',
          role: 'menuitemcheckbox',
          checked: ui.reduceMotion
        },
        { kind: 'sep' },
        { kind: 'heading', label: 'Text Size' },
        {
          kind: 'item',
          label: 'Standard',
          action: 'text-standard',
          role: 'menuitemradio',
          checked: ui.textSize === 'standard'
        },
        {
          kind: 'item',
          label: 'Large',
          action: 'text-large',
          role: 'menuitemradio',
          checked: ui.textSize === 'large'
        },
        {
          kind: 'item',
          label: 'Largest',
          action: 'text-largest',
          role: 'menuitemradio',
          checked: ui.textSize === 'largest'
        },
        { kind: 'sep' },
        { kind: 'heading', label: 'Theme' },
        {
          kind: 'item',
          label: 'Light',
          action: 'theme-light',
          role: 'menuitemradio',
          checked: ui.theme === 'light'
        },
        {
          kind: 'item',
          label: 'Dark',
          action: 'theme-dark',
          role: 'menuitemradio',
          checked: ui.theme === 'dark'
        },
        {
          kind: 'item',
          label: 'System',
          action: 'theme-system',
          role: 'menuitemradio',
          checked: ui.theme === 'system'
        }
      ]
    },
    {
      label: 'Help',
      rows: [
        { kind: 'item', label: 'User Guide', action: 'user-guide', accel: 'F1' },
        { kind: 'item', label: 'Keyboard Shortcuts', action: 'shortcuts', accel: `${mod}+/` },
        { kind: 'sep' },
        { kind: 'item', label: 'About CareConnect', action: 'about' }
      ]
    }
  ]

  // Close on outside click.
  useEffect(() => {
    if (open === null) return
    const onDown = (e: MouseEvent): void => {
      if (!barRef.current?.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const itemIndexes = (menuIndex: number): number[] =>
    menus[menuIndex].rows.map((r, i) => (r.kind === 'item' ? i : -1)).filter((i) => i >= 0)

  const focusRow = (rowIndex: number): void => {
    requestAnimationFrame(() => rowRefs.current[rowIndex]?.focus())
  }

  const openMenu = (index: number, focusFirst = false): void => {
    setOpen(index)
    if (focusFirst) {
      const first = itemIndexes(index)[0]
      if (first !== undefined) focusRow(first)
    }
  }

  const onTopKeyDown = (e: React.KeyboardEvent, index: number): void => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = (index + 1) % menus.length
      openMenu(next, open !== null)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = (index - 1 + menus.length) % menus.length
      openMenu(prev, open !== null)
    } else if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openMenu(index, true)
    } else if (e.key === 'Escape') {
      setOpen(null)
    }
  }

  const onRowKeyDown = (e: React.KeyboardEvent, menuIndex: number): void => {
    const idxs = itemIndexes(menuIndex)
    const current = rowRefs.current.findIndex((el) => el === document.activeElement)
    const pos = idxs.indexOf(current)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusRow(idxs[(pos + 1) % idxs.length])
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusRow(idxs[(pos - 1 + idxs.length) % idxs.length])
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusRow(idxs[0])
    } else if (e.key === 'End') {
      e.preventDefault()
      focusRow(idxs[idxs.length - 1])
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      openMenu((menuIndex + 1) % menus.length, true)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      openMenu((menuIndex - 1 + menus.length) % menus.length, true)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(null)
      barRef.current?.querySelectorAll<HTMLButtonElement>('.menubar-item')[menuIndex]?.focus()
    }
  }

  const choose = (action: ActionId): void => {
    setOpen(null)
    run(action)
  }

  return (
    <div className="menubar" role="menubar" aria-label="Application menu" ref={barRef}>
      {menus.map((menu, mi) => (
        <div key={menu.label} style={{ position: 'relative', display: 'flex' }}>
          <button
            type="button"
            className="menubar-item"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={open === mi}
            onClick={() => (open === mi ? setOpen(null) : openMenu(mi, false))}
            onKeyDown={(e) => onTopKeyDown(e, mi)}
          >
            {menu.label}
          </button>
          {open === mi && (
            <div
              className="menu-popup"
              role="menu"
              aria-label={menu.label}
              style={{ top: 'var(--menubar-h)', left: 0 }}
              onKeyDown={(e) => onRowKeyDown(e, mi)}
            >
              {menu.rows.map((row, ri) => {
                if (row.kind === 'sep')
                  return <div key={ri} className="menu-sep" role="separator" />
                if (row.kind === 'heading')
                  return (
                    <div
                      key={ri}
                      className="sidebar-heading"
                      style={{ padding: 'var(--space-1) var(--space-3)' }}
                    >
                      {row.label}
                    </div>
                  )
                return (
                  <button
                    key={ri}
                    type="button"
                    ref={(el) => {
                      rowRefs.current[ri] = el
                    }}
                    className="menu-row"
                    role={row.role ?? 'menuitem'}
                    aria-checked={row.role ? row.checked : undefined}
                    tabIndex={-1}
                    onClick={() => choose(row.action)}
                  >
                    <span aria-hidden="true" style={{ width: 16 }}>
                      {row.role && row.checked ? '✓' : ''}
                    </span>
                    <span className="label">{row.label}</span>
                    {row.accel && <span className="accel">{row.accel}</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
