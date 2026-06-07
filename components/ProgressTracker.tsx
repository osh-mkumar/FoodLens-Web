import Image from "next/image";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressTracker({ currentStep, totalSteps }: ProgressTrackerProps) {
  return (
    <div className="flex flex-col items-center mb-8 z-10 relative">
      <p className="text-white text-sm tracking-widest uppercase mb-3 drop-shadow-md">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="flex gap-4">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = index < currentStep;
          return (
            <div key={index} className="relative w-8 h-8 transition-transform duration-300">
              <Image
                src={isCompleted ? "/emptyplate.png" : "/blueberry.png"}
                alt={isCompleted ? "Completed Step" : "Unexplored Step"}
                fill
                sizes="32px"
                className="object-contain drop-shadow-md"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
