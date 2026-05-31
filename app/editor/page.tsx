export default function EditorPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Chord Editor</h1>
      <p className="mb-8 text-stone-500">
        Create and edit chord sheets and music notation.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
        >
          Add Note
        </button>
        <button
          type="button"
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
        >
          Add Rest
        </button>
        <button
          type="button"
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
        >
          Add Chord Symbol
        </button>
        <button
          type="button"
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
        >
          Play
        </button>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-8 dark:border-stone-700 dark:bg-stone-800">
        <div className="flex items-center justify-center" style={{ minHeight: 300 }}>
          <span className="text-stone-400">Editor canvas — VexFlow rendering coming soon</span>
        </div>
      </div>
    </main>
  );
}
