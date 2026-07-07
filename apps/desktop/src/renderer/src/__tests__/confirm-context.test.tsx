import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmProvider, useConfirm } from '../state/confirm-context'

function Harness(): React.JSX.Element {
  const { confirm } = useConfirm()
  const [result, setResult] = useState<string>('none')
  return (
    <div>
      <button
        onClick={async () => {
          const ok = await confirm({
            title: 'Mark dose as taken?',
            body: 'Confirm Metoprolol 50 mg was taken.',
            confirmLabel: 'Mark as Taken'
          })
          setResult(String(ok))
        }}
      >
        ask
      </button>
      <span data-testid="result">{result}</span>
    </div>
  )
}

const setup = (): void => {
  render(
    <ConfirmProvider>
      <Harness />
    </ConfirmProvider>
  )
}

describe('confirm-context (Pillar 2 — two-step confirm)', () => {
  test('opens a focus-managed alertdialog with the given title/body', async () => {
    setup()
    await userEvent.click(screen.getByText('ask'))
    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toBeInTheDocument()
    expect(screen.getByText('Mark dose as taken?')).toBeInTheDocument()
    expect(screen.getByText(/Metoprolol 50 mg was taken/)).toBeInTheDocument()
    // Safe default (Cancel) receives focus.
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
  })

  test('resolves true when the confirm action is chosen', async () => {
    setup()
    await userEvent.click(screen.getByText('ask'))
    await userEvent.click(screen.getByRole('button', { name: 'Mark as Taken' }))
    await waitFor(() => expect(screen.getByTestId('result')).toHaveTextContent('true'))
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  test('resolves false when cancelled', async () => {
    setup()
    await userEvent.click(screen.getByText('ask'))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.getByTestId('result')).toHaveTextContent('false'))
  })

  test('Escape cancels (resolves false)', async () => {
    setup()
    await userEvent.click(screen.getByText('ask'))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.getByTestId('result')).toHaveTextContent('false'))
  })

  test('traps focus between Cancel and Confirm', async () => {
    setup()
    await userEvent.click(screen.getByText('ask'))
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    const confirmBtn = screen.getByRole('button', { name: 'Mark as Taken' })
    expect(cancel).toHaveFocus()
    await userEvent.tab()
    expect(confirmBtn).toHaveFocus()
    await userEvent.tab() // past the last control → wraps back to Cancel
    expect(cancel).toHaveFocus()
  })
})
