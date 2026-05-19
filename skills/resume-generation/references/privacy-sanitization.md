# Privacy Sanitization

## Exclude From Shareable Bundles

- Real resumes and generated `.docx` or `.pdf` files.
- Personal profile JSON.
- Application tracker databases.
- Screenshots, browser profiles, run logs, and submission evidence.
- API keys, `.env` files, credentials, cookies, and session state.
- Employer-specific private notes or recruiter correspondence.

## Include Instead

- Placeholder sample profile data.
- Placeholder target jobs.
- Generic scripts.
- Generic skill instructions.
- Generic references and schemas.

## Checks

Run:

```bash
npm run privacy-check
```

Then scan for known private names, emails, phone numbers, employer names, and usernames before sharing.

## Review Questions

- Could a stranger identify the original candidate?
- Does any file reveal application history or job targets?
- Does any generated document contain real resume content?
- Are outputs ignored or stored outside the shareable folder?
- Are all examples obviously fake or generic?
