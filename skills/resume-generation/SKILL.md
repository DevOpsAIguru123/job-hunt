---
name: resume-generation
description: Use when generating, tailoring, reviewing, or optimizing resumes from structured profile data and target job descriptions; includes ATS-safe DOCX generation, keyword alignment, bullet improvement, quantification, and privacy-safe resume workflows.
---

# Resume Generation

## Purpose

Generate truthful, ATS-safe resumes from structured profile data and target job inputs. Use this skill when a user wants a resume created, tailored to a job, checked for ATS compatibility, or improved with stronger bullets and metrics.

## Privacy Rules

- Never include private resumes, real contact details, application databases, screenshots, browser profiles, credentials, or generated application evidence in a public bundle.
- Use explicit profile data supplied by the user or placeholder sample data.
- Do not invent employers, degrees, certifications, dates, tools, metrics, or outcomes.
- If a requested keyword is not supported by the profile, mark it as a gap instead of adding it.
- Keep generated output in an ignored `output/` directory unless the user asks for a different destination.

## Workflow

1. Establish inputs.
   - Profile JSON or resume text.
   - Target job JSON, pasted job description, or role title.
   - Output format, normally `.docx`.
   - Whether the task is generation, tailoring, review, or ATS analysis.

2. Normalize the profile.
   - Ensure contact, summary, skills, certifications, education, and roles are available.
   - Convert role bullets into reusable facts.
   - Identify unsupported, vague, or private details before writing output.

3. Analyze the target role.
   - Extract required tools, responsibilities, seniority, domain terms, certifications, and repeated phrases.
   - Classify terms as critical, important, or nice-to-have.
   - Map target keywords to truthful profile evidence.
   - For detailed keyword checks, read `references/ats-checklist.md`.

4. Tailor the resume.
   - Use the target role summary when it is truthful.
   - Prefer exact job-description phrasing only when supported by the profile.
   - Select the most relevant role bullets instead of including every bullet.
   - For tailoring patterns, read `references/tailoring-workflow.md`.

5. Improve bullets and metrics.
   - Start bullets with strong action verbs.
   - Include scale, impact, quality, time, money, or frequency when supported.
   - For bullet rewriting, read `references/bullet-writing.md`.
   - For metric discovery, read `references/quantification.md`.

6. Generate ATS-safe DOCX.
   - Use single-column text layout.
   - Keep contact info in the document body.
   - Use standard headings, fonts, simple bullets, and consistent dates.
   - Use the bundled generator when available:

```bash
node src/generate-resumes.js --profile data/sample-profile.json --jobs data/sample-jobs.json --out output
```

7. Verify before delivery.
   - Run generation for at least one target.
   - Run the privacy check:

```bash
npm run privacy-check
```

   - Scan for private identifiers if the bundle is meant to be shared.

## References

- `references/data-schema.md` - profile and job JSON schema.
- `references/ats-checklist.md` - ATS compatibility and keyword checks.
- `references/tailoring-workflow.md` - target-job tailoring process.
- `references/bullet-writing.md` - achievement bullet patterns.
- `references/quantification.md` - finding defensible metrics.
- `references/privacy-sanitization.md` - public bundle privacy checklist.

## Output Summary

When finished, report:

- Generated resume paths.
- Source profile and job files used.
- Privacy and generation checks run.
- Any unsupported keywords or missing facts.
- Any files intentionally excluded from the public bundle.
