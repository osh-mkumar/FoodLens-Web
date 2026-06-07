export const STORAGE_KEY = "foodlens_preferences";

export interface FoodLensPreferences {
  cuisines: string[];
  minBudget: number | null;
  maxBudget: number | null;
  mood: string | null;
}

export function getPreferences(): FoodLensPreferences {
  if (typeof window === "undefined") {
    return { cuisines: [], minBudget: null, maxBudget: null, mood: null };
  }
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse preferences from localStorage", e);
    }
  }
  return { cuisines: [], minBudget: null, maxBudget: null, mood: null };
}

export function updatePreferences(updates: Partial<FoodLensPreferences>) {
  if (typeof window === "undefined") return;
  const current = getPreferences();
  const next = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
