# Chord Weaver - i18n Status

## Current State

| Aspect | Status |
|--------|--------|
| Architecture | Context-based (matching NF standard from quest-hunt-web) |
| Default locale | `fr` (Quebec French) |
| Supported locales | `en`, `fr` |
| EN translations | ~80 keys (common, converter, editor, player, instruments, export, library, admin) |
| FR translations | ~80 keys (fully synced with EN) |
| Quebec French norms | FR translations use Quebec conventions (`courriel` not yet, `connexion` not yet - TBD) |
| Server-side resolution | Implemented via `getServerTranslations()` |
| Client-side hydration | Implemented via `useI18n()` hook |
| Language toggle | Not yet implemented (Phase 1) |
| Translation map | Implemented in `translations/map.ts` |

## Architecture

- `lib/i18n/config.ts` - Locale type, default, supported locales
- `lib/i18n/provider.tsx` - React Context with `useI18n()` / `useTranslation()` hooks
- `lib/i18n/server.ts` - Server-side locale resolution
- `lib/i18n/server-provider.tsx` - Server-to-client bridge
- `lib/i18n/translations/en.ts` - English translations
- `lib/i18n/translations/fr.ts` - French translations
- `lib/i18n/translations/map.ts` - Translation registry

## Locale Resolution Priority

1. Cookie (`chord-weaver-locale`)
2. Accept-Language header
3. Default: `fr`

## Next Steps

- Add language toggle component to navigation
- Audit for hardcoded English strings in UI
- Add Quebec French specific vocabulary review
