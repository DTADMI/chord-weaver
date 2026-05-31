# Chord Weaver — Encoding Reference

## Character Handling

Chord Weaver processes song titles, artist names, chord symbols, and lyrics that may contain accented characters and Unicode symbols.

## Supported Unicode Ranges

| Range | Usage | Examples |
|-------|-------|----------|
| U+0000-U+007F | Basic ASCII | Standard text |
| U+0080-U+024F | Latin Extended | é, è, ê, ë, ç, ö, ü, ñ |
| U+0370-U+03FF | Greek | Music theory notation |
| U+1D100-U+1D1FF | Musical Symbols | Notes, clefs, accidentals |
| U+2669-U+266F | Miscellaneous Music | ♩, ♪, ♫, ♬, ♯, ♭, ♮ |

## Encoding Rules

- All source files: UTF-8 without BOM
- Line endings: LF for .ts, .tsx, .sql, .sh, .yaml, .json
- Line endings: CRLF for .ps1
- SQL files with accented song titles: Use file-based execution, never pipe via stdin

## Verification

Run `scripts/check-encoding.ps1` to scan for encoding issues.
Run `scripts/fix-encoding.ps1 all` to repair BOM issues.

## PowerShell File I/O

```powershell
# Correct - UTF-8 without BOM
[System.IO.File]::WriteAllText($path, $content, [Text.Encoding]::UTF8)

# Avoid - defaults to UTF-16 LE on PS 5.1
Out-File -FilePath $path -InputObject $content
```
