"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CuisineCard from "@/components/CuisineCard";
import type { CuisineData } from "@/lib/data";
import { getPreferences, updatePreferences } from "@/lib/storage";

interface AdventureClientProps {
  cuisines: CuisineData[];
}

export default function AdventureClient({ cuisines }: AdventureClientProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isAnythingFine, setIsAnythingFine] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const prefs = getPreferences();
    if (prefs.cuisines && prefs.cuisines.length > 0) {
      setSelected(new Set(prefs.cuisines));
    }
  }, []);

  const handleSelect = (id: string) => {
    setIsAnythingFine(false);
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleAnythingFine = () => {
    if (isAnythingFine) {
      setIsAnythingFine(false);
      setSelected(new Set());
    } else {
      setIsAnythingFine(true);
      setSelected(new Set(cuisines.map((c) => c.id)));
    }
  };

  const handleContinue = () => {
    updatePreferences({ cuisines: Array.from(selected) });
    router.push(`/budget`);
  };

  const canContinue = selected.size > 0 || isAnythingFine;

  const filteredCuisines = cuisines.filter((cuisine) =>
    cuisine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center pb-24 z-10 relative px-4">
      
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          What are you craving today?
        </h2>
        <p className="text-lg md:text-xl text-white font-light drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          Pick everything you're in the mood for.
        </p>
      </div>

      <div className="w-full max-w-md mb-8">
        <input
          type="text"
          placeholder="Search cuisines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-3 rounded-full bg-white/90 border border-white/40 text-foreground placeholder-foreground/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full mb-12">
        {filteredCuisines.map((cuisine) => (
          <CuisineCard
            key={cuisine.id}
            id={cuisine.id}
            name={cuisine.name}
            icon={cuisine.icon}
            count={cuisine.count}
            isSelected={selected.has(cuisine.id)}
            onClick={() => handleSelect(cuisine.id)}
          />
        ))}
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
          disabled={!canContinue}
          className={`mt-8 px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl ${
            canContinue
              ? "bg-white text-[var(--color-foreground)] hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,181,167,0.4)] cursor-pointer"
              : "bg-white/40 text-white/60 cursor-not-allowed border border-white/20"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
