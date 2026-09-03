export type TabPosition = 'left' | 'center' | 'right';
export type Section = 'photography' | 'artwork' | 'audio';

export const SECTION_POSITION: Record<Section, TabPosition> = {
  photography: 'left',
  artwork: 'center',
  audio: 'right',
};

/** SVG coordinate space */
const W = 1000;
const H = 72;
/** Flat top of the folder body (tab rises above this) */
const EDGE = 46;
/** Top of the raised tab */
const PEAK = 8;
const TAB_W = 292;
const MARGIN = 28;
/** How much the tab top is narrower than the base (each side) */
const SLOPE = 34;
/** Corner rounding on tab top */
const ROUND = 20;

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
 * Rounded trapezoid tab sitting on the folder edge.
 * Path never drops below EDGE — that was causing the V-notches.
 */
function tabBump(tx: number): string {
  const tr = tx + TAB_W;
  const topL = tx + SLOPE;
  const topR = tr - SLOPE;

  return [
    // along the edge to the tab base
    `L ${tx} ${EDGE}`,
    // left shoulder: rise along the slope, then round into the top
    `C ${tx + 22} ${EDGE} ${topL - 4} ${PEAK + 26} ${topL} ${PEAK + ROUND}`,
    `Q ${topL} ${PEAK} ${topL + ROUND} ${PEAK}`,
    // flat-ish tab top
    `L ${topR - ROUND} ${PEAK}`,
    // right shoulder: round off, then descend to the edge
    `Q ${topR} ${PEAK} ${topR} ${PEAK + ROUND}`,
    `C ${topR + 4} ${PEAK + 26} ${tr - 22} ${EDGE} ${tr} ${EDGE}`,
  ].join(' ');
}

/** Inactive tab peeking above the front folder's flat edge */
export function inactiveTabPath(position: TabPosition): string {
  const tx = TAB_X[position];
  const tr = tx + TAB_W;
  const topL = tx + SLOPE;
  const topR = tr - SLOPE;
  const base = EDGE + 2;

  return [
    `M ${tx + 8} ${base}`,
    `C ${tx + 22} ${base} ${topL - 4} ${PEAK + 26} ${topL} ${PEAK + ROUND}`,
    `Q ${topL} ${PEAK} ${topL + ROUND} ${PEAK}`,
    `L ${topR - ROUND} ${PEAK}`,
    `Q ${topR} ${PEAK} ${topR} ${PEAK + ROUND}`,
    `C ${topR + 4} ${PEAK + 26} ${tr - 22} ${base} ${tr - 8} ${base}`,
    'Z',
  ].join(' ');
}

/** Active folder: flat top edge + one tab bump. One continuous silhouette. */
export function activeHeaderPath(position: TabPosition): string {
  const tx = TAB_X[position];

  return [
    `M 0 ${H}`,
    `L 0 ${EDGE + 8}`,
    `Q 0 ${EDGE} 12 ${EDGE}`,
    tabBump(tx),
    `L ${W - 12} ${EDGE}`,
    `Q ${W} ${EDGE} ${W} ${EDGE + 8}`,
    `L ${W} ${H}`,
    'Z',
  ].join(' ');
}

export const FOLDER_VIEWBOX = `0 0 ${W} ${H}`;
export const FOLDER_HEADER_HEIGHT = H;
