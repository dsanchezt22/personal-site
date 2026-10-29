export const INTRO_DURATION = 2.2;

export function chapterState(progress, count) {
  const position = Math.max(0, Math.min(1, progress)) * (count - 1);
  const index = Math.round(position);
  const offset = position - index;
  const opacity = Math.max(0, 1 - Math.abs(offset) * 2.5);
  return { index, offset, opacity: opacity * opacity * (3 - 2 * opacity) };
}
