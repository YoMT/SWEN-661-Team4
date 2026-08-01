# Accessibility evidence — CareConnect Web

Committed proof backing `../WEB_ACCESSIBILITY_TEST_REPORT.md` (and `.docx`). All of it
regenerates deterministically from the commands in the report.

| Folder / file | What it proves |
|---------------|----------------|
| `lighthouse/*.report.html` | Lighthouse 12.8.2 Accessibility = **100/100** on landing, login, signup. Open in any browser. |
| `axe/chromium/*.json`, `axe/firefox/*.json` | Raw axe-core (WCAG 2.1 A/AA) results per page. Each file's `"violations"` array is **empty**. |
| `axe/SUMMARY-chromium.txt` | Human-readable roll-up for Chromium **and** Edge — `TOTAL failing nodes: 0`. |

Reproduce:

```bash
cd apps/web
# axe across 4 browsers
npx playwright test --project=a11y-chromium --project=a11y-edge \
  --project=a11y-firefox --project=a11y-webkit --workers=1
node scripts/a11y-summary.mjs a11y-chromium

# Lighthouse (uses the installed Edge binary as Chrome)
VITE_API_URL='' npx vite --port 5199 --strictPort &
CHROME_PATH="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" \
npx -y lighthouse http://localhost:5199/login \
  --only-categories=accessibility --chrome-flags="--headless=new" \
  --output=html --output-path=./test-results/lighthouse/login
```

The tester-completed manual evidence (WAVE screenshots, NVDA/VoiceOver notes, the demo video,
real-Safari confirmation) goes here too, under `wave/`, `axe-devtools/`, and
`keyboard-screenreader-demo.mp4` — see report §1.2, §2.2, §2.6, §3.3.
