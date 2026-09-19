<!-- CLUSTER-C CANONICAL: NF-root rules. Project-specific delta below. -->
> **Canonical rules/process**: `../../../docs/technical/performance-optimization.md` (NF root). This doc keeps project-specific values/catalog only.
# Chord Weaver - Performance Optimization Strategy

## SSR Strategy

| Page Type | Strategy | Revalidation |
|-----------|----------|-------------|
| Landing page | ISR | 300s |
| About page | ISR | 3600s |
| Converter tool | Dynamic (user input) | N/A |
| Editor | Dynamic (user session) | N/A |
| Library | Dynamic (user session) | N/A |
| Admin dashboard | Dynamic (admin session) | N/A |

## Caching Layers

1. **Static pages**: ISR with appropriate revalidation
2. **API responses**: `React.cache()` for shared data fetching
3. **Audio analysis results**: Server-side cache by audio fingerprint (optional)
4. **Generated PDFs**: Cache by content hash (consider Vercel KV/Upstash)

## Bundle Optimization

- `experimental.optimizePackageImports`: lucide-react, date-fns
- Radix UI imports: tree-shaken via named imports
- VexFlow: dynamic import only on editor page
- Tone.js: dynamic import only on player/editor pages
- PDF generation: server-only (not in client bundle)

## Web Vitals Targets

| Metric | Target |
|--------|--------|
| LCP | < 2s |
| FID | < 100ms |
| CLS | < 0.1 |
| INP | < 200ms |

## Audio Processing Performance

- Audio decoding: Web Worker to avoid blocking main thread
- Chord detection: OffscreenCanvas for FFT analysis
- MIDI synthesis: AudioWorklet for low-latency playback
- Large file uploads: Chunked processing with progress indicators
