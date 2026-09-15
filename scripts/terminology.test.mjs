import test from "node:test";
import assert from "node:assert/strict";
import { findTerminologyViolations } from "./check-terminology.mjs";

test("flags deprecated NUWA variants without rejecting canonical branding", () => {
  const entries = [
    {
      id: "nuwa",
      status: "locked",
      zh: "女娲",
      en: "NUWA",
      deprecated: ["NVWA", "Nvwa"],
    },
  ];
  const violations = findTerminologyViolations(
    [
      { file: "bad.md", text: "NVWA studies frontier risk." },
      { file: "good.md", text: "女娲 · NUWA" },
    ],
    entries,
  );

  assert.deepEqual(
    violations.map((item) => item.match),
    ["NVWA"],
  );
});

test("skips historical redirect paths and the terminology source itself", () => {
  const entries = [
    {
      id: "nuwa",
      status: "locked",
      zh: "女娲",
      en: "NUWA",
      deprecated: ["NVWA"],
    },
  ];
  const violations = findTerminologyViolations(
    [
      { file: "src/pages/NVWA-Project/index.astro", text: "NVWA" },
      { file: "src/data/terminology.ts", text: "deprecated: ['NVWA']" },
    ],
    entries,
  );

  assert.equal(violations.length, 0);
});

test("reports every deprecated form with its canonical replacement", () => {
  const entries = [
    {
      id: "reasoning-trace",
      status: "preferred",
      zh: "推理轨迹",
      en: "reasoning trace",
      deprecated: ["thought chain"],
    },
    {
      id: "action-impact",
      status: "preferred",
      zh: "行动影响",
      en: "action impact",
      deprecated: ["action effect"],
    },
  ];
  const violations = findTerminologyViolations(
    [{ file: "copy.ts", text: "The thought chain determines the action effect." }],
    entries,
  );

  assert.deepEqual(
    violations.map(({ termId, replacement }) => ({ termId, replacement })),
    [
      { termId: "reasoning-trace", replacement: "reasoning trace" },
      { termId: "action-impact", replacement: "action impact" },
    ],
  );
});
