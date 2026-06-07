import Image from "next/image";

interface CuisineCardProps {
  id: string;
  name: string;
  icon: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function CuisineCard({
  id,
  name,
  icon,
  count,
  isSelected,
  onClick,
}: CuisineCardProps) {
  const isHiddenCorner = count < 5;

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 ${
        isSelected
          ? "bg-white/80 border-2 border-[var(--color-accent)] shadow-[0_0_20px_rgba(255,181,167,0.5)]"
          : "bg-white/40 border border-white/50 hover:bg-white/60 shadow-lg"
      } backdrop-blur-sm`}
    >
      {isHiddenCorner && (
        <div className="absolute -top-4 -right-4 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-lg z-10 border border-gray-100">
          <Image src="/exclamation.png" alt="Badge" width={24} height={24} className="object-contain" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
            Hidden Corner
          </span>
        </div>
      )}

      <div className="flex flex-col items-center justify-center text-center gap-3">
        <div className="text-4xl filter drop-shadow-sm">{icon}</div>
        <div>
          <h3 className="font-playfair font-bold text-lg text-foreground">{name}</h3>
          <p className="text-sm text-foreground/70">{count} places to explore</p>
        </div>
      </div>
    </div>
  );
}
