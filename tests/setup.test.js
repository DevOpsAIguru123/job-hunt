const { test, expect } = require('@playwright/test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const packageRoot = path.resolve(__dirname, '..');
const installer = path.join(packageRoot, 'install.sh');

function runInstaller(args, options = {}) {
  return spawnSync('bash', [installer, ...args], {
    cwd: packageRoot,
    encoding: 'utf8',
    env: { ...process.env, ...options.env },
  });
}

test('installer dry run reports Codex and Claude Code destinations', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'jobhunt-setup-home-'));
  try {
    const result = runInstaller(['--dry-run'], { env: { HOME: home } });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(path.join(home, '.codex', 'skills', 'jobhunt-ready-refresh'));
    expect(result.stdout).toContain(path.join(home, '.claude', 'skills', 'jobhunt-ready-refresh'));
    expect(fs.existsSync(path.join(home, '.codex'))).toBe(false);
    expect(fs.existsSync(path.join(home, '.claude'))).toBe(false);
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('installer copies the jobhunt skill to Codex and Claude Code', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'jobhunt-setup-home-'));
  try {
    const result = runInstaller(['--yes'], { env: { HOME: home } });

    expect(result.status).toBe(0);
    for (const agentDir of ['.codex', '.claude']) {
      const skillDir = path.join(home, agentDir, 'skills', 'jobhunt-ready-refresh');
      expect(fs.existsSync(path.join(skillDir, 'SKILL.md'))).toBe(true);
      expect(fs.existsSync(path.join(skillDir, 'references', 'workflow.md'))).toBe(true);
      expect(fs.existsSync(path.join(skillDir, 'agents', 'openai.yaml'))).toBe(true);
      expect(fs.existsSync(path.join(skillDir, '.env'))).toBe(false);
      expect(fs.existsSync(path.join(skillDir, 'data'))).toBe(false);
      expect(fs.existsSync(path.join(skillDir, 'resumes'))).toBe(false);
    }
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('open-source docs and ignore rules protect private local artifacts', () => {
  const readme = fs.readFileSync(path.join(packageRoot, 'README.md'), 'utf8');
  const gitignore = fs.readFileSync(path.join(packageRoot, '.gitignore'), 'utf8');

  expect(readme).toContain('One-command setup');
  expect(readme).toContain('Codex');
  expect(readme).toContain('Claude Code');
  expect(readme).toContain('The user must provide the master resume path, job links, and job descriptions');
  expect(readme).toContain('<master-resume-directory>/resumes/<company-slug>/<role-slug>/');
  expect(readme).toContain('Do not commit private applicant data');
  expect(gitignore).toContain('.env');
  expect(gitignore).toContain('data/*.sqlite');
  expect(gitignore).toContain('resumes/');
  expect(gitignore).toContain('runs/');
  expect(gitignore).toContain('data/browser-profiles/');
});
