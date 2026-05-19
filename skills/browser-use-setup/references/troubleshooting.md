# Troubleshooting

## Import Fails

Run:

```bash
uv run python -c "import browser_use; print('browser-use ok')"
```

If it fails:

```bash
uv venv --python 3.12
uv pip install -e .
```

## Browser Binary Missing

Run:

```bash
uvx browser-use install
```

If Playwright is used directly:

```bash
npx playwright install chromium
```

## Missing Model Key

Check exported variables without printing values:

```bash
python -c "import os; print('OPENAI_API_KEY', bool(os.getenv('OPENAI_API_KEY')))"
```

Use `.env` only if it is ignored by git.

## Browser Stalls

- Reduce task scope.
- Add a max step or timeout option if the scout script supports it.
- Switch to Playwright for known fields.
- Keep Browser Use for inspection or recovery only.

## Profile Or Session Warnings

- Retry with a fresh temporary profile.
- Do not share or commit browser profiles.
- Use an existing profile only when the user explicitly needs logged-in cookies.

## Page State Looks Wrong

- Take a fresh screenshot.
- Verify DOM values with Playwright.
- Re-run scout after auth or navigation.
- Treat visual state as potentially stale until confirmed.
