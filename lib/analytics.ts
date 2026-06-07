"use server";

import fs from "fs";
import path from "path";
import { Restaurant } from "./recommendation";

export interface CuisineStat {
  name: string;
  count: number;
}

export interface RatingDistribution {
  range: string;
  count: number;
}

export interface RegionStat {
  region: string;
  avgRating: number;
  count: number;
}

export interface AnalyticsData {
  topCuisines: CuisineStat[];
  ratingDist: RatingDistribution[];
  hiddenCorners: Restaurant[];
  crowdFavourites: Restaurant[];
  topRegions: RegionStat[];
  insights: string[];
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let currentCol = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(currentCol);
      currentCol = "";
    } else {
      currentCol += char;
    }
  }
  result.push(currentCol);
  return result;
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const restsPath = path.join(process.cwd(), "data", "restaurants.csv");
  const cuisinesCsvPath = path.join(process.cwd(), "data", "cuisines.csv");
  const restCuisinesPath = path.join(process.cwd(), "data", "restaurant_cuisines.csv");

  // 1. Load cuisines map
  const cuisineIdToName: Record<number, string> = {};
  const cuisinesData = fs.readFileSync(cuisinesCsvPath, 'utf8').split('\n');
  for (let i = 1; i < cuisinesData.length; i++) {
    const line = cuisinesData[i].trim();
    if (!line) continue;
    const [name, idStr] = line.split(',');
    if (name && idStr) {
      cuisineIdToName[parseInt(idStr, 10)] = name;
    }
  }

  // 2. Load restaurant cuisines mappings
  const restCuisinesMap: Record<number, string[]> = {};
  const globalCuisineCounts: Record<string, number> = {};
  const restCuisinesData = fs.readFileSync(restCuisinesPath, 'utf8').split('\n');
  for (let i = 1; i < restCuisinesData.length; i++) {
    const line = restCuisinesData[i].trim();
    if (!line) continue;
    const [restIdStr, cIdStr] = line.split(',');
    const rId = parseInt(restIdStr, 10);
    const cId = parseInt(cIdStr, 10);
    if (!isNaN(rId) && !isNaN(cId)) {
      const cName = cuisineIdToName[cId];
      if (cName) {
        if (!restCuisinesMap[rId]) restCuisinesMap[rId] = [];
        restCuisinesMap[rId].push(cName);
        globalCuisineCounts[cName] = (globalCuisineCounts[cName] || 0) + 1;
      }
    }
  }

  // 3. Process Restaurants
  const restaurantsData = fs.readFileSync(restsPath, 'utf8').split('\n');
  const restaurants: Restaurant[] = [];
  
  let ratingBuckets = {
    "<3.0": 0,
    "3.0-3.5": 0,
    "3.5-4.0": 0,
    "4.0-4.5": 0,
    "4.5+": 0
  };

  const regionAggregates: Record<string, { totalRating: number; count: number }> = {};

  for (let i = 1; i < restaurantsData.length; i++) {
    const line = restaurantsData[i].trim();
    if (!line) continue;
    const cols = parseCSVLine(line);
    if (cols.length < 9) continue;

    const id = parseInt(cols[0], 10);
    const name = cols[1];
    const price = parseFloat(cols[2]) || 0;
    const city = cols[3];
    const region = cols[4];
    const timing = cols[5];
    const ratingType = cols[6];
    const rating = parseFloat(cols[7]) || 0;
    const votes = parseFloat(cols[8]) || 0;
    const url = cols[9] || "";

    const r: Restaurant = {
      id, name, price, city, region, timing, ratingType, rating, votes, url,
      cuisines: restCuisinesMap[id] || []
    };
    restaurants.push(r);

    // Distribution
    if (rating > 0) { // Ignore unrated or 0
      if (rating < 3.0) ratingBuckets["<3.0"]++;
      else if (rating < 3.5) ratingBuckets["3.0-3.5"]++;
      else if (rating < 4.0) ratingBuckets["3.5-4.0"]++;
      else if (rating < 4.5) ratingBuckets["4.0-4.5"]++;
      else ratingBuckets["4.5+"]++;
    }

    // Regional
    if (rating > 0) {
      if (!regionAggregates[region]) {
        regionAggregates[region] = { totalRating: 0, count: 0 };
      }
      regionAggregates[region].totalRating += rating;
      regionAggregates[region].count++;
    }
  }

  // Generate aggregations
  const topCuisines = Object.entries(globalCuisineCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const ratingDist = Object.entries(ratingBuckets).map(([range, count]) => ({ range, count }));

  const hiddenCorners = restaurants
    .filter(r => r.rating >= 4.2 && r.votes <= 200)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const crowdFavourites = restaurants
    .filter(r => r.votes >= 1000 && r.rating >= 4.0)
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 6);

  const topRegions = Object.entries(regionAggregates)
    .filter(([_, stats]) => stats.count >= 10) // Only areas with enough restaurants
    .map(([region, stats]) => ({
      region,
      avgRating: Number((stats.totalRating / stats.count).toFixed(2)),
      count: stats.count
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5);

  // Dynamic Insights
  const topCuisineName = topCuisines[0]?.name || "North Indian";
  const topRegionName = topRegions[0]?.region || "Bandra";
  
  const hiddenCornerTotalRating = hiddenCorners.reduce((sum, r) => sum + r.rating, 0);
  const hiddenCornerAvg = hiddenCorners.length > 0 ? (hiddenCornerTotalRating / hiddenCorners.length).toFixed(1) : "4.3";

  const insights = [
    `Most restaurants belong to ${topCuisineName} cuisine.`,
    `${topRegionName} has the highest average rating among major areas.`,
    `Hidden Corner restaurants average ${hiddenCornerAvg} stars, proving you don't need crowds for quality.`
  ];

  return {
    topCuisines,
    ratingDist,
    hiddenCorners,
    crowdFavourites,
    topRegions,
    insights
  };
}
