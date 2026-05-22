# Jobhunt Application Prep Workflow

## Guardrails

- Treat employment applications as high-impact actions.
- Do not submit applications.
- Do not mark rows `applied` unless the user confirms submission.
- Do not invent applicant facts, employers, degrees, dates, locations, metrics,
  certifications, tools, or security clearances.
- Do not search for jobs unless the user asks for that separately.
- The user must provide a master resume path, job links, and job descriptions.
  If a job description is missing, ask the user to paste it or approve fetching
  it from the supplied link.
- If using a tracker, add supplied jobs as `draft` until tailored materials are
  generated and reviewed.

## Database

Tracker:

```text
data/job_applications.sqlite
```

Main table:

```sql
applications(
  id, company_name, role_title, role_slug, job_id, job_url, application_url,
  ats_type, date_found, resume_generated_at, resume_path, review_path,
  status, applied_at, followup_at, followup_note, notes, created_at, updated_at
)
```

Before writes:

1. Create `data/backups/job_applications_YYYY-MM-DD_HHMMSS_before_<action>.sqlite`.
2. Ensure `application_audit` exists.
3. Ensure insert/update/delete audit triggers exist for `applications`.

Use `source` values such as `profile-job-resume-pipeline` or
`jobhunt-ready-refresh`.

The tracker is optional for the open-source setup. If the user only wants
resume outputs, generate the files and skip database writes.

## Required Input

For each role, collect:

- Master resume path
- Company name
- Role title
- Job link
- Full job description
- Any constraints the user wants honored, such as location, sponsorship, salary,
  seniority, or technologies to emphasize

If the user provides multiple jobs, process them one at a time and keep a clear
summary of which files were generated for each role.

## Output Structure

Use the directory containing the master resume as the output root. Create a
`resumes/` folder there if it does not already exist:

```text
<master-resume-directory>/resumes/
```

For each role, infer the company and role from the job link and description,
then create:

```text
<master-resume-directory>/resumes/<company-slug>/<role-slug>/
```

Folder slugs should be lowercase ASCII, replace non-alphanumeric runs with
underscores, and trim leading or trailing underscores. Store the tailored
resume and review note in that role folder.

Suggested file names:

```text
<role-slug>.docx
<role-slug>_review.md
```

## Optional Tracker Entry

When the user wants local tracking, insert supplied jobs with:

- `status='draft'`
- `date_found` as the date the user supplied the role
- `resume_path` set to the master resume until a tailored resume is generated
- notes stating that the row came from user-provided link and description

After tailored materials are generated, update:

- `resume_path`
- `review_path`
- `resume_generated_at`
- `status`, only if the user wants a tracker status such as `ready`

## Generate Resumes And Review Notes

Run:

```bash
node scripts/generate_ready_resumes_for_drafts.js
```

This script may be adapted for rows with `status='draft'` or for direct
user-provided role data. It should generate a tailored `.docx` and `_review.md`
for each supplied role.

Use only facts from the local profile and resume materials. Do not invent
employers, degrees, dates, tools, certifications, metrics, or locations.

Expected artifact:

```text
data/activity_checks/resumes_generated_YYYY-MM-DD.json
```

## Verification Commands

If a tracker was used, run:

```bash
sqlite3 data/job_applications.sqlite "PRAGMA integrity_check;"
sqlite3 -header -column data/job_applications.sqlite "SELECT status, COUNT(*) AS count FROM applications GROUP BY status ORDER BY status;"
sqlite3 -header -column data/job_applications.sqlite "SELECT action, COUNT(*) AS count FROM application_audit WHERE changed_at >= datetime('now', '-1 day') GROUP BY action ORDER BY action;"
```

Check generated files:

```bash
node -e 'const fs=require("fs"); const file=process.argv[1]; const data=require(file); let bad=[]; for (const r of data.results||[]) for (const k of ["resumePath","reviewPath"]) if (!fs.existsSync(r[k]) || fs.statSync(r[k]).size===0) bad.push(r[k]); console.log({checked:data.count||0,bad});' ./data/activity_checks/resumes_generated_YYYY-MM-DD.json
```

Check DOCX archives:

```bash
node -e 'const fs=require("fs"),{spawnSync}=require("child_process"); const file=process.argv[1]; const data=require(file); let bad=[]; for (const r of data.results||[]) if (spawnSync("unzip",["-t",r.resumePath]).status!==0) bad.push(r.resumePath); console.log({checked:data.count||0,bad});' ./data/activity_checks/resumes_generated_YYYY-MM-DD.json
```

Adjust artifact date names to the current run date.
