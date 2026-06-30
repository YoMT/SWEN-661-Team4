import React, { useEffect, useRef, useState } from 'react'
import { MENUS } from '@renderer/components/menu-defs'

interface MenuBarProps {
  onCommand: (action: string) => void
}

export function MenuBar({ onCommand }: MenuBarProps): React.JSX.Element {
  const [open, setOpen] = useState<number | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open === null) return
    const onDocClick = (e: MouseEvent): void => {
      if (!barRef.current?.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const choose = (action?: string): void => {
    setOpen(null)
    if (action) onCommand(action)
  }

  const onTopKey = (e: React.KeyboardEvent, index: number): void => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setOpen((index + 1) % MENUS.length)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setOpen((index - 1 + MENUS.length) % MENUS.length)
    } else if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault()
      setOpen(index)
    } else if (e.key === 'Escape') {
      setOpen(null)
    }
  }

  return (
    <div className="menubar" ref={barRef} role="menubar" aria-label="Application menu">
      {MENUS.map((menu, i) => (
        <div key={menu.label} className="menu">
          <button
            type="button"
            className={`menu-top${open === i ? ' open' : ''}`}
            aria-haspopup="true"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            onMouseEnter={() => open !== null && setOpen(i)}
            onKeyDown={(e) => onTopKey(e, i)}
          >
            {menu.label}
          </button>
          {open === i && (
            <div className="menu-dropdown" role="menu" aria-label={menu.label}>
              {menu.items.map((item, j) =>
                item.separator ? (
                  <div key={j} className="menu-sep" role="separator" />
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    className="menu-item"
                    role="menuitem"
                    onClick={() => choose(item.action)}
                  >
                    <span>{item.label}</span>
                    {item.accelerator && <span className="menu-accel">{item.accelerator}</span>}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
