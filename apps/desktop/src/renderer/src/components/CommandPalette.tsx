import React, { useMemo, useRef, useState, useEffect } from 'react'
import { MENUS } from '@renderer/components/menu-defs'

interface Command {
  label: string
  action: string
  group: string
}

const COMMANDS: Command[] = MENUS.flatMap((m) =>
  m.items
    .filter((i) => i.action && !i.separator)
    .map((i) => ({ label: i.label, action: i.action!, group: m.label }))
)

interface CommandPaletteProps {
  onClose: () => void
  onCommand: (action: string) => void
}

export function CommandPalette({ onClose, onCommand }: CommandPaletteProps): React.JSX.Element {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COMMANDS
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(q))
  }, [query])

  const run = (cmd?: Command): void => {
    if (!cmd) return
    onClose()
    onCommand(cmd.action)
  }

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(results[active])
    }
  }

  return (
    <div className="modal-scrim palette-scrim" onMouseDown={onClose}>
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <input
          ref={inputRef}
          className="palette-input"
          placeholder="Type a command…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          aria-label="Command search"
        />
        <div className="palette-list" role="listbox" aria-label="Commands">
          {results.length === 0 && <div className="palette-empty">No matching commands</div>}
          {results.map((c, i) => (
            <button
              key={c.action}
              type="button"
              role="option"
              aria-selected={i === active}
              className={`palette-item${i === active ? ' active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => run(c)}
            >
              <span>{c.label}</span>
              <span className="palette-group">{c.group}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
