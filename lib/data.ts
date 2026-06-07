import fs from 'fs';
import path from 'path';

export interface CuisineData {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export async function getCuisinesWithCounts(): Promise<CuisineData[]> {
  // 1. Load the base cuisines from JSON
  const cuisinesJsonPath = path.join(process.cwd(), 'data', 'cuisines.json');
  const baseCuisines = JSON.parse(fs.readFileSync(cuisinesJsonPath, 'utf8'));

  // 2. Load cuisine numeric IDs from cuisines.csv
  const cuisinesCsvPath = 'd:\\zomato food data\\foodlens\\data\\cuisines.csv';
  const cuisinesCsvData = fs.readFileSync(cuisinesCsvPath, 'utf8').split('\n');
  
  // Map string name -> numeric ID (e.g. 'italian' -> 16)
  const cuisineNameToId: Record<string, number> = {};
  for (let i = 1; i < cuisinesCsvData.length; i++) {
    const line = cuisinesCsvData[i].trim();
    if (!line) continue;
    const [name, id] = line.split(',');
    if (name && id) {
      cuisineNameToId[name.toLowerCase()] = parseInt(id, 10);
    }
  }

  // 3. Count occurrences in restaurant_cuisines.csv
  const restCuisinesPath = 'd:\\zomato food data\\foodlens\\data\\restaurant_cuisines.csv';
  const restCuisinesData = fs.readFileSync(restCuisinesPath, 'utf8').split('\n');
  
  const cuisineCounts: Record<number, number> = {};
  for (let i = 1; i < restCuisinesData.length; i++) {
    const line = restCuisinesData[i].trim();
    if (!line) continue;
    const [restId, cuisineIdStr] = line.split(',');
    if (cuisineIdStr) {
      const cId = parseInt(cuisineIdStr, 10);
      cuisineCounts[cId] = (cuisineCounts[cId] || 0) + 1;
    }
  }

  // 4. Merge data
  return baseCuisines.map((c: any) => {
    const lookupName = c.name.toLowerCase();
    const lookupId = c.id.toLowerCase();
    
    // Exact match first
    let numericId = cuisineNameToId[lookupName] || cuisineNameToId[lookupId];
    
    // Fallbacks based on actual CSV data
    if (!numericId) {
      if (lookupId === 'dessert') numericId = cuisineNameToId['desserts'];
      if (lookupId === 'burger') numericId = cuisineNameToId['burger'];
      if (lookupId === 'cafe') numericId = cuisineNameToId['cafe'];
    }

    const count = numericId ? (cuisineCounts[numericId] || 0) : 0;
    
    return {
      ...c,
      count
    };
  });
}

export async function getBudgetRange(): Promise<{ min: number; max: number }> {
  const restsPath = 'd:\\zomato food data\\foodlens\\data\\restaurants.csv';
  const data = fs.readFileSync(restsPath, 'utf8').split('\n');
  
  let min = Infinity;
  let max = -Infinity;

  // start at 1 to skip header
  for (let i = 1; i < data.length; i++) {
    const line = data[i].trim();
    if (!line) continue;
    
    // Simple state machine to parse the CSV line to find the 3rd column correctly.
    let currentCol = 0;
    let inQuotes = false;
    let colValue = "";
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        if (currentCol === 2) {
          break; // We found the 3rd column (price)
        }
        currentCol++;
        colValue = "";
      } else {
        colValue += char;
      }
    }
    
    if (currentCol === 2 && colValue) {
      const price = parseFloat(colValue);
      if (!isNaN(price)) {
        if (price < min) min = price;
        if (price > max) max = price;
      }
    }
  }

  if (min === Infinity) min = 0;
  if (max === -Infinity) max = 10000; // safe fallback

  return { min, max };
}

