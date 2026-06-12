# CareConnect Mobile — Technical Guide

## Stack

| Layer | Technology |
|---|---|
| Framework | React Native via Expo SDK 56 |
| Routing | Expo Router v56 (file-system based) |
| State management | React Context API + custom hooks |
| Language | TypeScript (strict mode) |
| Styling | React Native StyleSheet |
| Token storage | expo-secure-store |
| Platform targets | iOS, Android, Web |

---

## Repository Layout

```
CareConnect/
├── apps/
│   ├── mobile/               React Native / Expo (this guide)
│   ├── web/                  React + Vite web app
│   ├── desktop/              Electron + React desktop app
│   └── flutter-app/          Flutter alternative build
└── packages/
    └── shared/               Cross-platform shared utilities
```

Inside `apps/mobile/`:

```
apps/mobile/
├── src/                      Main source root (@/ alias)
│   ├── app/                  Expo Router screens (file-system routing)
│   ├── features/             Feature domains (context + models + components)
│   ├── shared/               Cross-feature infrastructure
│   ├── services/             API client, mock API, and validation
│   └── constants/            Design tokens, timings, shared styles
├── app.json
└── tsconfig.json             Path alias: "@/*" → "src/*"
```

---

## Path Alias

`tsconfig.json` maps `@/` to `src/`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

All imports use `@/` — never relative `../..` paths. This makes files movable without cascading import fixes.

---

## Routing

Expo Router maps the file system to URL routes. The `src/app/` folder is the route root.

```
app/
├── _layout.tsx                  Root layout — provider tree
├── index.tsx                    Redirects to (auth) or (tabs) based on auth state
│
├── (auth)/                      Auth route group (no tab bar)
│   ├── login.tsx
│   └── signup.tsx
│
└── (tabs)/                      Authenticated route group (tab bar visible)
    ├── _layout.tsx              Tab definitions and icons
    ├── index.tsx                Dashboard (Home tab)
    ├── symptoms.tsx             Symptom logger (Symptoms tab)
    │
    ├── appointments/
    │   ├── index.tsx            Appointment list
    │   ├── new.tsx              Book appointment form
    │   └── reschedule.tsx       Reschedule form
    │
    ├── medications/
    │   ├── index.tsx            Medication list by time slot
    │   └── new.tsx              Add medication form
    │
    └── profile/
        ├── index.tsx            Profile overview
        ├── edit.tsx             Edit profile form
        ├── accessibility.tsx    Accessibility settings
        ├── caretaker-notes.tsx  Caretaker notes with reply
        ├── emergency.tsx        Emergency contacts and SOS
        └── report.tsx           Care report
```

Screen files are intentionally thin — they compose context hooks and shared/feature components. No business logic lives in `app/`.

---

## Feature Domains

The codebase uses a **feature-based** structure. Each domain owns its state, data shape, and feature-specific UI in one folder under `src/features/`. Cross-feature infrastructure lives in `src/shared/`. Screens import from either layer.

Each feature folder contains:

| File | Purpose |
|---|---|
| `<name>-context.tsx` | React context + provider + typed hook (`useXxxContext()`) |
| `<name>.ts` | TypeScript model / interface |
| `components/` | Memoised UI components used only by this feature |

### Feature map

| Folder | Context hook | Model(s) | Feature component |
|---|---|---|---|
| `features/auth/` | `useAuthContext()` | `User` | — |
| `features/appointments/` | `useAppointmentContext()` | `Appointment` | `ApptCard` |
| `features/medications/` | `useMedicationContext()` | `Medication`, `DoseTimeSlot` | `MedCard` |
| `features/symptoms/` | `useSymptomContext()` | `SymptomLog` | — |
| `features/dashboard/` | `useDashboard()` (composite hook) | — | — |
| `features/profile/` | `useProfileContext()` | `Profile` | — |
| `features/emergency/` | `useEmergencyContext()` | `EmergencyContact` | — |
| `features/caretaker/` | `useCaretakerContext()` | `CaretakerNote` | — |
| `features/ai-assistant/` | `useAiAssistantContext()` | `ChatMessage` | `PeggyFab` |
| `features/accessibility/` | `useAccessibilityContext()` | `AccessibilitySettings` | — |

---

## Provider Tree

The root `_layout.tsx` mounts providers in dependency order:

```tsx
<AccessibilityProvider>          // outermost — scales all text and touch targets
  <AuthProvider>                 // gates routing; restores session from SecureStore
    <CareDataProvider>           // compound: Profile, Medication, Appointment,
                                 //           Symptom, Emergency, Caretaker
      <DashboardProvider>        // reads from CareData providers
        <AiAssistantProvider>    // independent
          <Stack />
        </AiAssistantProvider>
      </DashboardProvider>
    </CareDataProvider>
  </AuthProvider>
</AccessibilityProvider>
```

`CareDataProvider` (`shared/components/care-data-provider.tsx`) groups the six care-domain providers so `_layout.tsx` nests only five levels instead of ten.

---

## Authentication

`features/auth/auth-context.tsx` manages the full session lifecycle:

- **Boot** — reads a JWT from `expo-secure-store`; if found, calls `GET /auth/me` to restore the session.
- **Login / Signup** — POSTs credentials, receives `{ token, user }`, writes the token to `SecureStore` and to the in-memory singleton in `api.ts`.
- **Logout** — clears `SecureStore`, nulls the in-memory token, and resets user state.
- **Auto-logout** — `registerUnauthorizedHandler(logout)` ensures a 401 response from any request triggers a clean logout.

---

## API Client and Mock Layer

### `src/services/api.ts`

A thin `fetch` wrapper with four methods: `api.get`, `api.post`, `api.patch`, `api.delete`. All requests attach a `Bearer` token when one is set via `setAuthToken()`.

```ts
const USE_MOCK = !BASE_URL || BASE_URL.includes('example.com');
```

When `EXPO_PUBLIC_API_URL` is unset (or set to the placeholder `example.com`), all requests are routed through the mock layer instead of `fetch`.

### `src/services/mock-api.ts`

An in-memory implementation of every API endpoint. Exports `mockRequest(method, path, body)` which handles routing via string matching and regex for path parameters (e.g., `/medications/:id/taken`).

**Demo account credentials:**

| Field | Value |
|---|---|
| Email | demo@careconnect.com |
| Password | demo123 |

Signing up with any other credentials also succeeds and returns a session token — mock state is shared in-memory for the session.

**Pre-seeded demo data:**

- 3 medications: Metoprolol (8:00 AM, given), Lisinopril (12:00 PM, due now), Atorvastatin (9:00 PM, upcoming)
- 2 appointments: Dr. Sarah Chen today at 3:00 PM (in-person), Dr. Michael Torres next week (video)
- 2 symptom logs: Dizziness 3/10, Fatigue 4/10
- 2 emergency contacts: Sarah Johnson (daughter), Dr. Sarah Chen
- 2 caretaker notes from Maria (Day Nurse), one with an existing reply

**AI assistant (`/ai/chat`):** `aiReply()` returns context-aware canned responses based on keywords in the user's message (medication, appointment, symptom, blood pressure, emergency).

---

## State Management Patterns

Every context follows the same structure:

```tsx
// 1. Interface
interface MedicationState {
  medications: Medication[];
  byTimeSlot: (slot: DoseTimeSlot) => Medication[];
  markTaken: (id: string) => void;
}

// 2. Context + null-checked hook
const MedicationContext = createContext<MedicationState | null>(null);
export function useMedicationContext() {
  const ctx = useContext(MedicationContext);
  if (!ctx) throw new Error('useMedicationContext outside MedicationProvider');
  return ctx;
}

// 3. Provider
export function MedicationProvider({ children }) {
  const [medications, setMedications] = useState<Medication[]>([]);

  const givenDoses = useMemo(
    () => medications.filter((m) => m.status === 'given').length,
    [medications],
  );

  const markTaken = useCallback((id: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'given' } : m)),
    );
  }, []);

  const value = useMemo(
    () => ({ medications, givenDoses, markTaken }),
    [medications, givenDoses, markTaken],
  );

  return <MedicationContext.Provider value={value}>{children}</MedicationContext.Provider>;
}
```

Rules applied consistently across all 10 contexts:

- **`useMemo`** on every derived value (filtered lists, aggregates, computed booleans)
- **`useCallback`** on every mutation function
- **Memoised context value** so stable references propagate correctly
- **No dead state** — `isLoading` and `errorMessage` omitted from contexts that have no async operations

---

## Composite Hook: `useDashboard`

`features/dashboard/use-dashboard.ts` composes data from five contexts into a single object consumed by the dashboard screen:

```ts
export function useDashboard() {
  const { user } = useAuthContext();
  const { profile } = useProfileContext();
  const { givenDoses, totalDoses, medications } = useMedicationContext();
  const { todayAppointments } = useAppointmentContext();
  const { logs } = useSymptomContext();
  const { isLoading, refresh } = useDashboardContext();

  const nextMed = useMemo(
    () => medications.find((m) => m.status !== 'given'),
    [medications],
  );

  return {
    user,
    careeName: profile?.careeName ?? 'your loved one',
    givenDoses,
    totalDoses,
    todayAppointmentsCount: todayAppointments.length,
    logsCount: logs.length,
    nextMed,
    nextAppt: todayAppointments[0] ?? null,
    isLoading,
    refresh,
  };
}
```

This keeps the dashboard screen free of multi-context imports and makes the data shape testable in isolation.

---

## Shared Infrastructure

### `src/shared/components/`

| File | Purpose |
|---|---|
| `cc-text.tsx` | Typography primitive — reads `fontScale` from `AccessibilityContext` and multiplies it into `fontSize`. All text in the app renders through this component. |
| `app-button.tsx` | Primary / outline / danger / text button with loading state, double-press guard (600 ms), and `accessibilityState={{ busy, disabled }}`. |
| `app-text-field.tsx` | Labelled `TextInput` with optional obscure toggle. `accessibilityLabel` is set to the `label` prop automatically. |
| `care-data-provider.tsx` | Compound provider that nests all six care-domain providers. Keeps root `_layout.tsx` readable. |

### `src/shared/hooks/`

| File | Purpose |
|---|---|
| `use-accessible-colors.ts` | Returns the `CC` colour palette, overriding `textMuted` and `borderSubtle` when `highContrast` is active. Extracted from `theme.ts` to avoid a circular import with `accessibility-context`. |

### `src/constants/`

| File | Purpose |
|---|---|
| `theme.ts` | `CC` design-token object — all colour constants for the app |
| `shared-styles.ts` | `shared` StyleSheet — `safeArea`, `screenHeader`, `scrollContent`, `card`, `emptyState` — reused across every screen |
| `timings.ts` | `TIMINGS` object — named ms constants (`AUTH_DELAY_MS`, `AI_RESPONSE_MS`, `SAVED_BANNER_MS`) replacing magic numbers |

---

## Design Tokens (`CC` colour palette)

| Token | Hex | WCAG contrast on white | Usage |
|---|---|---|---|
| `primary` | `#2E5C8A` | 6.50:1 ✅ AA | Buttons, active states, links |
| `onPrimary` | `#FFFFFF` | 6.50:1 ✅ AA | Text on primary backgrounds |
| `text` | `#1A1A1A` | 17.37:1 ✅ AAA | Body text |
| `textMuted` | `#595959` | 6.85:1 ✅ AAA | Secondary text, labels |
| `error` | `#C85C5C` | 3.91:1 ✅ AA | Errors, danger actions, logout icon |
| `success` | `#4A7C59` | 4.56:1 ✅ AA | Success states, taken doses |
| `warning` | `#9E6E00` | 5.37:1 ✅ AA | Warning indicators, due-now states |
| `surface` | `#FFFFFF` | — | Card and input backgrounds |
| `bg` | `#F8F9FA` | — | Screen background |
| `borderSubtle` | `#E0E0E0` | — | Dividers, card borders |
| `borderStrong` | `#6B6B6B` | — | High-contrast borders, input fields |

All token pairs meet WCAG 2.1 AA (4.5:1 for normal text; 3:1 for large text and UI components).

---

## Accessibility Architecture

### WCAG 2.1 AA compliance

The app meets WCAG 2.1 AA across all screens. Key implementation points:

- All `TouchableOpacity` elements carry `accessibilityRole="button"` and `accessibilityLabel`.
- `AppTextField` sets `accessibilityLabel={label}` on the underlying `TextInput` automatically.
- `AppButton` exposes `accessibilityState={{ busy, disabled }}` so TalkBack announces loading and disabled states.
- Error messages use `accessibilityLiveRegion="assertive"` so they are announced immediately when they appear.
- Radio groups (e.g., medication time-slot selector) are wrapped in `accessibilityRole="radiogroup"`.
- Decorative emoji are marked `accessible={false}` to prevent screen readers from announcing them.
- Severity dots in the symptom logger use `accessibilityRole="radio"` with `accessibilityState={{ checked }}`.

### `CCText`

All visible text renders through `CCText` (`shared/components/cc-text.tsx`):

```tsx
export function CCText({ size, style, ...props }: CCTextProps) {
  const { settings } = useAccessibilityContext();
  return (
    <Text style={[style, { fontSize: Math.round(size * settings.fontScale) }]} {...props} />
  );
}
```

`fontScale` is driven by the text-size setting (1.0 = Standard, 1.25 = Large, 1.5 = Largest). Because it is read from context, changing the slider re-renders all text across all mounted screens simultaneously.

### High contrast

`use-accessible-colors.ts` returns the `CC` palette with two overrides when high contrast is active:

```ts
export function useAccessibleColors() {
  const { settings } = useAccessibilityContext();
  return {
    ...CC,
    textMuted: settings.highContrast ? CC.text : CC.textMuted,
    borderSubtle: settings.highContrast ? CC.borderStrong : CC.borderSubtle,
  };
}
```

### Touch target scaling

`useAccessibilityContext()` exposes `touchTarget` (pixels). Interactive elements read this and set `minHeight: touchTarget` to guarantee adequate tap area.

| Mode | Touch target | Button height | Tab bar height |
|---|---|---|---|
| Standard | 48 pt | 64 pt | 56 pt |
| Tremor mode | 60 pt | 72 pt | 64 pt |

---

## Performance Patterns

| Pattern | Where applied |
|---|---|
| `React.memo` | `MedCard`, `PeggyFab` sub-components (`ChatBubble`, `TypingDots`, `EmptyChat`), `NoteCard`, `ApptCard` |
| `useCallback` on render functions | All `FlatList` / `SectionList` `renderItem` props |
| `FlatList` / `SectionList` | Appointments (SectionList), Caretaker Notes (FlatList), Peggy chat (FlatList) — replaces `ScrollView + map` for virtualised rendering |
| `removeClippedSubviews` | All list components |
| `useMemo` on derived list sections | Appointments screen builds `sections` only when `todayAppointments` or `upcomingAppointments` change |

---

## Adding a New Feature

1. **Create the feature folder**

```
src/features/<name>/
  <name>-context.tsx    state + provider + hook
  <name>.ts             TypeScript model
  components/           (if the feature has its own UI components)
```

2. **Define the model** in `<name>.ts`.

3. **Write the context** — follow the pattern: state → derived `useMemo` → mutations `useCallback` → memoised value.

4. **Register the provider** — add it inside `CareDataProvider` (`shared/components/care-data-provider.tsx`) for a care-domain context, or directly in `_layout.tsx` if cross-cutting.

5. **Add mock API support** — add a route handler in `src/services/mock-api.ts`.

6. **Add the screen** — create `src/app/(tabs)/<name>/index.tsx`. Import from `@/features/<name>/` and `@/shared/components/`.

7. **Wire the real API call** — add a method to `src/services/api.ts` and call it from the context once a backend endpoint exists.

8. **Type check** — run `npx tsc --noEmit` before committing.

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `EXPO_PUBLIC_API_URL` | Base URL for the API client in `services/api.ts`. When unset or set to `example.com`, the mock layer activates automatically. |

Set in `.env.local` (excluded from git by `.gitignore`). The `EXPO_PUBLIC_` prefix makes the value available at runtime in Expo.

---

## Development Scripts

```bash
# Start development server (LAN, for device/emulator testing)
npx expo start --lan

# Start for web browser
npx expo start --web

# TypeScript type check (no emit)
npx tsc --noEmit

# Build for production (EAS)
eas build --platform all
```

### Running on Android emulator

```powershell
# Set AVD home and start emulator
$env:ANDROID_AVD_HOME = "$env:USERPROFILE\.android\avd"
emulator -avd Pixel_5

# Verify device is connected
adb devices

# Start Metro on alternate port if 8081 is in use
npx expo start --port 8082
```

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Stable production branch — PRs merged here after review |
| `fix/*` | Bug fixes |
| `feat/*` | New features |
| `chore/*` | Maintenance, dependency updates, refactors |

All feature and fix branches are created from `main` and merged back via pull request.
