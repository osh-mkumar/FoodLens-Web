"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FoodLensHeader from "@/components/FoodLensHeader";
import FloatingSticker from "@/components/FloatingSticker";

export default function TransitionPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/results");
    }, 2500); // 2.5 seconds delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden justify-center items-center">
      {/* Floating Stickers */}
      <FloatingSticker src="/coffee.png" alt="Coffee" width={100} height={100} className="top-[15%] left-[15%] md:left-[30%]" animationClass="animate-float-slow" delayMs={0} />
      <FloatingSticker src="/croissant.png" alt="Croissant" width={120} height={120} className="top-[20%] right-[15%] md:right-[28%]" animationClass="animate-float-medium" delayMs={1500} />
      <FloatingSticker src="/dessert.png" alt="Dessert" width={90} height={90} className="bottom-[25%] left-[20%] md:left-[32%]" animationClass="animate-float-fast" delayMs={700} />
      <FloatingSticker src="/ramen.png" alt="Ramen" width={130} height={130} className="bottom-[20%] right-[15%] md:right-[30%]" animationClass="animate-float-slow" delayMs={2000} />
      <FloatingSticker src="/pavbhaji.png" alt="Pav Bhaji" width={110} height={110} className="top-[45%] left-[5%] md:left-[25%]" animationClass="animate-float-medium" delayMs={3000} />

      <div className="absolute top-0 left-0 w-full pt-4 z-20">
        <FoodLensHeader />
      </div>

      <div className="z-10 flex flex-col items-center justify-center p-8 text-center animate-pulse">
        <div className="w-16 h-16 border-4 border-t-[var(--color-accent)] border-white/30 rounded-full animate-spin mb-8" />
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          Finding places that match your cravings...
        </h2>
      </div>
    </main>
  );
}
