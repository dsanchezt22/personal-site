import assert from "node:assert/strict";
import { chapterState, chipHeight } from "../journey.js";
const count = 6;
for (let index = 0; index < count; index++) {
  const state = chapterState(index / (count - 1), count);
  assert.equal(
    state.index,
    index,
    "Each chapter must be readable at its own scroll stop",
  );
  assert.equal(state.opacity, 1);
}
assert.deepEqual(chapterState(-1, count), chapterState(0, count));
assert.deepEqual(chapterState(2, count), chapterState(1, count));
assert.equal(
  chapterState(0.1, count).opacity,
  0,
  "Camera travel should have an unobstructed transition",
);
assert.equal(chapterState(0.3, count).index, 2);
assert.equal(
  chapterState(0.2, count).index,
  1,
  "Reversing scroll must return to the previous chapter",
);
assert.ok(chapterState(0.23, count).opacity > 0);
console.log(
  "PASS: six readable stops, bounded scroll, clear transitions, and reversible chapter selection.",
);

assert.equal(chipHeight(0), 2.27);
assert.ok(chipHeight(0.1) - chipHeight(0.2) < chipHeight(0.3) - chipHeight(0.4), "Chip fall accelerates");
assert.equal(chipHeight(0.56), 0.27);
assert.ok(chipHeight(0.6) >= 0.27 && chipHeight(0.6) < 0.305);
assert.equal(chipHeight(2.2), 0.27);
console.log("PASS: accelerated chip descent, bounded contact, and settled position within the unchanged intro.");
