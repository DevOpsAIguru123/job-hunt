---
name: jobhunt-ready-refresh
description: Prepare job applications from a user-provided master resume path, job links, and job descriptions. Use when asked to generate truthful tailored resumes and review notes organized by company and role.
---

# Jobhunt Ready Refresh

## Overview

Use this skill to prepare job applications from a user-provided master resume
path, job links, and job descriptions. Generate truthful tailored resumes and
review notes organized by company and role.

Keep the workflow auditable. Do not search for jobs unless the user asks for
that separately. Do not require a pre-existing `ready` queue. If writing to a
local SQLite tracker, create a timestamped backup before the first database
write and ensure audit triggers exist.

## Quick Start

Work from the cloned `job-hunt` repository. Ask the user for the master resume
path, job links, and job descriptions if they did not provide them.

Then read [references/workflow.md](references/workflow.md) and follow the
checklist. Prefer the project scripts when they fit the local workspace:

```bash
node scripts/generate_ready_resumes_for_drafts.js
```

If a job description is missing, ask the user to paste it or provide approval
to fetch it from the supplied job link. Prefer official employer career pages,
Workday, Ashby, Greenhouse, Lever, iCIMS, SmartRecruiters, or equivalent
official ATS links when available.

Create a `resumes/` folder next to the master resume if it does not exist.
Write each tailored output to:

```text
<master-resume-directory>/resumes/<company-slug>/<role-slug>/
```

Infer company and role names from the job link and description, then slugify
them for folder names.

## Completion Criteria

Before reporting completion:

- If a tracker was used, run
  `sqlite3 data/job_applications.sqlite "PRAGMA integrity_check;"`.
- Confirm generated `.docx` and `_review.md` files exist and are non-empty.
- Confirm generated `.docx` files pass `unzip -t`.
- Summarize the output folder for each company and role, skipped roles, missing
  inputs, and any tracker writes made.
