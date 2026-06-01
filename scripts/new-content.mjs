import fs from "node:fs";
import path from "node:path";

const type = process.argv[2];

if (!type) {
  console.error("Usage: node new-content.mjs <type>");
  console.error("Types: post, brief, note, report, update");
  process.exit(1);
}

const collectionMap = {
  post: "posts",
  brief: "briefs",
  note: "notes",
  report: "reports",
  update: "updates",
};

const collection = collectionMap[type];
if (!collection) {
  console.error(`Unknown type: ${type}`);
  console.error("Valid types: post, brief, note, report, update");
  process.exit(1);
}

const now = new Date();
const dateStr = now.toISOString().split("T")[0];
const slug = `${dateStr}-new-${type}`;
const dir = path.join("src", "content", collection);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const filePath = path.join(dir, `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.error(`File already exists: ${filePath}`);
  process.exit(1);
}

const frontmatter = `---
title: "New ${type}"
date: ${dateStr}
type: ${type}
brand: whitzard
authors: []
summary: ""
tags: []
draft: true
---

Write your content here.
`;

fs.writeFileSync(filePath, frontmatter);
console.log(`Created: ${filePath}`);
console.log(`Set draft: true by default. Change to draft: false when ready to publish.`);
