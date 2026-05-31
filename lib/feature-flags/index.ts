import { FEATURE_FLAGS, type FeatureFlagKey } from "./flags";

const overrides: Partial<Record<FeatureFlagKey, boolean>> = {};

export function isFeatureEnabled(key: FeatureFlagKey): boolean {
  if (key in overrides) return overrides[key]!;
  const flag = Object.values(FEATURE_FLAGS).find((f) => f.key === key);
  return flag?.defaultValue ?? false;
}

export function setFeatureOverride(key: FeatureFlagKey, value: boolean): void {
  overrides[key] = value;
}

export function getFeatureFlags() {
  return FEATURE_FLAGS;
}
