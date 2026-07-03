import { MENUS } from '../components/menu-defs'

describe('MENUS', () => {
  test('contains expected top-level menus', () => {
    const labels = MENUS.map((m) => m.label)

    expect(labels).toContain('File')
    expect(labels).toContain('Edit')
    expect(labels).toContain('View')
    expect(labels).toContain('Help')
  })

  test('File menu contains Sign Out', () => {
    const fileMenu = MENUS.find((m) => m.label === 'File')

    expect(fileMenu).toBeDefined()
    expect(
      fileMenu?.items.some((item) => item.label === 'Sign Out')
    ).toBe(true)
  })

  test('Help menu contains User Guide', () => {
    const helpMenu = MENUS.find((m) => m.label === 'Help')

    expect(
      helpMenu?.items.some((item) => item.label === 'User Guide')
    ).toBe(true)
  })
})