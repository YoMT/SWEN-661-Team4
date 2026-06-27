# apps-desktop

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ pnpm install
```

### Development

```bash
$ pnpm dev
```

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```

## Design system & docs

- [`docs/DESKTOP_DESIGN_SYSTEM.md`](docs/DESKTOP_DESIGN_SYSTEM.md) — the **source of truth** for
  this Electron client: foundation tokens, desktop components, the keyboard-first interaction
  model, motion, and platform-specific (Windows/macOS/Linux) conventions. (`.docx` alongside.)

> Canonical copy lives at `Documentation/DESKTOP_DESIGN_SYSTEM.md` (regenerated to `.docx` via
> `Documentation/md_to_docx.py`); the copy here is a co-located mirror — refresh it when the
> canonical changes.
