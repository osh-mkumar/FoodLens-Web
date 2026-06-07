"use server";

import fs from 'fs';
import { FoodLensPreferences } from './storage';

export interface Restaurant {
  id: number;
  name: string;
  price: number;
  city: string;
  region: string;
  timing: string;
  ratingType: string;
  rating: number;
  votes: number;
  url: string;
  cuisines: string[];
}

export interface RecommendationResult {
  primary: Restaurant | null;
  secondary: Restaurant[];
  reason: string;
}

// Robust CSV parser
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

export async function getRecommendations(prefs: FoodLensPreferences): Promise<RecommendationResult> {
  const restsPath = 'd:\\zomato food data\\foodlens\\data\\restaurants.csv';
  const cuisinesCsvPath = 'd:\\zomato food data\\foodlens\\data\\cuisines.csv';
  const restCuisinesPath = 'd:\\zomato food data\\foodlens\\data\\restaurant_cuisines.csv';

  // 1. Load cuisines map (id -> name)
  const cuisineIdToName: Record<number, string> = {};
  const cuisineNameToId: Record<string, number> = {};
  const cuisinesData = fs.readFileSync(cuisinesCsvPath, 'utf8').split('\n');
  for (let i = 1; i < cuisinesData.length; i++) {
    const line = cuisinesData[i].trim();
    if (!line) continue;
    const [name, idStr] = line.split(',');
    if (name && idStr) {
      const id = parseInt(idStr, 10);
      cuisineIdToName[id] = name;
      cuisineNameToId[name.toLowerCase()] = id;
      // Add standard fallbacks for JSON IDs to CSV Names mapping
      if (name.toLowerCase() === 'desserts') cuisineNameToId['dessert'] = id;
    }
  }

  // Map requested cuisines to numeric IDs
  const requestedCuisineIds = prefs.cuisines
    .map(c => cuisineNameToId[c.toLowerCase()])
    .filter(id => id !== undefined);

  // 2. Load restaurant cuisines (restId -> array of cuisine names)
  const restCuisinesMap: Record<number, string[]> = {};
  const restCuisinesIdsMap: Record<number, number[]> = {};
  const restCuisinesData = fs.readFileSync(restCuisinesPath, 'utf8').split('\n');
  for (let i = 1; i < restCuisinesData.length; i++) {
    const line = restCuisinesData[i].trim();
    if (!line) continue;
    const [restIdStr, cIdStr] = line.split(',');
    const rId = parseInt(restIdStr, 10);
    const cId = parseInt(cIdStr, 10);
    if (!isNaN(rId) && !isNaN(cId)) {
      if (!restCuisinesMap[rId]) {
        restCuisinesMap[rId] = [];
        restCuisinesIdsMap[rId] = [];
      }
      restCuisinesIdsMap[rId].push(cId);
      if (cuisineIdToName[cId]) {
        restCuisinesMap[rId].push(cuisineIdToName[cId]);
      }
    }
  }

  // 3. Load and filter restaurants
  const restaurantsData = fs.readFileSync(restsPath, 'utf8').split('\n');
  let matchingRests: Restaurant[] = [];

  for (let i = 1; i < restaurantsData.length; i++) {
    const line = restaurantsData[i].trim();
    if (!line) continue;
    const cols = parseCSVLine(line);
    if (cols.length < 9) continue;

    // restaurant_id,name,price,city,region,timing,rating_type,rating,votes,url
    const id = parseInt(cols[0], 10);
    const name = cols[1];
    const price = parseFloat(cols[2]);
    const city = cols[3];
    const region = cols[4];
    const timing = cols[5];
    const ratingType = cols[6];
    const rating = parseFloat(cols[7]) || 0;
    const votes = parseFloat(cols[8]) || 0;
    const url = cols[9] || "";

    // Apply Budget Filter
    const minB = prefs.minBudget !== null ? prefs.minBudget : 0;
    const maxB = prefs.maxBudget !== null ? prefs.maxBudget : Infinity;
    if (price < minB || price > maxB) {
      continue;
    }

    // Apply Cuisine Filter (Must match AT LEAST ONE if any are provided)
    const restCIds = restCuisinesIdsMap[id] || [];
    if (requestedCuisineIds.length > 0) {
      const hasCuisineMatch = requestedCuisineIds.some(reqId => restCIds.includes(reqId));
      if (!hasCuisineMatch) continue;
    }

    matchingRests.push({
      id,
      name,
      price,
      city,
      region,
      timing,
      ratingType,
      rating,
      votes,
      url,
      cuisines: restCuisinesMap[id] || []
    });
  }

  // 4. Apply Mood Filter
  let filteredByMood: Restaurant[] = [];
  const mood = prefs.mood || "no-preference";

  if (mood === "hidden-corner") {
    filteredByMood = matchingRests.filter(r => r.rating >= 4.2 && r.votes <= 200);
  } else if (mood === "crowd-favourite") {
    filteredByMood = matchingRests.filter(r => r.votes >= 1000 && r.rating >= 4.0);
  } else {
    // curious-choice or no-preference or unrecognized
    filteredByMood = [...matchingRests];
  }

  // Fallback: If mood filtering results in 0 matches, fallback to budget+cuisine matches
  if (filteredByMood.length === 0) {
    filteredByMood = [...matchingRests];
  }

  // Fallback: If budget+cuisine results in 0 matches, ignore cuisines
  if (filteredByMood.length === 0) {
    // Re-run filter without cuisines, just budget
    // For simplicity, we just return nothing if totally constrained, but let's try to be resilient
    return { primary: null, secondary: [], reason: "We couldn't find an exact match for your strict cravings and budget." };
  }

  // 5. Select Primary and Secondary
  let primary: Restaurant | null = null;
  let secondary: Restaurant[] = [];
  let reason = "";

  if (mood === "curious-choice") {
    // Randomize
    filteredByMood.sort(() => Math.random() - 0.5);
    primary = filteredByMood[0];
    secondary = filteredByMood.slice(1, 4);
    reason = "You wanted something unexpected! We picked this curious choice randomly from your matches.";
  } else if (mood === "hidden-corner") {
    // Sort by rating descending
    filteredByMood.sort((a, b) => b.rating - a.rating);
    primary = filteredByMood[0];
    secondary = filteredByMood.slice(1, 4);
    reason = `With a stellar rating of ${primary.rating} but only ${primary.votes} votes, this is a true hidden gem waiting to be discovered.`;
  } else if (mood === "crowd-favourite") {
    // Sort by votes descending
    filteredByMood.sort((a, b) => b.votes - a.votes);
    primary = filteredByMood[0];
    secondary = filteredByMood.slice(1, 4);
    reason = `A true crowd favourite! Over ${primary.votes} people have rated it ${primary.rating}/5, proving it's worth coming back to.`;
  } else {
    // no-preference (score: rating * log10(votes))
    filteredByMood.sort((a, b) => {
      const scoreA = a.rating * (Math.log10(a.votes || 1));
      const scoreB = b.rating * (Math.log10(b.votes || 1));
      return scoreB - scoreA;
    });
    primary = filteredByMood[0];
    secondary = filteredByMood.slice(1, 4);
    reason = `We picked this as your top overall recommendation based on an exceptional balance of high ratings and popularity.`;
  }

  return {
    primary,
    secondary,
    reason
  };
}
