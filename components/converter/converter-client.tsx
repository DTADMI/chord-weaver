"use client";

import { useState } from "react";

import { useTranslation } from "@/lib/i18n";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { audioBufferToWav } from "@/lib/audio/decode";

/**
 * ConverterClient - the converter surface.
 *
 * Why a client component: the microphone recorder (`useAudioRecorder`) uses
 * `MediaRecorder`, and every label must come from the i18n dictionaries
 * (NF: no hardcoded UI string). The previous version was a static mock-up whose
 * "Record" button did nothing while the recorder hook sat unused next to it.
 */
export function ConverterClient() {
  const { t } = useTranslation();
  const { isRecording, duration, audioBlob, audioUrl, error, startRecording, stopRecording, reset } =
    useAudioRecorder();
  const [localError, setLocalError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const downloadWav = async () => {
    if (!audioBlob) return;
    setLocalError(null);
    setIsConverting(true);
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const ctx = new AudioContext();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      await ctx.close();
      const wav = audioBufferToWav(audioBuffer);
      const url = URL.createObjectURL(wav);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chord-recording-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setLocalError(t("converter.input.downloadFailed"));
    } finally {
      setIsConverting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const onRecordClick = async () => {
    setLocalError(null);
    if (isRecording) {
      stopRecording();
      return;
    }
    // A missing MediaRecorder API is the realistic failure (insecure context,
    // unsupported browser): say so instead of failing silently.
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setLocalError(t("converter.input.recordUnsupported"));
      return;
    }
    await startRecording();
  };

  const shownError = error ?? localError;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">{t("converter.title")}</h1>
      <p className="mb-8 text-stone-500">{t("converter.subtitle")}</p>

      <div className="mb-8 rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-800">
        <h2 className="mb-4 text-lg font-semibold">{t("converter.input.title")}</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder={t("converter.input.searchPlaceholder")}
            aria-label={t("converter.input.searchPlaceholder")}
            className="rounded-lg border border-stone-300 px-4 py-3 dark:border-stone-600 dark:bg-stone-700"
          />
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              className="rounded-lg bg-primary-500 px-6 py-3 font-medium text-white hover:bg-primary-600"
            >
              {t("converter.input.uploadLabel")}
            </button>
            <button
              type="button"
              className="rounded-lg border border-stone-300 px-6 py-3 font-medium hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
            >
              {t("converter.input.urlPlaceholder")}
            </button>
            <button
              type="button"
              onClick={onRecordClick}
              aria-pressed={isRecording}
              aria-busy={isRecording}
              className={`rounded-lg border px-6 py-3 font-medium dark:border-stone-600 ${
                isRecording
                  ? "border-red-500 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950"
                  : "border-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700"
              }`}
            >
              {isRecording
                ? `${t("converter.input.recording")} ${formatDuration(duration)}`
                : t("converter.input.recordLabel")}
            </button>
          </div>

          {shownError && (
            <p role="alert" className="text-sm text-red-600">
              {shownError}
            </p>
          )}

          {audioUrl && !isRecording && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">{t("converter.input.recordedLabel")}</span>
              <audio controls src={audioUrl} className="w-full" />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={downloadWav}
                  disabled={isConverting}
                  aria-busy={isConverting}
                  className="rounded-lg border border-stone-300 px-4 py-2 text-sm hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:hover:bg-stone-700"
                >
                  {t("converter.input.downloadLabel")}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-lg border border-stone-300 px-4 py-2 text-sm hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
                >
                  {t("converter.input.clearLabel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-stone-300 p-12 text-center text-stone-400 dark:border-stone-600">
        {t("converter.input.resultsEmpty")}
      </div>
    </main>
  );
}
