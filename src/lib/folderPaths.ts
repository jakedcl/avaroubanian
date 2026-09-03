export type TabPosition = 'left' | 'center' | 'right';
export type Section = 'photography' | 'artwork' | 'audio';

export const SECTION_POSITION: Record<Section, TabPosition> = {
  photography: 'left',
  artwork: 'center',
  audio: 'right',
};

const W = 1000;
const H = 80;
/** Flat top of the folder body */
const EDGE = 52;
/** Top of the tab */
const PEAK = 6;
/** Tab width — a real 1/3-cut is ~31% of the folder */
const TAB_W = 320;
const MARGIN = 32;
/**
 * Width of each die-cut ear. Rise is 46; 64px of run makes a
 * ~45° slope in the middle of the S-curve, like a real 1/3-cut tab.
 */
const SHOULDER = 64;

export const TAB_X: Record<TabPosition, number> = {
  left: MARGIN,
  center: (W - TAB_W) / 2,
  right: W - TAB_W - MARGIN,
};

export const TAB_LEFT_PCT: Record<TabPosition, number> = {
  left: (TAB_X.left / W) * 100,
  center: (TAB_X.center / W) * 100,
  right: (TAB_X.right / W) * 100,
};

export const TAB_W_PCT = (TAB_W / W) * 100;

/**
 * One shoulder: smooth step from the flat edge up onto the tab top.
 * Starts horizontal, ends horizontal — a die-cut ear, not a sharp trapezoid.
 * All points stay at y <= EDGE so nothing carves into the body.
 */
function leftEar(tx: number): string {
  const x1 = tx + SHOULDER;
  return [
    `L ${tx} ${EDGE}`,
    `C ${tx + 18} ${EDGE}`,
    `${x1 - 18} ${PEAK}`,
    `${x1} ${PEAK}`,
  ].join(' ');
}

function rightEar(tx: number): string {
  const tr = tx + TAB_W;
  const x1 = tr - SHOULDER;
  return [
    `C ${x1 + 18} ${PEAK}`,
    `${tr - 18} ${EDGE}`,
    `${tr} ${EDGE}`,
  ].join(' ');
}

function tabTop(tx: number): string {
  return `L ${tx + TAB_W - SHOULDER} ${PEAK}`;
}

export function inactiveTabPath(position: TabPosition): string {
  const tx = TAB_X[position];
  const tr = tx + TAB_W;
  const base = EDGE + 1;
  return [
    `M ${tx + 4} ${base}`,
    `C ${tx + 18} ${base} ${tx + SHOULDER - 18} ${PEAK} ${tx + SHOULDER} ${PEAK}`,
    `L ${tr - SHOULDER} ${PEAK}`,
    `C ${tr - SHOULDER + 18} ${PEAK} ${tr - 18} ${base} ${tr - 4} ${base}`,
    'Z',
  ].join(' ');
}

export function activeHeaderPath(position: TabPosition): string {
  const tx = TAB_X[position];
  return [
    `M 0 ${H}`,
    `L 0 ${EDGE + 6}`,
    `Q 0 ${EDGE} 10 ${EDGE}`,
    leftEar(tx),
    tabTop(tx),
    rightEar(tx),
    `L ${W - 10} ${EDGE}`,
    `Q ${W} ${EDGE} ${W} ${EDGE + 6}`,
    `L ${W} ${H}`,
    'Z',
  ].join(' ');
}

/** Score crease, inset just below the cut edge — follows the tab. */
export function scoreLinePath(position: TabPosition): string {
  const tx = TAB_X[position];
  const tr = tx + TAB_W;
  const e = EDGE + 9;
  const p = PEAK + 9;
  return [
    `M 14 ${e}`,
    `L ${tx} ${e}`,
    `C ${tx + 18} ${e} ${tx + SHOULDER - 18} ${p} ${tx + SHOULDER} ${p}`,
    `L ${tr - SHOULDER} ${p}`,
    `C ${tr - SHOULDER + 18} ${p} ${tr - 18} ${e} ${tr} ${e}`,
    `L ${W - 14} ${e}`,
  ].join(' ');
}

export const FOLDER_VIEWBOX = `0 0 ${W} ${H}`;
export const FOLDER_HEADER_HEIGHT = H;
