import { fireEvent, render, screen } from '@testing-library/react'
import React, { useState } from 'react'
import { axe } from 'jest-axe'
import { InfoDialog } from '../components/InfoDialog'

function Harness(): React.JSX.Element {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open help
      </button>
      {open && (
        <InfoDialog title="Help Information" onClose={() => setOpen(false)}>
          <p>This is helpful content.</p>
        </InfoDialog>
      )}
    </div>
  )
}

describe('InfoDialog accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(
      <InfoDialog title="Help Information" onClose={vi.fn()}>
        <p>This is helpful content.</p>
      </InfoDialog>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  test('focuses the close button on open and closes on Escape from anywhere', () => {
    const onClose = vi.fn()
    render(
      <InfoDialog title="Help Information" onClose={onClose}>
        <p>Content</p>
      </InfoDialog>
    )
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    // Escape is handled at the document level, not just inside the dialog.
    fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('restores focus to the opener when closed', () => {
    render(<Harness />)
    const opener = screen.getByRole('button', { name: 'Open help' })
    opener.focus()
    fireEvent.click(opener)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })
})
