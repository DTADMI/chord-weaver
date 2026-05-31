# Chord Weaver — Feature Flags & Testing Guide

## Flag Categories

| Category | Flags |
|----------|-------|
| `core` | homePage, authEmailPassword, guestMode, darkMode, i18nFrench |
| `converter` | audioUpload, audioRecording, urlExtraction, chordDetection, chordDetectionMl, audioSynthesis |
| `editor` | visualEditor, noteInput, undoRedo |
| `instruments` | pianoFingerings, guitarFingerings |
| `export` | pdfExport, musicXmlExport, abcExport, midiExport, audioDownload |
| `admin` | adminDashboard, userManagement, featureFlagManagement, analyticsDashboard |
| `ai` | aiChordSuggestions |
| `experimental` | webmidiInput, offlineMode |

## Testing Matrix

When running tests, verify each feature works correctly with its flag both enabled and disabled. Use `setFeatureOverride()` in unit tests:

```typescript
import { setFeatureOverride, isFeatureEnabled } from "@/lib/feature-flags";

describe("Feature flags", () => {
  it("defaults to disabled", () => {
    expect(isFeatureEnabled("webmidi-input")).toBe(false);
  });

  it("respects overrides", () => {
    setFeatureOverride("webmidi-input", true);
    expect(isFeatureEnabled("webmidi-input")).toBe(true);
  });
});
```

## Adding New Flags

1. Add the flag definition to `lib/feature-flags/flags.ts`
2. Default to `false` for new features
3. Document the flag in this file
4. Add admin UI toggle in `app/(admin)/feature-flags/`
5. Use `isFeatureEnabled()` to gate the feature in code
