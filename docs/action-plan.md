# Chord Weaver - Action Plan

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
| 0.9 | CI workflow | ✅ | GitHub Actions scaffolded |
| 0.10 | Git hooks (pre-commit) | ✅ | lint + typecheck |
| 0.11 | Scripts (run-all-checks, encoding) | ✅ | |
| 0.12 | App layout and basic pages | ✅ | Root layout + page |
| 0.13 | GitHub project creation | ✅ | |
| 0.14 | Add to pnpm-workspace.yaml | ✅ | |
| 0.15 | Install dependencies + build verification | ✅ | tsc: 0, lint: 0 |

## Phase 1: Core Conversion Skeleton

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Supabase project + schema | ✅ | 001_core_schema.sql - saved_chords + user_preferences |
| 1.2 | Auth pages (login/register) | ✅ | app/auth/ with Supabase email/password |
| 1.3 | Landing page with converter tool UI | ✅ | app/converter/ + components/converter/ |
| 1.4 | Basic audio upload component | ✅ | hooks/use-audio-recorder.ts |
| 1.5 | Audio decoding pipeline | ✅ | lib/audio/ + Web Audio API |
| 1.6 | Basic chord detection (FFT-based) | ✅ | hooks/use-chord-detection.ts + lib/chords/ |
| 1.7 | Chord sheet display (basic text) | ✅ | ChordPro/ABC parsers in lib/notation/ |
| 1.8 | Download as text/ChordPro | ✅ | Export in lib/notation/ + API routes |
| 1.9 | Admin dashboard stub | ✅ | app/(admin)/ + api/admin/ |

## Phase 2: Editor & Notation

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | VexFlow integration | ✅ | lib/notation/vexflow-renderer.ts |
| 2.2 | In-app chord editor | ✅ | app/editor/ + components/editor/ |
| 2.3 | MIDI playback | ✅ | components/player/ + hooks/use-soundfont.ts |
| 2.4 | Save/load chord sheets | ✅ | Supabase CRUD via API routes |
| 2.5 | PDF export | ✅ | lib/notation/pdf-generator.ts |

## Phase 3: Instruments & Advanced Detection

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Piano finger positioning diagrams | ✅ | lib/instruments/piano.ts |
| 3.2 | Guitar fretboard diagrams | ✅ | lib/instruments/fretboard.ts + components/player/fretboard-display.tsx |
| 3.3 | ML-based chord detection improvement | ⏳ | |
| 3.4 | URL extraction (YouTube/SoundCloud) | ⏳ | |
| 3.5 | Microphone recording input | ✅ Done 2026-10-13 | `hooks/use-audio-recorder.ts` (getUserMedia + MediaRecorder) etait ecrit mais **non câblé** ; la page convertisseur etait une maquette. Câblé dans `components/converter/converter-client.tsx` (bouton démarrer/arrêter, durée, lecture, effacer, message si contexte non sécurisé), tout en i18n (clés EN/FR), page convertisseur localisée ; typecheck 0, lint 0, build OK |

## Phase 4: Export & Polish

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | MusicXML export | ✅ | DEJA FAIT (verifie 2026-10-06) : `lib/notation/musicxml-parser.ts` expose `generateMusicXml(sheet)` |
| 4.2 | ABC notation export | ✅ | DEJA FAIT (verifie 2026-10-06) : `lib/notation/abc-parser.ts` expose `toAbcNotation(sheet)` |
| 4.3 | Audio download (MP3/WAV) | ✅ Done 2026-10-13 | Réutilise `audioBufferToWav` (`lib/audio/decode.ts`) : le convertisseur decode l'enregistrement et propose un **téléchargement WAV** (bouton dedie, etat d'attente, message d'erreur localisé). typecheck 0, lint 0, build OK |
| 4.4 | User library | ⏳ | |
| 4.5 | Community sharing | ⏳ | |
| 4.6 | Mobile optimization | ✅ Verifie 2026-10-13 | Premiere couverture e2e du projet (`tests/e2e/mobile.spec.ts`) : 3 pages (accueil, editeur, convertisseur) a **320 px** - aucun debordement, aucun controle rogne, et toutes les cibles tactiles >= 24x24 px (WCAG 2.2 AA). Garde-fou permanent ajoute. |
