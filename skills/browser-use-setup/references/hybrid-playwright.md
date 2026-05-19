# Hybrid Browser Use + Playwright

Use this pattern when Browser Use is good at discovery but deterministic automation should perform the actual stable interactions.

## Handoff Checklist

Browser Use should produce:

- current URL,
- auth state,
- field labels,
- required fields,
- file upload selectors if visible,
- buttons and navigation labels,
- blockers or warnings,
- sensitive fields that must not be filled automatically.

Playwright should handle:

- deterministic text input,
- dropdown selection when options are known,
- file uploads via `setInputFiles`,
- screenshots and HTML evidence,
- final review stop point,
- any database or tracker writes after evidence exists.

## Guardrails

- Keep a submit guard that blocks final submit unless an explicit `--confirm-submit` style flag is present.
- Keep sensitive field answers out of source code.
- Save run artifacts only under ignored paths.
- Prefer fresh temporary browser profiles unless the user explicitly needs existing cookies.

## Troubleshooting Handoff

- If Browser Use visually filled a value, verify DOM values with Playwright before relying on it.
- If a selector fails, re-run a scout focused on field labels and DOM state.
- If upload fails in Browser Use, use Playwright file input upload.
- If the page changes after auth, save a new scout report before staging fields.
