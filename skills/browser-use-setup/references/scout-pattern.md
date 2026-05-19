# Scout Pattern

The scout should inspect and report. It should not submit, purchase, delete, approve, or answer sensitive fields.

## Inputs

- Target URL.
- Provider and model.
- Headless or visible mode.
- Optional max steps or timeout.
- Optional output directory under ignored `runs/`.

## Report Fields

Capture:

- final URL,
- page title,
- visible form sections,
- required fields,
- upload fields,
- auth or bot blockers,
- sensitive fields to avoid,
- suggested deterministic next step,
- screenshots or HTML paths only if safe and ignored.

## Command Shape

```bash
uv run python scout_application.py \
  --url "https://example.com/application" \
  --provider openai \
  --model gpt-5 \
  --headless \
  --out runs/example-scout
```

## Decision Rules

- If fields are standard and stable, switch to Playwright.
- If auth or a visual blocker appears, keep Browser Use or ask the user for manual help.
- If a site asks for sensitive voluntary information, stop and ask for exact user-provided answers.
- If the page reaches final review, stop before submit.
