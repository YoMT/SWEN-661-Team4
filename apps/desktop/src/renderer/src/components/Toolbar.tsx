import React, { useRef } from 'react'

export interface ToolbarAction {
  label: string
  action: string
  primary?: boolean
}

interface ToolbarProps {
  actions: ToolbarAction[]
  onCommand: (action: string) => void
}

/**
 * Contextual action strip per screen. One tab stop with roving arrow-key
 * navigation between buttons (DESKTOP_DESIGN_SYSTEM.md §3.3).
 */
export function Toolbar({ actions, onCommand }: ToolbarProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null)

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End')
      return
    const btns = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])
    const idx = btns.indexOf(document.activeElement as HTMLButtonElement)
    e.preventDefault()
    let next = idx
    if (e.key === 'ArrowRight') next = (idx + 1) % btns.length
    else if (e.key === 'ArrowLeft') next = (idx - 1 + btns.length) % btns.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = btns.length - 1
    btns[next]?.focus()
  }

  return (
    <div className="toolbar" role="toolbar" aria-label="Actions" ref={ref} onKeyDown={onKeyDown}>
      {actions.map((a, i) => (
        <button
          key={a.action}
          type="button"
          className={`tool-btn${a.primary ? ' primary' : ''}`}
          tabIndex={i === 0 ? 0 : -1}
          onClick={() => onCommand(a.action)}
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}
