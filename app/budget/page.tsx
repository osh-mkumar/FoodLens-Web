import Link from "next/link";
import { Suspense } from "react";
import FoodLensHeader from "@/components/FoodLensHeader";
import ProgressTracker from "@/components/ProgressTracker";
import BudgetClient from "@/components/BudgetClient";
import { getBudgetRange } from "@/lib/data";

export default async function BudgetPage() {
  const { min, max } = await getBudgetRange();

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">

      {/* Top Navigation */}
      <div className="w-full absolute top-0 left-0 p-6 z-20 flex justify-between items-center">
        <Link 
          href="/adventure"
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
        <ProgressTracker currentStep={2} totalSteps={4} />
        
        <div className="mt-8 w-full">
          <Suspense fallback={<div className="text-white text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Loading budget data...</div>}>
            <BudgetClient minLimit={min} maxLimit={max} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
