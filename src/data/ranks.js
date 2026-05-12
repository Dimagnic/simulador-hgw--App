// ─── HGW Rank / Level Table ──────────────────────────────────────────────────
// Each rank maps a BV range to a distributor level name.
// Adjust bvMin / bvMax to match actual company table if needed.

export const RANK_TABLE = [
  { id: 'asociado',       nameEs: 'Asociado',            nameEn: 'Associate',          bvMin: 0,    bvMax: 49   },
  { id: 'distribuidor',   nameEs: 'Distribuidor',         nameEn: 'Distributor',         bvMin: 50,   bvMax: 149  },
  { id: 'distribuidor-s', nameEs: 'Distribuidor Senior',  nameEn: 'Senior Distributor',  bvMin: 150,  bvMax: 299  },
  { id: 'supervisor',     nameEs: 'Supervisor',           nameEn: 'Supervisor',          bvMin: 300,  bvMax: 499  },
  { id: 'gerente',        nameEs: 'Gerente',              nameEn: 'Manager',             bvMin: 500,  bvMax: 799  },
  { id: 'director',       nameEs: 'Director',             nameEn: 'Director',            bvMin: 800,  bvMax: 1199 },
  { id: 'diamante',       nameEs: 'Diamante',             nameEn: 'Diamond',             bvMin: 1200, bvMax: 1999 },
  { id: 'corona',         nameEs: 'Corona',               nameEn: 'Crown',               bvMin: 2000, bvMax: Infinity },
];

/**
 * Given a total BV amount, return enriched rank info.
 * @param {number} totalBV
 * @param {string} [lang='es']
 * @returns {{ name, bvMin, bvMax, nextName, bvToNext, progress } | null}
 */
export function getRank(totalBV, lang = 'es') {
  if (!totalBV || totalBV < 0) return null;

  const idx = RANK_TABLE.findIndex(r => totalBV >= r.bvMin && totalBV <= r.bvMax);
  if (idx < 0) return null;

  const current = RANK_TABLE[idx];
  const next = RANK_TABLE[idx + 1] || null;
  const name = lang === 'en' ? current.nameEn : current.nameEs;
  const nextName = next ? (lang === 'en' ? next.nameEn : next.nameEs) : null;
  const bvToNext = next ? next.bvMin - totalBV : 0;
  const rangeSize = current.bvMax === Infinity ? 1 : current.bvMax - current.bvMin + 1;
  const progress = current.bvMax === Infinity
    ? 100
    : Math.min(100, Math.round(((totalBV - current.bvMin) / rangeSize) * 100));

  return {
    name,
    bvMin: current.bvMin,
    bvMax: current.bvMax,
    nextName,
    bvToNext,
    progress,
  };
}
