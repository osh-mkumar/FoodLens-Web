import { Suspense } from "react";
import FoodLensHeader from "@/components/FoodLensHeader";
import ProgressTracker from "@/components/ProgressTracker";
import ResultsClient from "@/components/ResultsClient";
import Footer from "@/components/Footer";

export default function ResultsPage() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      
      <div className="z-10 pt-4">
        <FoodLensHeader />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-8 px-4 w-full z-10">
        <ProgressTracker currentStep={4} totalSteps={4} />
        
        <div className="mt-8 w-full">
          <Suspense fallback={<div className="text-white text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Generating recommendations...</div>}>
            <ResultsClient />
          </Suspense>
        </div>
      </div>
      <Footer />
    </main>
  );
}
