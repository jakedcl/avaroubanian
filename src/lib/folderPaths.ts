export type TabPosition = 'left' | 'center' | 'right';
export type Section = 'photography' | 'artwork' | 'audio';

export const SECTION_POSITION: Record<Section, TabPosition> = {
  photography: 'left',
  artwork: 'center',
  audio: 'right',
};

const W = 1000;
const BODY = 56;
const TAB_W = 300;
const TAB_TOP = 6;
const MARGIN = 22;

export const TAB_X: Record<TabPosition, number> = {
  left: MARGIN,
  center: (W - TAB_W) / 2,
  right: W - TAB_W - MARGIN,
};

/** Inactive tab peeking from behind the active folder */
export function inactiveTabPath(position: TabPosition): string {
  const tx = TAB_X[position];
  const tr = tx + TAB_W;
  const mid = tx + TAB_W / 2;
  const peek = BODY - 5;

  return `
    M ${tx + 22} ${peek}
    C ${tx + 12} ${peek} ${tx + 6} ${peek - 3} ${tx + 6} ${TAB_TOP + 30}
    C ${tx + 10} ${TAB_TOP + 10} ${tx + TAB_W * 0.22} ${TAB_TOP + 2} ${mid} ${TAB_TOP + 2}
    C ${tx + TAB_W * 0.78} ${TAB_TOP + 2} ${tr - 10} ${TAB_TOP + 10} ${tr - 6} ${TAB_TOP + 30}
    C ${tr - 6} ${peek - 3} ${tr - 12} ${peek} ${tr - 22} ${peek}
    Z
  `;
}

/** Active folder header — one continuous fluid shape */
export function activeHeaderPath(position: TabPosition): string {
  const tx = TAB_X[position];
  const tr = tx + TAB_W;
  const mid = tx + TAB_W / 2;

  return `
    M 0 ${BODY}
    L 0 14
    C 0 8 6 8 14 8
    L ${tx - 34} 8
    C ${tx - 24} 8 ${tx - 18} ${BODY} ${tx - 8} ${BODY - 2}
    C ${tx + 2} ${BODY - 14} ${tx + 10} ${TAB_TOP + 10} ${tx + TAB_W * 0.2} ${TAB_TOP + 2}
    C ${mid - 50} ${TAB_TOP} ${mid + 50} ${TAB_TOP} ${tx + TAB_W * 0.8} ${TAB_TOP + 2}
    C ${tr - 10} ${TAB_TOP + 10} ${tr - 2} ${BODY - 14} ${tr + 8} ${BODY - 2}
    C ${tr + 18} ${BODY} ${tr + 24} 8 ${tr + 34} 8
    L ${W - 14} 8
    C ${W - 6} 8 ${W} 8 ${W} 14
    L ${W} ${BODY}
    Z
  `;
}

export const FOLDER_VIEWBOX = `0 0 ${W} ${BODY}`;
export const FOLDER_HEADER_HEIGHT = BODY;
