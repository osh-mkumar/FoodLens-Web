import Link from "next/link";
import FoodLensHeader from "@/components/FoodLensHeader";
import FloatingSticker from "@/components/FloatingSticker";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4">
      
      {/* Floating Stickers */}
      <FloatingSticker src="/coffee.png" alt="Coffee" width={100} height={100} className="top-[15%] left-[15%] md:left-[30%]" animationClass="animate-float-slow" delayMs={0} />
      <FloatingSticker src="/croissant.png" alt="Croissant" width={120} height={120} className="top-[20%] right-[15%] md:right-[28%]" animationClass="animate-float-medium" delayMs={1500} />
      <FloatingSticker src="/dessert.png" alt="Dessert" width={90} height={90} className="bottom-[25%] left-[20%] md:left-[32%]" animationClass="animate-float-fast" delayMs={700} />
      <FloatingSticker src="/ramen.png" alt="Ramen" width={130} height={130} className="bottom-[20%] right-[15%] md:right-[30%]" animationClass="animate-float-slow" delayMs={2000} />
      <FloatingSticker src="/pavbhaji.png" alt="Pav Bhaji" width={110} height={110} className="top-[45%] left-[5%] md:left-[25%]" animationClass="animate-float-medium" delayMs={3000} />

      <div className="z-10 flex flex-col items-center text-center max-w-lg mx-auto py-10 transition-transform hover:scale-[1.01] duration-500">
        <h1 className="font-pinyon text-6xl md:text-8xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] mb-4 tracking-wide">
          FoodLens
        </h1>
        
        <p className="text-white text-xl md:text-2xl font-light mb-12 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-relaxed">
          Hello, hungry friend. <br className="hidden md:block" />
          Let's find something delicious today.
        </p>

        <Link 
          href="/adventure"
          className="group relative inline-flex items-center justify-center px-8 py-4 font-medium text-foreground bg-white rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_4px_15px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(255,255,255,0.2)]"
        >
          <span className="relative text-lg tracking-wide">Start Food Adventure</span>
        </Link>
      </div>
    </main>
  );
}
