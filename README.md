# Job Hunt Agent Skill

Open-source job-application preparation for agentic coding assistants. This package installs a reusable skill that helps Codex and Claude Code turn a user-provided master resume, job links, and job descriptions into truthful tailored resumes and review notes organized by company and role.

## One-command setup

Install the skill for both Codex and Claude Code:

```bash
curl -fsSL https://raw.githubusercontent.com/DevOpsAIguru123/job-hunt/main/install.sh | bash -s -- --yes
```

Local clone setup:

```bash
git clone https://github.com/DevOpsAIguru123/job-hunt.git
cd job-hunt
bash install.sh --yes
npm install
npm run test:setup
```

Dry run:

```bash
bash install.sh --dry-run
```

Install only one agent:

```bash
bash install.sh --codex-only --yes
bash install.sh --claude-only --yes
```

## What Gets Installed

The installer copies `skills/jobhunt-ready-refresh` into:

- `~/.codex/skills/jobhunt-ready-refresh`
- `~/.claude/skills/jobhunt-ready-refresh`

It only installs the skill instructions and references. It does not copy private applicant data, resumes, local databases, screenshots, browser profiles, run logs, credentials, or `.env` files.

## How To Use

After setup, ask Codex or Claude Code:

```text
Use the jobhunt-ready-refresh skill with my master resume path, these job links, and these job descriptions to generate tailored resumes and review notes.
```

The user must provide the master resume path, job links, and job descriptions. The skill should not search for roles, decide what jobs to add, or require a pre-existing `ready` queue.

Generated files go under a `resumes/` folder in the master resume's directory. If the folder does not exist, create it. For each role, create a company and role folder based on the job link or job description:

```text
<master-resume-directory>/resumes/<company-slug>/<role-slug>/
```

Each role folder should contain the tailored resume and a review note. A local tracker database at `data/job_applications.sqlite` is optional; you can adapt the schema and scripts for your workflow.

## Safety Rules

Do not commit private applicant data. Keep your `.env`, `config/applicant.json`, SQLite databases, generated resumes, screenshots, browser profiles, and run artifacts local.

Employment applications are high-impact actions:

- Do not submit applications automatically.
- Do not mark a row `applied` unless the user confirms the submission.
- Do not invent missing job details, applicant facts, employers, degrees, dates, metrics, or credentials.
- Prefer official employer career pages or official ATS links when the user provides them.
- Create a SQLite backup before any database write.

## Configuration

Start from the sample file:

```bash
cp .env.example .env
```

Keep secrets and personal details in local files that are ignored by git. For public demos, use synthetic applicant data.

## Verification

Run the setup smoke tests:

```bash
npm run test:setup
```

Check the installer without writing files:

```bash
bash install.sh --dry-run
```

When using an optional local tracker, verify the database and generated resume files before reporting completion:

```bash
sqlite3 data/job_applications.sqlite "PRAGMA integrity_check;"
sqlite3 -header -column data/job_applications.sqlite "SELECT status, COUNT(*) AS count FROM applications GROUP BY status ORDER BY status;"
```

## Package Layout

- `install.sh` - one-command installer for Codex and Claude Code.
- `skills/jobhunt-ready-refresh/` - installable agent skill.
- `tests/setup.test.js` - setup smoke tests.
- `.env.example` - placeholder-only local configuration template.
