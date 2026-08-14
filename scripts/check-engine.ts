import {
  ENGINE_CONFIG,
  errorBudget,
  priorities,
  scoreSection,
  scoreTotal,
  type SectionId,
  type SectionInput,
} from "@/lib/engine";

type Failure = string;

const failures: Failure[] = [];
const fail = (message: string): void => {
  failures.push(message);
};
const isMultipleOf10 = (value: number): boolean => value % 10 === 0;

const ZERO: SectionInput = { m1Mistakes: 0, m2Mistakes: 0 };
const SECTIONS: SectionId[] = ["rw", "math"];
const TARGETS = [1300, 1400, 1500, 1600];

// Fills M2 mistakes first, then overflows into M1 — reproduces the exact
// totalCorrect value scanSectionBudget found, so the round-trip should land
// exactly on target, not just "close enough".
const spendBudget = (section: SectionId, mistakes: number): SectionInput => {
  const cfg = ENGINE_CONFIG[section];
  const m2Mistakes = Math.min(mistakes, cfg.m2Questions);
  return { m1Mistakes: mistakes - m2Mistakes, m2Mistakes };
};

// ---- Reference table ------------------------------------------------------
console.log("=== Score Strategist engine — reference table ===\n");

const perfect = scoreTotal({ rw: ZERO, math: ZERO });
console.log(`0 mistakes -> total ${perfect.total} (expect 1600)`);

const worst = scoreTotal({
  rw: { m1Mistakes: ENGINE_CONFIG.rw.m1Questions, m2Mistakes: ENGINE_CONFIG.rw.m2Questions },
  math: { m1Mistakes: ENGINE_CONFIG.math.m1Questions, m2Mistakes: ENGINE_CONFIG.math.m2Questions },
});
console.log(`all wrong -> total ${worst.total} (expect 400)\n`);

for (const section of SECTIONS) {
  const cfg = ENGINE_CONFIG[section];
  const atThreshold = scoreSection(section, { m1Mistakes: cfg.m1Questions - cfg.routingThreshold, m2Mistakes: 0 });
  const belowThreshold = scoreSection(section, {
    m1Mistakes: cfg.m1Questions - cfg.routingThreshold + 1,
    m2Mistakes: 0,
  });
  console.log(
    `${section} @threshold:   route=${atThreshold.route} score=${atThreshold.score} distanceToThreshold=${atThreshold.distanceToThreshold}`,
  );
  console.log(
    `${section} @threshold-1: route=${belowThreshold.route} score=${belowThreshold.score} distanceToThreshold=${belowThreshold.distanceToThreshold}`,
  );
}
console.log("");

for (const target of TARGETS) {
  const budget = errorBudget(target);
  console.log(
    `errorBudget(${target}): reachable=${budget.reachable} range=~${budget.totalRange.low}-${budget.totalRange.high}`,
  );
  console.log(`  ${budget.perSection.rw.note}`);
  console.log(`  ${budget.perSection.math.note}`);
}
console.log("");

console.log(`priorities(all-zero): ${JSON.stringify(priorities(perfect))}\n`);

// ---- Assertions -------------------------------------------------------------
for (const section of SECTIONS) {
  const cfg = ENGINE_CONFIG[section];
  for (let m1 = 0; m1 <= cfg.m1Questions; m1 += 1) {
    for (let m2 = 0; m2 <= cfg.m2Questions; m2 += 1) {
      const result = scoreSection(section, { m1Mistakes: m1, m2Mistakes: m2 });

      if (![result.score, result.scoreLow, result.scoreHigh].every(isMultipleOf10)) {
        fail(`${section} (${m1},${m2}): a value is not a multiple of 10`);
      }
      if (result.score < 200 || result.score > 800 || result.scoreLow < 200 || result.scoreHigh > 800) {
        fail(`${section} (${m1},${m2}): out of [200,800] range`);
      }
      if (
        result.route === "easy" &&
        (result.score > ENGINE_CONFIG.easyRouteCap[section] ||
          result.scoreHigh > ENGINE_CONFIG.easyRouteCap[section])
      ) {
        fail(`${section} (${m1},${m2}): easy score/scoreHigh exceeds cap`);
      }
      if (result.marginalCost < 0) fail(`${section} (${m1},${m2}): negative marginalCost`);

      // Per-section monotonicity is sufficient proof for TotalResult too:
      // scoreSection depends only on its own section's input, and a sum of
      // two independently non-increasing functions is non-increasing.
      if (m1 > 0) {
        const prev = scoreSection(section, { m1Mistakes: m1 - 1, m2Mistakes: m2 });
        if (result.score > prev.score) fail(`${section}: score rose on an M1 mistake at (${m1},${m2})`);
      }
      if (m2 > 0) {
        const prev = scoreSection(section, { m1Mistakes: m1, m2Mistakes: m2 - 1 });
        if (result.score > prev.score) fail(`${section}: score rose on an M2 mistake at (${m1},${m2})`);
      }
    }
  }
}

for (const target of TARGETS) {
  const budget = errorBudget(target);
  if (!budget.reachable) continue;
  const spentTotal = scoreTotal({
    rw: spendBudget("rw", budget.perSection.rw.total),
    math: spendBudget("math", budget.perSection.math.total),
  });
  if (spentTotal.total < target) {
    fail(`budget round-trip @${target}: spending the full card budgets only reaches ${spentTotal.total}`);
  }
}

if (failures.length > 0) {
  console.error(`\ncheck-engine: ${failures.length} assertion(s) failed\n`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}

console.log("check-engine: all assertions passed");
process.exit(0);
