import Image from "next/image";

export default function BackgroundHero({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="fixed inset-0 z-[-2]">
        <Image
          src="/hero.jpg"
          alt="Cozy Cafe Background"
          fill
          priority
          className="object-cover"
        />
      </div>
      {/* Subtle dark overlay for readability */}
      <div className="fixed inset-0 z-[-1] bg-black/40" />
      
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
