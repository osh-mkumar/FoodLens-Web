interface BudgetPresetsProps {
  onSelect: (min: number, max: number) => void;
  selectedPreset: string | null;
  minVal: number;
  maxVal: number;
}

export default function BudgetPresets({ onSelect, selectedPreset, minVal, maxVal }: BudgetPresetsProps) {
  const range = maxVal - minVal;

  const presets = [
    {
      id: "budget-friendly",
      label: "Budget Friendly",
      min: minVal,
      max: minVal + Math.floor(range * 0.3),
    },
    {
      id: "comfortable",
      label: "Comfortable",
      min: minVal + Math.floor(range * 0.3),
      max: minVal + Math.floor(range * 0.7),
    },
    {
      id: "treat-yourself",
      label: "Treat Yourself",
      min: minVal + Math.floor(range * 0.7),
      max: maxVal,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full justify-center mb-8">
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelect(preset.min, preset.max)}
          className={`flex-1 px-6 py-4 rounded-xl border transition-all duration-300 font-playfair tracking-wide text-lg text-center ${
            selectedPreset === preset.id
              ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white shadow-[0_4px_15px_rgba(255,181,167,0.8)] transform scale-105"
              : "bg-white/90 border-white/50 text-foreground hover:bg-white shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
