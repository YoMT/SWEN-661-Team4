$outPath = "C:\Training\figmaProject\CareConnect\Documentation\CareConnect_RN_vs_Flutter_Comparison.docx"

$NAVY    = 32  + 56*256  + 100*65536
$BLUE    = 68  + 114*256 + 196*65536
$MIDBLUE = 46  + 117*256 + 182*65536
$WHITE   = 255 + 255*256 + 255*65536
$LGRAY   = 242 + 242*256 + 242*65536

$wdAlignParaCenter = 1
$wdAlignParaLeft   = 0
$wdStory           = 6

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc  = $word.Documents.Add()
$sel  = $word.Selection

function Set-Font($name, $size, $bold=$false, $italic=$false, $color=-1) {
    $sel.Font.Name   = $name
    $sel.Font.Size   = $size
    $sel.Font.Bold   = if ($bold)   { 1 } else { 0 }
    $sel.Font.Italic = if ($italic) { 1 } else { 0 }
    if ($color -ge 0) { $sel.Font.Color = $color }
}

function Heading1([string]$text) {
    $sel.EndKey($wdStory, 0) | Out-Null
    $sel.ParagraphFormat.SpaceBefore = 14
    $sel.ParagraphFormat.SpaceAfter  = 6
    $sel.ParagraphFormat.Alignment   = $wdAlignParaLeft
    Set-Font "Calibri" 16 $true $false $WHITE
    $sel.Shading.BackgroundPatternColor = $NAVY
    $sel.TypeText("  " + $text)
    $sel.TypeParagraph()
    $sel.Shading.BackgroundPatternColor = -16777216
    Set-Font "Calibri" 11 $false $false 0
    $sel.ParagraphFormat.SpaceBefore = 0
    $sel.ParagraphFormat.SpaceAfter  = 8
}

function Heading2([string]$text) {
    $sel.EndKey($wdStory, 0) | Out-Null
    $sel.ParagraphFormat.SpaceBefore = 10
    $sel.ParagraphFormat.SpaceAfter  = 4
    $sel.ParagraphFormat.Alignment   = $wdAlignParaLeft
    Set-Font "Calibri" 13 $true $false $BLUE
    $sel.TypeText($text)
    $sel.TypeParagraph()
    Set-Font "Calibri" 11 $false $false 0
    $sel.ParagraphFormat.SpaceBefore = 0
    $sel.ParagraphFormat.SpaceAfter  = 6
}

function Body([string]$text) {
    $sel.EndKey($wdStory, 0) | Out-Null
    Set-Font "Calibri" 11 $false $false 0
    $sel.ParagraphFormat.Alignment   = $wdAlignParaLeft
    $sel.ParagraphFormat.SpaceBefore = 0
    $sel.ParagraphFormat.SpaceAfter  = 4
    $sel.ParagraphFormat.LeftIndent  = 0
    $sel.TypeText($text)
    $sel.TypeParagraph()
}

function Bullet([string]$text) {
    $sel.EndKey($wdStory, 0) | Out-Null
    Set-Font "Calibri" 11 $false $false 0
    $sel.ParagraphFormat.Alignment       = $wdAlignParaLeft
    $sel.ParagraphFormat.SpaceBefore     = 0
    $sel.ParagraphFormat.SpaceAfter      = 3
    $sel.ParagraphFormat.LeftIndent      = 18
    $sel.ParagraphFormat.FirstLineIndent = -18
    $sel.TypeText([char]0x2022 + "  " + $text)
    $sel.TypeParagraph()
    $sel.ParagraphFormat.LeftIndent      = 0
    $sel.ParagraphFormat.FirstLineIndent = 0
}

function BlankLine() {
    $sel.EndKey($wdStory, 0) | Out-Null
    $sel.ParagraphFormat.SpaceBefore = 0
    $sel.ParagraphFormat.SpaceAfter  = 0
    $sel.TypeParagraph()
}

function Add2Col([string[]]$headers, [array]$rows) {
    $sel.EndKey($wdStory, 0) | Out-Null
    $rng = $sel.Range
    $tbl = $doc.Tables.Add($rng, $rows.Count + 1, 2)
    $tbl.Style = "Medium Shading 1 - Accent 1"
    $tbl.Columns(1).Width = 200
    $tbl.Columns(2).Width = 270
    $tbl.Cell(1,1).Range.Text = $headers[0]
    $tbl.Cell(1,2).Range.Text = $headers[1]
    foreach ($c in 1..2) {
        $tbl.Cell(1,$c).Range.Font.Bold  = 1
        $tbl.Cell(1,$c).Range.Font.Color = $WHITE
        $tbl.Cell(1,$c).Shading.BackgroundPatternColor = $NAVY
    }
    for ($i = 0; $i -lt $rows.Count; $i++) {
        $tbl.Cell($i+2, 1).Range.Text = $rows[$i][0]
        $tbl.Cell($i+2, 2).Range.Text = $rows[$i][1]
        if (($i % 2) -eq 0) {
            $tbl.Cell($i+2,1).Shading.BackgroundPatternColor = $LGRAY
            $tbl.Cell($i+2,2).Shading.BackgroundPatternColor = $LGRAY
        }
    }
    $tbl.Rows.AllowBreakAcrossPages = 0
    $word.Selection.EndKey($wdStory, 0) | Out-Null
    $sel.TypeParagraph()
}

function Add3Col([string[]]$headers, [array]$rows) {
    $sel.EndKey($wdStory, 0) | Out-Null
    $rng = $sel.Range
    $tbl = $doc.Tables.Add($rng, $rows.Count + 1, 3)
    $tbl.Style = "Medium Shading 1 - Accent 1"
    $tbl.Columns(1).Width = 140
    $tbl.Columns(2).Width = 165
    $tbl.Columns(3).Width = 165
    foreach ($c in 1..3) {
        $tbl.Cell(1,$c).Range.Text = $headers[$c-1]
        $tbl.Cell(1,$c).Range.Font.Bold  = 1
        $tbl.Cell(1,$c).Range.Font.Color = $WHITE
        $tbl.Cell(1,$c).Shading.BackgroundPatternColor = $NAVY
    }
    for ($i = 0; $i -lt $rows.Count; $i++) {
        foreach ($c in 1..3) {
            $tbl.Cell($i+2, $c).Range.Text = $rows[$i][$c-1]
        }
        if (($i % 2) -eq 0) {
            foreach ($c in 1..3) {
                $tbl.Cell($i+2,$c).Shading.BackgroundPatternColor = $LGRAY
            }
        }
    }
    $tbl.Rows.AllowBreakAcrossPages = 0
    $word.Selection.EndKey($wdStory, 0) | Out-Null
    $sel.TypeParagraph()
}

# ── TITLE PAGE ───────────────────────────────────────────────────────────────
$sel.ParagraphFormat.SpaceBefore = 60
$sel.ParagraphFormat.SpaceAfter  = 0
$sel.ParagraphFormat.Alignment   = $wdAlignParaCenter
Set-Font "Calibri" 28 $true $false $NAVY
$sel.TypeText("CareConnect")
$sel.TypeParagraph()
$sel.ParagraphFormat.SpaceBefore = 6
Set-Font "Calibri" 20 $false $false $MIDBLUE
$sel.TypeText("React Native vs Flutter")
$sel.TypeParagraph()
$sel.ParagraphFormat.SpaceBefore = 4
Set-Font "Calibri" 14 $false $false $BLUE
$sel.TypeText("Developer Experience Comparison")
$sel.TypeParagraph()
$sel.ParagraphFormat.SpaceBefore = 20
Set-Font "Calibri" 11 $false $false 0
$sel.TypeText("Prepared for: Yoseph Tesfay")
$sel.TypeParagraph()
$sel.ParagraphFormat.SpaceBefore = 2
$sel.TypeText("Date: June 2026")
$sel.TypeParagraph()
$sel.TypeText("Project: CareConnect Monorepo  |  apps/mobile/ vs apps/flutter-app/")
$sel.TypeParagraph()
$sel.ParagraphFormat.SpaceBefore = 0
$sel.ParagraphFormat.SpaceAfter  = 8
$sel.ParagraphFormat.Alignment   = $wdAlignParaLeft
$sel.InsertBreak(7)

# ── 1. EXECUTIVE SUMMARY ─────────────────────────────────────────────────────
Heading1 "1. Executive Summary"
Body "This report compares the developer experience of two parallel mobile implementations of the CareConnect healthcare application hosted in the same monorepo. Both apps implement identical feature domains: medication tracking, health metrics, appointments, AI assistant (Peggy), caregiver notifications, and WCAG 2.1 AA accessibility."
BlankLine
Body "React Native (apps/mobile/) uses TypeScript, Expo SDK 56, and a file-based routing model. It has a mature test suite with 119 tests and 94.84% statement coverage, supported by Jest and React Native Testing Library. JUnit XML and lcov artefacts are CI-ready."
BlankLine
Body "Flutter (apps/flutter-app/) uses Dart 3.12.1+, GoRouter, and the Provider pattern. It is strikingly lean -- only 3 production dependencies -- and leverages Dart's sound null-safe type system with sub-second hot reload."
BlankLine
Body "Key findings: Flutter offers a more self-contained toolchain with a minimal dependency footprint and faster hot reload. React Native offers a richer JavaScript ecosystem, higher observed test coverage, and OTA update capability via Expo. Both implementations are architecturally sound and feature-complete."

# ── 2. PROJECT OVERVIEW ──────────────────────────────────────────────────────
Heading1 "2. Project Overview"
Body "The CareConnect monorepo contains four app targets. Only the two mobile apps are fully implemented:"
Bullet "apps/mobile/         -- React Native / Expo (production-ready)"
Bullet "apps/flutter-app/    -- Flutter (production-ready)"
Bullet "apps/web/            -- React + Vite (placeholder)"
Bullet "apps/desktop/        -- Electron + React (placeholder)"
BlankLine
Body "Both mobile apps implement the same 11 feature domains:"

$f = @(
    @("Authentication",  "Login, register, biometric unlock"),
    @("Medications",     "Schedule, reminders, history, adherence tracking"),
    @("Health Metrics",  "Blood pressure, glucose, weight, mood logging"),
    @("Appointments",    "Calendar view, upcoming list, notifications"),
    @("AI Assistant",    "Peggy chatbot with context-aware health responses"),
    @("Caregiver",       "Family member roles, shared activity feed"),
    @("Notifications",   "Push alerts and in-app toasts"),
    @("Profile",         "User settings, preferences, logout"),
    @("Dashboard",       "Aggregated home screen with quick actions"),
    @("Onboarding",      "First-run walkthrough screens"),
    @("Accessibility",   "WCAG 2.1 AA compliance across all screens")
)
Add2Col @("Feature Domain", "Description") $f

# ── 3. LANGUAGE & TOOLING ────────────────────────────────────────────────────
Heading1 "3. Language & Tooling"

Heading2 "3.1 TypeScript (React Native)"
Body "React Native uses TypeScript 6.0.3. TypeScript adds structural typing over JavaScript; the runtime is Hermes, a JS engine optimised for React Native. Type errors surface at build time in the editor but are erased at runtime. The @/ path alias maps to src/ for clean imports."
Bullet "Transpiled: TypeScript -> JavaScript via Metro bundler"
Bullet "Runtime: Hermes JS engine (AOT bytecode on release builds)"
Bullet "Toolchain: Node 20+, pnpm, Metro, Expo CLI"
Bullet "Linting: expo lint (ESLint under the hood)"

Heading2 "3.2 Dart (Flutter)"
Body "Flutter uses Dart 3.12.1+ with sound null safety. Dart is compiled: AOT to native ARM/x64 binaries for release, JIT for debug/hot-reload. Null safety is enforced at compile time. flutter_lints and analysis_options.yaml enforce consistent code style."
Bullet "Compiled: Dart AOT -> native binary (release), JIT (debug)"
Bullet "Runtime: Dart VM in debug; native executable in release"
Bullet "Toolchain: Flutter SDK, pub package manager, flutter CLI"
Bullet "Linting: flutter_lints ruleset via analysis_options.yaml"

$langRows = @(
    @("Language",        "TypeScript 6.0.3",                     "Dart 3.12.1+"),
    @("Type System",     "Structural, erasure at runtime",        "Nominal, sound null safety"),
    @("Runtime",         "Hermes JS engine",                      "Dart VM / native binary"),
    @("Null Safety",     "Optional (strict: true in tsconfig)",   "Enforced at compile time"),
    @("IDE Support",     "VS Code + TypeScript LSP",              "VS Code / Android Studio + Dart LSP"),
    @("Linting",         "ESLint via expo lint",                  "flutter_lints + analysis_options.yaml"),
    @("Package Manager", "pnpm (workspace root)",                 "pub (pubspec.yaml)"),
    @("Build Tool",      "Metro bundler + Expo CLI",              "Flutter CLI (flutter build)")
)
Add3Col @("Aspect", "React Native", "Flutter") $langRows

# ── 4. DEPENDENCIES ──────────────────────────────────────────────────────────
Heading1 "4. Project Setup & Dependencies"

Heading2 "4.1 React Native -- 28 Production Dependencies"
Body "Expo SDK splits platform capabilities into individual packages (expo-font, expo-secure-store, expo-splash-screen, etc.). This gives fine-grained version control but results in a large node_modules tree and a lengthy pnpm-lock.yaml."

$rnDeps = @(
    @("Core Framework",  "react-native 0.85.3, react 19.2.3"),
    @("Expo Platform",   "expo 56.0.9, expo-router 56.2.9, plus 11 expo-* packages"),
    @("UI / Animation",  "react-native-reanimated 4.3.1, react-native-gesture-handler 2.31.1"),
    @("Layout / Safety", "react-native-safe-area-context 5.7.0, react-native-screens 4.25.2"),
    @("Web Support",     "react-native-web 0.21.0, react-dom 19.2.3"),
    @("Dev / Testing",   "jest 29, jest-expo, RNTL v14, TypeScript 6, jest-junit 17")
)
Add2Col @("Category", "Packages") $rnDeps

Heading2 "4.2 Flutter -- 3 Production Dependencies"
Body "Flutter's SDK ships batteries-included: navigation primitives, animation engine, Material/Cupertino widgets, HTTP client, local storage, and the test framework are all built-in. Only 3 third-party packages are needed."

$flDeps = @(
    @("State Management", "provider: ^6.1.2"),
    @("Navigation",       "go_router: ^14.3.0"),
    @("Platform Icons",   "cupertino_icons: ^1.0.8"),
    @("Testing (dev)",    "mocktail: ^1.0.4  (flutter_test is SDK built-in)"),
    @("Linting (dev)",    "flutter_lints: ^5.0.0"),
    @("SDK Built-ins",    "HTTP, animations, Material widgets, SafeArea, SecureStorage, etc.")
)
Add2Col @("Category", "Package") $flDeps

$setupRows = @(
    @("Production deps",  "28",                            "3"),
    @("Dev deps",         "8",                             "2 (plus SDK)"),
    @("Setup command",    "pnpm install",                  "flutter pub get"),
    @("Lock file size",   "pnpm-lock.yaml (~2000 lines)",  "pubspec.lock (~120 lines)"),
    @("Install time",     "45-90 seconds (clean)",         "10-20 seconds (clean)"),
    @("Environment req.", "Node 20+, pnpm, Expo Go / EAS", "Flutter SDK, Android Studio / Xcode")
)
Add3Col @("Aspect", "React Native", "Flutter") $setupRows

# ── 5. NAVIGATION ────────────────────────────────────────────────────────────
Heading1 "5. Navigation"

Heading2 "5.1 Expo Router -- File-Based Routing"
Body "Expo Router maps the file system to routes. Every .tsx file inside apps/mobile/src/app/ becomes a navigable route. Layout files (_layout.tsx) wrap screen groups. The app has 24 route files organised across 4 groups: (auth), (tabs), (caregiver), and (onboarding)."
Bullet "Route definition: create a file -- no manual registration required"
Bullet "Dynamic routes: [id].tsx, [medicationId].tsx"
Bullet "Tab groups: (auth)/_layout.tsx, (tabs)/_layout.tsx, etc."
Bullet "Navigation API: router.push(), useRouter(), useLocalSearchParams()"
Bullet "Deep linking: expo-linking plus expo-router Link component"

Heading2 "5.2 GoRouter -- Declarative Routing"
Body "The Flutter app defines all 18 screens as named GoRoute entries in a single AppRouter class. Route guards use redirect callbacks. A ShellRoute wraps tab screens for persistent bottom navigation."
Bullet "Route definition: explicit GoRoute entries in router.dart"
Bullet "Named navigation: context.pushNamed('medications')"
Bullet "Guards: redirect callback per GoRoute"
Bullet "Parameters: GoRouterState.pathParameters and queryParameters"
Bullet "Tab persistence: ShellRoute with nested GoRoute entries"

$navRows = @(
    @("Approach",          "File-system based (convention)",      "Code-based (explicit config)"),
    @("Route registration","Automatic (create file)",             "Manual (add GoRoute entry)"),
    @("Route count",       "24 route files",                     "18 named GoRoute entries"),
    @("Dynamic routes",    "[id].tsx, [medicationId].tsx",        "/:id path parameters"),
    @("Guards",            "Middleware in _layout.tsx",           "redirect callback on GoRoute"),
    @("Navigation API",    "router.push(), useRouter()",          "context.go(), context.push()"),
    @("Deep linking",      "expo-linking (built-in)",             "GoRouter path matching"),
    @("Learning curve",    "Low (file = route)",                  "Medium (explicit DSL)")
)
Add3Col @("Aspect", "React Native (Expo Router)", "Flutter (GoRouter)") $navRows

# ── 6. STATE MANAGEMENT ──────────────────────────────────────────────────────
Heading1 "6. State Management"

Heading2 "6.1 React Context API"
Body "The React Native app composes 7 React Context providers in the root _layout.tsx. Each feature domain owns its context: AuthContext, MedicationsContext, HealthMetricsContext, AppointmentsContext, AiAssistantContext, CaregiversContext, NotificationsContext. Components consume state via custom hooks."
Bullet "Provider composition: nested JSX wrappers in _layout.tsx"
Bullet "State access: const { medications } = useMedicationsContext()"
Bullet "Side effects: useEffect for async data loading inside providers"
Bullet "Persistence: expo-secure-store for auth tokens, async-storage for prefs"

Heading2 "6.2 Provider Pattern (ChangeNotifier)"
Body "The Flutter app registers 10 ChangeNotifierProvider instances in a MultiProvider at app root. Each ChangeNotifier holds mutable state and calls notifyListeners() to rebuild dependents. Consumers use context.watch or Consumer widgets."
Bullet "Provider registration: MultiProvider list in main.dart"
Bullet "State access: context.watch<MedicationsProvider>().medications"
Bullet "Side effects: async method on ChangeNotifier + notifyListeners()"
Bullet "Persistence: flutter_secure_storage (auth), SharedPreferences (settings)"

$stateRows = @(
    @("Pattern",         "React Context + useContext hooks",       "Provider + ChangeNotifier"),
    @("Provider count",  "7 context providers",                    "10 ChangeNotifierProviders"),
    @("Composition",     "Nested JSX in _layout.tsx",              "MultiProvider list at app root"),
    @("State access",    "useContext(MedContext)",                  "context.watch<MedProvider>()"),
    @("Rebuild scope",   "All consumers of context re-render",     "Only Consumer / watch widgets"),
    @("Async handling",  "useEffect + useState",                   "async method + notifyListeners()"),
    @("Boilerplate",     "Low (hooks reduce ceremony)",            "Medium (class + notifyListeners)"),
    @("Granularity",     "Re-renders full context subtree",        "context.select() for fine control")
)
Add3Col @("Aspect", "React Native", "Flutter") $stateRows

# ── 7. COMPONENT / WIDGET MODEL ──────────────────────────────────────────────
Heading1 "7. Component / Widget Model"

Heading2 "7.1 React Native -- JSX + StyleSheet"
Body "React Native components are TypeScript functions returning JSX. Layout uses Flexbox via StyleSheet.create(). A centralized theme file (constants/theme.ts) exposes CC.primary, CC.bg, CC.text etc. Custom reusable components live in src/components/ui/."
Bullet "Function components: export function MedCard({ med }: { med: Medication })"
Bullet "Styling: StyleSheet.create() -- scoped JS objects resolved at runtime"
Bullet "Platform branching: Platform.select({ ios: ..., android: ..., web: ... })"
Bullet "Animations: react-native-reanimated 4.x (worklets, shared values)"
Bullet "Icons: expo-symbols (SF Symbols on iOS, Material Icons on Android)"

Heading2 "7.2 Flutter -- Widget Tree + Theme"
Body "Flutter widgets are Dart classes overriding build(). Everything -- layout, styling, interaction -- is expressed as composable widget trees. ThemeData is defined once and inherited automatically via MaterialApp. Shared widgets live in lib/shared/widgets/."
Bullet "Widget classes: class MedCard extends StatelessWidget"
Bullet "Styling: ThemeData + BoxDecoration (inherited automatically)"
Bullet "Platform branching: Platform.isIOS ? CupertinoWidget() : MaterialWidget()"
Bullet "Animations: AnimationController + Tween (SDK built-in)"
Bullet "Icons: Icons.* (Material) or CupertinoIcons.* (iOS style)"

$compRows = @(
    @("UI primitive",    "JSX + View / Text / Pressable",         "Widget tree + Scaffold / Column / Text"),
    @("Styling",         "StyleSheet.create() (JS objects)",       "ThemeData + BoxDecoration"),
    @("Layout engine",   "Flexbox (Yoga)",                        "Flutter RenderObject (constrained)"),
    @("Source files",    "86 TSX/TS files",                       "88 Dart files"),
    @("Reusable UI",     "src/components/ui/",                    "lib/shared/widgets/"),
    @("Theming",         "constants/theme.ts (CC.*)",             "MaterialApp ThemeData"),
    @("Animation",       "react-native-reanimated (external dep)", "AnimationController (SDK built-in)"),
    @("Hot reload",      "Metro fast refresh (~1-3 seconds)",     "Flutter hot reload (< 1 second)")
)
Add3Col @("Aspect", "React Native", "Flutter") $compRows

# ── 8. TESTING ───────────────────────────────────────────────────────────────
Heading1 "8. Testing"

Heading2 "8.1 React Native -- Jest + RNTL"
Body "The React Native app uses Jest 29 with jest-expo preset and React Native Testing Library v14. Tests are split by file extension: .test.ts (unit) and .test.tsx (component). jest-junit produces JUnit XML for CI. Istanbul collects coverage reported as lcov, clover, and HTML."
Bullet "Unit tests (.test.ts): 4 suites, 88 tests -- services, context, utilities"
Bullet "Component tests (.test.tsx): 5 suites, 31 tests -- render, interaction, a11y"
Bullet "Total: 9 test files, 119 tests, all passing"
Bullet "Coverage: 94.84% statements | 87.5% branches | 94.44% functions | 94.84% lines"
Bullet "CI artefacts: coverage/junit.xml, coverage/lcov.info, coverage/clover.xml, coverage/index.html"
Bullet "Run command: pnpm test  (alias for: jest --coverage)"

Heading2 "8.2 Flutter -- flutter_test + mocktail"
Body "The Flutter app uses flutter_test (SDK built-in) and mocktail for mock objects. Tests are organised in unit/ and widget/ directories per feature. flutter test discovers and runs all *_test.dart files automatically."
Bullet "Unit tests: provider, service, and model tests per feature domain"
Bullet "Widget tests: screen-level widget tree rendering and interaction"
Bullet "Total: 21 test files"
Bullet "Coverage: flutter test --coverage -> coverage/lcov.info"
Bullet "CI artefacts: coverage/lcov.info (no JUnit XML by default)"
Bullet "Run command: flutter test  (in apps/flutter-app/)"

$testRows = @(
    @("Test framework",  "Jest 29 + jest-expo",                  "flutter_test (SDK built-in)"),
    @("Component tests", "RNTL v14 (render, fireEvent, act)",    "WidgetTester (pumpWidget, tap, pump)"),
    @("Mocking",         "jest.fn(), jest.mock()",                "mocktail (when / verify)"),
    @("Test files",      "9 test files",                         "21 test files"),
    @("Test count",      "119 (88 unit + 31 component)",         "Not counted (21 files)"),
    @("Statement cov.",  "94.84%",                               "Via lcov (not measured here)"),
    @("Coverage output", "lcov + clover.xml + HTML",             "lcov.info only"),
    @("CI reporting",    "junit.xml via jest-junit",             "No JUnit XML by default"),
    @("Async testing",   "async render(), waitFor()",            "async tester.pump() + await"),
    @("Run command",     "pnpm test (in apps/mobile/)",          "flutter test (in apps/flutter-app/)")
)
Add3Col @("Aspect", "React Native", "Flutter") $testRows

# ── 9. HOT RELOAD & DEV WORKFLOW ─────────────────────────────────────────────
Heading1 "9. Hot Reload & Dev Workflow"

Heading2 "9.1 React Native -- Metro + Expo Go"
Body "React Native development uses the Metro bundler. Expo Go loads the JavaScript bundle from the Metro server over the local network. Hot reload triggers on file save and re-runs the changed module. Fast Refresh preserves component state when only render logic changes."
Bullet "Start: expo start  (or pnpm android / pnpm ios)"
Bullet "Hot refresh: ~1-3 seconds"
Bullet "Full reload: shake device -> Reload JS, or press r in terminal"
Bullet "Emulator: Android AVD requires  adb reverse tcp:8081 tcp:8081"
Bullet "Debugging: Flipper, React DevTools, Chrome DevTools (remote JS)"
Bullet "OTA updates: Expo OTA / EAS Update (over-the-air JS bundle push)"

Heading2 "9.2 Flutter -- Dart Engine Hot Reload"
Body "Flutter's hot reload is widely regarded as the fastest in mobile development. Dart's incremental JIT compiler applies only the changed class to the running app in under 1 second, preserving widget state. No JavaScript bridge or port forwarding is required."
Bullet "Start: flutter run"
Bullet "Hot reload: press r in terminal  (< 1 second, state preserved)"
Bullet "Hot restart: press R  (resets state, re-runs main)"
Bullet "No port forwarding needed -- Flutter talks to device directly"
Bullet "Debugging: Dart DevTools (widget inspector, timeline, memory)"

$devRows = @(
    @("Dev start",       "expo start / pnpm android",             "flutter run"),
    @("Hot reload speed","~1-3 seconds (Metro fast refresh)",     "< 1 second (Dart JIT incremental)"),
    @("State preserved", "Yes (Fast Refresh for render changes)", "Yes (hot reload)"),
    @("Port forwarding", "adb reverse required for Android AVD",  "Not required"),
    @("Debugger",        "Flipper + Chrome DevTools",             "Dart DevTools (built-in)"),
    @("Widget inspector","React DevTools (external setup)",        "Flutter Inspector (built-in)"),
    @("OTA updates",     "Expo OTA / EAS Update",                 "Not supported natively"),
    @("First build",     "Fast (JS bundle only)",                 "Slower (Dart AOT compile)")
)
Add3Col @("Aspect", "React Native", "Flutter") $devRows

# ── 10. CROSS-PLATFORM ───────────────────────────────────────────────────────
Heading1 "10. Cross-Platform Support"

Heading2 "10.1 React Native / Expo"
Body "Expo SDK 56 targets iOS, Android, and Web from a single codebase. Web is handled via react-native-web. Desktop is a separate Electron app in apps/desktop/. Not all native React Native components have exact web equivalents, which can cause minor rendering differences on web."

Heading2 "10.2 Flutter"
Body "Flutter supports iOS, Android, Web, macOS, Windows, and Linux from the same Dart codebase using a single rendering engine (Skia/Impeller). The CareConnect Flutter app currently targets mobile only, but adding desktop requires only pubspec and platform configuration changes."

$platRows = @(
    @("iOS",             "Yes (Expo Go / EAS Build)",             "Yes (flutter build ios)"),
    @("Android",         "Yes (Expo Go / EAS Build)",             "Yes (flutter build apk / aab)"),
    @("Web",             "Yes (react-native-web)",                "Yes (flutter build web)"),
    @("macOS",           "Via Electron (apps/desktop/)",          "Yes (flutter build macos)"),
    @("Windows",         "Via Electron (apps/desktop/)",          "Yes (flutter build windows)"),
    @("Linux",           "Not supported",                         "Yes (flutter build linux)"),
    @("Rendering",       "Native UIKit/Views per platform",       "Skia/Impeller (own canvas)"),
    @("Look & feel",     "Matches platform natively",             "Material/Cupertino emulated")
)
Add3Col @("Aspect", "React Native", "Flutter") $platRows

# ── 11. METRICS SUMMARY ──────────────────────────────────────────────────────
Heading1 "11. Side-by-Side Metrics Summary"

$mRows = @(
    @("Language",              "TypeScript 6.0.3",                   "Dart 3.12.1+"),
    @("Framework version",     "React Native 0.85.3 + Expo SDK 56",  "Flutter stable channel"),
    @("Source files",          "86 TS/TSX files",                    "88 Dart files"),
    @("Route / screen files",  "24 route files",                     "18 screen files"),
    @("Feature domains",       "11",                                 "11"),
    @("Production deps",       "28",                                 "3"),
    @("Dev deps",              "8",                                  "2 (plus SDK built-ins)"),
    @("State providers",       "7 React Context providers",           "10 ChangeNotifierProviders"),
    @("Test files",            "9 test files",                       "21 test files"),
    @("Total tests",           "119 (88 unit + 31 component)",       "Not counted (21 files)"),
    @("Statement coverage",    "94.84%",                             "Not measured this session"),
    @("Test runner",           "Jest 29 + jest-expo",                "flutter_test (SDK)"),
    @("Navigation",            "Expo Router file-based, 24 routes",  "GoRouter declarative, 18 routes"),
    @("Hot reload speed",      "~1-3 seconds",                       "< 1 second"),
    @("Platforms supported",   "iOS, Android, Web",                  "iOS, Android, Web, macOS, Win, Linux")
)
Add3Col @("Metric", "React Native", "Flutter") $mRows

# ── 12. CONCLUSION ───────────────────────────────────────────────────────────
Heading1 "12. Conclusion & Recommendation"

Heading2 "12.1 Where React Native Excels"
Bullet "JavaScript/TypeScript ecosystem: vast npm library selection, familiar to web developers"
Bullet "Expo toolchain: OTA updates, EAS Build, no Xcode/Android Studio required for basic dev"
Bullet "Test coverage: 94.84% statement coverage with rich CI artefacts (JUnit XML, lcov, HTML)"
Bullet "File-based routing: Expo Router is intuitive and self-documenting (file = route)"
Bullet "Web target: react-native-web enables a shared mobile/web codebase"

Heading2 "12.2 Where Flutter Excels"
Bullet "Minimal dependencies: only 3 packages -- less supply-chain risk, faster installs"
Bullet "Hot reload speed: sub-second reloads dramatically accelerate UI iteration cycles"
Bullet "Sound type system: Dart null safety enforced at compile time, fewer runtime null crashes"
Bullet "Built-in tooling: Dart DevTools, widget inspector, timeline profiler -- zero external setup"
Bullet "Desktop targets: macOS, Windows, and Linux natively without a separate Electron app"
Bullet "Consistent rendering: Skia/Impeller ensures pixel-perfect consistency across platforms"

Heading2 "12.3 Recommendation"
Body "For the CareConnect project specifically:"
Bullet "Strong web/JS team: React Native + Expo is the faster onramp. The test suite and CI pipeline are already production-ready."
Bullet "Long-lived production app: Flutter's sound type system, sub-second hot reload, and 3-dependency footprint reduce long-term maintenance overhead."
Bullet "Cross-platform desktop expansion: Flutter is the clear choice -- React Native requires a separate Electron app."
Bullet "Both implementations are architecturally sound and feature-complete. The choice is primarily team familiarity and target platforms."

BlankLine
$sel.EndKey($wdStory, 0) | Out-Null
$sel.ParagraphFormat.SpaceBefore = 20
$sel.ParagraphFormat.SpaceAfter  = 0
$sel.ParagraphFormat.Alignment   = $wdAlignParaCenter
Set-Font "Calibri" 9 $false $true $NAVY
$sel.TypeText("CareConnect  |  Confidential  |  June 2026  |  Generated from live codebase analysis")
$sel.TypeParagraph()
$sel.ParagraphFormat.Alignment = $wdAlignParaLeft

# ── SAVE ─────────────────────────────────────────────────────────────────────
try {
    $doc.SaveAs2($outPath, 16)
    Write-Host "SAVED: $outPath"
    $pages = ($doc.BuiltInDocumentProperties | Where-Object { $_.Name -eq "Number of Pages" }).Value
    Write-Host "Pages:      $pages"
    Write-Host "Tables:     $($doc.Tables.Count)"
    Write-Host "Paragraphs: $($doc.Paragraphs.Count)"
} catch {
    Write-Host "ERROR: $_"
} finally {
    $doc.Close($false)
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
