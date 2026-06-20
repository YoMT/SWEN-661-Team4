# Integration Testing — CareConnect Mobile (React Native)

**Date:** June 2026  
**App:** `apps/mobile/` (Expo / React Native)  
**Author:** Yoseph Tesfay

---

## 1. Overview

This document covers the integration test suite added to the CareConnect React Native mobile application. Integration tests verify complete feature flows by rendering real screens with their full context-provider chain, simulating user interactions, and asserting on UI state after API responses are intercepted and mocked at the network layer.

Integration tests sit between unit tests (which test individual components or functions in isolation) and end-to-end tests (which drive a real device). They give high confidence that screens, state management, and the API client work together correctly, without the fragility or setup cost of a full device test.

---

## 2. Technology Stack

| Tool | Version | Role |
|---|---|---|
| **Jest** | 29.7 | Test runner, assertions, module mocking |
| **React Native Testing Library (RNTL)** | 14.0 | Render screens, query the component tree, fire events |
| **Mock Service Worker (MSW)** | 1.3.5 | Intercept `fetch` calls at the Node.js level and return controlled responses |
| **jest-expo** | 56.0 | Babel transform preset and Jest defaults for Expo projects |
| **jest-junit** | 17.0 | JUnit XML report for CI pipelines |

### Why MSW v1, not v2?

MSW v2 introduced a pure-ESM internal dependency (`rettime`) that cannot be transformed by `babel-jest` without a `babel.config.js` file — which this project does not have (the Expo preset supplies its own Babel configuration at transform time). MSW v1 ships CommonJS output and integrates with `jest-expo` without any extra configuration.

---

## 3. File Structure

```
apps/mobile/
├── jest.env.js                          # Sets EXPO_PUBLIC_API_URL before modules load
├── jest.setup.js                        # MSW server lifecycle (beforeAll / afterEach / afterAll)
├── package.json                         # Jest config block
└── src/
    └── __tests__/
        ├── css-mock.js                  # CSS module stub (moduleNameMapper)
        └── integration/
            ├── setup/
            │   ├── server.ts            # MSW server — 17 request handlers
            │   └── render-with-providers.tsx  # Async render helper with full provider chain
            ├── auth.integration.test.tsx        # 5 tests — login screen
            ├── medications.integration.test.tsx # 4 tests — medication list
            └── appointments.integration.test.tsx # 4 tests — appointment list
```

---

## 4. Architecture

### 4.1 The `USE_MOCK` Gate

`src/services/api.ts` contains a module-level constant:

```typescript
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
const USE_MOCK = !BASE_URL || BASE_URL.includes('example.com');
```

When `USE_MOCK` is `true`, all API calls bypass `fetch` and go directly to `mockRequest()` (an in-process seed-data stub). MSW can only intercept real `fetch` calls, so the gate must be `false` during integration tests.

**`jest.env.js`** (in `setupFiles`) sets the env variable before any module is imported:

```js
process.env.EXPO_PUBLIC_API_URL = 'http://localhost';
```

Because `USE_MOCK` is evaluated at module load time, and Jest resets the module registry between test files, every test file receives a fresh `api.ts` with `USE_MOCK = false`.

### 4.2 MSW Server (`setup/server.ts`)

The server is created with `setupServer(...handlers)` from `msw/node`. Seed data mirrors `src/services/mock-api.ts` so assertions use predictable values.

Handlers cover:

| Method | Path | Response |
|---|---|---|
| POST | `/auth/login` | `{ token, user }` (valid) / 400 (bad credentials) |
| POST | `/auth/signup` | `{ token, user }` |
| GET | `/auth/me` | Demo user object |
| GET | `/medications` | Array of 3 medications |
| POST | `/medications` | New medication |
| PATCH | `/medications/:id/taken` | `{}` |
| GET | `/appointments` | Array of 2 appointments |
| POST | `/appointments` | New appointment |
| PATCH | `/appointments/:id` | Updated appointment |
| GET | `/symptoms` | Symptom log array |
| POST | `/symptoms` | New symptom |
| GET | `/profile` | Profile object |
| PATCH | `/profile` | Merged profile |
| GET | `/emergency-contacts` | Emergency contact array |
| POST | `/incidents` | `{}` |
| GET | `/caretaker-notes` | Caretaker notes array |
| PATCH | `/caretaker-notes/:id/reply` | Updated note |
| POST | `/ai/chat` | `{ reply: string }` |
| DELETE | `/*` | 405 (catch-all for error-handling tests) |

**Why 400 for bad login credentials, not 401?**  
`api.ts` calls `_onUnauthorized()` on every 401 response. That handler invokes `logout()`, which sets `errorMessage` to `null` — clearing the "Invalid email or password." error before the test can assert on it. Returning 400 for wrong credentials is semantically correct (400 = bad request, 401 = valid token required) and avoids the unintended logout side-effect.

### 4.3 MSW Server Lifecycle (`jest.setup.js`)

```js
const { server } = require('./src/__tests__/integration/setup/server');

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

`resetHandlers()` after each test removes any per-test handler overrides so handlers don't leak between tests.

### 4.4 Render Helper (`setup/render-with-providers.tsx`)

```tsx
export async function renderWithProviders(ui, options) {
  return render(ui, { wrapper: AllProviders, ...options });
}
```

`AllProviders` wraps the component under test in the same provider chain as `src/app/_layout.tsx`:

```
ErrorBoundary
  AccessibilityProvider
    ErrorProvider
      AuthProvider
        RefreshProvider
          CareDataProvider
            DashboardProvider
              AiAssistantProvider
                {children}
```

**Why `expo-secure-store` is mocked:** `AuthProvider` checks for a stored token on mount. With `getItemAsync` returning `null`, no cold-start token is found and no `GET /auth/me` call is made, keeping tests isolated.

---

## 5. Test Coverage

### Auth — Login Screen (`auth.integration.test.tsx`)

| # | Test | What it verifies |
|---|---|---|
| 1 | Renders sign-in form | All form elements are present on initial render |
| 2 | Valid login shows no error | Full login flow completes; no error text appears |
| 3 | Wrong credentials shows error | 400 from MSW → error message visible in UI |
| 4 | Empty form shows local validation | Client-side validation fires before any API call |
| 5 | "Create account" navigates to signup | `router.replace('/(auth)/signup')` is called |

### Medications Screen (`medications.integration.test.tsx`)

| # | Test | What it verifies |
|---|---|---|
| 1 | Medication names load from API | All 3 seed medication names appear after fetch |
| 2 | Adherence counter shown | "1/3 doses" text reflects seed data (1 given, 3 total) |
| 3 | Add button navigates | `router.push('/(tabs)/medications/new')` is called |
| 4 | Mark taken — optimistic update | Take button disappears immediately after press (before API response) |

### Appointments Screen (`appointments.integration.test.tsx`)

| # | Test | What it verifies |
|---|---|---|
| 1 | Doctor names load from API | Dr. Sarah Chen and Dr. Michael Torres appear |
| 2 | Specialties are shown | "Cardiologist" and "General Practice" appear |
| 3 | Book button navigates | `router.push('/(tabs)/appointments/new')` is called |
| 4 | Reschedule button navigates | `router.push('/(tabs)/appointments/reschedule')` is called |

**Total: 13 integration tests across 3 suites.**

---

## 6. Jest Configuration

Key additions to `package.json`:

```json
"jest": {
  "preset": "jest-expo",
  "testMatch": ["**/__tests__/**/*.test.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  "setupFiles": ["<rootDir>/jest.env.js"],
  "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
  "moduleNameMapper": {
    "\\.(css)$": "<rootDir>/src/__tests__/css-mock.js"
  }
}
```

`testMatch` is set explicitly so Jest does not pick up `setup/server.ts` and `setup/render-with-providers.tsx` as test suites (they live inside `__tests__/` but contain no tests).

---

## 7. Running the Tests

```bash
# Integration tests only
npx jest --testPathPattern=integration

# Full suite (unit + integration)
npx jest

# With coverage report
npx jest --coverage

# From the workspace root
pnpm test --filter mobile
```

---

## 8. Critical Pitfalls (React 19 + RNTL v14)

These issues were discovered during implementation and are not obvious from the documentation.

### 8.1 `render` is async

RNTL v14 changed `render()` to an `async` function. The return value is a `Promise<RenderResult>`. Always `await` it:

```tsx
// WRONG — { getByText } is destructured from a Promise, so it is undefined
const { getByText } = renderWithProviders(<LoginScreen />);

// CORRECT
const { getByText } = await renderWithProviders(<LoginScreen />);
```

### 8.2 `fireEvent` is async

`fireEvent.changeText`, `fireEvent.press`, and `fireEvent.scroll` are all `async` in RNTL v14. Each wraps the event handler in `act()` and returns a `Promise`. Not awaiting them causes two bugs:

1. **Overlapping `act()` warnings** — multiple concurrent `act()` calls produce React 19 errors.
2. **Stale `useCallback` closures** — state updates from `changeText` aren't committed before `press` fires. A `handleLogin` callback that closes over `email` and `password` would still see empty strings when `press` triggers it.

```tsx
// WRONG — press fires before changeText state updates commit
fireEvent.changeText(emailInput, 'user@example.com');
fireEvent.press(signInButton);

// CORRECT
await fireEvent.changeText(emailInput, 'user@example.com');
await fireEvent.changeText(passwordInput, 'password');
await fireEvent.press(signInButton);
```

### 8.3 No async queries inside `waitFor`

`findBy*` queries are themselves async (they internally call `waitFor`). Nesting them inside another `waitFor` creates a recursive polling loop that crashes after the component unmounts:

```tsx
// WRONG — findByText inside waitFor causes "Screen is no longer attached"
await waitFor(() => {
  expect(findByText('given')).toBeTruthy();
});

// CORRECT — use synchronous queryBy* inside waitFor
await waitFor(() => {
  expect(queryByLabelText('Mark Lisinopril as taken')).toBeNull();
});
```

### 8.4 Wait for async chains to fully settle

After pressing a button that triggers an async chain (login → API call → save token → update state), use a `findBy*` assertion that can only be true once the entire chain finishes:

```tsx
await fireEvent.press(signInButton);

// This resolves only after setIsLoading(false) — i.e., after the full login settled
await findByText('Sign In');
expect(queryByText(/invalid email or password/i)).toBeNull();
```

Using `waitFor(() => expect(...).toBeNull())` passes too early (the condition is true before the API call even starts) and leaves orphaned async work that bleeds into the next test.

---

## 9. Module Mocking Reference

| Module | Mock | Reason |
|---|---|---|
| `expo-router` | `useRouter: jest.fn()`, `Redirect: () => null` | No real navigator in test env; capture navigation calls |
| `expo-secure-store` | `getItemAsync → null`, `setItemAsync → void` | No native device storage; `null` token prevents cold-start `GET /auth/me` |

Both mocks are set per test file with `jest.mock()`. `beforeEach` calls `jest.clearAllMocks()` to reset call history, then re-applies `mockReturnValue` for `useRouter` so each test starts with a fresh mock router.

---

## 10. Relationship to Existing Unit Tests

The unit tests in `src/__tests__/` (component tests, API tests, validation tests) continue to work. Because `jest.env.js` sets `EXPO_PUBLIC_API_URL=http://localhost` for all test files, and `jest.setup.js` starts the MSW server, unit tests that call `api.*` methods now go through MSW rather than the in-process mock. The `src/__tests__/api.test.ts` file was updated to reflect this:

- Comment updated to reflect actual environment
- Error-handler assertion updated from the mock message (`"Invalid email or password."`) to the HTTP message (`expect.stringContaining("400")`)

All 132 tests pass (119 unit + 13 integration).
