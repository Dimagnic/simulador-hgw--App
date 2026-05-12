import { useCallback } from 'react';

export function useBVCombinationGenerator() {
  const generateCombinations = useCallback((products, goal, role) => {
    const target = parseInt(goal);
    if (isNaN(target) || target <= 0) return [];

    const validProducts = products.filter(p => p.bv && p.bv > 0);
    const combos = new Map();

    const addCombo = (comboItems) => {
      let totalBV = 0;
      let totalMXN = 0;
      const counts = {};

      comboItems.forEach(p => {
        totalBV += p.bv;
        totalMXN += role === 'Master' ? (p.master || 0) : (p.dist || 0);
        counts[p.id] = (counts[p.id] || 0) + 1;
      });

      const diff = target - totalBV;
      if (diff < 0) return; // Discard if it exceeds target

      // Create unique key based on counts to deduplicate identical combinations
      const key = Object.entries(counts)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([id, c]) => `${id}:${c}`)
        .join('|');

      if (!combos.has(key)) {
        const grouped = [];
        Object.keys(counts).forEach(id => {
          const product = comboItems.find(p => p.id === id);
          grouped.push({
            ...product,
            quantity: counts[id]
          });
        });

        combos.set(key, {
          flatItems: comboItems, // raw array for easy printing
          products: grouped,     // aggregated array for display
          totalBV,
          totalPrice: totalMXN,
          differenceFromGoal: diff
        });
      }
    };

    // Approach 1: Strict Greedy Descending (always high BV first)
    let greedyDesc = [];
    let currDesc = 0;
    let sortedDesc = [...validProducts].sort((a, b) => b.bv - a.bv);
    for (let p of sortedDesc) {
      while (currDesc + p.bv <= target) {
        greedyDesc.push(p);
        currDesc += p.bv;
      }
    }
    addCombo(greedyDesc);

    // Approach 2: Randomized Greedy Backtracking to find diverse matches
    let iterations = 0;
    while (iterations < 500 && combos.size < 30) {
      let combo = [];
      let currentBV = 0;
      // Shuffle products to prioritize different paths
      let shuffled = [...validProducts].sort(() => Math.random() - 0.5);

      for (let p of shuffled) {
        if (currentBV + p.bv <= target) {
          let maxPossible = Math.floor((target - currentBV) / p.bv);
          // Add a random quantity from 0 up to max possible
          let addQty = Math.floor(Math.random() * (maxPossible + 1));
          
          // Force picking at least one item on the first valid product to start building
          if (addQty === 0 && currentBV === 0 && maxPossible > 0) {
            addQty = 1;
          }

          for (let i = 0; i < addQty; i++) combo.push(p);
          currentBV += p.bv * addQty;
        }
      }
      
      // Fill the remaining gap strictly greedy to get as close to target as possible
      for (let p of sortedDesc) {
        while (currentBV + p.bv <= target) {
          combo.push(p);
          currentBV += p.bv;
        }
      }

      addCombo(combo);
      iterations++;
    }

    // Sort by diff (closest to target), then by fewer items as tie-breaker
    let resultList = Array.from(combos.values());
    resultList.sort((a, b) => {
      if (a.differenceFromGoal !== b.differenceFromGoal) {
        return a.differenceFromGoal - b.differenceFromGoal;
      }
      return a.products.length - b.products.length;
    });

    // Return the top 10 unique combinations
    return resultList.slice(0, 10).map((c, i) => ({
      optionNumber: i + 1,
      products: c.products,
      flatItems: c.flatItems,
      totalPrice: c.totalPrice,
      totalBV: c.totalBV,
      differenceFromGoal: c.differenceFromGoal
    }));
  }, []);

  return { generateCombinations };
}