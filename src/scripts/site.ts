// Comportamento do site sem dependências: métricas, origem do Instagram, fundo vivo, escassez do mês,
// projetos (ver todos), mapa interativo e medição por seção. O movimento com GSAP fica em motion.ts; o quiz, em quiz.ts.

import { vagasRestantes, fraseVagas, fraseVagasCurta, mentoradosRestantes, fraseMentorados } from '../lib/mes';

type Dados = Record<string, string | number | boolean>;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Métricas (Umami, sem cookie). Sem Umami, só ecoa no console em ?debug ---------- */
const debug = new URLSearchParams(location.search).has('debug');
function track(nome: string, dados?: Dados) {
  try {
    const u = (window as any).umami;
    if (u && typeof u.track === 'function') u.track(nome, dados);
    if (debug) console.log('[track]', nome, dados || {});
  } catch {}
}

/* ---------- Origem (utm) guardada na sessão; WhatsApp do rodapé ganha " (vim pelo Instagram)" ---------- */
(function origem() {
  const q = new URLSearchParams(location.search);
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) if (q.get(k)) sessionStorage.setItem(k, q.get(k)!);
  const src = (q.get('utm_source') || sessionStorage.getItem('utm_source') || '').toLowerCase();
  if (src !== 'instagram') return;
  const sufixo = (window as any).__rt?.sufixo || ' (vim pelo Instagram)';
  document.querySelectorAll<HTMLAnchorElement>('a[data-wa]').forEach((a) => {
    const url = new URL(a.href);
    const texto = url.searchParams.get('text') || '';
    if (texto && !texto.endsWith(sufixo)) { url.searchParams.set('text', texto + sufixo); a.href = url.toString().replace(/\+/g, '%20'); }
  });
})();

/* ---------- Cliques por botão ---------- */
document.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
  if (el) track('clique', { botao: el.dataset.track! });
});

/* ---------- Vidro: brilho especular que reage a mouse e rolagem ---------- */
(function vidro() {
  if (reduce) return;
  const glass = [...document.querySelectorAll<HTMLElement>('.glass')];
  const set = (el: HTMLElement, x: number, y: number) => { el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px'); };
  const onPointer = (e: PointerEvent) => {
    for (const el of glass) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) continue;
      set(el, e.clientX - r.left, e.clientY - r.top);
    }
  };
  addEventListener('pointermove', onPointer, { passive: true });
  let ticking = false, moved = false;
  addEventListener('pointermove', () => (moved = true), { once: true, passive: true });
  addEventListener('scroll', () => {
    if (moved || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const t = (scrollY % 900) / 900;
      for (const el of glass) { const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) continue; set(el, r.width * (0.15 + 0.7 * t), r.height * (0.1 + 0.4 * Math.sin(t * Math.PI))); }
      ticking = false;
    });
  }, { passive: true });
})();

/* ---------- Fundo vivo: foto embaçada que "limpa" onde o dedo passa, e brilhos em órbita ---------- */
(function fundoVivo() {
  const raiz = document.documentElement;
  addEventListener('scroll', () => raiz.style.setProperty('--sy', (scrollY / Math.max(1, raiz.scrollHeight - innerHeight)).toFixed(4)), { passive: true });
  const limpo = document.querySelector<HTMLCanvasElement>('[data-limpo]');
  const brilhos = document.querySelector<HTMLCanvasElement>('[data-brilhos]');
  if (!limpo || !brilhos) return;
  const lite = raiz.classList.contains('lite');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const bctx = brilhos.getContext('2d')!;
  const lctx = limpo.getContext('2d')!;
  const ESC = 8;
  const foto = new Image();
  const fotoC = document.createElement('canvas');
  const rastro = document.createElement('canvas');
  const rctx = rastro.getContext('2d')!;
  let w = 0, h = 0, fotoOk = false;
  const dimensiona = () => {
    w = Math.max(8, Math.ceil(innerWidth / ESC)); h = Math.max(8, Math.ceil(innerHeight / ESC));
    for (const c of [limpo, fotoC, rastro]) { c.width = w; c.height = h; }
    brilhos.width = Math.round(innerWidth * dpr); brilhos.height = Math.round(innerHeight * dpr);
    if (fotoOk) { const r = Math.max(w / foto.naturalWidth, h / foto.naturalHeight); const fw = foto.naturalWidth * r, fh = foto.naturalHeight * r; fotoC.getContext('2d')!.drawImage(foto, (w - fw) / 2, (h - fh) / 2, fw, fh); }
    energia = 0; lctx.clearRect(0, 0, w, h);
  };
  let energia = 0;
  const alvo = { x: -999, y: -999, ativo: false };
  let ult: { x: number; y: number } | null = null;
  const carimba = (x: number, y: number) => {
    const raio = 170 / ESC, cx = x / ESC, cy = y / ESC;
    const g = rctx.createRadialGradient(cx, cy, 0, cx, cy, raio);
    g.addColorStop(0, 'rgba(255,255,255,0.30)'); g.addColorStop(0.55, 'rgba(255,255,255,0.14)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    rctx.fillStyle = g; rctx.fillRect(cx - raio, cy - raio, raio * 2, raio * 2);
  };
  const toca = (x: number, y: number) => {
    alvo.x = x; alvo.y = y; alvo.ativo = true;
    if (!reduce) {
      if (ult) { const d = Math.hypot(x - ult.x, y - ult.y); const n = Math.min(12, Math.ceil(d / 28)); for (let i = 1; i <= n; i++) carimba(ult.x + ((x - ult.x) * i) / n, ult.y + ((y - ult.y) * i) / n); }
      else carimba(x, y);
      energia = 260;
    }
    ult = { x, y };
  };
  addEventListener('pointermove', (e) => toca(e.clientX, e.clientY), { passive: true });
  addEventListener('pointerdown', (e) => ((ult = null), toca(e.clientX, e.clientY)), { passive: true });
  addEventListener('touchmove', (e) => e.touches[0] && toca(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  addEventListener('touchstart', (e) => e.touches[0] && ((ult = null), toca(e.touches[0].clientX, e.touches[0].clientY)), { passive: true });
  const solta = () => { ult = null; alvo.ativo = false; };
  document.addEventListener('pointerleave', solta); addEventListener('touchend', solta, { passive: true }); addEventListener('blur', solta);

  type P = { cx: number; cy: number; rx: number; ry: number; a: number; va: number; vx: number; vy: number; tw: number; ph: number; r: number; kick: number; tilt: number; vis: number; fase: number; ate: number; fim: number; boost: number; px: number; py: number };
  const N = lite ? 12 : innerWidth < 700 ? 20 : 32;
  const ps: P[] = [];
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const nova = (): P => ({ cx: rnd(0, innerWidth), cy: rnd(0, innerHeight), rx: rnd(18, 120), ry: rnd(14, 90), a: rnd(0, 6.28), va: rnd(0.22, 0.6) * (Math.random() < 0.5 ? -1 : 1), vx: rnd(-7, 7), vy: rnd(-7, 7), tw: rnd(0.25, 0.9), ph: rnd(0, 6.28), r: rnd(0.8, 2.3), kick: 1, tilt: rnd(0, 3.14), vis: 1, fase: 0, ate: performance.now() + rnd(1500, 12000), fim: 0, boost: 1, px: 0, py: 0 });
  for (let i = 0; i < N; i++) ps.push(nova());
  const spr = document.createElement('canvas'); spr.width = spr.height = 48;
  const sc = spr.getContext('2d')!; const sg = sc.createRadialGradient(24, 24, 0, 24, 24, 24);
  sg.addColorStop(0, 'rgba(255,255,255,1)'); sg.addColorStop(0.18, 'rgba(190,225,255,0.85)'); sg.addColorStop(0.5, 'rgba(90,160,255,0.22)'); sg.addColorStop(1, 'rgba(60,120,255,0)');
  sc.fillStyle = sg; sc.fillRect(0, 0, 48, 48);
  let t0 = performance.now(); const halo = { x: -999, y: -999, a: 0 };
  const intervalo = innerWidth < 700 || lite ? 33 : 0;
  const quadro = (now: number) => {
    if (intervalo && now - t0 < intervalo) { if (!document.hidden) requestAnimationFrame(quadro); return; }
    const dt = Math.min(0.05, (now - t0) / 1000); t0 = now; const t = now / 1000;
    if (energia > 0 && fotoOk) {
      energia--;
      rctx.globalCompositeOperation = 'destination-out'; rctx.fillStyle = 'rgba(0,0,0,0.018)'; rctx.fillRect(0, 0, w, h); rctx.globalCompositeOperation = 'source-over';
      lctx.clearRect(0, 0, w, h); lctx.globalCompositeOperation = 'source-over'; lctx.drawImage(fotoC, 0, 0); lctx.globalCompositeOperation = 'destination-in'; lctx.drawImage(rastro, 0, 0); lctx.globalCompositeOperation = 'source-over';
      if (energia === 0) { rctx.clearRect(0, 0, w, h); lctx.clearRect(0, 0, w, h); }
    }
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0); bctx.clearRect(0, 0, innerWidth, innerHeight); bctx.globalCompositeOperation = 'lighter';
    halo.a += ((alvo.ativo ? 1 : 0) - halo.a) * Math.min(1, dt * 3);
    if (alvo.ativo) { halo.x += (alvo.x - halo.x) * Math.min(1, dt * 6); halo.y += (alvo.y - halo.y) * Math.min(1, dt * 6); }
    if (halo.a > 0.01) { const g = bctx.createRadialGradient(halo.x, halo.y, 0, halo.x, halo.y, 190); g.addColorStop(0, `rgba(200,225,255,${0.1 * halo.a})`); g.addColorStop(1, 'rgba(160,210,255,0)'); bctx.fillStyle = g; bctx.fillRect(halo.x - 190, halo.y - 190, 380, 380); }
    for (const p of ps) {
      if (!reduce) {
        if (p.fase === 0 && now > p.ate) { p.fase = 1; p.fim = now + rnd(450, 800); }
        else if (p.fase === 1) { p.boost += (8 - p.boost) * Math.min(1, dt * 7); p.kick += (1.5 - p.kick) * Math.min(1, dt * 4); if (now > p.fim) p.fase = 2; }
        else if (p.fase === 2) { p.vis -= dt * 6; if (p.vis <= 0) { p.vis = 0; p.cx = rnd(0, innerWidth); p.cy = rnd(0, innerHeight); p.rx = rnd(18, 120); p.ry = rnd(14, 90); p.tilt = rnd(0, 3.14); p.a = rnd(0, 6.28); p.kick = 1; p.fase = 3; p.boost = 5; p.px = p.py = 0; } }
        else if (p.fase === 3) { p.vis = Math.min(1, p.vis + dt * 1.8); p.boost += (1 - p.boost) * Math.min(1, dt * 2.5); if (p.vis >= 1) { p.fase = 0; p.boost = 1; p.ate = now + rnd(5000, 15000); } }
        if (p.fase === 0) { p.boost += (1 - p.boost) * Math.min(1, dt * 3); p.kick += (1 - p.kick) * Math.min(1, dt * 2); }
        p.a += p.va * p.boost * dt; p.cx += p.vx * dt; p.cy += p.vy * dt;
        if (p.cx < -140) p.cx = innerWidth + 140; else if (p.cx > innerWidth + 140) p.cx = -140;
        if (p.cy < -140) p.cy = innerHeight + 140; else if (p.cy > innerHeight + 140) p.cy = -140;
      }
      const ex = Math.cos(p.a) * p.rx * p.kick, ey = Math.sin(p.a) * p.ry * p.kick;
      const x = p.cx + ex * Math.cos(p.tilt) - ey * Math.sin(p.tilt), y = p.cy + ex * Math.sin(p.tilt) + ey * Math.cos(p.tilt);
      let al = Math.pow(0.5 + 0.5 * Math.sin(t * p.tw + p.ph), 2) * 0.5 + 0.06;
      al *= 1 + (p.boost - 1) * 0.12;
      if (halo.a > 0.05) { const d = Math.hypot(x - halo.x, y - halo.y); if (d < 190) al += (1 - d / 190) * 0.5 * halo.a; }
      al *= p.vis; const s = p.r * 7;
      if (p.boost > 2.2 && p.px && p.vis > 0.05) for (let k = 1; k <= 4; k++) { const f = k / 5; bctx.globalAlpha = Math.min(1, al) * (1 - f) * 0.5; const rs = s * (1 - f * 0.4); bctx.drawImage(spr, x + (p.px - x) * f - rs, y + (p.py - y) * f - rs, rs * 2, rs * 2); }
      p.px = x; p.py = y; bctx.globalAlpha = Math.min(1, al); bctx.drawImage(spr, x - s, y - s, s * 2, s * 2);
    }
    bctx.globalAlpha = 1;
    if (!document.hidden) requestAnimationFrame(quadro);
  };
  const inicia = () => { t0 = performance.now(); requestAnimationFrame(quadro); };
  document.addEventListener('visibilitychange', () => !document.hidden && inicia());
  let lw = innerWidth, lh = innerHeight, tResize = 0;
  addEventListener('resize', () => { clearTimeout(tResize); tResize = window.setTimeout(() => { if (innerWidth === lw && Math.abs(innerHeight - lh) < 160) return; lw = innerWidth; lh = innerHeight; dimensiona(); }, 150); });
  foto.onload = () => { fotoOk = true; dimensiona(); };
  foto.src = '/img/fundo.webp';
  dimensiona(); inicia();
})();

/* ---------- Escassez fixa do mês (vagas por parte do mês) ---------- */
(function escassezDoMes() {
  const hoje = new Date();
  const n = vagasRestantes(hoje);
  document.querySelectorAll<HTMLElement>('[data-vagas-frase]').forEach((e) => (e.textContent = fraseVagas(n) + '.'));
  document.querySelectorAll<HTMLElement>('[data-vagas-curta]').forEach((e) => (e.textContent = fraseVagasCurta(n)));
  document.querySelectorAll<HTMLElement>('[data-dots] i').forEach((e, i, todos) => e.classList.toggle('taken', i < todos.length - n));
  const m = mentoradosRestantes(hoje);
  document.querySelectorAll<HTMLElement>('[data-mentorados-frase]').forEach((e) => (e.textContent = fraseMentorados(m) + '.'));
  document.querySelectorAll<HTMLElement>('[data-dots-m] i').forEach((e, i, todos) => e.classList.toggle('taken', i < todos.length - m));
})();

/* ---------- Barra fixa de ação: aparece depois do hero, some sobre os cartões de preço ---------- */
(function barra() {
  const b = document.querySelector<HTMLElement>('[data-ctabar]');
  const hero = document.querySelector('#topo');
  if (!b || !hero) return;
  let passou = false, nosPlanos = false;
  const atualiza = () => b.classList.toggle('on', passou && !nosPlanos);
  new IntersectionObserver(([en]) => { passou = !en.isIntersecting; atualiza(); }, { threshold: 0 }).observe(hero);
  const planos = document.querySelector('#caminhos');
  if (planos) new IntersectionObserver(([en]) => { nosPlanos = en.isIntersecting; atualiza(); }, { threshold: 0, rootMargin: '-30% 0px -30% 0px' }).observe(planos);
})();

/* ---------- Tempo em cada seção e profundidade de rolagem ---------- */
(function medir() {
  const secs = [...document.querySelectorAll<HTMLElement>('[data-sec]')];
  if (!secs.length) return;
  const visivel = new Map<string, number>(); const total = new Map<string, number>();
  const io = new IntersectionObserver((entries) => {
    const agora = performance.now();
    for (const en of entries) {
      const nome = (en.target as HTMLElement).dataset.sec!;
      if (en.isIntersecting && document.visibilityState === 'visible') { if (!visivel.has(nome)) visivel.set(nome, agora); }
      else if (visivel.has(nome)) { total.set(nome, (total.get(nome) || 0) + (agora - visivel.get(nome)!) / 1000); visivel.delete(nome); }
    }
  }, { threshold: 0.35 });
  secs.forEach((s) => io.observe(s));
  const enviar = () => {
    const agora = performance.now();
    visivel.forEach((t0, nome) => { total.set(nome, (total.get(nome) || 0) + (agora - t0) / 1000); visivel.set(nome, agora); });
    total.forEach((seg, nome) => { if (seg >= 1) track('secao_vista', { secao: nome, segundos: Math.round(seg) }); });
    total.clear();
  };
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && enviar());
  addEventListener('pagehide', enviar);
  const marcos = [25, 50, 75, 100]; const feitos = new Set<number>();
  addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - innerHeight; if (h <= 0) return;
    const pct = (scrollY / h) * 100;
    for (const m of marcos) if (pct >= m - 1 && !feitos.has(m)) (feitos.add(m), track('rolagem', { percentual: m }));
  }, { passive: true });
})();

/* ---------- Modal "o que fizemos na empresa" (logos da faixa) ---------- */
(function modais() {
  const dlg = document.querySelector<HTMLDialogElement>('[data-modal]');
  const dados = document.getElementById('areas-data');
  if (!dlg || !dados || typeof dlg.showModal !== 'function') return;
  const areas: Record<string, { titulo: string; texto: string; feitos: string[] }> = JSON.parse(dados.textContent || '{}');
  const q = <T extends HTMLElement>(s: string) => dlg.querySelector<T>(s)!;
  let origem: HTMLElement | null = null;
  document.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-empresa]');
    if (!b) return;
    const a = areas[b.dataset.empresa!];
    if (!a) return;
    origem = b;
    q('[data-modal-titulo]').textContent = a.titulo;
    q('[data-modal-texto]').textContent = a.texto;
    q('[data-modal-feitos]').replaceChildren(...a.feitos.map((f) => Object.assign(document.createElement('li'), { textContent: f })));
    dlg.showModal();
    track('empresa_aberta', { empresa: b.dataset.empresa! });
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg || (e.target as HTMLElement).closest('[data-modal-close]') || (e.target as HTMLElement).closest('[data-quiz]')) dlg.close(); });
  dlg.addEventListener('close', () => { if (origem?.closest('.marquee')) origem.blur(); else origem?.focus(); });
})();

/* ---------- Projetos: ver todos ---------- */
(function projetos() {
  const root = document.querySelector<HTMLElement>('[data-projects]');
  if (!root) return;
  const btn = root.querySelector<HTMLButtonElement>('[data-more]');
  const grade = root.querySelector<HTMLElement>('.projects');
  const cards = [...root.querySelectorAll<HTMLElement>('.project')];
  let aberto = false;
  const render = () => {
    cards.forEach((c) => (c.hidden = !aberto && c.dataset.extra === '1'));
    grade?.classList.toggle('open', aberto);
    if (btn) { btn.textContent = aberto ? 'Mostrar menos' : 'Ver todos os projetos'; btn.setAttribute('aria-expanded', String(aberto)); }
  };
  btn?.addEventListener('click', () => {
    aberto = !aberto; render();
    if (!aberto) { const vis = cards.filter((c) => !c.hidden); const ultimo = vis[vis.length - 1]; if (ultimo) scrollTo({ top: Math.max(0, ultimo.getBoundingClientRect().bottom + scrollY - innerHeight + 140), behavior: 'instant' as ScrollBehavior }); }
    track('projetos_ver_todos', { aberto });
  });
  render();
})();

/* ---------- Mapa: arrastar, zoom por botão, roda (com Ctrl) e pinça; toque num ponto mostra a cidade ---------- */
(function mapa() {
  const root = document.querySelector<HTMLElement>('[data-map]');
  if (!root) return;
  const svg = root.querySelector<SVGSVGElement>('svg')!;
  const layer = svg.querySelector<SVGGElement>('[data-layer]')!;
  const tip = root.querySelector<HTMLElement>('[data-tip]')!;
  const hint = root.querySelector<HTMLElement>('[data-hint]');
  const vb = svg.viewBox.baseVal;
  let k = 1, tx = 0, ty = 0; const K_MIN = 1, K_MAX = 18; let usou = false;
  const clamp = () => { const m = 60; tx = Math.max(vb.width * (1 - k) - m, Math.min(m, tx)); ty = Math.max(vb.height * (1 - k) - m, Math.min(m, ty)); };
  const NS = 'http://www.w3.org/2000/svg';
  const muns = layer.querySelector<SVGGElement>('[data-muns]')!; const rios = layer.querySelector<SVGGElement>('[data-rios]')!;
  const badge = root.querySelector<HTMLElement>('[data-badge]');
  const ufs = [...layer.querySelectorAll<SVGPathElement>('.uf')];
  const caixas = new Map<string, DOMRect>(); ufs.forEach((u) => caixas.set(u.dataset.uf!, u.getBBox()));
  const carregados = new Set<string>(); let riosOk = false; let sel: SVGPathElement | null = null;
  const desenhar = async (url: string, alvo: SVGGElement, classe: string, uf?: string) => {
    try { const j = await (await fetch(url)).json(); if (!j.d) return; const p = document.createElementNS(NS, 'path'); p.setAttribute('d', j.d); p.setAttribute('class', classe); if (uf) p.dataset.uf = uf; alvo.appendChild(p); } catch {}
  };
  const io = new IntersectionObserver(([en]) => { if (!en.isIntersecting) return; io.disconnect(); desenhar('/geo/BR-leve.json', muns, 'mun leve'); }, { rootMargin: '400px' });
  io.observe(root);
  let voando = false;
  const detalhar = () => {
    if (k < 1.8 || voando) return;
    if (!riosOk) { riosOk = true; desenhar('/geo/rios.json', rios, 'rio'); }
    const x0 = -tx / k, y0 = -ty / k, x1 = (vb.width - tx) / k, y1 = (vb.height - ty) / k;
    caixas.forEach((b, uf) => { if (carregados.has(uf) || b.x > x1 || b.x + b.width < x0 || b.y > y1 || b.y + b.height < y0) return; carregados.add(uf); desenhar(`/geo/${uf}.json`, muns, 'mun', uf); });
  };
  const apply = () => { clamp(); layer.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${k.toFixed(3)})`); svg.style.setProperty('--k', String(k)); svg.style.setProperty('--det', String(Math.max(0, Math.min(1, (k - 1.5) / 2)))); detalhar(); };
  const selecionar = (u: SVGPathElement | null) => {
    sel?.classList.remove('sel'); sel = u; muns.querySelectorAll('.sel').forEach((m) => m.classList.remove('sel'));
    if (!u || !badge) { badge?.classList.remove('on'); return; }
    u.classList.add('sel'); muns.querySelector(`[data-uf="${u.dataset.uf}"]`)?.classList.add('sel');
    const n = Number(u.dataset.n), e = Number(u.dataset.e);
    const partes = [n ? `${n} ${n === 1 ? 'pessoa atendida' : 'pessoas atendidas'}` : '', e ? `${e} ${e === 1 ? 'empresa' : 'empresas'}` : ''].filter(Boolean);
    badge.innerHTML = `<b>${u.dataset.nome}</b><span>${partes.length ? partes.join(' · ') : 'ainda sem atendimentos'}</span>`; badge.classList.add('on');
    const b = caixas.get(u.dataset.uf!)!;
    const nk = Math.max(K_MIN, Math.min(K_MAX, 0.62 * Math.min(vb.width / b.width, vb.height / b.height)));
    voar(nk, vb.width / 2 - (b.x + b.width / 2) * nk, vb.height / 2 - (b.y + b.height / 2) * nk);
  };
  let anim = 0;
  const voar = (nk: number, ntx: number, nty: number) => {
    cancelAnimationFrame(anim); voando = true;
    if (reduce) { voando = false; k = nk; tx = ntx; ty = nty; apply(); return; }
    const k0 = k, x0 = tx, y0 = ty, t0 = performance.now();
    const passo = (t: number) => { const p = Math.min(1, (t - t0) / 700); const e = 1 - Math.pow(1 - p, 3); k = k0 * Math.pow(nk / k0, e); tx = x0 + (ntx - x0) * e; ty = y0 + (nty - y0) * e; apply(); if (p < 1) anim = requestAnimationFrame(passo); else { voando = false; detalhar(); } };
    anim = requestAnimationFrame(passo);
  };
  const escala = () => vb.width / svg.getBoundingClientRect().width;
  const zoomEm = (fator: number, cx = vb.width / 2, cy = vb.height / 2) => { const nk = Math.max(K_MIN, Math.min(K_MAX, k * fator)); const f = nk / k; tx = cx - (cx - tx) * f; ty = cy - (cy - ty) * f; k = nk; apply(); hideTip(); marcar(); };
  const marcar = () => { if (!usou) { usou = true; hint?.remove(); track('mapa_interacao'); } };
  const hideTip = () => { tip.classList.remove('on'); root.querySelectorAll('.pt.on').forEach((p) => p.classList.remove('on')); };
  const mostrarTip = (pt: SVGElement) => {
    const r = pt.getBoundingClientRect(), rr = root.getBoundingClientRect();
    tip.textContent = pt.dataset.tipo === 'empresa' ? `Empresa atendida em ${pt.dataset.city}, ${pt.dataset.uf}` : `Mentorado em ${pt.dataset.city}, ${pt.dataset.uf}`;
    tip.classList.add('on');
    const meia = tip.offsetWidth / 2 + 10; const cx = Math.max(meia, Math.min(rr.width - meia, r.left + r.width / 2 - rr.left)); const acima = r.top - rr.top > tip.offsetHeight + 24;
    tip.style.left = cx + 'px'; tip.style.top = (acima ? r.top - rr.top : r.bottom - rr.top) + 'px'; tip.style.transform = acima ? 'translate(-50%, calc(-100% - 14px))' : 'translate(-50%, 14px)';
    root.querySelectorAll('.pt.on').forEach((p) => p.classList.remove('on')); pt.classList.add('on');
  };
  const ptrs = new Map<number, { x: number; y: number }>(); let last: { x: number; y: number } | null = null; let dist0 = 0, k0 = 1, arrastou = false;
  svg.addEventListener('pointerdown', (e) => { svg.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); arrastou = false; if (ptrs.size === 1) last = { x: e.clientX, y: e.clientY }; if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; dist0 = Math.hypot(a.x - b.x, a.y - b.y); k0 = k; } });
  svg.addEventListener('pointermove', (e) => {
    if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); const rect = svg.getBoundingClientRect(); zoomEm((k0 * (d / dist0)) / k, ((a.x + b.x) / 2 - rect.left) * escala(), ((a.y + b.y) / 2 - rect.top) * escala()); arrastou = true; return; }
    if (last) { const dx = e.clientX - last.x, dy = e.clientY - last.y; if (Math.abs(dx) + Math.abs(dy) > 2) arrastou = true; if (arrastou) { tx += dx * escala(); ty += dy * escala(); last = { x: e.clientX, y: e.clientY }; apply(); hideTip(); marcar(); } }
  });
  const fim = (e: PointerEvent) => { ptrs.delete(e.pointerId); if (ptrs.size === 0) last = null; if (ptrs.size === 1) last = [...ptrs.values()][0]; };
  svg.addEventListener('pointerup', (e) => {
    const alvo = (e.target as Element).closest<SVGElement>('.pt');
    const estado = (document.elementFromPoint(e.clientX, e.clientY) || (e.target as Element)).closest<SVGPathElement>('.uf');
    if (!arrastou && alvo) { mostrarTip(alvo); marcar(); track('mapa_ponto', { uf: alvo.dataset.uf! }); }
    else if (!arrastou && estado) { hideTip(); selecionar(estado === sel ? null : estado); marcar(); track('mapa_estado', { uf: estado.dataset.uf! }); }
    else if (!arrastou) hideTip();
    fim(e);
  });
  svg.addEventListener('pointercancel', fim);
  svg.addEventListener('pointerover', (e) => { if ((e as PointerEvent).pointerType !== 'mouse' || ptrs.size) return; const alvo = (e.target as Element).closest<SVGElement>('.pt'); if (alvo) mostrarTip(alvo); });
  svg.addEventListener('pointerout', (e) => { if ((e as PointerEvent).pointerType === 'mouse' && (e.target as Element).closest('.pt')) hideTip(); });
  svg.addEventListener('wheel', (e) => { if (!(e.ctrlKey || e.metaKey)) return; e.preventDefault(); const rect = svg.getBoundingClientRect(); zoomEm(e.deltaY < 0 ? 1.25 : 0.8, (e.clientX - rect.left) * escala(), (e.clientY - rect.top) * escala()); }, { passive: false });
  root.querySelectorAll<HTMLButtonElement>('[data-zoom]').forEach((b) => b.addEventListener('click', () => { const a = b.dataset.zoom; if (a === 'in') zoomEm(1.5); else if (a === 'out') zoomEm(1 / 1.5); else { selecionar(null); hideTip(); voar(1, 0, 0); } marcar(); }));
  apply();
})();
