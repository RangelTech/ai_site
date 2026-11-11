// Cérebro vivo: rede de neurônios em 3D (córtex em dois hemisférios, cerebelo e tronco), ligações por vizinhança e pulsos viajando.
// Portado do "Segundo Cérebro" (repo second-brain, renderer/atividade.js), sem a parte de ferramentas. Canvas 2D, sem dependência.
// Mesmo desenho sempre (semente fixa). Pausa fora da tela e com a aba escondida. Respeita "reduzir movimento" (gira parado, sem pulsos).

const TAU = Math.PI * 2;
type Ponto = { x: number; y: number; z: number; f: number; peso: number; sx: number; sy: number; sz: number; k: number };
type Modelo = { P: Ponto[]; L: { a: number; b: number }[]; viz: number[][]; poeira: { x: number; y: number; z: number; f: number; v: number }[] };

const modelos = new Map<number, Modelo>();
function modelo(nc: number): Modelo {
  const pronto = modelos.get(nc);
  if (pronto) return pronto;
  let sem = 20261110;
  const rnd = () => ((sem = (sem + 0x6d2b79f5) >>> 0), (((sem ^ (sem >>> 15)) * (1 | sem)) >>> 0) / 4294967296);
  const P: Ponto[] = [];
  const ponto = (x: number, y: number, z: number, peso = 1) => P.push({ x, y, z, f: rnd() * TAU, peso, sx: 0, sy: 0, sz: 0, k: 1 });
  for (let i = 0; i < nc; i++) {
    const lado = i % 2 ? 1 : -1;
    const u = rnd() * TAU;
    const v = Math.acos(2 * rnd() - 1);
    const dx = Math.sin(v) * Math.cos(u), dy = Math.cos(v), dz = Math.abs(Math.sin(v) * Math.sin(u));
    const dobra = 1 + 0.07 * Math.sin(u * 5 + v * 3) + 0.05 * Math.sin(v * 9);
    const r = (rnd() < 0.22 ? Math.cbrt(rnd()) * 0.85 : 1) * dobra;
    let x = dx * r, y = dy * 0.72 * r, z = lado * (0.07 + dz * 0.6 * r);
    if (y < -0.28) y = -0.28 - -(y + 0.28) * 0.45;
    if (x > 0.35 && y > 0.1) x *= 1.06;
    if (y < -0.12 && x > -0.35 && x < 0.55) z *= 1.14;
    ponto(x, y + 0.06, z);
  }
  const nCer = Math.round(nc * 0.15), nTr = Math.round(nc * 0.06);
  for (let i = 0; i < nCer; i++) {
    const u = rnd() * TAU, v = Math.acos(2 * rnd() - 1), r = 0.3 * Math.cbrt(0.4 + rnd() * 0.6);
    ponto(-0.66 + Math.sin(v) * Math.cos(u) * r, -0.42 + Math.cos(v) * r * 0.72, Math.sin(v) * Math.sin(u) * r * 1.5, 0.8);
  }
  for (let i = 0; i < nTr; i++) {
    const t = i / Math.max(1, nTr - 1);
    ponto(-0.36 + t * 0.08 + (rnd() - 0.5) * 0.09, -0.4 - t * 0.6, (rnd() - 0.5) * 0.11, 0.7);
  }
  const L: { a: number; b: number }[] = [];
  const viz: number[][] = P.map(() => []);
  const visto = new Set<string>();
  for (let i = 0; i < P.length; i++) {
    const d: [number, number][] = [];
    for (let j = 0; j < P.length; j++) if (j !== i) d.push([Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y, P[i].z - P[j].z), j]);
    d.sort((a, b) => a[0] - b[0]);
    for (const [dist, j] of d.slice(0, 3)) {
      const k = i < j ? i + ':' + j : j + ':' + i;
      if (visto.has(k) || dist > 0.34) continue;
      visto.add(k);
      viz[i].push(L.length); viz[j].push(L.length);
      L.push({ a: i, b: j });
    }
  }
  const poeira = Array.from({ length: Math.round(nc / 8) }, () => ({ x: rnd(), y: rnd(), z: 0.25 + rnd() * 0.75, f: rnd() * TAU, v: 0.004 + rnd() * 0.012 }));
  const m = { P, L, viz, poeira };
  modelos.set(nc, m);
  return m;
}

const rgb = (hex: string) => { const v = parseInt(hex.slice(1), 16); return [v >> 16, (v >> 8) & 255, v & 255]; };
const rgba = (hex: string, a: number) => { const [r, g, b] = rgb(hex); return `rgba(${r},${g},${b},${a})`; };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const sprites = new Map<string, HTMLCanvasElement>();
function sprite(cor: string) {
  let s = sprites.get(cor);
  if (s) return s;
  s = document.createElement('canvas'); s.width = s.height = 96;
  const g = s.getContext('2d')!; const [r, gg, b] = rgb(cor);
  const gr = g.createRadialGradient(48, 48, 0, 48, 48, 48);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.12, `rgba(${r},${gg},${b},.95)`); gr.addColorStop(0.38, `rgba(${r},${gg},${b},.28)`); gr.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, 96, 96);
  sprites.set(cor, s);
  return s;
}

export interface Opcoes { neuronios?: number; base?: string; nucleo?: string; energia?: number; reduzir?: boolean; escala?: number; velocidade?: number }

export function montar(canvas: HTMLCanvasElement, o: Opcoes = {}) {
  const NC = o.neuronios ?? 860;
  const BASE = o.base ?? '#59c8ff', NUCLEO = o.nucleo ?? '#ff4b32';
  const energia = o.energia ?? 0.8, reduzir = !!o.reduzir, escala = o.escala ?? 1, veloc = o.velocidade ?? 1;
  const M = modelo(NC);
  const P = M.P.map((p) => ({ ...p }));
  const pulsos: { e: number; f: number; inv: boolean; saltos: number; v: number }[] = [];
  const cx = canvas.getContext('2d')!;
  let W = 0, H = 0, dpr = 1, ult = 0, acum = 0, raf = 0, rodando = false, yaw = 0.6, mx = 0, my = 0;
  const luz = (cor: string, x: number, y: number, r: number, a: number) => { if (a <= 0.003) return; cx.globalAlpha = Math.min(1, a); cx.drawImage(sprite(cor), x - r, y - r, r * 2, r * 2); };

  function tamanho() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1);
    W = Math.max(120, r.width); H = Math.max(120, r.height);
    if (W * H > 500000) dpr = Math.min(dpr, 1.25);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  }
  function quadro(ms: number) {
    const t = ms / 1000;
    const dt = Math.min(0.05, ult ? t - ult : 0.016);
    ult = t;
    if (!W) tamanho();
    const CX = W / 2, CY = H / 2;
    cx.setTransform(1, 0, 0, 1, 0, 0); cx.clearRect(0, 0, canvas.width, canvas.height); cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.globalCompositeOperation = 'lighter';
    for (const d of M.poeira) {
      const x = ((d.x + t * d.v * d.z * veloc) % 1) * W + Math.sin(t * 0.3 + d.f) * 6 * d.z;
      const y = d.y * H + Math.cos(t * 0.25 + d.f) * 5 * d.z;
      const borda = Math.min(x, W - x, y, H - y) / 40;
      if (borda <= 0) continue;
      luz('#9fc8ff', x, y, 1.2 + d.z * 2.2, (0.1 + 0.25 * (0.5 + 0.5 * Math.sin(t * 1.7 + d.f))) * d.z * Math.min(1, borda));
    }
    if (!reduzir) yaw += dt * (0.05 + 0.1 * energia) * veloc;
    // a seta ou o dedo inclinam o cérebro de leve
    const inc = -0.2 + (reduzir ? 0 : Math.sin(t * 0.29) * 0.06) + my * 0.25;
    const cy_ = Math.cos(yaw + mx * 0.35), sy_ = Math.sin(yaw + mx * 0.35), ci = Math.cos(inc), si = Math.sin(inc);
    const S = Math.min(W, H) * 0.42 * escala * (1 + (reduzir ? 0 : 0.012 * Math.sin(t * 1.25)));
    const E = Math.max(1, Math.sqrt(S / 170));
    for (const p of P) {
      const x = p.x * cy_ - p.z * sy_, z0 = p.x * sy_ + p.z * cy_;
      const y = p.y * ci - z0 * si, z = p.y * si + z0 * ci;
      const k = 2.7 / (2.7 - z);
      p.sx = CX + x * S * k; p.sy = CY - y * S * k; p.sz = z; p.k = k;
    }
    // ligações em lotes por profundidade (poucos strokes por quadro)
    cx.lineCap = 'round';
    const FAIXAS = 6;
    const frias: { a: number; b: number }[][] = Array.from({ length: FAIXAS }, () => []);
    for (const l of M.L) { const prof = ((P[l.a].sz + P[l.b].sz) / 2 + 1.1) / 2.2; frias[Math.max(0, Math.min(FAIXAS - 1, (prof * FAIXAS) | 0))].push(l); }
    cx.globalAlpha = 1;
    for (let f = 0; f < FAIXAS; f++) {
      if (!frias[f].length) continue;
      const prof = (f + 0.5) / FAIXAS;
      cx.strokeStyle = rgba(BASE, (0.07 + prof * 0.24) * (0.75 + energia * 0.4));
      cx.lineWidth = 0.6 * E;
      cx.beginPath();
      for (const l of frias[f]) { cx.moveTo(P[l.a].sx, P[l.a].sy); cx.lineTo(P[l.b].sx, P[l.b].sy); }
      cx.stroke();
    }
    luz(NUCLEO, CX, CY, S * (0.5 + 0.05 * Math.sin(t * 2.2)), 0.14 + energia * 0.12);
    for (const p of P) {
      const prof = (p.sz + 1.1) / 2.2;
      const pisca = 0.5 + 0.5 * Math.sin(t * (1.4 + p.peso) + p.f);
      const r = (2.2 + prof * 4.2 + pisca * 1.6) * p.k * p.peso * E;
      const alfa = (0.16 + prof * 0.5) * (0.55 + pisca * 0.45);
      if (prof < 0.42) { cx.globalAlpha = Math.min(1, alfa * 1.6); cx.fillStyle = BASE; const q = Math.max(1, r * 0.32); cx.fillRect(p.sx - q / 2, p.sy - q / 2, q, q); }
      else luz(BASE, p.sx, p.sy, r, alfa);
    }
    if (!reduzir) {
      acum += dt * (2 + energia * 30) * veloc;
      while (acum > 1) { acum--; pulsos.push({ e: (Math.random() * M.L.length) | 0, f: 0, inv: Math.random() < 0.5, saltos: 0, v: 2.2 + Math.random() * 2 }); }
    }
    for (let i = pulsos.length - 1; i >= 0; i--) {
      const q = pulsos[i];
      q.f += dt * q.v * veloc;
      const l = M.L[q.e];
      const a = P[q.inv ? l.b : l.a], b = P[q.inv ? l.a : l.b];
      if (q.f >= 1) {
        const destino = q.inv ? l.a : l.b;
        if (q.saltos < 4 && Math.random() < 0.72) { const op = M.viz[destino]; const ne = op[(Math.random() * op.length) | 0]; q.e = ne; q.inv = M.L[ne].b === destino; q.f = 0; q.saltos++; }
        else pulsos.splice(i, 1);
        continue;
      }
      const prof = (lerp(a.sz, b.sz, q.f) + 1.1) / 2.2;
      luz(Math.random() < 0.08 ? NUCLEO : '#ffffff', lerp(a.sx, b.sx, q.f), lerp(a.sy, b.sy, q.f), (3 + prof * 4) * E, 0.35 + prof * 0.5);
    }
    if (pulsos.length > 220) pulsos.splice(0, pulsos.length - 220);
    cx.globalCompositeOperation = 'source-over';
    cx.globalAlpha = 1;
  }
  const laco = (ms: number) => { if (!rodando) return; if (!document.hidden) quadro(ms); raf = requestAnimationFrame(laco); };
  const iniciar = () => { if (rodando) return; rodando = true; ult = 0; tamanho(); raf = requestAnimationFrame(laco); };
  const parar = () => { rodando = false; cancelAnimationFrame(raf); };
  const io = new IntersectionObserver(([en]) => (en.isIntersecting ? iniciar() : parar()), { rootMargin: '120px' });
  io.observe(canvas);
  addEventListener('resize', () => rodando && tamanho());
  addEventListener('pointermove', (e) => { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });
  document.addEventListener('visibilitychange', () => !document.hidden && rodando && (ult = 0));
  if (reduzir) { tamanho(); quadro(0); }
  return { iniciar, parar, tamanho };
}

export function montarTodos() {
  const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lite = document.documentElement.classList.contains('lite');
  document.querySelectorAll<HTMLCanvasElement>('canvas[data-cerebro]').forEach((c) => {
    const tipo = c.dataset.cerebro || 'hero';
    const n = tipo === 'hero' ? (lite ? 420 : 860) : tipo === 'como' ? (lite ? 320 : 560) : lite ? 240 : 380;
    montar(c, { neuronios: n, reduzir, energia: tipo === 'como' ? 1 : tipo === 'final' ? 0.5 : 0.8, escala: tipo === 'final' ? 1.15 : 1, velocidade: tipo === 'como' ? 1.3 : 1 });
  });
}
