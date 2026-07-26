import { FEATURE_FLAGS, type FeatureFlagKey } from "./flags";

export interface FlagOverride {
  key: FeatureFlagKey;
  enabled: boolean;
  updatedAt: string;
  updatedBy: string;
}

const overrides = new Map<FeatureFlagKey, boolean>();

export function getFlagOverrides(): Map<FeatureFlagKey, boolean> {
  return new Map(overrides);
}

export function setFlagOverride(key: FeatureFlagKey, value: boolean, by?: string): void {
  overrides.set(key, value);
}

export function clearFlagOverride(key: FeatureFlagKey): void {
  overrides.delete(key);
}

export function clearAllOverrides(): void {
  overrides.clear();
}

export function getAllFlagsWithStatus() {
  return Object.values(FEATURE_FLAGS).map((flag) => ({
    ...flag,
    isOverridden: overrides.has(flag.key as FeatureFlagKey),
    currentValue: overrides.has(flag.key as FeatureFlagKey)
      ? overrides.get(flag.key as FeatureFlagKey)
      : flag.defaultValue,
  }));
}
