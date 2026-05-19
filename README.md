# Shareable Resume Generator

Generic, JSON-driven resume generation bundle extracted from a private job-search workspace.

This folder intentionally excludes private resumes, application history, screenshots, browser profiles, personal configuration, and generated artifacts. Replace the sample data in `data/` with your own profile and target jobs before generating resumes.

## What It Includes

- `src/generate-resumes.js` - CLI that creates ATS-friendly `.docx` resumes.
- `data/sample-profile.json` - placeholder profile, roles, skills, education, and certifications.
- `data/sample-jobs.json` - placeholder target jobs used to tailor output.
- `skills/resume-generation/` - shareable Codex skill plus references for resume generation, ATS checks, tailoring, bullet writing, quantification, and data schema.
- `skills/browser-use-setup/` - shareable Codex skill for setting up and safely running Browser Use scouting/recovery workflows.
- `package.json` - minimal dependency list and npm scripts.

## What It Excludes

- Existing generated resumes.
- Real contact details, work history, and personal profile data.
- Job-application databases and tracker state.
- Browser profiles, screenshots, run logs, and submission evidence.
- API keys, `.env` files, and local credentials.

## Setup

```bash
npm install
npm run generate
```

Generated files are written to `output/` by default.

## Usage

```bash
node src/generate-resumes.js \
  --profile data/sample-profile.json \
  --jobs data/sample-jobs.json \
  --out output
```

You can generate for one job id:

```bash
node src/generate-resumes.js --job-id platform-engineer
```

## Data Model

`sample-profile.json` contains:

- `contact`: name, location, email, links.
- `summary`: default professional summary.
- `skills`: labeled skill groups.
- `certifications`: certification list.
- `education`: education entries.
- `roles`: reusable experience entries with bullets.

`sample-jobs.json` contains:

- `id`: stable output id.
- `company`: target company.
- `title`: target role title.
- `keywords`: terms to emphasize.
- `summary`: optional tailored summary override.
- `skills`: optional extra skill groups.
- `experience`: role ids and selected bullet indexes.

## Privacy Check

Before sharing this folder, run:

```bash
npm run privacy-check
```

The check looks for common private file types and placeholder values that should be replaced before publishing.

## Skill Bundle

The bundled skills can be copied into a Codex skills directory.

```text
skills/
├── resume-generation/
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   └── references/
└── browser-use-setup/
    ├── SKILL.md
    ├── agents/openai.yaml
    └── references/
```

The skills are written generically and do not contain real resumes, personal profile details, application data, credentials, or local browser state.
