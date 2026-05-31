export type FeatureFlagCategory =
  | "core"
  | "converter"
  | "editor"
  | "instruments"
  | "export"
  | "admin"
  | "ai"
  | "experimental";

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  category: FeatureFlagCategory;
  defaultValue: boolean;
}

export const FEATURE_FLAGS = {
  // Core
  homePage: {
    key: "home-page",
    name: "Home Page",
    description: "Public landing page with marketing content",
    category: "core" as FeatureFlagCategory,
    defaultValue: true,
  },
  authEmailPassword: {
    key: "auth-email-password",
    name: "Email/Password Auth",
    description: "Allow email and password authentication",
    category: "core" as FeatureFlagCategory,
    defaultValue: true,
  },
  guestMode: {
    key: "guest-mode",
    name: "Guest Mode",
    description: "Allow unauthenticated users to use basic conversion",
    category: "core" as FeatureFlagCategory,
    defaultValue: true,
  },
  darkMode: {
    key: "dark-mode",
    name: "Dark Mode",
    description: "Dark theme support",
    category: "core" as FeatureFlagCategory,
    defaultValue: true,
  },
  i18nFrench: {
    key: "i18n-french",
    name: "French Language",
    description: "French language support (Quebec French)",
    category: "core" as FeatureFlagCategory,
    defaultValue: true,
  },

  // Converter
  audioUpload: {
    key: "audio-upload",
    name: "Audio Upload",
    description: "Upload audio files for chord detection",
    category: "converter" as FeatureFlagCategory,
    defaultValue: true,
  },
  audioRecording: {
    key: "audio-recording",
    name: "Audio Recording",
    description: "Record audio from microphone for chord detection",
    category: "converter" as FeatureFlagCategory,
    defaultValue: false,
  },
  urlExtraction: {
    key: "url-extraction",
    name: "URL Extraction",
    description: "Extract audio from YouTube/SoundCloud URLs",
    category: "converter" as FeatureFlagCategory,
    defaultValue: false,
  },
  chordDetection: {
    key: "chord-detection",
    name: "Chord Detection",
    description: "Detect chords from audio using FFT/ML pipeline",
    category: "converter" as FeatureFlagCategory,
    defaultValue: true,
  },
  chordDetectionMl: {
    key: "chord-detection-ml",
    name: "ML Chord Detection",
    description: "Use ML model for improved chord detection accuracy",
    category: "converter" as FeatureFlagCategory,
    defaultValue: false,
  },
  audioSynthesis: {
    key: "audio-synthesis",
    name: "Audio Synthesis",
    description: "Synthesize audio from chord sheets",
    category: "converter" as FeatureFlagCategory,
    defaultValue: true,
  },

  // Editor
  visualEditor: {
    key: "visual-editor",
    name: "Visual Editor",
    description: "WYSIWYG music notation editor with VexFlow rendering",
    category: "editor" as FeatureFlagCategory,
    defaultValue: false,
  },
  noteInput: {
    key: "note-input",
    name: "Manual Note Input",
    description: "Manual note-by-note input in the editor",
    category: "editor" as FeatureFlagCategory,
    defaultValue: false,
  },
  undoRedo: {
    key: "undo-redo",
    name: "Undo/Redo",
    description: "Undo and redo in the editor",
    category: "editor" as FeatureFlagCategory,
    defaultValue: false,
  },

  // Instruments
  pianoFingerings: {
    key: "piano-fingerings",
    name: "Piano Fingerings",
    description: "Piano finger positioning diagrams",
    category: "instruments" as FeatureFlagCategory,
    defaultValue: false,
  },
  guitarFingerings: {
    key: "guitar-fingerings",
    name: "Guitar Fingerings",
    description: "Guitar fretboard finger positioning diagrams",
    category: "instruments" as FeatureFlagCategory,
    defaultValue: false,
  },

  // Export
  pdfExport: {
    key: "pdf-export",
    name: "PDF Export",
    description: "Export chord sheets as PDF with proper music engraving",
    category: "export" as FeatureFlagCategory,
    defaultValue: false,
  },
  musicXmlExport: {
    key: "musicxml-export",
    name: "MusicXML Export",
    description: "Export in MusicXML format",
    category: "export" as FeatureFlagCategory,
    defaultValue: false,
  },
  abcExport: {
    key: "abc-export",
    name: "ABC Export",
    description: "Export in ABC notation format",
    category: "export" as FeatureFlagCategory,
    defaultValue: false,
  },
  midiExport: {
    key: "midi-export",
    name: "MIDI Export",
    description: "Export as MIDI file",
    category: "export" as FeatureFlagCategory,
    defaultValue: false,
  },
  audioDownload: {
    key: "audio-download",
    name: "Audio Download",
    description: "Download synthesized audio as MP3/WAV",
    category: "export" as FeatureFlagCategory,
    defaultValue: false,
  },

  // Admin
  adminDashboard: {
    key: "admin-dashboard",
    name: "Admin Dashboard",
    description: "Administrative control panel",
    category: "admin" as FeatureFlagCategory,
    defaultValue: true,
  },
  userManagement: {
    key: "user-management",
    name: "User Management",
    description: "Admin user management interface",
    category: "admin" as FeatureFlagCategory,
    defaultValue: true,
  },
  featureFlagManagement: {
    key: "feature-flag-management",
    name: "Feature Flag Management",
    description: "Admin feature flag toggle interface",
    category: "admin" as FeatureFlagCategory,
    defaultValue: true,
  },
  analyticsDashboard: {
    key: "analytics-dashboard",
    name: "Analytics Dashboard",
    description: "Usage and engagement metrics",
    category: "admin" as FeatureFlagCategory,
    defaultValue: false,
  },

  // AI
  aiChordSuggestions: {
    key: "ai-chord-suggestions",
    name: "AI Chord Suggestions",
    description: "AI-powered chord progression suggestions",
    category: "ai" as FeatureFlagCategory,
    defaultValue: false,
  },

  // Experimental
  webmidiInput: {
    key: "webmidi-input",
    name: "WebMIDI Input",
    description: "MIDI instrument input support",
    category: "experimental" as FeatureFlagCategory,
    defaultValue: false,
  },
  offlineMode: {
    key: "offline-mode",
    name: "Offline Mode",
    description: "Service worker and cache for offline use",
    category: "experimental" as FeatureFlagCategory,
    defaultValue: false,
  },
} as const;

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS]["key"];
