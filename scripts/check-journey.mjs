import assert from "node:assert/strict";
import { chapterState } from "../journey.js";
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
