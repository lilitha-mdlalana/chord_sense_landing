// Chord shape data for the prototype.
// Frets: 0 = open, -1 = muted/skipped, otherwise relative fret number.
// `baseFret` is the lowest fret displayed (1 = nut).
// Strings ordered low-E → high-E (6 entries).

const CHORDS = {
  'C#Maj7': {
    name: 'C#Maj7', fullName: 'C-sharp Major 7',
    frets: [-1, 4, 6, 5, 6, 4], fingers: [0, 1, 3, 2, 4, 1], baseFret: 4,
    barre: { fret: 1, from: 1, to: 5 },
    quality: 'major7', tags: ['Jazz', 'Soul', 'Pop'],
    blurb: 'Major 7 chords sound smooth and dreamy — the signature color of jazz, neo-soul, and bossa nova.',
    voicings: [
      { label: 'A-shape barré · 4fr', frets: [-1, 4, 6, 5, 6, 4], fingers: [0, 1, 3, 2, 4, 1], baseFret: 4, barre: { fret: 1, from: 1, to: 5 } },
      { label: 'E-shape barré · 9fr', frets: [9, 11, 10, 10, 9, 9], fingers: [1, 4, 2, 3, 1, 1], baseFret: 9, barre: { fret: 1, from: 1, to: 6 } },
      { label: 'Open-voiced · 4fr',   frets: [-1, 4, -1, 5, 6, 4], fingers: [0, 1, 0, 2, 4, 1], baseFret: 4 },
    ],
  },
  'F#m7': {
    name: 'F#m7', fullName: 'F-sharp minor 7',
    frets: [2, 4, 2, 2, 2, 2], fingers: [1, 3, 1, 1, 1, 1], baseFret: 2,
    barre: { fret: 1, from: 1, to: 6 },
    quality: 'minor7', tags: ['Jazz', 'Soul'],
    blurb: 'Minor 7 chords feel mellow and pensive — the workhorse of soul, R&B, and jazz ballads.',
    voicings: [
      { label: 'E-shape barré · 2fr', frets: [2, 4, 2, 2, 2, 2], fingers: [1, 3, 1, 1, 1, 1], baseFret: 2, barre: { fret: 1, from: 1, to: 6 } },
      { label: 'A-shape barré · 9fr', frets: [-1, 9, 11, 9, 10, 9], fingers: [0, 1, 3, 1, 2, 1], baseFret: 9, barre: { fret: 1, from: 1, to: 5 } },
    ],
  },
  'B7': {
    name: 'B7', fullName: 'B dominant 7',
    frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4], baseFret: 1,
    quality: 'dom7', tags: ['Blues', 'Jazz'],
    blurb: 'Dominant 7 chords push toward resolution — the engine of blues turnarounds and ii-V-I cadences.',
    voicings: [
      { label: 'Open · 1fr', frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4], baseFret: 1 },
      { label: 'E-shape barré · 7fr', frets: [7, 9, 7, 8, 7, 7], fingers: [1, 3, 1, 2, 1, 1], baseFret: 7, barre: { fret: 1, from: 1, to: 6 } },
    ],
  },
  'G#7': {
    name: 'G#7', fullName: 'G-sharp dominant 7',
    frets: [4, 6, 4, 5, 4, 4], fingers: [1, 3, 1, 2, 1, 1], baseFret: 4,
    barre: { fret: 1, from: 1, to: 6 },
    quality: 'dom7', tags: ['Blues', 'Jazz'],
    blurb: 'A bright, urgent dominant chord — perfect for tritone substitutions and modal turnarounds.',
    voicings: [
      { label: 'E-shape barré · 4fr', frets: [4, 6, 4, 5, 4, 4], fingers: [1, 3, 1, 2, 1, 1], baseFret: 4, barre: { fret: 1, from: 1, to: 6 } },
    ],
  },
  'F#Maj7': {
    name: 'F#Maj7', fullName: 'F-sharp Major 7',
    frets: [2, 4, 3, 3, 2, 2], fingers: [1, 4, 2, 3, 1, 1], baseFret: 2,
    barre: { fret: 1, from: 1, to: 6 },
    quality: 'major7', tags: ['Jazz'],
    blurb: 'A lush, full-bodied Maj7 — the resolution chord that makes jazz progressions feel like home.',
    voicings: [
      { label: 'E-shape barré · 2fr', frets: [2, 4, 3, 3, 2, 2], fingers: [1, 4, 2, 3, 1, 1], baseFret: 2, barre: { fret: 1, from: 1, to: 6 } },
    ],
  },
  'D#m7': {
    name: 'D#m7', fullName: 'D-sharp minor 7',
    frets: [-1, 6, 4, 6, 4, 6], fingers: [0, 3, 1, 4, 1, 2], baseFret: 4,
    quality: 'minor7', tags: ['Jazz'],
    blurb: 'The relative minor of F# Major — moody, contemplative, common in modal jazz.',
    voicings: [
      { label: 'A-shape · 4fr', frets: [-1, 6, 4, 6, 4, 6], fingers: [0, 3, 1, 4, 1, 2], baseFret: 4 },
    ],
  },
  'A#m7': {
    name: 'A#m7', fullName: 'A-sharp minor 7',
    frets: [-1, 1, 3, 1, 2, 1], fingers: [0, 1, 4, 1, 3, 1], baseFret: 1,
    barre: { fret: 1, from: 1, to: 5 },
    quality: 'minor7', tags: ['Jazz'],
    blurb: 'A jazzy minor 7 sitting low on the neck — a great pivot chord toward the relative major.',
    voicings: [
      { label: 'A-shape barré · 1fr', frets: [-1, 1, 3, 1, 2, 1], fingers: [0, 1, 4, 1, 3, 1], baseFret: 1, barre: { fret: 1, from: 1, to: 5 } },
    ],
  },
  'Am': {
    name: 'Am', fullName: 'A minor',
    frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1,
    quality: 'minor', tags: ['Folk', 'Pop', 'Rock'],
    blurb: 'The melancholic open chord — a foundation of countless folk and rock progressions.',
    voicings: [
      { label: 'Open', frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 },
      { label: 'E-shape barré · 5fr', frets: [5, 7, 7, 5, 5, 5], fingers: [1, 3, 4, 1, 1, 1], baseFret: 5, barre: { fret: 1, from: 1, to: 6 } },
    ],
  },
  'G': {
    name: 'G', fullName: 'G major',
    frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4], baseFret: 1,
    quality: 'major', tags: ['Folk', 'Pop'],
    blurb: 'A warm, ringing open chord — the brightest of the folk staples.',
    voicings: [
      { label: 'Open', frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4], baseFret: 1 },
    ],
  },
  'C': {
    name: 'C', fullName: 'C major',
    frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1,
    quality: 'major', tags: ['Folk', 'Pop'],
    blurb: 'The most fundamental major chord — the home key of beginners and pop alike.',
    voicings: [
      { label: 'Open', frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1 },
    ],
  },
  'D': {
    name: 'D', fullName: 'D major',
    frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1,
    quality: 'major', tags: ['Folk', 'Pop'],
    blurb: 'A bright, top-heavy major chord — central to folk strumming patterns.',
    voicings: [
      { label: 'Open', frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1 },
    ],
  },
  'Em': {
    name: 'Em', fullName: 'E minor',
    frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1,
    quality: 'minor', tags: ['Folk', 'Rock'],
    blurb: 'The simplest minor chord — heavy, ringing, and forever atmospheric.',
    voicings: [
      { label: 'Open', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1 },
    ],
  },
};

// Daily entries — what shows up as "Chord of the Day" at different positions.
// Each carries its own context, key, role, progressions, practice prompt.
const DAILY_ENTRIES = [
  {
    chord: 'C#Maj7',
    key: 'E Major',
    degree: 'VI♯',
    degreeRole: 'Chromatic Mediant',
    date: 'Mon · May 4',
    progressions: [
      { name: 'Modal interchange', chords: ['F#m7', 'B7', 'C#Maj7'], genre: 'Soul' },
      { name: 'Tritone substitute', chords: ['G#7', 'C#Maj7', 'F#Maj7'], genre: 'Pop' },
      { name: 'Jazz turnaround', chords: ['D#m7', 'G#7', 'C#Maj7'], genre: 'Jazz' },
    ],
    prompt: 'Try switching between B7 → C#Maj7 for 5 minutes. Notice the resolution.',
  },
  {
    chord: 'Am',
    key: 'C Major',
    degree: 'vi',
    degreeRole: 'Relative Minor',
    date: 'Tue · May 5',
    progressions: [
      { name: 'Pop sad', chords: ['Am', 'G', 'C'], genre: 'Pop' },
      { name: 'Folk loop', chords: ['Am', 'C', 'G', 'D'], genre: 'Folk' },
      { name: 'Andalusian', chords: ['Am', 'G', 'C', 'Em'], genre: 'Folk' },
    ],
    prompt: 'Strum Am → G → C slowly. Feel how the bass walks down.',
  },
  {
    chord: 'G',
    key: 'G Major',
    degree: 'I',
    degreeRole: 'Tonic',
    date: 'Wed · May 6',
    progressions: [
      { name: 'I-V-vi-IV', chords: ['G', 'D', 'Em', 'C'], genre: 'Pop' },
      { name: 'Folk classic', chords: ['G', 'C', 'D'], genre: 'Folk' },
      { name: 'Resolving cadence', chords: ['C', 'D', 'G'], genre: 'Pop' },
    ],
    prompt: 'Practice G → C transitions until they feel automatic.',
  },
  {
    chord: 'F#m7',
    key: 'A Major',
    degree: 'vi7',
    degreeRole: 'Submediant',
    date: 'Thu · May 7',
    progressions: [
      { name: 'Smooth jazz', chords: ['F#m7', 'B7', 'F#Maj7'], genre: 'Jazz' },
      { name: 'Neo-soul', chords: ['F#m7', 'C#Maj7', 'F#Maj7'], genre: 'Soul' },
    ],
    prompt: 'Loop F#m7 → B7 and listen for the V7 tension.',
  },
  {
    chord: 'B7',
    key: 'E Major',
    degree: 'V7',
    degreeRole: 'Dominant',
    date: 'Fri · May 8',
    progressions: [
      { name: 'Blues turnaround', chords: ['B7', 'G#7', 'F#m7'], genre: 'Blues' },
      { name: 'V-I cadence', chords: ['F#m7', 'B7', 'F#Maj7'], genre: 'Jazz' },
    ],
    prompt: 'Resolve B7 → F#Maj7. Notice how the leading tone wants to rise.',
  },
];

const TODAY = DAILY_ENTRIES[0];

window.CHORDS = CHORDS;
window.DAILY_ENTRIES = DAILY_ENTRIES;
window.TODAY = TODAY;
