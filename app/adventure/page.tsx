import Link from "next/link";
import FoodLensHeader from "@/components/FoodLensHeader";
import ProgressTracker from "@/components/ProgressTracker";
import AdventureClient from "@/components/AdventureClient";
import { getCuisinesWithCounts } from "@/lib/data";

export default async function AdventurePage() {
  const cuisines = await getCuisinesWithCounts();

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">

      {/* Top Navigation */}
      <div className="w-full absolute top-0 left-0 p-6 z-20 flex justify-between items-center">
        <Link 
          href="/"
          className="text-white hover:text-[var(--color-accent)] transition-colors flex items-center gap-2 group drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
        >
          <span className="text-2xl transform group-hover:-translate-x-1 transition-transform">&larr;</span>
          <span className="font-medium tracking-wide">Back</span>
        </Link>
      </div>

      <div className="z-10 pt-4">
        <FoodLensHeader />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-8 px-4 w-full z-10">
        <ProgressTracker currentStep={1} totalSteps={4} />
        
        <div className="mt-8 w-full">
          <AdventureClient cuisines={cuisines} />
        </div>
      </div>
    </main>
  );
}
