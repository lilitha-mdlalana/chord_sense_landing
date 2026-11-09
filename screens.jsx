// ChordSense screens — Home, Detail, Saved + shuffle exploration loop.
// Three home layout variants (toggle via Tweaks): "classic" | "editorial" | "card".

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ──────────────────────────────────────────────────────────────
// Persistence: favorites + streak
// ──────────────────────────────────────────────────────────────

function useFavorites() {
  const KEY = 'chordsense.favorites';
  const [favs, setFavs] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); }
    catch { return new Set(); }
  });
  const toggle = useCallback((name) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      localStorage.setItem(KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);
  return [favs, toggle];
}

function useStreak() {
  // For prototype demo, fix to 3 (matches the spec example).
  // Real app: increment on day-rollover with a 'lastSeen' date.
  return 3;
}

// ──────────────────────────────────────────────────────────────
// Icons
// ──────────────────────────────────────────────────────────────

const StarIcon = ({ filled, size = 22, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3.5l2.7 5.5 6.05.88-4.38 4.27 1.04 6.03L12 17.7l-5.41 2.85 1.04-6.03L3.25 9.88 9.3 9 12 3.5z"
      fill={filled ? (color || 'var(--accent)') : 'none'}
      stroke={filled ? (color || 'var(--accent)') : 'var(--ink-2)'}
      strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
const ShuffleIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M16 4l4 3-4 3M16 14l4 3-4 3M3 7h4l3 4M3 17h4l3-4M21 7h-4M21 17h-4"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CloseIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const BackIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ArrowRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
    <path d="M2 7h10M8 3l4 4-4 4" stroke="var(--ink-3)" strokeWidth="1.5"
      fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const HomeIcon = ({ size = 22, active }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-9z"
      fill={active ? 'var(--accent)' : 'none'}
      stroke={active ? 'var(--accent)' : 'var(--ink-3)'}
      strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

// ──────────────────────────────────────────────────────────────
// Shared atoms
// ──────────────────────────────────────────────────────────────

function ChordPill({ name, active = false, onClick }) {
  return (
    <button type="button" onClick={onClick}
      style={{
        appearance: 'none',
        border: active ? '1px solid var(--accent)' : '1px solid var(--line)',
        background: active ? 'var(--accent)' : '#fff',
        color: active ? '#fff' : 'var(--ink)',
        fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
        letterSpacing: '-0.01em',
        padding: '9px 14px', borderRadius: 999,
        boxShadow: active ? '0 6px 16px -6px var(--accent-glow)' : 'none',
        cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
        transition: 'transform 120ms ease',
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >{name}</button>
  );
}

function ProgressionRow({ progression, todayChord, onPick }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        fontFamily: 'var(--font-ui)', fontSize: 12,
        color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>
        <span>{progression.name}</span>
        <span>{progression.genre}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {progression.chords.map((c, i) => (
          <React.Fragment key={`${c}-${i}`}>
            <ChordPill name={c} active={c === todayChord} onClick={() => onPick(c)} />
            {i < progression.chords.length - 1 && <ArrowRight />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function StreakBadge({ streak }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px 4px 8px', borderRadius: 999,
      background: 'var(--accent-tint)', color: 'var(--accent)',
      fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
      letterSpacing: '-0.005em', whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      <span style={{ fontSize: 13 }}>🔥</span>
      <span style={{ whiteSpace: 'nowrap' }}>{streak} day streak</span>
    </div>
  );
}

function PracticeCard({ prompt, onShuffle }) {
  return (
    <div style={{
      borderRadius: 18,
      background: 'linear-gradient(135deg, #FAF7FF 0%, #F3EEFE 100%)',
      border: '1px solid var(--accent-tint)',
      padding: 16,
      display: 'flex', alignItems: 'flex-start', gap: 12,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: 'var(--accent)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 600,
      }}>🎯</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600,
          color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase',
          marginBottom: 4,
        }}>Practice prompt</div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--ink)',
          lineHeight: 1.4, letterSpacing: '-0.005em',
        }}>{prompt}</div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Action row (Shuffle primary, Save secondary)
// ──────────────────────────────────────────────────────────────

function ActionRow({ chordName, favs, toggleFav, onShuffle, primaryOnDark = false }) {
  const isFav = favs.has(chordName);
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <button onClick={onShuffle}
        style={{
          flex: 1, height: 50, borderRadius: 14,
          border: 'none',
          background: 'var(--accent)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600,
          cursor: 'pointer', letterSpacing: '-0.005em',
          boxShadow: '0 8px 20px -8px var(--accent-glow)',
        }}>
        <ShuffleIcon size={18} color="#fff" />
        <span>Shuffle</span>
      </button>
      <button onClick={() => toggleFav(chordName)}
        style={{
          width: 50, height: 50, borderRadius: 14,
          border: '1px solid var(--line)',
          background: isFav ? 'var(--accent-tint)' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}>
        <StarIcon filled={isFav} size={20} />
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// LAYOUT VARIANTS — same content, different composition
// ──────────────────────────────────────────────────────────────

function LayoutClassic({ today, chord, onOpen, onShuffle, favs, toggleFav, streak }) {
  return (
    <div style={{ padding: '16px 24px 32px', display: 'flex', flexDirection: 'column', gap: 26 }}>
      {/* Header with streak */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={ehLabel}>Chord of the Day</div>
          <div style={ehDate}>{today.date}</div>
        </div>
        <div style={{ marginTop: 4 }}><StreakBadge streak={streak} /></div>
      </div>

      {/* Hero */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: 56, letterSpacing: '-0.04em', color: 'var(--ink)',
          lineHeight: 1, textAlign: 'center',
        }}>{chord.name}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {chord.tags.slice(0, 3).map((t) => <span key={t} style={tagStyle}>{t}</span>)}
        </div>
        <ChordDiagram chord={chord} size="lg" />
      </div>

      {/* Context */}
      <div>
        <div style={sectionLabel}>Where you'll find this chord</div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          background: '#fff', border: '1px solid var(--line)', borderRadius: 14,
          overflow: 'hidden', marginTop: 10,
        }}>
          <div style={statCell}>
            <div style={statLabel}>Key</div>
            <div style={statValue}>{today.key}</div>
          </div>
          <div style={{ ...statCell, borderLeft: '1px solid var(--line)' }}>
            <div style={statLabel}>Role</div>
            <div style={statValue}>{today.degree}</div>
            <div style={statSub}>{today.degreeRole}</div>
          </div>
        </div>
      </div>

      {/* Practice prompt */}
      <PracticeCard prompt={today.prompt} />

      {/* Progressions */}
      <div>
        <div style={sectionLabel}>Common Progressions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 14 }}>
          {today.progressions.map((p, i) => (
            <ProgressionRow key={i} progression={p} todayChord={chord.name} onPick={onOpen} />
          ))}
        </div>
      </div>

      <ActionRow chordName={chord.name} favs={favs} toggleFav={toggleFav} onShuffle={onShuffle} />
    </div>
  );
}

function LayoutEditorial({ today, chord, onOpen, onShuffle, favs, toggleFav, streak }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Hero card — purple wash */}
      <div style={{
        background: 'var(--accent)', color: '#fff',
        padding: '24px 24px 40px', position: 'relative',
      }}>
        {/* orbits */}
        <svg viewBox="0 0 360 360" style={{
          position: 'absolute', right: -120, top: -110, width: 360, height: 360,
          opacity: 0.16, pointerEvents: 'none',
        }}>
          <circle cx="180" cy="180" r="110" fill="none" stroke="#fff" strokeWidth="1" />
          <circle cx="180" cy="180" r="160" fill="none" stroke="#fff" strokeWidth="1" />
          <circle cx="180" cy="180" r="60"  fill="none" stroke="#fff" strokeWidth="1" />
        </svg>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: '0.08em',
          textTransform: 'uppercase', opacity: 0.85, position: 'relative',
        }}>
          <span>Chord of the Day</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'rgba(255,255,255,0.18)', padding: '4px 10px',
            borderRadius: 999, letterSpacing: '-0.005em', textTransform: 'none',
            fontWeight: 600, opacity: 1,
          }}>🔥 {streak}d</span>
        </div>

        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: 64, letterSpacing: '-0.045em', lineHeight: 1,
          marginTop: 14, position: 'relative',
        }}>{chord.name}</div>
        <div style={{
          fontFamily: 'var(--font-ui)', fontSize: 14, opacity: 0.85,
          marginTop: 6, position: 'relative',
        }}>{chord.fullName}</div>

        {/* Diagram on white card, overlapping */}
        <div style={{
          marginTop: 22, marginBottom: -56,
          background: '#fff', borderRadius: 20,
          padding: '18px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
          boxShadow: '0 12px 28px -12px rgba(60, 30, 130, 0.4)',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
            <div style={statLabel}>Shape</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
              color: 'var(--ink)', letterSpacing: '-0.01em',
            }}>{chord.barre ? `Barré · ${chord.baseFret}fr` : `Open · ${chord.baseFret}fr`}</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
              {chord.tags.slice(0, 2).map((t) => <span key={t} style={tagStyle}>{t}</span>)}
            </div>
          </div>
          <div style={{ flexShrink: 0 }}><ChordDiagram chord={chord} size="md" /></div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '76px 24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={sectionLabel}>Where you'll find this chord</div>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 12,
            paddingBottom: 16, borderBottom: '1px solid var(--line)',
          }}>
            <div>
              <div style={statLabel}>Key</div>
              <div style={statValueLg}>{today.key}</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={statLabel}>Role</div>
              <div style={statValueLg}>{today.degree}</div>
              <div style={statSub}>{today.degreeRole}</div>
            </div>
          </div>
        </div>

        <PracticeCard prompt={today.prompt} />

        <div>
          <div style={sectionLabel}>Common Progressions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 14 }}>
            {today.progressions.map((p, i) => (
              <ProgressionRow key={i} progression={p} todayChord={chord.name} onPick={onOpen} />
            ))}
          </div>
        </div>

        <ActionRow chordName={chord.name} favs={favs} toggleFav={toggleFav} onShuffle={onShuffle} />
      </div>
    </div>
  );
}

function LayoutCard({ today, chord, onOpen, onShuffle, favs, toggleFav, streak }) {
  const isFav = favs.has(chord.name);
  return (
    <div style={{
      padding: '16px 16px 32px', background: 'var(--surface-2)',
      minHeight: '100%', display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px' }}>
        <div>
          <div style={ehLabel}>Chord of the Day</div>
          <div style={{ ...ehDate, fontSize: 18 }}>{today.date}</div>
        </div>
        <StreakBadge streak={streak} />
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: 44, letterSpacing: '-0.035em', color: 'var(--ink)', lineHeight: 1,
            }}>{chord.name}</div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-3)',
              marginTop: 6,
            }}>{chord.fullName}</div>
          </div>
          <button onClick={() => toggleFav(chord.name)} style={iconBtnStyle}>
            <StarIcon filled={isFav} size={20} />
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14 }}>
          <ChordDiagram chord={chord} size="md" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 0 }}>
            <div>
              <div style={statLabelTiny}>Key</div>
              <div style={statValueMd}>{today.key}</div>
            </div>
            <div>
              <div style={statLabelTiny}>Role in key</div>
              <div style={statValueMd}>
                {today.degree}
                <span style={{ color: 'var(--ink-3)', fontWeight: 400, marginLeft: 6 }}>· {today.degreeRole}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {chord.tags.slice(0, 3).map((t) => <span key={t} style={tagStyle}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>

      <PracticeCard prompt={today.prompt} />

      <div style={cardStyle}>
        <div style={{ ...sectionLabel, marginBottom: 14 }}>Common Progressions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {today.progressions.map((p, i) => (
            <ProgressionRow key={i} progression={p} todayChord={chord.name} onPick={onOpen} />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 4 }}>
        <ActionRow chordName={chord.name} favs={favs} toggleFav={toggleFav} onShuffle={onShuffle} />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// CHORD DETAIL SCREEN — full screen, alternate voicings
// ──────────────────────────────────────────────────────────────

function ChordDetailScreen({ chordName, onBack, onTryAnother, favs, toggleFav }) {
  const chord = CHORDS[chordName];
  const [voicingIdx, setVoicingIdx] = useState(0);
  useEffect(() => { setVoicingIdx(0); }, [chordName]);
  if (!chord) return null;

  const voicings = chord.voicings || [{
    label: 'Default', frets: chord.frets, fingers: chord.fingers,
    baseFret: chord.baseFret, barre: chord.barre,
  }];
  const v = voicings[Math.min(voicingIdx, voicings.length - 1)];
  const voicedChord = { ...chord, ...v };
  const isFav = favs.has(chord.name);

  return (
    <div data-screen-label={`Detail · ${chord.name}`} style={{
      position: 'absolute', inset: 0, background: '#fff',
      display: 'flex', flexDirection: 'column',
      paddingTop: 54, // status-bar room
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px 4px',
      }}>
        <button onClick={onBack} style={{
          ...iconBtnStyle, width: 40, height: 40, color: 'var(--ink-2)',
        }}><BackIcon size={20} /></button>
        <button onClick={() => toggleFav(chord.name)} style={{
          ...iconBtnStyle, width: 40, height: 40,
          background: isFav ? 'var(--accent-tint)' : '#fff',
        }}>
          <StarIcon filled={isFav} size={20} />
        </button>
      </div>

      <div style={{
        flex: 1, overflowY: 'auto', padding: '8px 24px 32px',
        display: 'flex', flexDirection: 'column', gap: 22,
      }}>
        {/* Hero name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 600,
            fontSize: 56, letterSpacing: '-0.04em', color: 'var(--ink)',
            lineHeight: 1, textAlign: 'center',
          }}>{chord.name}</div>
          <div style={{
            fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink-3)',
          }}>{chord.fullName}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {chord.tags.map((t) => <span key={t} style={tagStyle}>{t}</span>)}
          </div>
        </div>

        {/* Big diagram */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <ChordDiagram chord={voicedChord} size="lg" />
        </div>

        {/* Voicing selector */}
        {voicings.length > 1 && (
          <div>
            <div style={{ ...sectionLabel, marginBottom: 10, textAlign: 'center' }}>Voicings</div>
            <div style={{
              display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap',
            }}>
              {voicings.map((vc, i) => (
                <button key={i} onClick={() => setVoicingIdx(i)} style={{
                  appearance: 'none',
                  border: i === voicingIdx ? '1px solid var(--accent)' : '1px solid var(--line)',
                  background: i === voicingIdx ? 'var(--accent-tint)' : '#fff',
                  color: i === voicingIdx ? 'var(--accent)' : 'var(--ink-2)',
                  padding: '8px 14px', borderRadius: 999,
                  fontFamily: 'var(--font-ui)', fontSize: 12.5, fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}>{vc.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Blurb */}
        {chord.blurb && (
          <div style={{
            background: 'var(--surface-2)', borderRadius: 16,
            padding: 16,
            fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--ink-2)',
            lineHeight: 1.5, letterSpacing: '-0.005em',
          }}>{chord.blurb}</div>
        )}

        {/* Try-another loop */}
        <button onClick={onTryAnother} style={{
          marginTop: 'auto',
          appearance: 'none', height: 50, borderRadius: 14,
          border: '1px solid var(--line)', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600,
          color: 'var(--ink)', cursor: 'pointer',
        }}>
          <ShuffleIcon size={16} color="var(--ink-2)" />
          <span>Try another chord</span>
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SAVED SCREEN
// ──────────────────────────────────────────────────────────────

function SavedScreen({ favs, toggleFav, onOpen, onShuffle }) {
  const items = [...favs].filter((n) => CHORDS[n]);
  return (
    <div data-screen-label="Saved" style={{
      position: 'absolute', inset: 0, background: '#fff',
      display: 'flex', flexDirection: 'column', paddingTop: 54,
    }}>
      <div style={{ padding: '12px 24px 16px' }}>
        <div style={ehLabel}>Library</div>
        <div style={{ ...ehDate, fontSize: 28 }}>Saved Chords</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 32px' }}>
        {items.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 14,
            padding: '60px 20px', textAlign: 'center',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 999,
              background: 'var(--accent-tint)', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><StarIcon filled={false} size={28} /></div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600,
              color: 'var(--ink)', letterSpacing: '-0.01em',
            }}>No saved chords yet</div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ink-3)',
              maxWidth: 240, lineHeight: 1.5,
            }}>Tap the star on any chord to save it for later. They'll show up here.</div>
            <button onClick={onShuffle} style={{
              marginTop: 8, height: 44, padding: '0 20px',
              borderRadius: 12, border: 'none',
              background: 'var(--accent)', color: '#fff',
              fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              boxShadow: '0 6px 16px -8px var(--accent-glow)',
            }}>
              <ShuffleIcon size={16} color="#fff" />
              Explore chords
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map((name) => {
              const c = CHORDS[name];
              return (
                <button key={name} onClick={() => onOpen(name)} style={{
                  appearance: 'none', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px',
                  background: '#fff', border: '1px solid var(--line)',
                  borderRadius: 16, cursor: 'pointer', width: '100%',
                }}>
                  <div style={{
                    width: 56, height: 64, borderRadius: 10,
                    background: 'var(--surface-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, padding: 6,
                  }}>
                    <ChordDiagram chord={c} size="sm" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 600,
                      color: 'var(--ink)', letterSpacing: '-0.015em',
                    }}>{c.name}</div>
                    <div style={{
                      fontFamily: 'var(--font-ui)', fontSize: 12.5, color: 'var(--ink-3)',
                      marginTop: 2,
                    }}>{c.fullName}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleFav(name); }} style={{
                    ...iconBtnStyle, width: 36, height: 36,
                    background: 'var(--accent-tint)',
                  }}><StarIcon filled size={18} /></button>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// BOTTOM NAV
// ──────────────────────────────────────────────────────────────

function BottomNav({ tab, onTab }) {
  const item = (key, label, icon) => {
    const active = tab === key;
    return (
      <button onClick={() => onTab(key)} style={{
        appearance: 'none', flex: 1, height: '100%',
        background: 'transparent', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        paddingTop: 8,
      }}>
        {icon(active)}
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: 10.5, fontWeight: 600,
          color: active ? 'var(--accent)' : 'var(--ink-3)',
          letterSpacing: '-0.005em',
        }}>{label}</span>
      </button>
    );
  };
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height: 70, paddingBottom: 18,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: '1px solid var(--line)',
      display: 'flex', zIndex: 30,
    }}>
      {item('home', 'Home', (a) => <HomeIcon active={a} size={22} />)}
      {item('saved', 'Saved', (a) => <StarIcon filled={a} size={22} />)}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Style tokens
// ──────────────────────────────────────────────────────────────

const ehLabel = {
  fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
  color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase',
  whiteSpace: 'nowrap',
};
const ehDate = {
  fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500,
  color: 'var(--ink)', letterSpacing: '-0.015em', marginTop: 2,
};
const sectionLabel = {
  fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600,
  color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase',
};
const tagStyle = {
  fontFamily: 'var(--font-ui)', fontSize: 10.5, fontWeight: 600,
  padding: '4px 8px', borderRadius: 999,
  background: 'var(--accent-tint)', color: 'var(--accent)',
  letterSpacing: '0.06em', textTransform: 'uppercase',
};
const statCell = { padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 };
const statLabel = {
  fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600,
  color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase',
};
const statLabelTiny = {
  fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600,
  color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase',
  marginBottom: 2,
};
const statValue = {
  fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600,
  color: 'var(--ink)', letterSpacing: '-0.015em',
};
const statValueMd = {
  fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
  color: 'var(--ink)', letterSpacing: '-0.015em',
};
const statValueLg = {
  fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
  color: 'var(--ink)', letterSpacing: '-0.02em', marginTop: 2,
};
const statSub = {
  fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 500,
  color: 'var(--ink-3)', marginTop: 2,
};
const cardStyle = {
  background: '#fff', borderRadius: 20, padding: 18,
  boxShadow: '0 1px 2px rgba(15, 10, 35, 0.04), 0 4px 14px -8px rgba(15, 10, 35, 0.08)',
};
const iconBtnStyle = {
  appearance: 'none',
  width: 36, height: 36, borderRadius: 999,
  border: '1px solid var(--line)', background: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--ink-2)', cursor: 'pointer', flexShrink: 0,
};

Object.assign(window, {
  useFavorites, useStreak,
  LayoutClassic, LayoutEditorial, LayoutCard,
  ChordDetailScreen, SavedScreen, BottomNav,
  StarIcon, ShuffleIcon, BackIcon,
});
