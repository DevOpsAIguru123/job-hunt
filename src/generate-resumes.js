#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  TextRun,
} = require("docx");

const ACCENT = "1F4E79";
const GRAY = "555555";
const FONT = "Arial";

function parseArgs(argv) {
  const args = {
    profile: path.resolve("data/sample-profile.json"),
    jobs: path.resolve("data/sample-jobs.json"),
    out: path.resolve("output"),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--profile") args.profile = path.resolve(argv[++i]);
    else if (arg === "--jobs") args.jobs = path.resolve(argv[++i]);
    else if (arg === "--out") args.out = path.resolve(argv[++i]);
    else if (arg === "--job-id") args.jobId = argv[++i];
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function usage() {
  return [
    "Usage:",
    "  node src/generate-resumes.js [--profile data/profile.json] [--jobs data/jobs.json] [--out output] [--job-id id]",
  ].join("\n");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function cleanText(value) {
  return String(value || "").replace(/&/g, "and").replace(/\s+/g, " ").trim();
}

function slug(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function textRun(text, options = {}) {
  return new TextRun({ text: cleanText(text), font: FONT, ...options });
}

function paragraph(children, options = {}) {
  return new Paragraph({
    spacing: { before: 0, after: 80, line: 220 },
    ...options,
    children,
  });
}

function simpleParagraph(text, options = {}) {
  return paragraph([textRun(text, { size: options.size || 20, color: options.color })], {
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: { before: options.before || 0, after: options.after ?? 80, line: options.line || 220 },
  });
}

function heading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    border: {
      bottom: { color: ACCENT, style: BorderStyle.SINGLE, size: 6 },
    },
    spacing: { before: 160, after: 90 },
    children: [textRun(text.toUpperCase(), { bold: true, size: 22, color: ACCENT })],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "resume-bullets", level: 0 },
    spacing: { before: 0, after: 55, line: 210 },
    children: [textRun(text, { size: 18 })],
  });
}

function skillLine(label, value) {
  return paragraph([
    textRun(`${label}: `, { bold: true, size: 18 }),
    textRun(value, { size: 18 }),
  ], { spacing: { before: 0, after: 45, line: 210 } });
}

function roleHeader(role) {
  return paragraph([
    textRun(`${role.title} | ${role.company}`, { bold: true, size: 19 }),
    textRun(` | ${role.location} | ${role.dates}`, { size: 18, color: GRAY }),
  ], { spacing: { before: 90, after: 45, line: 210 }, keepNext: true });
}

function selectedExperience(profile, job) {
  const selections = job.experience && job.experience.length
    ? job.experience
    : Object.keys(profile.roles).map((role) => ({ role }));

  const blocks = [];
  for (const selection of selections) {
    const role = profile.roles[selection.role];
    if (!role) throw new Error(`Job ${job.id} references unknown role: ${selection.role}`);

    const indexes = selection.bullets || role.bullets.map((_, index) => index);
    blocks.push(roleHeader(role));
    for (const index of indexes) {
      if (!role.bullets[index]) throw new Error(`Role ${selection.role} has no bullet at index ${index}`);
      blocks.push(bullet(role.bullets[index]));
    }
  }
  return blocks;
}

function mergedSkills(profile, job) {
  const seen = new Set();
  const rows = [];
  for (const [label, value] of [...(job.skills || []), ...(profile.skills || [])]) {
    const key = label.toLowerCase();
    if (!seen.has(key)) {
      rows.push([label, value]);
      seen.add(key);
    }
  }
  return rows;
}

function buildDocument(profile, job) {
  const contact = profile.contact || {};
  const summary = job.summary || profile.summary;
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 45 },
      children: [textRun(contact.name, { bold: true, size: 30, color: ACCENT })],
    }),
    simpleParagraph(contact.line1, { alignment: AlignmentType.CENTER, size: 18, color: GRAY, after: 20 }),
    simpleParagraph(contact.line2, { alignment: AlignmentType.CENTER, size: 18, color: GRAY, after: 110 }),
    heading("Professional Summary"),
    simpleParagraph(summary, { size: 19, after: 100 }),
    heading("Technical Skills"),
    ...mergedSkills(profile, job).map(([label, value]) => skillLine(label, value)),
  ];

  if (profile.certifications && profile.certifications.length) {
    children.push(heading("Certifications"));
    children.push(simpleParagraph(profile.certifications.join(" | "), { size: 18, after: 90 }));
  }

  children.push(heading("Professional Experience"));
  children.push(...selectedExperience(profile, job));

  if (profile.education && profile.education.length) {
    children.push(heading("Education"));
    for (const item of profile.education) {
      children.push(simpleParagraph(item, { size: 18, after: 30 }));
    }
  }

  return new Document({
    creator: "Job Hunt",
    title: `${contact.name || "Candidate"} - ${job.title}`,
    description: `Resume tailored for ${job.company} ${job.title}`,
    styles: {
      default: { document: { run: { font: FONT, size: 20 } } },
      paragraphStyles: [
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 22, bold: true, font: FONT, color: ACCENT },
          paragraph: { spacing: { before: 160, after: 90 }, outlineLevel: 1 },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: "resume-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "\u2022",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 360, hanging: 180 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  });
}

async function writeResume(profile, job, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const fileName = `${slug(job.company)}-${slug(job.title || job.id)}.docx`;
  const outputPath = path.join(outDir, fileName);
  const doc = buildDocument(profile, job);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  const profile = readJson(args.profile);
  let jobs = readJson(args.jobs);
  if (!Array.isArray(jobs)) throw new Error("Jobs file must contain an array.");
  if (args.jobId) jobs = jobs.filter((job) => job.id === args.jobId);
  if (!jobs.length) throw new Error(args.jobId ? `No job found for --job-id ${args.jobId}` : "No jobs found.");

  for (const job of jobs) {
    const outputPath = await writeResume(profile, job, args.out);
    console.log(`Created ${outputPath}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
