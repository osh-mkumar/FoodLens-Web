"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BudgetPresets from "@/components/BudgetPresets";
import DualRangeSlider from "@/components/DualRangeSlider";
import { getPreferences, updatePreferences } from "@/lib/storage";

interface BudgetClientProps {
  minLimit: number;
  maxLimit: number;
}

export default function BudgetClient({ minLimit, maxLimit }: BudgetClientProps) {
  const router = useRouter();

  const [budgetRange, setBudgetRange] = useState<[number, number]>([minLimit, maxLimit]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isAnythingFine, setIsAnythingFine] = useState(false);

  useEffect(() => {
    const prefs = getPreferences();
    if (prefs.minBudget !== null && prefs.maxBudget !== null) {
      setBudgetRange([prefs.minBudget, prefs.maxBudget]);
    }
  }, []);

  const handlePresetSelect = (min: number, max: number) => {
    setBudgetRange([min, max]);
    setIsAnythingFine(false);
    
    // Determine which preset was clicked based on values
    const range = maxLimit - minLimit;
    if (min === minLimit && max === minLimit + Math.floor(range * 0.3)) {
      setSelectedPreset("budget-friendly");
    } else if (min === minLimit + Math.floor(range * 0.3) && max === minLimit + Math.floor(range * 0.7)) {
      setSelectedPreset("comfortable");
    } else if (min === minLimit + Math.floor(range * 0.7) && max === maxLimit) {
      setSelectedPreset("treat-yourself");
    } else {
      setSelectedPreset(null);
    }
  };

  const handleSliderChange = (val: [number, number]) => {
    setBudgetRange(val);
    setSelectedPreset(null);
    setIsAnythingFine(false);
  };

  const handleAnythingFine = () => {
    if (isAnythingFine) {
      setIsAnythingFine(false);
    } else {
      setIsAnythingFine(true);
      setBudgetRange([minLimit, maxLimit]);
      setSelectedPreset(null);
    }
  };

  const handleContinue = () => {
    updatePreferences({ minBudget: budgetRange[0], maxBudget: budgetRange[1] });
    router.push(`/mood`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center pb-24 z-10 relative px-4">
      
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          What's your budget today?
        </h2>
        <p className="text-lg md:text-xl text-white font-light drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          Pick a comfortable range.
        </p>
      </div>

      <BudgetPresets 
        onSelect={handlePresetSelect} 
        selectedPreset={selectedPreset} 
        minVal={minLimit} 
        maxVal={maxLimit} 
      />

      <div className="w-full bg-white/90 rounded-2xl p-8 mb-12 shadow-[0_4px_12px_rgba(0,0,0,0.4)] border border-white/50">
        <DualRangeSlider 
          min={minLimit} 
          max={maxLimit} 
          value={budgetRange} 
          onChange={handleSliderChange} 
        />
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-white font-medium tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">Not sure?</p>
          <button
            onClick={handleAnythingFine}
            className={`px-8 py-3 rounded-full border-2 transition-all duration-300 font-semibold ${
              isAnythingFine
                ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white shadow-[0_0_15px_rgba(255,181,167,0.6)] transform scale-105"
                : "bg-black/40 border-white/50 text-white hover:bg-black/60 shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
            }`}
          >
            Anything is Fine &rarr;
          </button>
        </div>

        <button
          onClick={handleContinue}
          className={`mt-8 px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.4)] bg-white text-[var(--color-foreground)] hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,255,255,0.4)] cursor-pointer`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
