"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPreferences } from "@/lib/storage";
import { getRecommendations, RecommendationResult } from "@/lib/recommendation";

export default function ResultsClient() {
  const router = useRouter();
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      const prefs = getPreferences();
      try {
        const res = await getRecommendations(prefs);
        setResult(res);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, []);

  const handleStartOver = () => {
    localStorage.removeItem("foodlens_preferences");
    router.push("/");
  };

  const handleAnalytics = () => {
    router.push("/analytics");
  };

  if (loading) {
    return <div className="text-white text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">Brewing your perfect match...</div>;
  }

  if (!result || !result.primary) {
    return (
      <div className="text-center text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
        <h2 className="text-3xl font-playfair mb-4">No exact matches found!</h2>
        <p className="mb-8">{result?.reason || "Try loosening your budget or craving preferences."}</p>
        <button onClick={handleStartOver} className="px-8 py-3 bg-white text-[var(--color-foreground)] rounded-full font-bold shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform">
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center pb-24 relative px-4 z-10">
      
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          We found something for you.
        </h2>
      </div>

      {/* Primary Result Container */}
      <div className="relative w-full max-w-3xl flex justify-center mb-16">
        {/* Background "Plate" Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[140%] pointer-events-none opacity-40 -z-10">
          <Image
            src="/circle.png"
            alt="Decorative plate"
            fill
            className="object-contain"
          />
        </div>

        {/* Exclamation Sticker */}
        <div className="absolute -top-12 -right-6 md:-right-12 w-20 h-20 md:w-28 md:h-28 pointer-events-none z-20 rotate-12 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] animate-pulse">
          <Image
            src="/exclamation.png"
            alt="Exclamation mark sticker"
            fill
            className="object-contain"
          />
        </div>

        <div className="w-full bg-white/95 rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/50 text-foreground relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h3 className="text-3xl md:text-4xl font-playfair font-bold text-[var(--color-accent)]">
              {result.primary.name}
            </h3>
            <div className="bg-[var(--color-accent)] text-white px-4 py-1 rounded-full text-sm font-bold mt-2 md:mt-0 shadow-sm">
              {result.primary.ratingType} • {result.primary.rating}/5
            </div>
          </div>
          
          <p className="text-lg font-light mb-6 border-b border-foreground/10 pb-6 text-foreground/80 italic">
            "{result.reason}"
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground/90">
            <div>
              <p><strong className="font-semibold text-foreground">Region:</strong> {result.primary.region} ({result.primary.city})</p>
              <p><strong className="font-semibold text-foreground">Cuisines:</strong> {result.primary.cuisines.join(", ")}</p>
            </div>
            <div>
              <p><strong className="font-semibold text-foreground">Average Price:</strong> ₹{result.primary.price}</p>
              <p><strong className="font-semibold text-foreground">Timing:</strong> {result.primary.timing}</p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            {result.primary.url ? (
              <a href={result.primary.url} target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-[var(--color-accent)] text-white rounded-full font-bold shadow-md hover:scale-105 transition-transform inline-block">
                View on Zomato &rarr;
              </a>
            ) : (
              <span className="px-8 py-3 bg-black/10 text-foreground/60 rounded-full font-bold shadow-sm inline-block italic">
                Link unavailable
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Results */}
      {result.secondary.length > 0 && (
        <div className="w-full mb-16 relative z-10">
          <h3 className="text-2xl font-playfair font-bold text-white mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] text-center">
            You may also enjoy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.secondary.map(rest => (
              <div key={rest.id} className="bg-white/90 rounded-2xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.4)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-playfair font-bold text-foreground">{rest.name}</h4>
                    <span className="text-sm font-medium text-[var(--color-accent)] whitespace-nowrap ml-2">★ {rest.rating}</span>
                  </div>
                  <p className="text-sm text-foreground/80 mb-2 italic">{rest.cuisines.join(", ")}</p>
                  <p className="text-sm font-semibold text-foreground mb-4">₹{rest.price}</p>
                </div>
                
                <div className="mt-auto">
                  <p className="text-xs text-foreground/60 mb-4 border-t border-foreground/10 pt-3">
                    📍 {rest.region}
                  </p>
                  {rest.url ? (
                    <a href={rest.url} target="_blank" rel="noopener noreferrer" className="w-full block text-center px-4 py-2 border-2 border-[var(--color-accent)] text-[var(--color-accent)] rounded-full text-sm font-bold shadow-sm hover:bg-[var(--color-accent)] hover:text-white transition-colors">
                      View on Zomato
                    </a>
                  ) : (
                    <span className="w-full block text-center px-4 py-2 bg-black/5 text-foreground/40 rounded-full text-sm font-medium italic">
                      No link available
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-6 mt-4 relative z-10">
        <button
          onClick={handleStartOver}
          className="px-8 py-3 bg-black/40 border border-white/50 text-white rounded-full font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:bg-black/60 transition-colors"
        >
          Start Over
        </button>
        <button
          onClick={handleAnalytics}
          className="px-8 py-3 bg-white text-[var(--color-foreground)] rounded-full font-bold shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform"
        >
          See How We Chose
        </button>
      </div>

    </div>
  );
}
