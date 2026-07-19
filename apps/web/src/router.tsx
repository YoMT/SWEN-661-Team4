import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

/**
 * Tiny History-API router — enough for CareConnect web's flat route set, with no
 * third-party dependency. Vite's dev/preview servers do SPA index.html fallback,
 * so deep links (e.g. /medications) resolve on refresh.
 */
interface RouterState {
  path: string
  navigate: (to: string, opts?: { replace?: boolean }) => void
}

const RouterContext = createContext<RouterState | null>(null)

export function RouterProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [path, setPath] = useState<string>(window.location.pathname)

  useEffect(() => {
    const onPop = (): void => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to: string, opts?: { replace?: boolean }) => {
    if (to === window.location.pathname) return
    if (opts?.replace) window.history.replaceState({}, '', to)
    else window.history.pushState({}, '', to)
    setPath(to)
    window.scrollTo(0, 0)
  }, [])

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>
}

export function useRouter(): RouterState {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used within RouterProvider')
  return ctx
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

/** Client-side link that keeps a real href (crawlable, right-clickable) but avoids a full reload. */
export function Link({ to, onClick, children, ...rest }: LinkProps): React.JSX.Element {
  const { navigate } = useRouter()
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
