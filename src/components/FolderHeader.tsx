'use client';

import {
  SECTION_POSITION,
  TAB_LEFT_PCT,
  TAB_W_PCT,
  inactiveTabPath,
  activeHeaderPath,
  scoreLinePath,
  FOLDER_VIEWBOX,
  type Section,
  type TabPosition,
} from '@/lib/folderPaths';

const TABS: { section: Section; label: string; position: TabPosition }[] = [
  { section: 'photography', label: 'Photography', position: 'left' },
  { section: 'artwork', label: 'Artwork', position: 'center' },
  { section: 'audio', label: 'Audio', position: 'right' },
];

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
            width="900"
            height="675"
          >
            <rect width="900" height="675" fill="#e8d5a3" />
            <image
              href="/manilla_texture.jpg"
              width="900"
              height="675"
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>

        {inactivePositions.map((pos) => (
          <path
            key={pos}
            d={inactiveTabPath(pos)}
            fill="url(#manillaPattern)"
            className="folder-tab-inactive"
          />
        ))}

        <path
          d={activeHeaderPath(activePosition)}
          fill="url(#manillaPattern)"
          className="folder-tab-active-shape"
          stroke="rgba(80, 55, 25, 0.18)"
          strokeWidth="1"
        />

        <path
          d={scoreLinePath(activePosition)}
          className="folder-score-line"
        />
      </svg>

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
