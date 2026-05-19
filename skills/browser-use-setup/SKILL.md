---
name: browser-use-setup
description: Use when setting up, repairing, or running Browser Use for local browser automation experiments, especially safe scout runs, visual page inspection, login/auth recovery, field-label discovery, or hybrid Browser Use plus deterministic Playwright workflows.
---

# Browser Use Setup

## Purpose

Use Browser Use as an inspection, scouting, and recovery layer for browser automation. Prefer deterministic Playwright or framework-specific scripts for stable form filling and file uploads. Browser Use is best when the page is unfamiliar, visually dynamic, blocked, or hard to inspect with selectors alone.

## Safety

- Never click final `Submit`, `Submit Application`, `Apply`, `Send`, purchase, delete, or equivalent destructive/committing actions unless the user explicitly approves that exact action.
- Do not fill demographic, EEO, veteran, disability, race, ethnicity, protected-status, legal certification, relocation, salary, sensitive identity, payment, or acknowledgement fields unless the user gives exact answers.
- Do not store API keys in skills, source files, screenshots, logs, reports, or tracker notes.
- Do not commit browser profiles, cookies, session storage, screenshots with private data, or run artifacts.
- Treat Browser Use scout reports as evidence for next steps, not as final application or submission status.

## Setup

Use a project-local experiment directory such as:

```bash
cd <repo>/experiments/browser-use-job-application
```

Install with `uv`:

```bash
uv venv --python 3.12
uv pip install -e .
uvx browser-use install
```

For a minimal project, read `references/project-template.md`.

## Setup Check

Run:

```bash
uv run python -c "import browser_use; print('browser-use ok')"
.venv/bin/browser-use --help
```

If either command fails, read `references/troubleshooting.md`.

## Environment

Use exported environment variables or a local `.env` that is ignored by git.

Common keys:

```bash
export OPENAI_API_KEY="..."
export ANTHROPIC_API_KEY="..."
export GOOGLE_API_KEY="..."
```

Do not paste real key values into notes or shared files.

## When To Use Browser Use

Prefer Browser Use for:

- visual inspection of unfamiliar pages,
- login/auth recovery,
- explaining why a page is blocked,
- finding field labels and page state,
- recovering from selector failures,
- producing a scouting report before writing deterministic automation.

Prefer Playwright for:

- known field filling,
- resume or file upload via file input,
- screenshots and HTML evidence,
- deterministic submit guards,
- database or tracker updates.

## Safe Scout Pattern

Use a scout script or Browser Use task that inspects and reports without committing actions:

```bash
uv run python scout_application.py --url "https://example.com/application" --provider openai --model gpt-5 --headless
```

Useful variants:

```bash
uv run python scout_application.py --url "https://example.com/application" --provider openai --model gpt-5 --vision
uv run python scout_application.py --url "https://example.com/application" --provider anthropic --model claude-sonnet-4-5
```

Read the JSON or Markdown report before deciding whether to continue with Playwright, Browser Use, or a hybrid flow. For a generic scaffold, read `references/scout-pattern.md`.

## Hybrid Pattern

Use Browser Use for visual discovery or auth recovery, then hand stable work to Playwright:

1. Browser Use opens or inspects the page.
2. The report records URL, visible state, field labels, blockers, and warnings.
3. Playwright performs deterministic interactions for known safe fields.
4. The workflow stops before final submit unless the user explicitly approves.

Read `references/hybrid-playwright.md` for the handoff checklist.

## Completion Checklist

- Correct experiment directory used.
- Required model/API key exists in environment and is not committed.
- Browser Use import and CLI help verified when setup changed.
- Scout report or screenshots saved only to ignored run output.
- Browser Use used for inspection/recovery unless the user explicitly asks otherwise.
- Playwright used for stable filling where available.
- Sensitive fields and final submit were not handled without exact approval.
- No credentials, browser profiles, screenshots, or generated run artifacts were added to the shareable bundle.
