# Chord Weaver - Bidirectional Chord/Song/Audio Converter

**Owner:** Nebula Forge Digital Studio  
**Last Updated:** 2025-07-16  

Convert songs to chords and chords to audio. Type a chord progression and hear it played. Upload a song and see the chord chart. Built with Next.js 16, Tone.js for audio synthesis, and Web Audio API for analysis.

---

## 📁 Project Structure

```
chord-weaver/
├── app/
│   ├── converter/          # Song → Chord converter (audio analysis)
│   ├── editor/             # Chord progression editor + playback
│   ├── page.tsx            # Landing page
│   └── layout.tsx          # Root layout + nav
├── components/
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── audio/              # Tone.js synth, Web Audio API analysis
│   ├── chords/             # Chord dictionary, progression engine
│   ├── converter/          # Audio → Chord extraction pipeline
│   └── i18n/               # EN/FR translations
├── tests/                   # Unit + integration + E2E
├── docs/
│   └── technical/           # Architecture, encoding, feature flags
└── AGENTS.md
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 26.3.0 | `node --version` |
| pnpm | 11.5.0 | `pnpm --version` |

### Install

```bash
git clone https://github.com/nebulaforge/chord-weaver.git
cd chord-weaver
pnpm install
```

### Development

```bash
pnpm dev              # http://localhost:3025
```

### Build

```bash
pnpm build            # Production build
pnpm start            # Start production server
```

### Testing

```bash
pnpm test               # All tests
pnpm test:unit          # Unit tests only
pnpm test:integration   # Integration tests
pnpm test:e2e           # E2E tests (Playwright)
pnpm run-all-checks     # Full pre-commit suite
```

---

## 🎹 How It Works

### Song → Chords (Audio Analysis)

1. **Upload or record** a song snippet (MP3, WAV, OGG)
2. **Web Audio API** extracts frequency spectrum via FFT
3. **Chromagram** maps frequencies to 12 pitch classes
4. **Chord detection** matches chroma patterns against a chord dictionary
5. **Progression output** shows the detected chords in sequence

### Chords → Audio (Synthesis)

1. **Type or select** a chord progression (e.g., `Am F C G`)
2. **Tone.js synthesizer** generates audio for each chord
3. **Style selection**: piano, guitar, organ, synth, strings
4. **Playback** with adjustable tempo and looping
5. **Export** as WAV or MIDI

---

## 🎸 Chord Dictionary

Supports 1,200+ chord types across all 12 roots:
- Major, minor, diminished, augmented
- 7th chords (maj7, m7, dom7, dim7, half-dim7)
- Suspended (sus2, sus4)
- Extended (9th, 11th, 13th)
- Slash chords (D/F#, Am/G)
- Jazz voicings, power chords

---

## 🎵 Supported Formats

| Input | Output |
|---|---|
| MP3, WAV, OGG, FLAC | WAV, MIDI |
| Chord text (Am F C G) | Audio playback (Tone.js) |
| Microphone recording | Chord detection |
| MIDI file import | Chord visualization |

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| No audio playback | Check browser audio permissions. Click anywhere on the page first. |
| Chord detection inaccurate | Use cleaner audio (no drums, single instrument). Try longer clips. |
| Browser not supported | Requires Chrome 70+, Firefox 76+, Edge 79+ for Web Audio API. |

---

## 🧪 CI

```bash
# CI runs on every push:
pnpm typecheck && pnpm lint && pnpm test:unit && pnpm test:integration && pnpm build
```

---

Built with ❤️ by Nebula Forge Digital Studio