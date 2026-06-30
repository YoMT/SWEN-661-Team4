import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useUI } from '@renderer/state/ui-context'
import { COMMANDS, type ActionId } from '@renderer/actions'

/**
 * Command palette (⌘K) — a keyboard-only path to every action (§3.3 / §4.5).
 * Focus lands in the search field; ↑/↓ move the active option, Enter runs it,
 * Esc closes and restores focus to the invoker.
 */
export function CommandPalette({ run }: { run: (id: ActionId) => void }): React.JSX.Element {
  const { setPaletteOpen } = useUI()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COMMANDS
    return COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    )
  }, [query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const close = (): void => setPaletteOpen(false)

  const onQueryChange = (value: string): void => {
    setQuery(value)
    setActive(0)
  }

  const choose = (id: ActionId): void => {
    close()
    run(id)
  }

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = results[active]
      if (cmd) choose(cmd.id)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
  }

  useEffect(() => {
    listRef.current?.querySelector('.palette-row.active')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  return (
    <div className="palette-scrim" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search commands…"
          aria-label="Search commands"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="palette-list" id="palette-list" role="listbox" ref={listRef}>
          {results.length === 0 && <div className="palette-row muted">No matching commands</div>}
          {results.map((cmd, i) => (
            <div
              key={cmd.id}
              id={`cmd-${cmd.id}`}
              role="option"
              aria-selected={i === active}
              className={`palette-row${i === active ? ' active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault()
                choose(cmd.id)
              }}
            >
              <span className="muted" style={{ width: 72, fontSize: 12 }}>
                {cmd.group}
              </span>
              <span>{cmd.label}</span>
              {cmd.accel && <span className="accel">{cmd.accel}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
