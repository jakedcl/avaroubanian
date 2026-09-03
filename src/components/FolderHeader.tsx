'use client';

import {
  SECTION_POSITION,
  inactiveTabPath,
  activeHeaderPath,
  FOLDER_VIEWBOX,
  type Section,
  type TabPosition,
} from '@/lib/folderPaths';

const TABS: { section: Section; label: string; position: TabPosition }[] = [
  { section: 'photography', label: 'Photography', position: 'left' },
  { section: 'artwork', label: 'Artwork', position: 'center' },
  { section: 'audio', label: 'Audio', position: 'right' },
];

const TAB_W_PCT = 30;
const TAB_LEFT_PCT: Record<TabPosition, number> = {
  left: 2.2,
  center: 35,
  right: 67.8,
};

interface FolderHeaderProps {
  activeSection: Section;
  onTabChange: (section: Section) => void;
}

export default function FolderHeader({ activeSection, onTabChange }: FolderHeaderProps) {
  const activePosition = SECTION_POSITION[activeSection];
  const inactivePositions = TABS
    .map((t) => t.position)
    .filter((p) => p !== activePosition);

  return (
    <div className="folder-header">
      <svg
        className="folder-header-svg"
        viewBox={FOLDER_VIEWBOX}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="manillaPattern"
            patternUnits="userSpaceOnUse"
            width="360"
            height="360"
          >
            <image
              href="/manilla_texture.jpg"
              width="360"
              height="360"
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
          <linearGradient id="manillaShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.06)" />
          </linearGradient>
        </defs>

        {/* Inactive tabs peeking from behind */}
        {inactivePositions.map((pos) => (
          <path
            key={pos}
            d={inactiveTabPath(pos)}
            fill="url(#manillaPattern)"
            className="folder-tab-inactive"
          />
        ))}

        {/* Active folder header — tab + back panel as one shape */}
        <path
          d={activeHeaderPath(activePosition)}
          fill="url(#manillaPattern)"
          className="folder-tab-active-shape"
        />

        {/* Subtle top highlight */}
        <path
          d={activeHeaderPath(activePosition)}
          fill="url(#manillaShade)"
          className="folder-tab-highlight"
        />

        {/* Score / fold line below tab */}
        <line
          x1="0"
          y1={56}
          x2="1000"
          y2={56}
          className="folder-score-line"
        />
      </svg>

      {/* Click targets */}
      {TABS.map(({ section, label, position }) => (
        <button
          key={section}
          type="button"
          className={`folder-tab-btn ${activeSection === section ? 'active' : ''}`}
          style={{
            left: `${TAB_LEFT_PCT[position]}%`,
            width: `${TAB_W_PCT}%`,
          }}
          onClick={() => onTabChange(section)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
