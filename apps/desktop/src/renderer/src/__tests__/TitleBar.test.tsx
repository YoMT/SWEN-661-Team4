import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { TitleBar } from '../components/TitleBar'

const minimizeMock = jest.fn()
const maximizeMock = jest.fn()
const closeMock = jest.fn()
const onMaximizedChangeMock = jest.fn()

describe('TitleBar', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    Object.defineProperty(window, 'api', {
      writable: true,
      value: {
        platform: 'win32',
        window: {
          minimize: minimizeMock,
          maximize: maximizeMock,
          close: closeMock,
          isMaximized: jest.fn().mockResolvedValue(false),
          onMaximizedChange: jest.fn().mockImplementation((cb) => {
            onMaximizedChangeMock.mockImplementation(cb)
            return jest.fn()
          })
        }
      }
    })
  })

  test('renders title and window controls', async () => {
    render(<TitleBar title="Dashboard" />)

    expect(screen.getByText(/CareConnect — Dashboard/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /minimize/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /maximize/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })
  })

  test('calls window actions', () => {
    render(<TitleBar title="Dashboard" />)

    fireEvent.click(screen.getByRole('button', { name: /minimize/i }))
    fireEvent.click(screen.getByRole('button', { name: /maximize/i }))
    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(minimizeMock).toHaveBeenCalledTimes(1)
    expect(maximizeMock).toHaveBeenCalledTimes(1)
    expect(closeMock).toHaveBeenCalledTimes(1)
  })

  test('changes maximize button label when maximized', async () => {
    Object.defineProperty(window, 'api', {
      writable: true,
      value: {
        platform: 'win32',
        window: {
          minimize: minimizeMock,
          maximize: maximizeMock,
          close: closeMock,
          isMaximized: jest.fn().mockResolvedValue(true),
          onMaximizedChange: jest.fn(() => jest.fn())
        }
      }
    })

    render(<TitleBar title="Dashboard" />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /restore/i })).toBeInTheDocument()
    })
  })

  test('hides window controls on macOS', () => {
    Object.defineProperty(window, 'api', {
      writable: true,
      value: {
        platform: 'darwin',
        window: {
          minimize: minimizeMock,
          maximize: maximizeMock,
          close: closeMock,
          isMaximized: jest.fn().mockResolvedValue(false),
          onMaximizedChange: jest.fn(() => jest.fn())
        }
      }
    })

    render(<TitleBar title="Dashboard" />)

    expect(screen.queryByRole('button', { name: /minimize/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
  })
})