# Data Schema

Use JSON as the source of truth. Keep the schema simple enough to edit by hand.

## Profile

```json
{
  "contact": {
    "name": "ALEX MORGAN",
    "line1": "Austin, TX | 555-010-1234 | alex.morgan@example.com",
    "line2": "linkedin.com/in/alex-morgan | github.com/alexmorgan | alexmorgan.dev"
  },
  "summary": "Default professional summary.",
  "skills": [["Category", "Comma-separated tools and capabilities"]],
  "certifications": ["Certification Name"],
  "education": ["Degree | School | Year"],
  "roles": {
    "role-id": {
      "title": "Job Title",
      "company": "Company",
      "location": "City, ST",
      "dates": "YYYY - Present",
      "bullets": ["Achievement bullet"]
    }
  }
}
```

## Target Jobs

```json
[
  {
    "id": "platform-engineer",
    "company": "Acme Systems",
    "title": "Platform Engineer",
    "keywords": ["Kubernetes", "Terraform"],
    "summary": "Optional tailored summary.",
    "skills": [["Role-Relevant Category", "Keyword list"]],
    "experience": [
      { "role": "role-id", "bullets": [0, 2, 3] }
    ]
  }
]
```

## Rules

- `id` values should be stable, lowercase, and filesystem-safe.
- `experience[].role` must match a key in `profile.roles`.
- Bullet indexes are zero-based.
- Keep factual profile data separate from target-job emphasis.
- Do not put private application answers, recruiter notes, or job-tracker state in either JSON file.
