#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const blockedNames = [
  ".env",
  "applicant.json",
  "job_applications.sqlite",
  "applications.db",
];
const blockedDirs = [
  "resumes",
  "runs",
  "screenshots",
  "browser-profiles",
  "submission_evidence",
];
const blockedExtensions = new Set([".sqlite", ".db", ".docx", ".pdf"]);
const privatePatterns = [
  /@gmail\.com/i,
  /linkedin\.com\/in\/replace-me/i,
  /github\.com\/replace-me/i,
  /\b(?!555)\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/,
];

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(ROOT, fullPath);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "output") continue;
      results.push(relPath);
      walk(fullPath, results);
    } else {
      results.push(relPath);
    }
  }
  return results;
}

function isTextFile(filePath) {
  return [".js", ".json", ".md", ".txt", ".gitignore"].includes(path.extname(filePath));
}

const findings = [];
for (const relPath of walk(ROOT)) {
  const base = path.basename(relPath);
  const parts = relPath.split(path.sep);
  const ext = path.extname(relPath);

  if (blockedNames.includes(base)) findings.push(`${relPath}: blocked private filename`);
  if (parts.some((part) => blockedDirs.includes(part))) findings.push(`${relPath}: blocked private directory`);
  if (blockedExtensions.has(ext) && !relPath.startsWith(`output${path.sep}`)) {
    findings.push(`${relPath}: generated/private document or database extension`);
  }

  const fullPath = path.join(ROOT, relPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile() && isTextFile(fullPath)) {
    const text = fs.readFileSync(fullPath, "utf8");
    for (const pattern of privatePatterns) {
      if (pattern.test(text)) findings.push(`${relPath}: matched private pattern ${pattern}`);
    }
  }
}

if (findings.length) {
  console.error("Privacy check failed:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Privacy check passed.");
