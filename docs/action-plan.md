# Chord Weaver — Action Plan

Status Legend: 🎯 Active | ✅ Complete | ⏳ Pending | 🔄 In Progress | ❌ Blocked

## Phase 0: Foundation (Current Sprint)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 0.1 | Project scaffolding and directory structure | ✅ | Core structure created |
| 0.2 | Architecture recommendations document | ✅ | `docs/technical/architecture-recommendations.md` |
| 0.3 | Name selection: Chord Weaver | ✅ | Pronounced decision |
| 0.4 | Config files (package.json, tsconfig, next.config, etc.) | ✅ | Standard NF scaffold |
| 0.5 | .gitignore, .env.example, .node-version, .nvmrc | ✅ | | |
| 0.6 | Feature flags system | ✅ | `lib/feature-flags/` with 26 flags |
| 0.7 | i18n system (EN/FR) | ✅ | `lib/i18n/` following NF pattern |
| 0.8 | AGENTS.md | ✅ | Project rules and conventions |
| 0.9 | CI workflow | ⏳ | |
| 0.10 | Git hooks (pre-commit) | ⏳ | |
| 0.11 | Scripts (run-all-checks, encoding) | ⏳ | |
| 0.12 | App layout and basic pages | ⏳ | |
| 0.13 | GitHub project creation | ⏳ | Via MCP |
| 0.14 | Add to pnpm-workspace.yaml | ⏳ | |
| 0.15 | Install dependencies + build verification | ⏳ | |

## Phase 1: Core Conversion Skeleton

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Supabase project + schema | ⏳ | Auth, users, saved_chords tables |
| 1.2 | Auth pages (login/register) | ⏳ | Email/password, Supabase |
| 1.3 | Landing page with converter tool UI | ⏳ | |
| 1.4 | Basic audio upload component | ⏳ | File input + validation |
| 1.5 | Audio decoding pipeline | ⏳ | Web Audio API |
| 1.6 | Basic chord detection (FFT-based) | ⏳ | Chroma features + template matching |
| 1.7 | Chord sheet display (basic text) | ⏳ | |
| 1.8 | Download as text/ChordPro | ⏳ | |
| 1.9 | Admin dashboard stub | ⏳ | Feature flag management |

## Phase 2: Editor & Notation

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | VexFlow integration | ⏳ | Music notation rendering |
| 2.2 | In-app chord editor | ⏳ | WYSIWYG editor |
| 2.3 | MIDI playback | ⏳ | Tone.js or midi-player-js |
| 2.4 | Save/load chord sheets | ⏳ | Supabase CRUD |
| 2.5 | PDF export | ⏳ | @react-pdf/renderer |

## Phase 3: Instruments & Advanced Detection

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Piano finger positioning diagrams | ⏳ | |
| 3.2 | Guitar fretboard diagrams | ⏳ | |
| 3.3 | ML-based chord detection improvement | ⏳ | |
| 3.4 | URL extraction (YouTube/SoundCloud) | ⏳ | |
| 3.5 | Microphone recording input | ⏳ | |

## Phase 4: Export & Polish

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | MusicXML export | ⏳ | |
| 4.2 | ABC notation export | ⏳ | |
| 4.3 | Audio download (MP3/WAV) | ⏳ | |
| 4.4 | User library | ⏳ | |
| 4.5 | Community sharing | ⏳ | |
| 4.6 | Mobile optimization | ⏳ | |
