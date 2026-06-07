import Image from "next/image";

export default function FoodLensHeader() {
  return (
    <header className="w-full py-6 flex justify-center items-center gap-3 relative z-20">
      <h1 className="font-pinyon text-5xl md:text-6xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-wider">
        FoodLens
      </h1>
      <div className="relative w-10 h-10 md:w-12 md:h-12 pointer-events-none -mt-4">
        <Image
          src="/spoon.png"
          alt="Spoon decoration"
          fill
          sizes="48px"
          className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
        />
      </div>
    </header>
  );
}
