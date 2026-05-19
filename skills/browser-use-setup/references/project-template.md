# Project Template

Use this shape for a small Browser Use experiment:

```text
experiments/browser-use-job-application/
├── .gitignore
├── pyproject.toml
├── scout_application.py
└── runs/
```

`.gitignore`:

```gitignore
.venv/
.env
runs/
profiles/
*.log
```

`pyproject.toml`:

```toml
[project]
name = "browser-use-job-application"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "browser-use",
  "python-dotenv"
]
```

Install:

```bash
uv venv --python 3.12
uv pip install -e .
uvx browser-use install
```

Keep real profile data, credentials, screenshots, run reports, and browser state out of the shareable source tree.
