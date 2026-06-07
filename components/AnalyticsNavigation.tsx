"use client";

import { useRouter } from "next/navigation";

export default function AnalyticsNavigation() {
  const router = useRouter();

  const handleStartOver = () => {
    localStorage.removeItem("foodlens_preferences");
    router.push("/");
  };

  const handleBack = () => {
    router.push("/results");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-16 pb-24 justify-center items-center">
      <button
        onClick={handleBack}
        className="px-8 py-3 bg-black/40 border border-white/50 text-white rounded-full font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:bg-black/60 transition-colors"
      >
        &larr; Back to Results
      </button>
      <button
        onClick={handleStartOver}
        className="px-8 py-3 bg-white text-[var(--color-foreground)] rounded-full font-bold shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform"
      >
        Start Over
      </button>
    </div>
  );
}
