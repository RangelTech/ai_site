// Gera os traçados de municípios (IBGE) e rios (Natural Earth) já projetados no mesmo espaço do mapa.
// Uso: node scripts/gerar-geo.mjs   (precisa de internet; a saída vai para public/geo e é versionada)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { geoMercator, geoPath } from 'd3-geo';

const W = 800, H = 820;
const area = (ring) => ring.reduce((a, p, i) => { const q = ring[(i + 1) % ring.length]; return a + (p[0] * q[1] - q[0] * p[1]); }, 0) / 2;
const orienta = (rings) => rings.map((r, i) => ((i === 0 ? area(r) > 0 : area(r) < 0) ? [...r].reverse() : r));
const rewind = (geo) => {
  for (const f of geo.features) {
    const g = f.geometry;
    if (g.type === 'Polygon') g.coordinates = orienta(g.coordinates);
    else if (g.type === 'MultiPolygon') g.coordinates = g.coordinates.map(orienta);
  }
  return geo;
};

const brasil = rewind(JSON.parse(readFileSync('src/data/brasil-uf.geojson', 'utf8')));
const proj = geoMercator().fitExtent([[28, 24], [W - 28, H - 24]], brasil);
const path = geoPath(proj).digits(1);

const UFS = { RO: 11, AC: 12, AM: 13, RR: 14, PA: 15, AP: 16, TO: 17, MA: 21, PI: 22, CE: 23, RN: 24, PB: 25, PE: 26, AL: 27, SE: 28, BA: 29, MG: 31, ES: 32, RJ: 33, SP: 35, PR: 41, SC: 42, RS: 43, MS: 50, MT: 51, GO: 52, DF: 53 };
mkdirSync('public/geo', { recursive: true });

for (const [uf, cod] of Object.entries(UFS)) {
  const url = `https://servicodados.ibge.gov.br/api/v3/malhas/estados/${cod}?intrarregiao=municipio&formato=application/vnd.geo+json&qualidade=minima`;
  const geo = rewind(await (await fetch(url)).json());
  const d = geo.features.map((f) => path(f)).filter(Boolean).join('');
  writeFileSync(`public/geo/${uf}.json`, JSON.stringify({ d }));
  console.log(uf, Math.round(d.length / 1024) + ' KB');
}

// rios: só os que cruzam o Brasil, linhas simples
const rios = JSON.parse(readFileSync(process.argv[2] || 'rios.json', 'utf8'));
const [x0, y0, x1, y1] = [-74, -34, -34, 6];
const dentro = (f) => f.geometry.coordinates.flat(f.geometry.type === 'MultiLineString' ? 1 : 0).some(([x, y]) => x > x0 && x < x1 && y > y0 && y < y1);
const feats = rios.features.filter((f) => f.geometry && /LineString/.test(f.geometry.type) && dentro(f));
const d = feats.map((f) => path(f)).filter(Boolean).join('');
writeFileSync('public/geo/rios.json', JSON.stringify({ d }));
console.log('rios', feats.length, Math.round(d.length / 1024) + ' KB');
