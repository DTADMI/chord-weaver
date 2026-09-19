# AGENTS.md

## Purpose

- Keep repo-loaded agent instructions short, stable, and enforceable.
- Use this file for hard repo rules only.
- Put procedural workflows in skills, runtime automation in hooks, and external system access in MCP/plugins.
- Read root `AGENTS.md` at the repo root for cross-project governance rules.
- Don't Do Evil. Never Do Evil.

## Operating Model

| Layer | Location | Use It For | Do Not Put Here |
| --- | --- | --- | --- |
| Rules | `AGENTS.md` | Stable repo policy, safety constraints, required guardrails | Long step-by-step playbooks, external integration setup |
| Hooks | `.githooks/pre-commit` | Automated reminders and enforced validation entrypoints | Product rules that need human judgment |
| Skills | `.agents/skills/` | Repeatable workflows that require repo-specific procedure | Global policy, generic shell preferences |
| MCP / Plugins | `plugins/` | External system access and integration metadata | Repo policy or authoring standards |

## Project Info

- **Name**: chord-weaver
- **Description**: Convert songs to chords and chords to audio - a bidirectional music notation tool
- **Tech**: Next.js 16 (App Router), React 19, TypeScript 5.9, Tailwind CSS v4, pnpm 10.33.4, Node 22.22.3
- **Port**: 3025

## Repository Map

- `app/` Next.js App Router pages and API routes
- `components/` shared UI, converter, editor, player
- `lib/` shared logic: i18n, supabase, audio processing, notation, chords, instruments, feature flags
- `hooks/` React hooks for audio, recording, playback
- `scripts/` validation and agent support scripts
- `supabase/` config and migrations
- `docs/` technical and design documentation

## Hard Rules

### Search And Shell

- Use `rg` first and by default for repo search.
- Scope searches and avoid heavy folders: `node_modules`, `.next`, `test-results`, `.qodo`, `.idea`.
- Never use `Get-ChildItem -Recurse | Select-String` for repo content search.
- For data-heavy work, prefer repo scripts over repeated manual tool calls.
- Use `pnpm`/`pnpx` rather than `npm`/`npx` for all package management and script execution.

### Performance

- Public content pages must export `revalidate` with a value appropriate to the content change rate.
- Dynamic routes serving public content should implement `generateStaticParams` for high-traffic entries.
- Use `React.cache()` to deduplicate expensive data-fetching functions.
- Enable Partial Prerendering (`experimental.ppr: 'incremental'`) when stable.
- Set stale times (`experimental.staleTimes`) in `next.config.ts`.
- Configure `experimental.optimizePackageImports` for lucide-react, date-fns, and Radix UI.
- Pages with list data must paginate; never return unbounded result sets.
- Never remove `cache()` wrappers from shared data-fetching functions.
- Never downgrade a page from static/ISR to `force-dynamic` without documenting the reason.

### Change Safety

### Compilation Gate (NF-GATE-001)

**Every batch of code changes MUST be verified by the project's compiler(s) before
the batch is complete.** For TypeScript: npx tsc --noEmit. For Rust: cargo check.
Scripts that generate code via text replacement MUST run compilation as their
final step and abort on failure.

See .agents/skills/compilation-gate/SKILL.md for the full procedure and 14 known
pitfall classes.


- Do not remove or overwrite user changes in a dirty worktree unless explicitly asked.
- Avoid editing generated output or `.next/`.
- Keep new product behavior behind feature flags, and keep UI/API enforcement in sync.
- All features must be feature-flag gated and controllable from the admin dashboard.
- **Never use `--no-verify`, `--no-gpg-sign`, or any hook-skipping flag on git commits or pushes.**
- Run `pnpm run-all-checks` before committing.

### Product, UX, And Content

- Keep UI responsive and mobile-first across all surfaces; validate at 320px minimum.
- Keep user-facing copy user-facing; internal operator language belongs only on admin surfaces.
- Use Quebec French norms for FR copy where applicable.
- Support bilingual (EN/FR) content throughout.
- All user-facing strings must use i18n (see `lib/i18n/`).

### Migrations And Data

- Migrations live in `supabase/migrations/`.
- Every migration must have paired rollout and rollback SQL files.
- Every new table must enable RLS with explicit policies.
- Every `SECURITY DEFINER` function must set an explicit least-privilege `search_path`.

#### Migration Idempotency

- **Tables**: `CREATE TABLE IF NOT EXISTS`. Never plain `CREATE TABLE`.
- **Columns**: `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`. Never plain `ADD COLUMN`.
- **Enums**: Wrap `CREATE TYPE` in a `DO $$ ... EXCEPTION WHEN duplicate_object THEN null; END $$;` block.
- **Policies**: `DROP POLICY IF EXISTS "name" ON table;` before each `CREATE POLICY`.
- **Constraints**: `DROP CONSTRAINT IF EXISTS ...` before `ADD CONSTRAINT ...`.
- **Indexes**: `CREATE INDEX IF NOT EXISTS`. Never plain `CREATE INDEX`.
- **Seed data**: `INSERT ... ON CONFLICT DO NOTHING`.
- **Functions**: `CREATE OR REPLACE FUNCTION`.
- **Triggers**: `DROP TRIGGER IF EXISTS ... ON table;` before `CREATE TRIGGER`.
- **Extensions**: `CREATE EXTENSION IF NOT EXISTS WITH SCHEMA extensions`.

### Validation, Docs, And Commits

- Keep documentation aligned with code and schema changes.
- Keep `docs/action-plan.md` current when source-of-truth docs change.
- In docs, keep exactly one empty line between a section title and the start of its table.
- Use real emoji characters in docs and keep docs UTF-8 clean.
- When code or docs change, create a concise commit unless the user says not to.

### Security And Privacy

- Do not log or expose secrets from `.env`, `.env.local`, or other environment files.
- Audio file uploads must validate file type and size.
- User-submitted audio content is private; do not share or cache without explicit consent.
- Instrument and chord data is public, user chord sheets are private by default.

### Encoding & Special Character Handling

- French accented characters must NOT be corrupted, replaced, or mangled.
- Song titles, artist names, and chord symbols may contain accented characters.
- Use .NET methods for reliable UTF-8 without BOM in PowerShell scripts.
- Line endings: SQL, shell script, and TypeScript files must use LF line endings.
- `.ps1` files use CRLF.
- Run `scripts/check-encoding.ps1` to scan for encoding issues.

### i18n

- Default locale is `fr` (Quebec French).
- All UI strings must resolve through the i18n system in `lib/i18n/`.
- Never hardcode user-facing strings in components.
- Every translation key must exist in both `en.ts` and `fr.ts`.
- Use `t()` from `useI18n()` hook in client components.
- Use `getServerTranslations()` in server components.
- Never pass `locale` as a prop to client components.

### Feature Flags

- Feature flags are defined in `lib/feature-flags/flags.ts`.
- Every feature must have a corresponding flag.
- Admin dashboard must provide UI for toggling flags.
- New flags default to `false` (disabled).
- Document new flags in `docs/technical/feature-flags-testing.md`.

## Skills To Use

- `supabase`: Supabase integration, migrations, RLS, auth
- `encoding-handling`: Fix encoding issues in seed data and translations

## MCP And Plugin Boundaries

- MCP targets: GitHub, Vercel
- Runtime hooks in `.githooks/pre-commit`

## Continuous Improvement Rule

- Never bypass or work around a failing check, guardrail, deployment gate, or quality/security policy just to proceed. Fix the real root cause.
- For every incident or failure, add at least one durable prevention mechanism in-repo before closing the work (rule, skill, script, hook, or test) so the same class of issue is less likely to recur.
- Document the incident and the prevention change in the relevant technical docs/runbook when applicable.