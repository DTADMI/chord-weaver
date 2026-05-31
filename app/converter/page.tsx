export default function ConverterPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Song to Chords Converter</h1>
      <p className="mb-8 text-stone-500">
        Convert any song, recording, or URL into chords and sheet music.
      </p>

      <div className="mb-8 rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-800">
        <h2 className="mb-4 text-lg font-semibold">Input</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search for a song by name..."
            className="rounded-lg border border-stone-300 px-4 py-3 dark:border-stone-600 dark:bg-stone-700"
          />
          <div className="flex gap-4">
            <button
              type="button"
              className="rounded-lg bg-primary-500 px-6 py-3 font-medium text-white hover:bg-primary-600"
            >
              Upload Audio
            </button>
            <button
              type="button"
              className="rounded-lg border border-stone-300 px-6 py-3 font-medium hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
            >
              Paste URL
            </button>
            <button
              type="button"
              className="rounded-lg border border-stone-300 px-6 py-3 font-medium hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
            >
              Record
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-stone-300 p-12 text-center text-stone-400 dark:border-stone-600">
        Results will appear here
      </div>
    </main>
  );
}
