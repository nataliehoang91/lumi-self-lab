export interface FeatureItem {
  key: string;
  label: string;
  description?: string;
}

export interface FeatureGroup {
  key: string;
  label: string;
  features: FeatureItem[];
}

export const FEATURE_CATALOG: FeatureGroup[] = [
  {
    key: "experiments",
    label: "Experiments",
    features: [
      { key: "experiments_unlimited", label: "Unlimited experiments", description: "Free plan: max 5 active experiments" },
      { key: "experiments_ai_reflections", label: "AI reflections", description: "AI-generated end-of-experiment summaries" },
    ],
  },
];

export const ALL_FEATURE_KEYS = FEATURE_CATALOG.flatMap((g) => g.features.map((f) => f.key));

export const ALL_FEATURES_ON = Object.fromEntries(ALL_FEATURE_KEYS.map((k) => [k, true]));
export const ALL_FEATURES_OFF = Object.fromEntries(ALL_FEATURE_KEYS.map((k) => [k, false]));

/** The 3 built-in system packages seeded on first load. */
export const SYSTEM_PACKAGE_SEEDS = [
  {
    name: "Testing",
    key: "testing",
    description: "All features on. For internal testing only.",
    features: ALL_FEATURES_ON,
    isSystem: true,
    isDefault: false,
  },
  {
    name: "Free",
    key: "free",
    description: "Default plan for all users. Limited access.",
    features: ALL_FEATURES_OFF,
    isSystem: true,
    isDefault: true,
  },
  {
    name: "Premium",
    key: "premium",
    description: "Full access to all features.",
    features: ALL_FEATURES_ON,
    isSystem: true,
    isDefault: false,
  },
] as const;
