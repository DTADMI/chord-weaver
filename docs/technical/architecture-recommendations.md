# Chord Weaver - Architecture Recommendations

## Name Recommendation: **Chord Weaver**

**Rationale:** Pairs thematically with Glyph Weaver (existing NF project), clearly describes the core function (weaving audio/songs into chord sheets and vice versa), and is short, memorable, and brandable. Domain: `chordweaver.app` (if available).

| Candidate | Verdict | Reason |
|-----------|---------|--------|
| Chord Weaver | ✅ Selected | Thematic consistency with NF portfolio, clear function, brandable |
| NoteForge | ❌ Rejected | Too generic, conflicts with "Nebula Forge" brand |
| Harmonia | ❌ Rejected | More abstract, less descriptive of core function |
| ChordCraft | ❌ Rejected | Meriting but "Weaver" pairs better with existing project |
| FretForge | ❌ Rejected | Too instrument-specific, doesn't cover audio-to-sheet direction |

## Overview

Chord Weaver is a web application that converts between songs/audio and chord/music sheet representations bidirectionally. It also provides an in-app chord editor/creator for manual input and editing.

## Functional Requirements

### Core Conversion (Song → Chords)

1. **Audio Input Methods:**
   - Song name/artist text search (fetch from public chord databases)
   - Audio file upload (MP3, WAV, OGG, FLAC, M4A)
   - Microphone recording (sang or hummed melody)
   - URL to audio file or video (YouTube, SoundCloud, Vimeo, etc.)
   - Paste raw audio data

2. **Chord Detection Pipeline:**
   - Audio preprocessing (normalization, noise reduction, silence trimming)
   - Pitch detection (FFT-based, autocorrelation, or ML-based)
   - Chord recognition (chroma features, template matching, or ML)
   - Beat/tempo detection
   - Structure analysis (verse, chorus, bridge)
   - Confidence scoring per detected chord

3. **Output Formats:**
   - Standard chord notation (C, Am, G7, etc.)
   - Chord sheet (lyrics + chords inline)
   - Lead sheet (melody notation + chord symbols)
   - Full music notation (ABC notation, MusicXML, MIDI)
   - Tablature (guitar, bass)
   - Instrument-specific finger positioning diagrams (piano, guitar initially)
   - PDF export with proper music engraving
   - Downloadable formats: PDF, MIDI, MusicXML, ABC, ChordPro, plain text

### Reverse Conversion (Chords → Audio)

1. **Input Methods:**
   - Upload chord sheet (PDF, image, ChordPro, MusicXML, ABC)
   - Manual chord input via in-app editor
   - Paste chord notation text

2. **Audio Synthesis:**
   - MIDI-based rendering with realistic instrument samples (SoundFonts)
   - Multiple instrument voicings (piano, guitar, strings, etc.)
   - Adjustable tempo, key, and style
   - Playback in-app with visual cursor following the sheet
   - Download as MP3, WAV, MIDI

### In-App Chord Editor

1. **Visual Editor Features:**
   - WYSIWYG sheet music display (standard notation + chord symbols)
   - Drag-and-drop note placement on staff
   - Chord symbol entry and editing
   - Multiple voices and layers
   - Measure/bar management
   - Key and time signature controls
   - Tempo markings
   - Lyrics entry aligned to notes
   - Undo/redo
   - Copy/paste measures

2. **Dual Role:**
   - Display and edit output from song→chords conversion
   - Create input for chords→audio conversion

### Output Formats

| Format | Song→Chords | Chords→Audio | Description |
|--------|:-----------:|:------------:|-------------|
| ChordPro | ✓ | | Industry-standard text-based chord format |
| MusicXML | ✓ | ✓ | Standard interchange format for sheet music |
| ABC Notation | ✓ | ✓ | Text-based music notation language |
| MIDI | ✓ | ✓ | Standard audio protocol for performance data |
| PDF (engraved) | ✓ | ✓ | Professional sheet music output |
| PNG/SVG (sheet image) | ✓ | ✓ | Image rendering of sheet music |
| Plain text chords | ✓ | | Simple chord-over-lyrics text |
| Guitar tablature | ✓ | | Fretboard position diagrams |
| Piano roll view | ✓ | | Visual piano keyboard with highlighted keys |
| MP3/WAV audio | | ✓ | Audio file download |
| LilyPond | ✓ | ✓ | High-quality engraving input format |
| MEI (Music Encoding) | ✓ | ✓ | Academic standard for music encoding |

### Instrument Support (Roadmap)

| Instrument | Song→Chords (Fingerings) | Chords→Audio (Playback) | Priority |
|------------|:------------------------:|:-----------------------:|----------|
| Piano | ✓ | ✓ | P0 (MVP) |
| Guitar | ✓ | ✓ | P0 (MVP) |
| Bass Guitar | ✓ | ✓ | P1 |
| Ukulele | ✓ | ✓ | P1 |
| Violin | | ✓ | P2 |
| Viola | | ✓ | P2 |
| Cello | | ✓ | P2 |
| Mandolin | ✓ | | P2 |
| Banjo | ✓ | | P3 |
| Harp | ✓ | | P3 |

## Technical Requirements

### Core Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 16 (App Router) | Industry standard, Vercel-native, supports SSR/ISR/PPR |
| Language | TypeScript 5.9 | Type safety across the entire stack |
| Styling | Tailwind CSS v4 | Utility-first, consistent with NF portfolio |
| Package Manager | pnpm 10.33.4 | NF standard, workspace support |
| Node | 22.22.3 LTS | NF standard |

### Audio Processing

| Component | Recommended Library | Rationale | Alternative |
|-----------|-------------------|-----------|-------------|
| Audio decoding | Web Audio API (browser) + FFmpeg/WASM (server) | Native browser support, no license fees | `audiobuffer-to-wav` |
| Pitch detection | `pitchfinder` or `ml-music` | Multiple algorithms (YIN, AMDF, autocorrelation) | `tuna`, ` Meyda` |
| Chord recognition | `chroma.js` + custom template matching | Lightweight, proven approach | TensorFlow.js model |
| Beat detection | Web Audio API beat detection | Native browser capabilities | `beats` library |
| Music notation rendering | `VexFlow` (browser) | Industry standard, open-source music engraving JS library | `abcjs`, `osmd` (OpenSheetMusicDisplay) |
| MIDI playback | `midi-player-js` + SoundFont | Lightweight, works in browser | Web MIDI API |
| Audio synthesis | `tone.js` | Full-featured web audio framework | Web Audio API raw |
| PDF generation | `@react-pdf/renderer` or `pdf-lib` | Server-side PDF generation | `puppeteer` (overhead) |
| Music file parsing | `musicxml-parser`, `abcjs` | Standard input format handling | Custom parser |
| URL media extraction | `yt-dlp` WASM or server-side API | YouTube/SoundCloud/etc. extraction | YouTube Data API |

### Recommended Architecture: Hybrid Client/Server Processing

**Rationale:** Audio processing is computationally intensive. A hybrid approach balances latency, cost, and accuracy.

| Processing Stage | Location | Reason |
|-----------------|----------|--------|
| Audio capture/upload | Client (browser) | Privacy, reduced bandwidth |
| Simple pitch detection | Client (Web Worker) | Immediate feedback, offline capability |
| Complex chord recognition | Server (API route / Edge Function) | ML model loading, consistent results |
| Music notation rendering | Client (VexFlow) | Interactive editing requires DOM access |
| PDF generation | Server (API route) | Library weight, consistent output |
| MIDI synthesis for preview | Client (Tone.js) | Low latency, interactive |
| MIDI/audio file download | Server (API route) | File generation + streaming |
| URL media fetching | Server (API route + FFmpeg) | CORS bypass, format conversion |

### Database (Supabase)

| Table | Purpose |
|-------|---------|
| `users` | Auth, profile (managed by Supabase Auth) |
| `saved_chords` | User-saved chord sheets, metadata |
| `conversion_history` | Log of conversions with input/output refs |
| `instrument_library` | Instrument definitions and fret mappings |
| `feature_flags` | Dynamic feature flag overrides |
| `admin_users` | Admin role assignments |

### External APIs

| Service | Purpose | Cost |
|---------|---------|------|
| YouTube Data API / yt-dlp | Video URL audio extraction | Free tier |
| SoundCloud API | Audio URL extraction | Free tier |
| Spotify Web API | Song metadata lookup | Free tier |
| OpenAI Whisper API (optional) | Hummed melody to notes | Pay-per-use |
| Custom chord recognition model | Server-side ML inference | Compute cost |

### Performance Targets

| Metric | Target |
|--------|--------|
| Audio upload to chord result | < 5 seconds (30s audio clip) |
| Chord sheet to audio preview | < 2 seconds |
| In-app editor responsiveness | < 100ms per action |
| PDF generation | < 3 seconds |
| Page load (initial) | < 2s LCP, < 100 CLS |
| Page load (subsequent) | Instant (ISR/PPR) |

### Feature Flag Categories

| Category | Examples |
|----------|---------|
| `core` | home_page, auth, guest_mode |
| `converter` | audio_upload, url_extraction, youtube_extraction, chord_recognition, audio_synthesis |
| `editor` | visual_editor, notation_editor, undo_redo, midi_export |
| `instruments` | piano_fingerings, guitar_fingerings, bass_fingerings |
| `export` | pdf_export, musicxml_export, abc_export, midi_export |
| `admin` | admin_dashboard, user_management, feature_flag_management |
| `ai` | ml_chord_detection, ai_arrangement_suggestions |
| `experimental` | webmidi_input, realtime_collaboration, offline_mode |

## UI/UX Requirements

### User Flows

1. **Song → Chords Flow:**
   - Input: Search bar (song name) + Upload button + URL paste + Mic button
   - Processing: Animated progress with stage indicators
   - Result: Interactive chord sheet with playback controls
   - Actions: Edit in editor, Download (multiple formats), Save to library

2. **Chords → Audio Flow:**
   - Input: Upload sheet/Editor open/Type notation
   - Processing: Rendering preview
   - Result: Interactive playable sheet with visual cursor
   - Actions: Download audio, Print, Share

3. **Editor Flow:**
   - Staff view with note palette
   - Toolbar: Notes, rests, accidentals, dynamics
   - Chord symbol entry above staff
   - Play button for real-time preview
   - Format/Export menu

### Responsive Design

- Mobile-first at 320px minimum
- Editor adapts to screen size (simplified toolbar on mobile)
- Chord diagrams scale appropriately
- Touch-friendly note placement

### Color Palette (Preliminary)

- Primary: Warm amber/gold (music theme)
- Secondary: Deep purple/indigo
- Accent: Coral/rose
- Background: Warm white / Dark mode variant
- Surface: Light cream / Dark charcoal

### Accessibility

- All interactive elements keyboard-navigable
- Screen reader support for musical content
- High contrast mode
- Focus indicators
- ARIA labels for all editor controls

## Directory Structure (Recommended)

```
chord-weaver/
├── app/
│   ├── (public)/          # Public routes
│   │   ├── converter/     # Main conversion tool
│   │   ├── chords/        # Browse/shared chord sheets
│   │   ├── editor/        # Chord editor
│   │   ├── about/         # About page
│   │   └── page.tsx       # Landing page
│   ├── (authenticated)/   # Authenticated routes
│   │   ├── dashboard/     # User dashboard
│   │   ├── library/       # Saved chord library
│   │   └── settings/      # User settings
│   ├── (admin)/           # Admin routes
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── users/         # User management
│   │   ├── feature-flags/ # Flag management
│   │   └── content/       # Content moderation
│   ├── auth/              # Auth pages
│   ├── api/               # API routes
│   │   ├── auth/          # Auth endpoints
│   │   ├── convert/       # Conversion endpoints
│   │   ├── editor/        # Editor save/load
│   │   └── admin/         # Admin endpoints
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                # Shared UI primitives
│   ├── converter/         # Converter-specific components
│   ├── editor/            # Chord editor components
│   ├── player/            # Audio player components
│   └── layout/            # Layout components
├── lib/
│   ├── i18n/              # Internationalization
│   │   ├── config.ts
│   │   ├── index.ts
│   │   ├── provider.tsx
│   │   ├── server.ts
│   │   ├── server-provider.tsx
│   │   └── translations/
│   │       ├── en.ts
│   │       ├── fr.ts
│   │       └── map.ts
│   ├── supabase/          # Supabase client & helpers
│   │   ├── client.ts
│   │   ├── admin-client.ts
│   │   └── middleware.ts
│   ├── audio/             # Audio processing
│   │   ├── decode.ts
│   │   ├── pitch.ts
│   │   ├── chord-detection.ts
│   │   ├── beat-detection.ts
│   │   └── synthesis.ts
│   ├── notation/          # Music notation
│   │   ├── vexflow-renderer.ts
│   │   ├── abc-parser.ts
│   │   ├── musicxml-parser.ts
│   │   ├── chordpro-parser.ts
│   │   └── pdf-generator.ts
│   ├── chords/            # Chord theory
│   │   ├── types.ts
│   │   ├── database.ts
│   │   ├── voicings.ts
│   │   └── progression.ts
│   ├── instruments/       # Instrument mappings
│   │   ├── piano.ts
│   │   ├── guitar.ts
│   │   ├── fretboard.ts
│   │   └── fingerings.ts
│   ├── feature-flags/     # Feature flag system
│   │   ├── index.ts
│   │   ├── flags.ts
│   │   └── admin.ts
│   ├── admin/             # Admin utilities
│   │   └── guard.ts
│   └── utils/             # Shared utilities
│       ├── cn.ts
│       └── formatting.ts
├── hooks/                 # React hooks
│   ├── use-audio-recorder.ts
│   ├── use-chord-detection.ts
│   ├── use-soundfont.ts
│   └── use-media-player.ts
├── scripts/               # Agent/utility scripts
│   ├── run-all-checks.ps1
│   ├── check-encoding.ps1
│   └── fix-encoding.ps1
├── supabase/              # Supabase config
│   ├── migrations/
│   └── seed.sql
├── tests/
│   ├── unit/
│   ├── e2e/
│   ├── integration/
│   └── fixtures/
├── public/                # Static assets
├── docs/
│   ├── technical/
│   │   ├── architecture-recommendations.md  (this file)
│   │   ├── performance-optimization.md
│   │   ├── encoding-reference.md
│   │   ├── feature-flags-testing.md
│   │   └── i18n-status.md
│   └── design/
├── .githooks/
│   └── pre-commit
├── .github/
│   └── workflows/
│       └── ci.yml
├── .agents/
│   └── skills/
├── AGENTS.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
├── .gitignore
├── .env.example
├── .node-version
├── .nvmrc
└── .prettierrc
```

## Phase Plan

### Phase 0: Foundation (Current)
- Project scaffolding, AGENTS.md, docs, CI/CD
- Name selection and GitHub project creation

### Phase 1: Core Skeleton
- Landing page with converter tool UI
- Basic audio capture/upload
- Simple chord detection from audio
- Chord sheet display (basic)
- Download as text/ChordPro
- Auth (Supabase)
- Admin dashboard with feature flag management

### Phase 2: Editor & Notation
- VexFlow-based in-app chord editor
- Manual chord input and editing
- Save/load chord sheets
- MIDI playback
- PDF export

### Phase 3: Instruments & Advanced Detection
- Piano finger positioning diagrams
- Guitar finger positioning diagrams
- Improved ML-based chord detection
- URL video/audio extraction
- Hummed melody detection

### Phase 4: Export & Polish
- Multiple export formats (MusicXML, ABC, MIDI, LilyPond)
- Batch conversion
- Community library
- Real-time collaboration (experimental)
- Mobile optimization

## Dependencies (Recommended)

### Production
```
next, react, react-dom
@supabase/ssr, @supabase/supabase-js
@radix-ui/* (as needed)
tailwind-merge, class-variance-authority
lucide-react
date-fns
vexflow (music notation rendering)
tone.js (audio synthesis/music)
pitchfinder (pitch detection)
midi-player-js (MIDI playback)
abcjs (ABC notation parsing/rendering)
@react-pdf/renderer (PDF generation)
zod (validation)
server-only
```

### Dev
```
typescript, @types/react, @types/node
eslint, eslint-config-next
prettier, prettier-plugin-tailwindcss
tailwindcss, @tailwindcss/postcss
vitest, @playwright/test
jsdom
```

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Audio analysis accuracy < 90% | High | Hybrid approach (FFT + ML + user correction). Feature flag gating for ML. |
| YouTube URL extraction legality | Medium | User-provided content only, comply with ToS. Provide clear disclaimers. |
| Web Audio API limitations | Medium | Server-side fallback for complex processing. Feature flag gating. |
| MusicXML parsing complexity | Medium | Use established libraries (abcjs, vexflow). Incremental feature delivery. |
| PDF generation costs | Low | Serverless functions. Cache generated PDFs. Limit free tier to preview. |
| SoundFont licensing | Low | Use open-source SoundFonts (FluidR3_GM, TimGM6mb). |
