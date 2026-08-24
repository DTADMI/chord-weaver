"use client";

import React from "react";
import type { FretboardDiagram } from "@/lib/instruments/fretboard";
import { getChordFretboard } from "@/lib/instruments/fretboard";
import type { Chord, NoteName } from "@/lib/chords/types";
import { cn } from "@/lib/utils/cn";

interface FretboardDisplayProps {
  chord: Chord;
  numFrets?: number;
  startFret?: number;
  className?: string;
  showNoteNames?: boolean;
  highlightRoot?: boolean;
}

const STRING_LABELS = ["E", "A", "D", "G", "B", "e"];
const FRET_MARKER_FRETS = [3, 5, 7, 9, 12, 15];

export function FretboardDisplay({
  chord,
  numFrets = 5,
  startFret = 0,
  className,
  showNoteNames = false,
  highlightRoot = true,
}: FretboardDisplayProps) {
  const diagram = getChordFretboard(chord, numFrets, startFret);

  if (!diagram) {
    return (
      <div className={cn("p-4 text-sm text-muted-foreground text-center", className)}>
        No fretboard diagram available for {chord.root}{chord.quality}
      </div>
    );
  }

  const dotRadius = 10;
  const stringSpacing = 40;
  const fretSpacing = 50;
  const leftMargin = 40;
  const topMargin = 40;
  const width = leftMargin + stringSpacing * (diagram.strings - 1) + 30;
  const height = topMargin + fretSpacing * (diagram.frets - 1) + 24;

  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-[280px]"
        role="img"
        aria-label={`Fretboard diagram: ${chord.root}${chord.quality}`}
      >
        {/* Strings */}
        {Array.from({ length: diagram.strings }).map((_, s) => {
          const x = leftMargin + s * stringSpacing;
          return (
            <line
              key={`string-${s}`}
              x1={x}
              y1={topMargin}
              x2={x}
              y2={topMargin + (diagram.frets - 1) * fretSpacing}
              stroke="currentColor"
              strokeWidth={s === 0 || s === diagram.strings - 1 ? 1.5 : 1}
              opacity={0.5}
            />
          );
        })}

        {/* Frets */}
        {Array.from({ length: diagram.frets }).map((_, f) => {
          const y = topMargin + f * fretSpacing;
          return (
            <g key={`fret-${f}`}>
              <line
                x1={leftMargin - 10}
                y1={y}
                x2={leftMargin + (diagram.strings - 1) * stringSpacing + 10}
                y2={y}
                stroke="currentColor"
                strokeWidth={f === 0 ? 3 : 1}
                opacity={f === 0 ? 0.8 : 0.3}
              />
              {/* Fret markers */}
              {f > 0 && FRET_MARKER_FRETS.includes(startFret + f) && (
                <circle
                  cx={leftMargin + ((diagram.strings - 1) / 2) * stringSpacing}
                  cy={y - fretSpacing / 2}
                  r={4}
                  fill="currentColor"
                  opacity={0.2}
                />
              )}
            </g>
          );
        })}

        {/* String labels at top */}
        {STRING_LABELS.slice(0, diagram.strings).map((label, s) => (
          <text
            key={`label-${s}`}
            x={leftMargin + s * stringSpacing}
            y={topMargin - 16}
            textAnchor="middle"
            fill="currentColor"
            fontSize={11}
            fontWeight={600}
            opacity={0.6}
          >
            {label}
          </text>
        ))}

        {/* Start fret label */}
        {startFret > 0 && (
          <text
            x={leftMargin - 18}
            y={topMargin + fretSpacing / 2 + 4}
            textAnchor="middle"
            fill="currentColor"
            fontSize={11}
            fontWeight={600}
            opacity={0.5}
          >
            {startFret}
          </text>
        )}

        {/* Position dots */}
        {diagram.positions.map((pos, i) => {
          const cx = leftMargin + (pos.string - 1) * stringSpacing;
          const cy = (pos.fret - startFret) === 0 ? topMargin - 8 : topMargin + (pos.fret - startFret - 0.5) * fretSpacing;
          const isMuted = pos.fret === 0 && startFret === 0 && pos.string !== 0; // open strings
          const isOpen = pos.fret === 0 && startFret === 0;

          if (isOpen) {
            return (
              <circle
                key={`pos-${i}`}
                cx={cx}
                cy={topMargin - 8}
                r={6}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                opacity={0.6}
              />
            );
          }

          if (isMuted) return null;

          return (
            <g key={`pos-${i}`}>
              <circle
                cx={cx}
                cy={cy}
                r={dotRadius}
                fill={highlightRoot && pos.isRoot ? "#3b82f6" : "currentColor"}
                stroke={highlightRoot && pos.isRoot ? "#1d4ed8" : "none"}
                strokeWidth={1}
                opacity={highlightRoot && pos.isRoot ? 1 : 0.7}
              />
              {highlightRoot && pos.isRoot && (
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize={10}
                  fontWeight={700}
                >
                  R
                </text>
              )}
              {showNoteNames && (
                <text
                  x={cx}
                  y={cy + dotRadius + 14}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize={9}
                  opacity={0.5}
                >
                  {pos.note}
                </text>
              )}
              {pos.finger && (
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fill={highlightRoot && pos.isRoot ? "white" : "#1e293b"}
                  fontSize={10}
                  fontWeight={700}
                >
                  {pos.finger}
                </text>
              )}
            </g>
          );
        })}

        {/* Barres */}
        {diagram.barres.map((barre, i) => {
          if (barre.fret <= startFret) return null;
          const x1 = leftMargin + (barre.fromString - 1) * stringSpacing - dotRadius;
          const x2 = leftMargin + (barre.toString - 1) * stringSpacing + dotRadius;
          const y = topMargin + (barre.fret - startFret - 0.5) * fretSpacing;
          return (
            <rect
              key={`barre-${i}`}
              x={x1}
              y={y - dotRadius}
              width={x2 - x1}
              height={dotRadius * 2}
              rx={dotRadius}
              fill="currentColor"
              opacity={0.5}
            />
          );
        })}
      </svg>
      <span className="text-xs text-muted-foreground font-medium">
        {chord.root}{chord.quality}
      </span>
    </div>
  );
}

/** Multi-chord fretboard grid for displaying chord progressions */
interface ChordGridProps {
  chords: Chord[];
  numFrets?: number;
  startFret?: number;
  className?: string;
}

export function ChordFretboardGrid({ chords, numFrets = 5, startFret = 0, className }: ChordGridProps) {
  if (chords.length === 0) {
    return <p className="text-sm text-muted-foreground text-center p-4">No chords to display.</p>;
  }

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", className)}>
      {chords.map((chord, i) => (
        <FretboardDisplay
          key={`${chord.root}-${chord.quality}-${i}`}
          chord={chord}
          numFrets={numFrets}
          startFret={startFret}
          className="border rounded-lg p-3 bg-card"
        />
      ))}
    </div>
  );
}

export default FretboardDisplay;