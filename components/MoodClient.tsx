"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPreferences, updatePreferences } from "@/lib/storage";

const MOOD_OPTIONS = [
  {
    id: "hidden-corner",
    title: "Hidden Corner",
    description: "Places most people walk past.",
  },
  {
    id: "crowd-favourite",
    title: "Crowd Favourite",
    description: "The places everyone keeps coming back to.",
  },
  {
    id: "curious-choice",
    title: "Curious Choice",
    description: "Unexpected places worth exploring.",
  },
  {
    id: "no-preference",
    title: "No Preference",
    description: "Show me whatever fits best.",
  },
];

export default function MoodClient() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    const prefs = getPreferences();
    if (prefs.mood) {
      setSelectedMood(prefs.mood);
    }
  }, []);

  const handleSelect = (id: string) => {
    setSelectedMood(id);
  };

  const handleFlexible = () => {
    setSelectedMood("no-preference");
  };

  const handleContinue = () => {
    if (!selectedMood) return;

    updatePreferences({ mood: selectedMood });
    
    router.push(`/transition`);
  };

  const canContinue = selectedMood !== null;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center pb-24 z-10 relative px-4">
      
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          How would you like to discover today?
        </h2>
        <p className="text-lg md:text-xl text-white font-light drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          Choose the kind of experience you're looking for.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full mb-12">
        {MOOD_OPTIONS.map((mood) => {
          const isSelected = selectedMood === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => handleSelect(mood.id)}
              className={`flex flex-col items-start p-8 rounded-2xl border text-left transition-all duration-300 ${
                isSelected
                  ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white shadow-[0_4px_15px_rgba(255,181,167,0.8)] transform scale-[1.02]"
                  : "bg-white/90 border-white/50 text-foreground hover:bg-white shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
              }`}
            >
              <h3 className={`text-2xl font-playfair font-bold mb-2 tracking-wide ${isSelected ? "text-white" : "text-foreground"}`}>
                {mood.title}
              </h3>
              <p className={`text-base md:text-lg font-light ${isSelected ? "text-white/90" : "text-foreground/80"}`}>
                {mood.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleFlexible}
            className={`px-8 py-3 rounded-full border-2 transition-all duration-300 font-semibold ${
              selectedMood === "no-preference"
                ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white shadow-[0_0_15px_rgba(255,181,167,0.6)] transform scale-105"
                : "bg-black/40 border-white/50 text-white hover:bg-black/60 shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
            }`}
          >
            I'm feeling flexible &rarr;
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`mt-8 px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.4)] ${
            canContinue
              ? "bg-white text-[var(--color-foreground)] hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,255,255,0.4)] cursor-pointer"
              : "bg-white/40 text-white/60 cursor-not-allowed border border-white/20"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
