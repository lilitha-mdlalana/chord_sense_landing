// ChordDiagram — vertical fretboard chord chart.
// Props:
//   chord: chord object from CHORDS
//   size: 'sm' | 'md' | 'lg'  (controls cell size)
//   accent: hex string for active dots (defaults to var(--accent))
//   muted: bool — render in greyscale (used for non-today chords if desired)

function ChordDiagram({ chord, size = 'lg', accent = 'var(--accent)', showName = false }) {
  if (!chord) return null;

  // Cell sizes
  const CELL = size === 'sm' ? 14 : size === 'md' ? 22 : 30;
  const STROKE = size === 'sm' ? 1 : size === 'md' ? 1.25 : 1.5;
  const DOT = size === 'sm' ? 6 : size === 'md' ? 9 : 12;
  const FONT_SM = size === 'sm' ? 7 : size === 'md' ? 10 : 12;
  const LABEL_FS = size === 'sm' ? 9 : size === 'md' ? 12 : 14;

  const NUM_STRINGS = 6;
  const NUM_FRETS = 5;

  // Geometry
  const padX = CELL * 0.9;
  const padTopForMarkers = CELL * 0.95;
  const padTop = padTopForMarkers;
  const padBottom = CELL * 0.6;
  const gridW = CELL * (NUM_STRINGS - 1);
  const gridH = CELL * NUM_FRETS;
  const W = gridW + padX * 2;
  const H = gridH + padTop + padBottom;

  // strings drawn from low-E (left) to high-E (right) — index 0..5
  // chord.frets is ordered low → high, same order.
  const isOpenPosition = chord.baseFret === 1;

  const stringX = (i) => padX + i * CELL;
  const fretY = (f) => padTop + f * CELL; // f=0 is the nut/top

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {showName && (
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600,
          letterSpacing: '-0.01em', color: 'var(--ink)',
        }}>{chord.name}</div>
      )}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        {/* String/fret marker row above (open / muted) */}
        {chord.frets.map((f, i) => {
          const x = stringX(i);
          const y = padTop - CELL * 0.45;
          if (f === -1) {
            return (
              <text key={`m-${i}`} x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
                fontSize={LABEL_FS} fontWeight="500" fill="var(--ink-3)"
                style={{ fontFamily: 'var(--font-ui)' }}>×</text>
            );
          }
          if (f === 0) {
            return (
              <circle key={`m-${i}`} cx={x} cy={y} r={DOT * 0.42}
                fill="none" stroke="var(--ink-3)" strokeWidth={STROKE} />
            );
          }
          return null;
        })}

        {/* Nut (thick top line) — only when in open position */}
        {isOpenPosition && (
          <rect x={padX - STROKE / 2} y={padTop - STROKE * 1.5}
            width={gridW + STROKE} height={STROKE * 3}
            fill="var(--ink)" />
        )}
        {/* Top fret line (thin, when not at nut) */}
        {!isOpenPosition && (
          <line x1={padX} y1={padTop} x2={padX + gridW} y2={padTop}
            stroke="var(--ink-2)" strokeWidth={STROKE} />
        )}

        {/* Frets (horizontal) */}
        {Array.from({ length: NUM_FRETS }).map((_, i) => (
          <line key={`f-${i}`}
            x1={padX} y1={fretY(i + 1)}
            x2={padX + gridW} y2={fretY(i + 1)}
            stroke="var(--ink-2)" strokeWidth={STROKE} />
        ))}

        {/* Strings (vertical) */}
        {Array.from({ length: NUM_STRINGS }).map((_, i) => (
          <line key={`s-${i}`}
            x1={stringX(i)} y1={padTop}
            x2={stringX(i)} y2={padTop + gridH}
            stroke="var(--ink-2)" strokeWidth={STROKE} />
        ))}

        {/* Base fret label, when offset from nut */}
        {!isOpenPosition && (
          <text x={padX - CELL * 0.45} y={fretY(0.5) + 1}
            textAnchor="end" dominantBaseline="middle"
            fontSize={FONT_SM + 1} fontWeight="500"
            fill="var(--ink-3)" style={{ fontFamily: 'var(--font-ui)' }}>
            {chord.baseFret}fr
          </text>
        )}

        {/* Barre */}
        {chord.barre && (() => {
          const f = chord.barre.fret;
          // strings are 1-indexed in chord notation; "from" 1 = highest string (high E),
          // we'll treat as inclusive range. Convert to low→high indexes.
          // Convention used in CHORDS data above: string 1 = low E (index 0), 6 = high E (index 5).
          const lo = Math.min(chord.barre.from, chord.barre.to) - 1;
          const hi = Math.max(chord.barre.from, chord.barre.to) - 1;
          const x1 = stringX(lo);
          const x2 = stringX(hi);
          const y = fretY(f - 0.5);
          return (
            <rect
              x={x1 - DOT * 0.55} y={y - DOT * 0.55}
              width={(x2 - x1) + DOT * 1.1} height={DOT * 1.1}
              rx={DOT * 0.55} ry={DOT * 0.55}
              fill={accent}
            />
          );
        })()}

        {/* Finger dots */}
        {chord.frets.map((f, i) => {
          if (f <= 0) return null;
          const relFret = f - chord.baseFret + 1;
          if (relFret < 1 || relFret > NUM_FRETS) return null;
          const cx = stringX(i);
          const cy = fretY(relFret - 0.5);
          const finger = chord.fingers && chord.fingers[i];
          return (
            <g key={`d-${i}`}>
              <circle cx={cx} cy={cy} r={DOT * 0.85} fill={accent} />
              {size === 'lg' && finger > 0 && (
                <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
                  fontSize={DOT} fontWeight="600" fill="#fff"
                  style={{ fontFamily: 'var(--font-ui)' }}>{finger}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

window.ChordDiagram = ChordDiagram;
