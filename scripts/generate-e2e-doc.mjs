/**
 * Generates CareConnect E2E Testing DOCX — plan, execution, and how-to guide.
 * Run: node scripts/generate-e2e-doc.mjs
 * Output: apps/mobile/docs/e2e-testing.docx
 */

import {
  Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
  TableLayoutType, PageBreak,
  convertInchesToTwip,
} from 'docx';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR  = join(__dirname, '..', 'apps', 'mobile', 'docs');
const OUT_FILE = join(OUT_DIR, 'e2e-testing.docx');

mkdirSync(OUT_DIR, { recursive: true });

// ─── Colour palette ──────────────────────────────────────────────────────────
const C = {
  blue:      '208AEF',
  darkBlue:  '1565C0',
  navy:      '0D3B6E',
  white:     'FFFFFF',
  lightGray: 'F4F7FC',
  medGray:   'C9D4E8',
  darkGray:  '2D2D2D',
  midText:   '555555',
  green:     'E6F4EA',
  greenText: '1B6B3A',
  amber:     'FFF3CD',
  amberText: '856404',
  code:      'F0F4FF',
  codeText:  '1A3A6B',
  step:      'EAF3FB',
  stepText:  '0D3B6E',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const NONE  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const THIN  = (col = C.medGray) => ({ style: BorderStyle.SINGLE, size: 1, color: col });

function spacer(pt = 8) {
  return new Paragraph({ spacing: { before: pt * 20, after: 0 }, children: [] });
}

function pageBreak() {
  return new Paragraph({ children: [new TextRun({ break: 1 })] });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 140 },
    children: [new TextRun({ text, color: C.navy, size: 30, bold: true, font: 'Calibri' })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 100 },
    children: [new TextRun({ text, color: C.darkBlue, size: 24, bold: true, font: 'Calibri' })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 60 },
    children: [new TextRun({ text, color: C.darkGray, size: 22, bold: true, font: 'Calibri' })],
  });
}

function body(runs, opts = {}) {
  const arr = typeof runs === 'string' ? [{ text: runs }] : runs;
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: arr.map(r =>
      new TextRun({
        text: r.text ?? r,
        size: 20,
        font: 'Calibri',
        color: r.color ?? C.darkGray,
        bold: r.bold ?? false,
        italics: r.italic ?? false,
      })
    ),
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 20, font: 'Calibri', color: C.darkGray })],
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'steps', level },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 20, font: 'Calibri', color: C.darkGray })],
  });
}

function codeBlock(lines) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    shading: { type: ShadingType.SOLID, color: C.code, fill: C.code },
    children: lines.flatMap((line, i) => [
      new TextRun({
        text: line,
        font: 'Courier New',
        size: 16,
        color: C.codeText,
        break: i > 0 ? 1 : 0,
      }),
    ]),
  });
}

function infoBox(lines, bg = C.step, fg = C.stepText) {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    shading: { type: ShadingType.SOLID, color: bg, fill: bg },
    children: lines.flatMap((line, i) => [
      new TextRun({ text: line, size: 19, font: 'Calibri', color: fg, break: i > 0 ? 1 : 0 }),
    ]),
  });
}

// ─── Table helpers ────────────────────────────────────────────────────────────
function hCell(text, pct) {
  return new TableCell({
    width: { size: pct, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.SOLID, color: C.darkBlue, fill: C.darkBlue },
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE },
    children: [new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text, size: 18, bold: true, color: C.white, font: 'Calibri' })],
    })],
  });
}

function dCell(text, pct, opts = {}) {
  const bg = opts.bg ?? C.white;
  const fg = opts.fg ?? C.darkGray;
  return new TableCell({
    width: { size: pct, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.SOLID, color: bg, fill: bg },
    margins: { top: 70, bottom: 70, left: 140, right: 140 },
    borders: {
      top:    THIN(), bottom: THIN(),
      left:   NONE, right: NONE,
    },
    children: [new Paragraph({
      alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [new TextRun({ text, size: 18, font: 'Calibri', color: fg, bold: opts.bold ?? false })],
    })],
  });
}

function simpleTable(headers, rows, widths) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: {
      top: THIN(), bottom: THIN(), left: NONE, right: NONE,
      insideH: THIN(), insideV: NONE,
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => hCell(h, widths[i])),
      }),
      ...rows.map((row, ri) => {
        const bg = ri % 2 === 0 ? C.white : C.lightGray;
        return new TableRow({
          children: row.map((cell, ci) =>
            dCell(String(cell), widths[ci], { bg })
          ),
        });
      }),
    ],
  });
}

function stepTable(steps) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: {
      top: THIN(), bottom: THIN(), left: NONE, right: NONE,
      insideH: THIN(), insideV: NONE,
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          hCell('#', 8),
          hCell('Action', 32),
          hCell('Maestro command', 35),
          hCell('Assert', 25),
        ],
      }),
      ...steps.map(([num, action, cmd, assert], ri) =>
        new TableRow({
          children: [
            dCell(num,    8,  { bg: ri % 2 === 0 ? C.white : C.lightGray, center: true, bold: true }),
            dCell(action, 32, { bg: ri % 2 === 0 ? C.white : C.lightGray }),
            dCell(cmd,    35, { bg: ri % 2 === 0 ? C.white : C.lightGray, fg: C.codeText }),
            dCell(assert, 25, { bg: ri % 2 === 0 ? C.white : C.lightGray, fg: C.greenText }),
          ],
        })
      ),
    ],
  });
}

// ─── Cover page ──────────────────────────────────────────────────────────────
const cover = [
  spacer(120),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 200 },
    children: [
      new TextRun({ text: 'CareConnect', size: 80, bold: true, color: C.blue, font: 'Calibri' }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 100 },
    children: [
      new TextRun({ text: 'E2E Testing Guide', size: 52, bold: true, color: C.navy, font: 'Calibri' }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 600 },
    children: [
      new TextRun({ text: 'Plan · Execution · How-To Steps', size: 36, color: C.midText, font: 'Calibri', italics: true }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: C.blue } },
    spacing: { before: 120, after: 120 },
    children: [],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [
      new TextRun({ text: 'Application: ', size: 22, bold: true, color: C.darkGray, font: 'Calibri' }),
      new TextRun({ text: 'CareConnect Mobile (React Native / Expo)', size: 22, color: C.darkGray, font: 'Calibri' }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [
      new TextRun({ text: 'Target Platform: ', size: 22, bold: true, color: C.darkGray, font: 'Calibri' }),
      new TextRun({ text: 'Android (emulator / physical device via ADB)', size: 22, color: C.darkGray, font: 'Calibri' }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [
      new TextRun({ text: 'Framework: ', size: 22, bold: true, color: C.darkGray, font: 'Calibri' }),
      new TextRun({ text: 'Maestro (YAML-based, zero native code changes)', size: 22, color: C.darkGray, font: 'Calibri' }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [
      new TextRun({ text: 'Date: ', size: 22, bold: true, color: C.darkGray, font: 'Calibri' }),
      new TextRun({ text: 'June 20, 2026', size: 22, color: C.darkGray, font: 'Calibri' }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [
      new TextRun({ text: 'Repository: ', size: 22, bold: true, color: C.darkGray, font: 'Calibri' }),
      new TextRun({ text: 'github.com/YoMT/SWEN-661-Team4', size: 22, color: C.darkGray, font: 'Calibri' }),
    ],
  }),
  pageBreak(),
];

// ─── Section 1: Executive Summary ────────────────────────────────────────────
const execSummary = [
  h1('1. Executive Summary'),
  body('CareConnect already has 177 unit and integration tests covering business logic, '
     + 'API mocking, and component rendering. E2E tests fill the remaining gap: they verify '
     + 'complete user journeys from the landing screen through authenticated workflows on a '
     + 'real Android runtime, catching regressions that mocked tests cannot.'),
  spacer(8),
  simpleTable(
    ['Metric', 'Value'],
    [
      ['E2E framework',       'Maestro (YAML flows)'],
      ['Target platform',     'Android emulator / physical device (ADB)'],
      ['App package name',    'com.anonymous.mobile'],
      ['Flows created',       '6 user journeys + 1 reusable sub-flow'],
      ['Selectors used',      'accessibilityLabel (label:) — no testID changes needed'],
      ['Backend required',    'None — app uses built-in mock-api.ts when EXPO_PUBLIC_API_URL is unset'],
      ['Lines of test code',  '~230 YAML lines across 7 files'],
    ],
    [40, 60]
  ),
  spacer(8),
];

// ─── Section 2: Framework Selection ──────────────────────────────────────────
const frameworkSection = [
  h1('2. Framework Selection — Maestro vs Detox'),
  body('Two E2E frameworks were evaluated. Maestro was chosen for this Expo-managed project.'),
  spacer(6),
  simpleTable(
    ['Criterion', 'Maestro (chosen)', 'Detox'],
    [
      ['Setup effort',       'Install global CLI only; no project changes', 'npm install + detox.config.js + native build'],
      ['Expo compatibility', 'Works with Expo Go or dev build out-of-the-box', 'Requires bare workflow or Expo prebuild'],
      ['Selectors',          'label: (accessibilityLabel) — already set on all elements', 'testID or accessibilityLabel (testID not set in codebase)'],
      ['Test language',      'YAML (readable, no JS required)', 'JavaScript / TypeScript'],
      ['Android back nav',   'tapOn: label: "Go back" (UI button is the correct path)', 'back() or pressBack()'],
      ['CI integration',     'android-emulator-runner + single shell command', 'Complex native build pipeline'],
    ],
    [28, 36, 36]
  ),
  spacer(8),
  infoBox([
    'Decision rationale: The WCAG 2.1 AA audit already added accessibilityLabel to every',
    'interactive element. Maestro uses these labels natively. predictiveBackGestureEnabled: false',
    'in app.json means the UI "Go back" button is the only back path on Android,',
    'making Maestro\'s label-based approach both correct and exhaustive.',
  ], C.step, C.stepText),
  spacer(8),
];

// ─── Section 3: E2E Plan ─────────────────────────────────────────────────────
const planSection = [
  h1('3. E2E Test Plan'),
  h2('3.1 Scope'),
  body('Six user journeys cover every major feature area of the app. Each journey starts '
     + 'from a fresh app launch (clearState: true), logs in via the mock API, and verifies '
     + 'the final state of the target screen.'),
  spacer(6),
  simpleTable(
    ['Flow file', 'Journey', 'Screens exercised', 'Key assertion'],
    [
      ['auth-login.yaml',          'Landing → Sign in → Dashboard', 'Landing, Login, Dashboard',                           '"Doses today" + "Margaret Johnson" visible'],
      ['auth-signup.yaml',         'Landing → Create account → Dashboard', 'Landing, Signup, Dashboard',                   '"Doses today" visible after account creation'],
      ['medication-add.yaml',      'Login → Add medication → Verify', 'Dashboard, Medications list, Add Medication form',  '"Aspirin" appears in medication list'],
      ['symptom-log.yaml',         'Login → Log symptom → Banner', 'Dashboard, Symptoms, Log form',                        '"✓ Symptom logged" banner + severity entry'],
      ['dashboard-navigation.yaml','Login → All tabs + quick links', 'All 5 tabs, Emergency, Provider Report',             'Each screen title asserted in sequence'],
      ['profile-journey.yaml',     'Login → Full profile workflow', 'Profile, Edit, Emergency, Caretaker, Peggy AI',       'Reply text and incident save both assert'],
    ],
    [22, 25, 28, 25]
  ),
  spacer(10),
  h2('3.2 Flow Details'),

  h3('Flow 1 — auth-login.yaml (Authentication: Login)'),
  stepTable([
    ['1', 'Launch app (fresh state)',   'launchApp: clearState: true',       'Landing screen visible'],
    ['2', 'Assert landing branding',    'assertVisible: "CareConnect"',       'Title + tagline present'],
    ['3', 'Tap Sign in link',           'tapOn: label: "Sign in"',            'Login form opens'],
    ['4', 'Enter email',                'tapOn label: "Email address" + inputText', '—'],
    ['5', 'Enter password',             'tapOn label: "Password" + inputText','—'],
    ['6', 'Submit',                     'tapOn: "Sign In"',                   '"Doses today" visible on dashboard'],
  ]),
  spacer(10),

  h3('Flow 2 — auth-signup.yaml (Authentication: Signup)'),
  stepTable([
    ['1', 'Launch app (fresh state)',   'launchApp: clearState: true',        'Landing screen visible'],
    ['2', 'Tap Get started button',     'tapOn: "Get started — it\'s free  →"','Signup form opens'],
    ['3', 'Fill Full name',             'tapOn label: "Full name" + inputText','—'],
    ['4', 'Fill Email',                 'tapOn label: "Email address" + inputText','—'],
    ['5', 'Fill Password',              'tapOn label: "Password" + inputText', '—'],
    ['6', 'Submit',                     'tapOn: "Create Account"',             '"Doses today" visible — account created'],
  ]),
  spacer(10),

  h3('Flow 3 — medication-add.yaml (Medication Management)'),
  stepTable([
    ['1', 'Login via sub-flow',         'runFlow: ../_helpers/login.yaml',    '"Doses today" visible'],
    ['2', 'Navigate to Medications tab','tapOn: label: "Medications tab"',    '"Medications" heading visible'],
    ['3', 'Open add form',              'tapOn: label: "Add medication"',      '"Add Medication" form visible'],
    ['4', 'Fill Medication name',       'inputText: "Aspirin"',               '—'],
    ['5', 'Fill Dosage',                'inputText: "100mg"',                 '—'],
    ['6', 'Fill Instructions',          'inputText: "Take with a full glass of water"','—'],
    ['7', 'Select Morning time slot',   'tapOn: label: "morning"',            'Time slot selected'],
    ['8', 'Save',                       'tapOn: "Save Medication"',           '"Aspirin" appears in medication list'],
  ]),
  spacer(10),

  h3('Flow 4 — symptom-log.yaml (Symptom Logging)'),
  stepTable([
    ['1', 'Login via sub-flow',         'runFlow: ../_helpers/login.yaml',    'Dashboard visible'],
    ['2', 'Navigate to Symptoms tab',   'tapOn: label: "Symptoms tab"',       '"Log a symptom" visible'],
    ['3', 'Select Pain',                'tapOn: label: "Pain"',               'Pain chip selected'],
    ['4', 'Add note',                   'tapOn label: "Note (optional)" + inputText','—'],
    ['5', 'Save log',                   'tapOn: label: "Save Log"',           '"✓ Symptom logged" banner shown'],
    ['6', 'Assert entry',               'assertVisible: "Severity 5/10"',     'Entry in recent list'],
  ]),
  spacer(10),

  h3('Flow 5 — dashboard-navigation.yaml (Full Navigation)'),
  stepTable([
    ['1', 'Login',                      'runFlow: ../_helpers/login.yaml',    'Dashboard loaded'],
    ['2', 'Quick link: Medications',    'tapOn: label: "View all medications"','"Medications" visible'],
    ['3', 'Return to dashboard',        'tapOn: label: "Home tab"',           '—'],
    ['4', 'Quick link: Appointments',   'tapOn: label: "View schedule"',      '"Appointments" visible'],
    ['5', 'Tab: Medications',           'tapOn: label: "Medications tab"',    '"Medications" visible'],
    ['6', 'Tab: Symptoms',              'tapOn: label: "Symptoms tab"',       '"Log a symptom" visible'],
    ['7', 'Tab: Profile',               'tapOn: label: "Profile tab"',        '"Alex Johnson" visible'],
    ['8', 'Quick link: Emergency',      'tapOn: label: "Emergency"',          '"Emergency contacts" visible'],
    ['9', 'Quick link: Provider report','tapOn: label: "Provider report"',    '"Provider Report" visible'],
  ]),
  spacer(10),

  h3('Flow 6 — profile-journey.yaml (Profile & Settings)'),
  stepTable([
    ['1',  'Login',                     'runFlow: ../_helpers/login.yaml',    'Dashboard visible'],
    ['2',  'Open Profile tab',          'tapOn: label: "Profile tab"',        'Name + email visible'],
    ['3',  'Open Edit profile',         'tapOn: label: "Edit profile"',       '"Edit Profile" form visible'],
    ['4',  'Edit Full name',            'clearText + inputText: "Alex Johnson"','—'],
    ['5',  'Save',                      'tapOn: "Save Changes"',              'Returns to profile screen'],
    ['6',  'Open Emergency contacts',   'tapOn: label: "Emergency contacts"', '"Sarah Johnson" visible'],
    ['7',  'Log incident',              'tapOn label: "Quick incident log" + inputText','—'],
    ['8',  'Save incident',             'tapOn: label: "Save incident log"',  '"✓ Saved" shown'],
    ['9',  'Go back',                   'tapOn: label: "Go back"',            'Profile screen'],
    ['10', 'Open Caretaker notes',      'tapOn: label: "Caretaker notes"',    '"Maria (Day Nurse)" visible'],
    ['11', 'Reply to note',             'tapOn label: "Reply to note" + inputText','—'],
    ['12', 'Submit reply',              'tapOn: label: "Submit reply"',       'Reply text visible in thread'],
    ['13', 'Open Peggy AI',             'tapOn: label: "Open Peggy assistant"','"Hi, I\'m Peggy!" visible'],
    ['14', 'Send message',              'tapOn label: "Message input" + inputText + Send','Message echoed in chat'],
    ['15', 'Close Peggy',               'tapOn: label: "Close assistant"',    'Overlay dismissed'],
  ]),
  spacer(10),
];

// ─── Section 4: Android Setup ─────────────────────────────────────────────────
const setupSection = [
  h1('4. Android Setup — How-To Steps'),

  h2('4.1 Install Maestro CLI'),
  body('Maestro is a standalone CLI tool. It does not get added to package.json.'),
  spacer(4),
  h3('macOS / Linux'),
  codeBlock(['curl -Ls "https://get.maestro.mobile.dev" | bash']),
  h3('Windows (PowerShell)'),
  codeBlock([
    'iwr -Uri "https://get.maestro.mobile.dev/install.ps1" -OutFile "$env:TEMP\\install-maestro.ps1"',
    '& "$env:TEMP\\install-maestro.ps1"',
  ]),
  body('Verify the installation:'),
  codeBlock(['maestro --version']),
  spacer(8),

  h2('4.2 Install Android SDK & ADB'),
  body([
    { text: '1. ', bold: true },
    { text: 'Download and install ' },
    { text: 'Android Studio', bold: true },
    { text: ' from developer.android.com/studio.' },
  ]),
  body([
    { text: '2. ', bold: true },
    { text: 'During setup, install the Android SDK (API level 33 or higher) and the Android Emulator component.' },
  ]),
  body([
    { text: '3. ', bold: true },
    { text: 'Add platform-tools to your PATH so that ' },
    { text: 'adb', bold: true },
    { text: ' is accessible from the terminal.' },
  ]),
  spacer(4),
  body('Verify ADB is on PATH:'),
  codeBlock(['adb version   # prints: Android Debug Bridge version x.x.x']),
  spacer(8),

  h2('4.3 Create & Start an Android Emulator'),
  h3('Option A — Android Studio AVD Manager (recommended)'),
  body([{ text: '1. ', bold: true }, { text: 'Open Android Studio → More Actions → Virtual Device Manager.' }]),
  body([{ text: '2. ', bold: true }, { text: 'Click + Create Device, select a Pixel 7 profile, choose API 34 system image, Finish.' }]),
  body([{ text: '3. ', bold: true }, { text: 'Click the play ▶ button to start the emulator.' }]),
  spacer(4),
  h3('Option B — Command Line'),
  codeBlock([
    '# List available AVDs',
    'emulator -list-avds',
    '',
    '# Start your AVD (replace with your actual AVD name)',
    'emulator -avd Pixel_7_API_34 &',
  ]),
  spacer(4),
  body('In either case, wait until the emulator shows the Android home screen, then confirm ADB detects it:'),
  codeBlock(['adb devices', '# Expected output:  emulator-5554   device']),
  spacer(8),

  h2('4.4 Run the App on the Emulator'),
  body('From the apps/mobile/ directory:'),
  codeBlock([
    '# Fastest option — Expo Go (no build required)',
    'pnpm start --android',
    '',
    '# Alternative — standalone dev build',
    'npx expo run:android',
  ]),
  spacer(4),
  infoBox([
    'The app uses its built-in mock-api.ts when EXPO_PUBLIC_API_URL is not set.',
    'No real backend or network connection is required for E2E tests.',
    'Default credentials: demo@careconnect.com / demo123 (any email/password accepted by mock API).',
  ], C.green, C.greenText),
  spacer(8),
];

// ─── Section 5: Test Execution ───────────────────────────────────────────────
const executionSection = [
  h1('5. Test Execution'),

  h2('5.1 Prerequisites Checklist'),
  simpleTable(
    ['#', 'Prerequisite', 'Verify with'],
    [
      ['1', 'Maestro CLI installed',                         'maestro --version'],
      ['2', 'Android SDK + ADB on PATH',                    'adb version'],
      ['3', 'Android emulator running',                     'adb devices (shows "device")'],
      ['4', 'App running on emulator (pnpm start --android)', 'App visible on emulator screen'],
    ],
    [6, 60, 34]
  ),
  spacer(8),

  h2('5.2 Running a Single Flow'),
  body('Open a second terminal (keep the Expo server running in the first) and run:'),
  codeBlock([
    '# From the repo root or apps/mobile/',
    'maestro test apps/mobile/e2e/flows/auth-login.yaml',
    '',
    '# Or using the npm alias (from apps/mobile/)',
    'pnpm e2e:auth',
  ]),
  spacer(6),
  body('Maestro connects to the running emulator via ADB, launches the app (clearing state), '
     + 'and executes each step. Pass/fail output is printed to the terminal. A video recording '
     + 'is saved under ~/.maestro/tests/ if a failure occurs.'),
  spacer(8),

  h2('5.3 Running All Flows'),
  codeBlock([
    '# Run all flows sequentially (from apps/mobile/)',
    'pnpm e2e',
    '',
    '# Equivalent direct command',
    'maestro test apps/mobile/e2e/flows/',
  ]),
  spacer(6),
  body('Flows run in alphabetical order by filename. Each flow starts with a fresh app '
     + 'state (clearState: true), so they are fully independent and can be run in any order.'),
  spacer(8),

  h2('5.4 Running All Flows with JUnit XML Output (CI / reporting)'),
  codeBlock([
    '# From apps/mobile/',
    'pnpm e2e:all',
    '',
    '# Equivalent direct command',
    'maestro test apps/mobile/e2e/flows/ \\',
    '  --format junit \\',
    '  --output apps/mobile/coverage/e2e-results.xml',
  ]),
  spacer(6),
  body('The JUnit XML can be consumed by CI systems (GitHub Actions, Jenkins, CircleCI) '
     + 'and test-reporting tools.'),
  spacer(8),

  h2('5.5 Interpreting Results'),
  body('Maestro prints a summary after each flow:'),
  codeBlock([
    '  ✅  Launch app                     (0.8s)',
    '  ✅  Assert "CareConnect" visible    (0.2s)',
    '  ✅  Tap "Sign in"                  (0.4s)',
    '  ✅  Input email                    (0.3s)',
    '  ✅  Input password                 (0.3s)',
    '  ✅  Tap "Sign In"                  (0.6s)',
    '  ✅  Assert "Doses today" visible   (1.1s)',
    '',
    'Flow auth-login.yaml completed in 3.7s  ✅',
  ]),
  spacer(6),
  body('If a step fails, Maestro shows the failed command and saves a screenshot + '
     + 'video to ~/.maestro/tests/<timestamp>/. Re-run the specific flow to debug.'),
  spacer(8),
];

// ─── Section 6: CI Integration ───────────────────────────────────────────────
const ciSection = [
  h1('6. CI/CD Integration (GitHub Actions)'),
  body('Add the following job to your GitHub Actions workflow file '
     + '(.github/workflows/ci.yml) after the existing unit/integration test job:'),
  spacer(6),
  codeBlock([
    '  e2e:',
    '    runs-on: ubuntu-latest',
    '    needs: test          # waits for unit/integration tests to pass first',
    '    steps:',
    '      - uses: actions/checkout@v4',
    '',
    '      - uses: actions/setup-node@v4',
    '        with:',
    '          node-version: 20',
    '',
    '      - name: Install dependencies',
    '        run: cd apps/mobile && pnpm install',
    '',
    '      - name: Install Maestro',
    '        run: curl -Ls "https://get.maestro.mobile.dev" | bash',
    '',
    '      - name: Run E2E on Android Emulator',
    '        uses: reactivecircus/android-emulator-runner@v2',
    '        with:',
    '          api-level: 34',
    '          arch: x86_64',
    '          profile: pixel_6',
    '          script: |',
    '            cd apps/mobile',
    '            pnpm start --android &',
    '            sleep 45          # wait for Expo bundle to load',
    '            pnpm e2e:all',
    '',
    '      - name: Upload E2E results',
    '        uses: actions/upload-artifact@v4',
    '        if: always()         # upload even on failure to see what broke',
    '        with:',
    '          name: e2e-results',
    '          path: apps/mobile/coverage/e2e-results.xml',
  ]),
  spacer(8),
  simpleTable(
    ['CI setting', 'Value', 'Reason'],
    [
      ['api-level: 34',     'Android 14',             'Latest stable API; matches AVD Manager default'],
      ['arch: x86_64',      'x86_64 emulator',        'Faster on GitHub-hosted runners than ARM'],
      ['profile: pixel_6',  'Pixel 6 screen size',    'Representative mid-range Android form factor'],
      ['sleep 45',          '45-second wait',         'Expo bundle compilation takes ~30–40 s cold'],
      ['if: always()',      'Always upload artifact',  'Ensures failure reports are accessible'],
    ],
    [24, 22, 54]
  ),
  spacer(8),
];

// ─── Section 7: File Reference ────────────────────────────────────────────────
const fileSection = [
  h1('7. File Reference'),

  h2('7.1 Directory Structure'),
  codeBlock([
    'apps/mobile/',
    '  e2e/',
    '    _helpers/',
    '      login.yaml              # Reusable login sub-flow (runFlow:)',
    '    flows/',
    '      auth-login.yaml         # Journey 1 — Login',
    '      auth-signup.yaml        # Journey 2 — Signup',
    '      medication-add.yaml     # Journey 3 — Add medication',
    '      symptom-log.yaml        # Journey 4 — Log symptom',
    '      dashboard-navigation.yaml # Journey 5 — Full navigation',
    '      profile-journey.yaml    # Journey 6 — Profile + Peggy AI',
    '    README.md                 # Quick-start guide (Android)',
    '  package.json               # Scripts: e2e, e2e:auth, e2e:all',
  ]),
  spacer(8),

  h2('7.2 npm Scripts (apps/mobile/package.json)'),
  simpleTable(
    ['Script', 'Command', 'Description'],
    [
      ['pnpm e2e',       'maestro test e2e/flows/',                                         'Run all flows sequentially'],
      ['pnpm e2e:auth',  'maestro test e2e/flows/auth-login.yaml',                          'Run login flow only'],
      ['pnpm e2e:all',   'maestro test e2e/flows/ --format junit --output coverage/e2e-results.xml', 'All flows + JUnit XML'],
    ],
    [18, 52, 30]
  ),
  spacer(8),

  h2('7.3 Selector Strategy'),
  body('All flows exclusively use label: (Maestro\'s mapping of React Native accessibilityLabel) '
     + 'because the WCAG 2.1 AA audit added accessibilityLabel to every interactive element. '
     + 'Visible text selectors (tapOn: "Button text") are used only as a fallback where the '
     + 'label and visible text are identical. No testID props were added.'),
  spacer(6),
  simpleTable(
    ['Maestro selector', 'React Native prop', 'Example'],
    [
      ['tapOn: label: "..."',      'accessibilityLabel',    'tapOn: label: "Email address"'],
      ['tapOn: "..."',             'visible text content',  'tapOn: "Sign In"'],
      ['assertVisible: "..."',     'text or label',         'assertVisible: "Doses today"'],
      ['inputText: "..."',         '(focused TextInput)',   'inputText: "demo@careconnect.com"'],
      ['clearText',                '(clears focused field)', 'clearText (before editing profile name)'],
    ],
    [28, 26, 46]
  ),
  spacer(8),

  h2('7.4 Android-Specific Notes'),
  bullet('App ID: com.anonymous.mobile (Expo default — no bundleIdentifier set in app.json).'),
  bullet('Back navigation: The app disables the Android predictive back gesture '
       + '(predictiveBackGestureEnabled: false in app.json). All nested screens '
       + 'have an explicit "Go back" button with accessibilityLabel="Go back". '
       + 'The flows use tapOn: label: "Go back" — the Maestro back command is not needed.'),
  bullet('clearState: true: Clears Android SharedPreferences and Expo SecureStore '
       + 'between runs. This forces re-authentication on every flow.'),
  bullet('Expo Go vs dev build: Flows run with appId: com.anonymous.mobile which requires '
       + 'a dev build (npx expo run:android). For Expo Go, remove the appId line and '
       + 'launchApp step, start the app first, then run maestro test.'),
  spacer(8),
];

// ─── Section 8: Troubleshooting ───────────────────────────────────────────────
const troubleSection = [
  h1('8. Troubleshooting'),
  simpleTable(
    ['Symptom', 'Likely cause', 'Fix'],
    [
      [
        'No connected devices found',
        'Emulator not running or ADB not on PATH',
        'Run adb devices; start emulator if empty',
      ],
      [
        'App not found: com.anonymous.mobile',
        'App running in Expo Go, not a dev build',
        'Run npx expo run:android OR remove appId and launchApp from flow',
      ],
      [
        'Element not found: "Doses today"',
        'App still loading (slow bundle)',
        'Increase sleep before maestro test; or set maestro timeout in flow',
      ],
      [
        'Element not found: "Sign in"',
        'App already logged in from previous run',
        'clearState: true is set in every flow — ensure Maestro version supports it',
      ],
      [
        'clearText has no effect',
        'Field did not receive focus',
        'Add tapOn: label: "Full name" before clearText to focus the field first',
      ],
      [
        '"Get started" tap fails',
        'em-dash or arrow in button label mismatched',
        'Verify exact label in app code; use exact UTF-8 string in YAML',
      ],
    ],
    [30, 34, 36]
  ),
  spacer(8),
];

// ─── Assemble document ────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'steps',
        levels: [
          {
            level: 0,
            format: 'decimal',
            text: '%1.',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: convertInchesToTwip(0.4), hanging: convertInchesToTwip(0.2) } } },
          },
        ],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        margin: {
          top:    convertInchesToTwip(1),
          bottom: convertInchesToTwip(1),
          left:   convertInchesToTwip(1.1),
          right:  convertInchesToTwip(1.1),
        },
      },
    },
    children: [
      ...cover,
      ...execSummary,
      ...frameworkSection,
      ...planSection,
      ...setupSection,
      ...executionSection,
      ...ciSection,
      ...fileSection,
      ...troubleSection,
    ],
  }],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync(OUT_FILE, buffer);
console.log(`✅  Written: ${OUT_FILE}`);
