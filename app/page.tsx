import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-16">
      <h1 className="mb-4 text-5xl font-bold tracking-tight text-primary-600">Chord Weaver</h1>
      <p className="mb-12 max-w-2xl text-center text-lg text-stone-600 dark:text-stone-400">
        Weave audio into chords, chords into sound.
        <br />
        Upload, record, or search any song - get instant chord sheets, instrument fingerings, and
        audio playback.
      </p>

      <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-2">
        <Link
          href="/converter"
          className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-stone-700 dark:bg-stone-800"
        >
          <span className="text-4xl">🎵</span>
          <span className="text-lg font-semibold">Song to Chords</span>
          <span className="text-center text-sm text-stone-500">
            Upload audio, paste a URL, or search for a song
          </span>
        </Link>

        <Link
          href="/editor"
          className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-stone-700 dark:bg-stone-800"
        >
          <span className="text-4xl">🎼</span>
          <span className="text-lg font-semibold">Chords to Audio</span>
          <span className="text-center text-sm text-stone-500">
            Create or paste chord sheets and hear them play
          </span>
        </Link>
      </div>
    </main>
  );
}
