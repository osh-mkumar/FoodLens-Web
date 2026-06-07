import Image from "next/image";
import FoodLensHeader from "@/components/FoodLensHeader";
import ProgressTracker from "@/components/ProgressTracker";
import AnalyticsNavigation from "@/components/AnalyticsNavigation";
import Footer from "@/components/Footer";
import { getAnalyticsData } from "@/lib/analytics";

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  // Find max value for Cuisine Bar Chart scaling
  const maxCuisineCount = Math.max(...data.topCuisines.map(c => c.count));

  // Find max value for Ratings Histogram scaling
  const maxRatingDist = Math.max(...data.ratingDist.map(d => d.count));

  // Calculate total restaurants correctly
  const totalRestsInDist = data.ratingDist.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden text-white">

      <div className="z-20 pt-4">
        <FoodLensHeader />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-8 px-4 w-full z-10 max-w-6xl mx-auto pb-24">

        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-playfair text-white mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            A closer look at Mumbai's food scene.
          </h2>
        </div>

        <ProgressTracker currentStep={4} totalSteps={4} />

        <div className="w-full mt-16 space-y-24">

          {/* SECTION 1: Cuisine Landscape */}
          <section className="bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <h3 className="text-4xl font-playfair font-bold mb-2 text-white">Cuisine Landscape</h3>
            <p className="text-lg font-light text-white/80 mb-8 italic">The cuisines that appear most often across Mumbai.</p>

            <div className="flex flex-col gap-6">
              {data.topCuisines.map((cuisine, i) => {
                const widthPercent = Math.max(10, (cuisine.count / maxCuisineCount) * 100);
                return (
                  <div key={i} className="flex flex-col w-full">
                    <div className="flex justify-between items-end mb-1 px-1">
                      <span className="font-semibold tracking-wide text-lg">{cuisine.name}</span>
                      <span className="text-sm font-light text-white/70">{cuisine.count} spots</span>
                    </div>
                    <div className="w-full h-8 bg-white/10 rounded-r-full overflow-hidden">
                      <div
                        className="h-full bg-white/80 rounded-r-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 2: Ratings Distribution */}
          <section className="bg-white/95 rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/50 text-[var(--color-foreground)]">
            <h3 className="text-4xl font-playfair font-bold mb-2">Ratings Distribution</h3>
            <p className="text-lg font-light text-foreground/70 mb-10 italic">How restaurants are rated across the city.</p>

            <div className="flex justify-between items-end h-64 gap-2 md:gap-8 px-2 md:px-8">
              {data.ratingDist.map((bucket, i) => {
                const heightPercent = Math.max(5, (bucket.count / maxRatingDist) * 100);
                return (
                  <div key={i} className="flex flex-col items-center justify-end h-full w-full group">
                    <span className="text-sm font-bold text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                      {bucket.count}
                    </span>
                    <div
                      className="w-full max-w-[60px] bg-[var(--color-accent)]/80 hover:bg-[var(--color-accent)] rounded-t-lg transition-all duration-500 ease-out shadow-md"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="mt-4 font-semibold text-sm md:text-base">{bucket.range}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: Hidden Corners */}
          <section>
            <div className="text-center mb-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              <h3 className="text-4xl font-playfair font-bold mb-2">Hidden Corners</h3>
              <p className="text-lg font-light text-white/90 italic">Highly rated places that fewer people notice.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.hiddenCorners.map(rest => (
                <div key={rest.id} className="bg-white/90 rounded-2xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.4)] flex flex-col justify-between text-foreground hover:-translate-y-1 transition-transform">
                  <div>
                    <h4 className="text-xl font-playfair font-bold mb-2">{rest.name}</h4>
                    <p className="text-sm text-foreground/80 mb-2">{rest.region}</p>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <span className="font-semibold">₹{rest.price}</span>
                    <div className="bg-[var(--color-accent)] text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                      ★ {rest.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: Crowd Favourites */}
          <section>
            <div className="text-center mb-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              <h3 className="text-4xl font-playfair font-bold mb-2">Crowd Favourites</h3>
              <p className="text-lg font-light text-white/90 italic">Places that consistently attract attention.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.crowdFavourites.map(rest => (
                <div key={rest.id} className="bg-white/90 rounded-2xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.4)] flex flex-col justify-between text-foreground hover:-translate-y-1 transition-transform border-t-4 border-[var(--color-accent)]">
                  <div>
                    <h4 className="text-xl font-playfair font-bold mb-2">{rest.name}</h4>
                    <p className="text-sm text-foreground/80 mb-2">{rest.region}</p>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <span className="font-semibold">₹{rest.price}</span>
                    <div className="bg-[var(--color-foreground)] text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                      ★ {rest.rating} <span className="text-xs font-normal text-white/70 ml-1">({rest.votes})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: Regional Insights */}
          <section className="bg-[#FAF9F6] rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white text-[var(--color-foreground)]">
            <h3 className="text-4xl font-playfair font-bold mb-2">Regional Insights</h3>
            <p className="text-lg font-light text-foreground/70 mb-10 italic">Areas with the strongest average ratings.</p>

            <div className="flex flex-col gap-4">
              {data.topRegions.map((region, i) => (
                <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b border-foreground/10 last:border-0 hover:bg-black/5 transition-colors rounded-lg">
                  <div className="mb-2 md:mb-0">
                    <span className="text-xl font-playfair font-bold block">{region.region}</span>
                    <span className="text-sm font-light text-foreground/60">{region.count} restaurants analyzed</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-[var(--color-accent)]">{region.avgRating}</span>
                    <span className="text-sm uppercase tracking-widest text-foreground/50">Avg Rating</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 6: FoodLens Notes */}
          <section className="mt-20 relative z-10 pb-10">
            {/* Background "Plate" Circle for Notes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] md:w-[100%] h-[200%] pointer-events-none opacity-60 -z-10">
              <Image
                src="/circle.png"
                alt="Decorative background plate"
                fill
                className="object-contain"
              />
            </div>

            <h3 className="text-5xl font-pinyon text-center mb-12 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              FoodLens Notes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.insights.map((insight, i) => (
                <div key={i} className="bg-[#FFFDF9] rounded-xl p-8 shadow-[0_8px_20px_rgba(0,0,0,0.4)] rotate-1 hover:rotate-0 transition-transform relative border border-black/5">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-3 bg-black/10 rounded-full blur-[1px]"></div>
                  <p className="text-2xl font-playfair italic text-foreground/80 leading-relaxed text-center mt-4">
                    "{insight}"
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

        <AnalyticsNavigation />

      </div>

      <Footer />
    </main>
  );
}
