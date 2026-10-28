// Comportamento do site. Sem dependências. Tudo degrada bem sem JavaScript.

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

/* ---------- WhatsApp: acrescenta " (vim pelo Instagram)" quando a origem é o Instagram ---------- */
(function whatsapp() {
  const q = new URLSearchParams(location.search);
  const origem = q.get('utm_source') || sessionStorage.getItem('utm_source') || '';
  if (q.get('utm_source')) sessionStorage.setItem('utm_source', q.get('utm_source')!);
  if (origem.toLowerCase() !== 'instagram') return;
  const sufixo = (window as any).__wa?.sufixo || ' (vim pelo Instagram)';
  document.querySelectorAll<HTMLAnchorElement>('a[data-wa]').forEach((a) => {
    const url = new URL(a.href);
    const texto = url.searchParams.get('text') || '';
    if (texto && !texto.endsWith(sufixo)) {
      url.searchParams.set('text', texto + sufixo);
      a.href = url.toString().replace(/\+/g, '%20');
    }
  });
})();

/* ---------- Cliques por botão ---------- */
document.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
  if (el) track('clique', { botao: el.dataset.track! });
});

/* ---------- Vidro: brilho especular que reage a mouse, toque, giroscópio e rolagem ---------- */
(function vidro() {
  if (reduce) return;
  const glass = [...document.querySelectorAll<HTMLElement>('.glass')];
  const set = (el: HTMLElement, x: number, y: number) => {
    el.style.setProperty('--mx', x + 'px');
    el.style.setProperty('--my', y + 'px');
  };
  const onPointer = (e: PointerEvent) => {
    for (const el of glass) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) continue;
      set(el, e.clientX - r.left, e.clientY - r.top);
    }
  };
  addEventListener('pointermove', onPointer, { passive: true });
  addEventListener('pointerdown', onPointer, { passive: true });
  // sem ponteiro: o brilho segue a rolagem
  let ticking = false;
  let moved = false;
  addEventListener('pointermove', () => (moved = true), { once: true, passive: true });
  addEventListener(
    'scroll',
    () => {
      if (moved || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const t = (scrollY % 900) / 900;
        for (const el of glass) {
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > innerHeight) continue;
          set(el, r.width * (0.15 + 0.7 * t), r.height * (0.1 + 0.4 * Math.sin(t * Math.PI)));
        }
        ticking = false;
      });
    },
    { passive: true },
  );
  // giroscópio (Android e iOS com permissão já dada)
  addEventListener(
    'deviceorientation',
    (e) => {
      if (moved || e.gamma == null || e.beta == null) return;
      const gx = Math.max(-45, Math.min(45, e.gamma)) / 90 + 0.5;
      const gy = Math.max(-45, Math.min(45, e.beta - 40)) / 90 + 0.5;
      for (const el of glass) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        set(el, r.width * gx, r.height * gy);
      }
    },
    { passive: true },
  );
})();

/* ---------- Fundo vivo: vidro embaçado que "limpa" onde o dedo passa, e brilhos que vão e voltam ---------- */
(function fundoVivo() {
  const raiz = document.documentElement;
  // parallax suave da foto com a rolagem
  addEventListener(
    'scroll',
    () => raiz.style.setProperty('--sy', (scrollY / Math.max(1, raiz.scrollHeight - innerHeight)).toFixed(4)),
    { passive: true },
  );

  const limpo = document.querySelector<HTMLCanvasElement>('[data-limpo]');
  const brilhos = document.querySelector<HTMLCanvasElement>('[data-brilhos]');
  if (!limpo || !brilhos) return;
  const lite = raiz.classList.contains('lite');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const bctx = brilhos.getContext('2d')!;
  const lctx = limpo.getContext('2d')!;

  /* --- limpar o embaçado: o rastro vive num canvas pequeno (a foto já é borrada, então a resolução baixa não aparece) --- */
  const ESC = 8; // 1 px do canvas = 8 px da tela
  const foto = new Image();
  const fotoC = document.createElement('canvas');
  const rastro = document.createElement('canvas');
  const rctx = rastro.getContext('2d')!;
  let w = 0, h = 0, fotoOk = false;
  const dimensiona = () => {
    w = Math.max(8, Math.ceil(innerWidth / ESC));
    h = Math.max(8, Math.ceil(innerHeight / ESC));
    for (const c of [limpo, fotoC, rastro]) { c.width = w; c.height = h; }
    brilhos.width = Math.round(innerWidth * dpr);
    brilhos.height = Math.round(innerHeight * dpr);
    if (fotoOk) {
      // "cover": a foto preenche a tela sem deformar
      const r = Math.max(w / foto.naturalWidth, h / foto.naturalHeight);
      const fw = foto.naturalWidth * r, fh = foto.naturalHeight * r;
      fotoC.getContext('2d')!.drawImage(foto, (w - fw) / 2, (h - fh) / 2, fw, fh);
    }
    energia = 0;
    lctx.clearRect(0, 0, w, h);
  };
  let energia = 0; // quadros restantes até o rastro sumir por completo
  const alvo = { x: -999, y: -999, ativo: false };
  let ult: { x: number; y: number } | null = null;
  const carimba = (x: number, y: number) => {
    const raio = 170 / ESC;
    const cx = x / ESC, cy = y / ESC;
    const g = rctx.createRadialGradient(cx, cy, 0, cx, cy, raio);
    g.addColorStop(0, 'rgba(255,255,255,0.30)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.14)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    rctx.fillStyle = g;
    rctx.fillRect(cx - raio, cy - raio, raio * 2, raio * 2);
  };
  const toca = (x: number, y: number) => {
    alvo.x = x; alvo.y = y; alvo.ativo = true;
    if (!reduce) {
      // interpola entre o ponto anterior e o atual, para o traço não ficar com buracos
      if (ult) {
        const d = Math.hypot(x - ult.x, y - ult.y);
        const n = Math.min(12, Math.ceil(d / 28));
        for (let i = 1; i <= n; i++) carimba(ult.x + ((x - ult.x) * i) / n, ult.y + ((y - ult.y) * i) / n);
      } else carimba(x, y);
      energia = 260;
    }
    ult = { x, y };
  };
  addEventListener('pointermove', (e) => toca(e.clientX, e.clientY), { passive: true });
  addEventListener('pointerdown', (e) => ((ult = null), toca(e.clientX, e.clientY)), { passive: true });
  addEventListener('touchmove', (e) => e.touches[0] && toca(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  addEventListener('touchstart', (e) => e.touches[0] && ((ult = null), toca(e.touches[0].clientX, e.touches[0].clientY)), { passive: true });
  const solta = () => { ult = null; alvo.ativo = false; };
  document.addEventListener('pointerleave', solta);
  addEventListener('touchend', solta, { passive: true });
  addEventListener('blur', solta);

  /* --- brilhos: pontos que orbitam, piscam e às vezes "explodem" para longe e voltam --- */
  type P = { cx: number; cy: number; rx: number; ry: number; a: number; va: number; vx: number; vy: number; tw: number; ph: number; r: number; tom: number; kick: number; tilt: number };
  const N = lite ? 14 : innerWidth < 700 ? 22 : 34;
  const ps: P[] = [];
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const nova = (): P => ({
    cx: rnd(0, innerWidth), cy: rnd(0, innerHeight), rx: rnd(18, 120), ry: rnd(14, 90), a: rnd(0, 6.28), va: rnd(0.08, 0.32) * (Math.random() < 0.5 ? -1 : 1),
    vx: rnd(-7, 7), vy: rnd(-7, 7), tw: rnd(0.25, 0.9), ph: rnd(0, 6.28), r: rnd(0.8, 2.3), tom: Math.random(), kick: 1, tilt: rnd(0, 3.14),
  });
  for (let i = 0; i < N; i++) ps.push(nova());
  // sprite do brilho, desenhado uma vez
  const spr = document.createElement('canvas');
  spr.width = spr.height = 48;
  const sc = spr.getContext('2d')!;
  const sg = sc.createRadialGradient(24, 24, 0, 24, 24, 24);
  sg.addColorStop(0, 'rgba(255,255,255,1)');
  sg.addColorStop(0.18, 'rgba(190,225,255,0.85)');
  sg.addColorStop(0.5, 'rgba(90,160,255,0.22)');
  sg.addColorStop(1, 'rgba(60,120,255,0)');
  sc.fillStyle = sg;
  sc.fillRect(0, 0, 48, 48);

  let t0 = performance.now(), proxExplosao = t0 + 1200, halo = { x: -999, y: -999, a: 0 };
  // no celular o vidro fosco refaz o desfoque a cada quadro, então limitamos a 30 quadros por segundo
  const intervalo = innerWidth < 700 || lite ? 33 : 0;
  const quadro = (now: number) => {
    if (intervalo && now - t0 < intervalo) {
      if (!document.hidden) requestAnimationFrame(quadro);
      return;
    }
    const dt = Math.min(0.05, (now - t0) / 1000);
    t0 = now;
    const t = now / 1000;

    // 1) rastro do embaçado
    if (energia > 0 && fotoOk) {
      energia--;
      rctx.globalCompositeOperation = 'destination-out';
      rctx.fillStyle = 'rgba(0,0,0,0.018)';
      rctx.fillRect(0, 0, w, h);
      rctx.globalCompositeOperation = 'source-over';
      lctx.clearRect(0, 0, w, h);
      lctx.globalCompositeOperation = 'source-over';
      lctx.drawImage(fotoC, 0, 0);
      lctx.globalCompositeOperation = 'destination-in';
      lctx.drawImage(rastro, 0, 0);
      lctx.globalCompositeOperation = 'source-over';
      if (energia === 0) {
        rctx.clearRect(0, 0, w, h);
        lctx.clearRect(0, 0, w, h);
      }
    }

    // 2) brilhos
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bctx.clearRect(0, 0, innerWidth, innerHeight);
    bctx.globalCompositeOperation = 'lighter';
    // halo suave que acompanha a seta ou o dedo
    halo.a += ((alvo.ativo ? 1 : 0) - halo.a) * Math.min(1, dt * 3);
    if (alvo.ativo) { halo.x += (alvo.x - halo.x) * Math.min(1, dt * 6); halo.y += (alvo.y - halo.y) * Math.min(1, dt * 6); }
    if (halo.a > 0.01) {
      const g = bctx.createRadialGradient(halo.x, halo.y, 0, halo.x, halo.y, 190);
      g.addColorStop(0, `rgba(200,225,255,${0.1 * halo.a})`);
      g.addColorStop(1, 'rgba(160,210,255,0)');
      bctx.fillStyle = g;
      bctx.fillRect(halo.x - 190, halo.y - 190, 380, 380);
    }
    if (!reduce && now > proxExplosao) {
      const p = ps[(Math.random() * ps.length) | 0];
      p.kick = rnd(2.4, 3.8);
      proxExplosao = now + rnd(500, 1800);
    }
    for (const p of ps) {
      if (!reduce) {
        p.a += p.va * dt;
        p.cx += p.vx * dt;
        p.cy += p.vy * dt;
        p.kick += (1 - p.kick) * Math.min(1, dt * 1.1); // volta devagar para a órbita
        if (p.cx < -140) p.cx = innerWidth + 140; else if (p.cx > innerWidth + 140) p.cx = -140;
        if (p.cy < -140) p.cy = innerHeight + 140; else if (p.cy > innerHeight + 140) p.cy = -140;
      }
      const ex = Math.cos(p.a) * p.rx * p.kick, ey = Math.sin(p.a) * p.ry * p.kick;
      const x = p.cx + ex * Math.cos(p.tilt) - ey * Math.sin(p.tilt);
      const y = p.cy + ex * Math.sin(p.tilt) + ey * Math.cos(p.tilt);
      let al = Math.pow(0.5 + 0.5 * Math.sin(t * p.tw + p.ph), 2) * 0.5 + 0.04;
      al *= 1 + (p.kick - 1) * 0.35; // brilha mais na explosão
      if (halo.a > 0.05) {
        const d = Math.hypot(x - halo.x, y - halo.y);
        if (d < 190) al += (1 - d / 190) * 0.5 * halo.a;
      }
      const s = p.r * 7 * (p.kick > 1.4 ? 1.25 : 1);
      bctx.globalAlpha = Math.min(1, al);
      bctx.drawImage(spr, x - s, y - s, s * 2, s * 2);
    }
    bctx.globalAlpha = 1;
    if (!document.hidden) requestAnimationFrame(quadro);
  };
  const inicia = () => { t0 = performance.now(); requestAnimationFrame(quadro); };
  document.addEventListener('visibilitychange', () => !document.hidden && inicia());
  addEventListener('resize', dimensiona);

  foto.onload = () => { fotoOk = true; dimensiona(); };
  foto.src = '/img/fundo.webp';
  dimensiona();
  inicia();
})();

/* ---------- Entrada suave das seções ---------- */
(function reveal() {
  const els = document.querySelectorAll<HTMLElement>('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((e) => e.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  els.forEach((e) => io.observe(e));
})();

/* ---------- Botão flutuante do WhatsApp (aparece depois do hero) ---------- */
(function fab() {
  const f = document.querySelector<HTMLElement>('[data-fab]');
  const hero = document.querySelector('#topo');
  if (!f || !hero) return;
  const io = new IntersectionObserver(([en]) => f.classList.toggle('on', !en.isIntersecting), { threshold: 0 });
  io.observe(hero);
})();

/* ---------- Tempo em cada seção e profundidade de rolagem ---------- */
(function medir() {
  const secs = [...document.querySelectorAll<HTMLElement>('[data-sec]')];
  if (!secs.length) return;
  const visivel = new Map<string, number>(); // nome -> instante de entrada
  const total = new Map<string, number>(); // nome -> segundos acumulados
  const io = new IntersectionObserver(
    (entries) => {
      const agora = performance.now();
      for (const en of entries) {
        const nome = (en.target as HTMLElement).dataset.sec!;
        if (en.isIntersecting && document.visibilityState === 'visible') {
          if (!visivel.has(nome)) visivel.set(nome, agora);
        } else if (visivel.has(nome)) {
          total.set(nome, (total.get(nome) || 0) + (agora - visivel.get(nome)!) / 1000);
          visivel.delete(nome);
        }
      }
    },
    { threshold: 0.35 },
  );
  secs.forEach((s) => io.observe(s));
  const enviar = () => {
    const agora = performance.now();
    visivel.forEach((t0, nome) => {
      total.set(nome, (total.get(nome) || 0) + (agora - t0) / 1000);
      visivel.set(nome, agora);
    });
    total.forEach((seg, nome) => {
      if (seg >= 1) track('secao_vista', { secao: nome, segundos: Math.round(seg) });
    });
    total.clear();
  };
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && enviar());
  addEventListener('pagehide', enviar);

  const marcos = [25, 50, 75, 100];
  const feitos = new Set<number>();
  addEventListener(
    'scroll',
    () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      if (h <= 0) return;
      const pct = (scrollY / h) * 100;
      for (const m of marcos) if (pct >= m - 1 && !feitos.has(m)) (feitos.add(m), track('rolagem', { percentual: m }));
    },
    { passive: true },
  );
})();

/* ---------- Projetos: ver todos e filtrar por grupo ---------- */
(function projetos() {
  const root = document.querySelector<HTMLElement>('[data-projects]');
  if (!root) return;
  const btn = root.querySelector<HTMLButtonElement>('[data-more]');
  const filtros = root.querySelector<HTMLElement>('[data-filters]');
  const grade = root.querySelector<HTMLElement>('.projects');
  const cards = [...root.querySelectorAll<HTMLElement>('.project')];
  let aberto = false;
  let grupo = 'todos';
  const render = () => {
    cards.forEach((c) => {
      const extra = c.dataset.extra === '1';
      const okGrupo = grupo === 'todos' || c.dataset.grupo === grupo;
      c.hidden = !(aberto ? okGrupo : !extra);
    });
    grade?.classList.toggle('open', aberto);
    if (filtros) filtros.hidden = !aberto;
    if (btn) {
      btn.textContent = aberto ? 'Mostrar menos' : 'Ver todos os projetos';
      btn.setAttribute('aria-expanded', String(aberto));
    }
  };
  btn?.addEventListener('click', () => {
    aberto = !aberto;
    if (!aberto) grupo = 'todos';
    filtros?.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.g === grupo)));
    render();
    track('projetos_ver_todos', { aberto });
  });
  filtros?.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-g]');
    if (!b) return;
    grupo = b.dataset.g!;
    filtros.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    render();
    track('projetos_filtro', { grupo });
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
  let k = 1;
  let tx = 0;
  let ty = 0;
  const K_MIN = 1;
  const K_MAX = 18;
  let usou = false;

  // o conteúdo ocupa [tx, tx + W*k]; mantém o mapa sempre cobrindo a janela, com uma folga
  const clamp = () => {
    const m = 60;
    tx = Math.max(vb.width * (1 - k) - m, Math.min(m, tx));
    ty = Math.max(vb.height * (1 - k) - m, Math.min(m, ty));
  };
  const NS = 'http://www.w3.org/2000/svg';
  const muns = layer.querySelector<SVGGElement>('[data-muns]')!;
  const rios = layer.querySelector<SVGGElement>('[data-rios]')!;
  const badge = root.querySelector<HTMLElement>('[data-badge]');
  const ufs = [...layer.querySelectorAll<SVGPathElement>('.uf')];
  const caixas = new Map<string, DOMRect>();
  ufs.forEach((u) => caixas.set(u.dataset.uf!, u.getBBox()));
  const carregados = new Set<string>();
  let riosOk = false;
  let sel: SVGPathElement | null = null;

  // municípios e rios só são baixados quando o zoom pede detalhe, e só os estados que estão na janela
  const desenhar = async (url: string, alvo: SVGGElement, classe: string, uf?: string) => {
    try {
      const j = await (await fetch(url)).json();
      if (!j.d) return;
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', j.d);
      p.setAttribute('class', classe);
      if (uf) p.dataset.uf = uf;
      alvo.appendChild(p);
    } catch {}
  };
  let voando = false;
  const detalhar = () => {
    if (k < 1.8 || voando) return;
    if (!riosOk) {
      riosOk = true;
      desenhar('/geo/rios.json', rios, 'rio');
    }
    const x0 = -tx / k, y0 = -ty / k, x1 = (vb.width - tx) / k, y1 = (vb.height - ty) / k;
    caixas.forEach((b, uf) => {
      if (carregados.has(uf) || b.x > x1 || b.x + b.width < x0 || b.y > y1 || b.y + b.height < y0) return;
      carregados.add(uf);
      desenhar(`/geo/${uf}.json`, muns, 'mun', uf);
    });
  };
  const apply = () => {
    clamp();
    layer.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${k.toFixed(3)})`);
    svg.style.setProperty('--k', String(k));
    svg.style.setProperty('--det', String(Math.max(0, Math.min(1, (k - 1.5) / 2))));
    detalhar();
  };
  // seleciona o estado: mostra a contagem no canto e aproxima o mapa dele
  const selecionar = (u: SVGPathElement | null) => {
    sel?.classList.remove('sel');
    sel = u;
    muns.querySelectorAll('.sel').forEach((m) => m.classList.remove('sel'));
    if (!u || !badge) {
      badge?.classList.remove('on');
      return;
    }
    u.classList.add('sel');
    muns.querySelector(`[data-uf="${u.dataset.uf}"]`)?.classList.add('sel');
    const n = Number(u.dataset.n);
    badge.innerHTML = `<b>${u.dataset.nome}</b><span>${n ? `${n} ${n === 1 ? 'pessoa atendida' : 'pessoas atendidas'}` : 'ainda sem mentorados'}</span>`;
    badge.classList.add('on');
    const b = caixas.get(u.dataset.uf!)!;
    const nk = Math.max(K_MIN, Math.min(K_MAX, 0.62 * Math.min(vb.width / b.width, vb.height / b.height)));
    voar(nk, vb.width / 2 - (b.x + b.width / 2) * nk, vb.height / 2 - (b.y + b.height / 2) * nk);
  };
  let anim = 0;
  const voar = (nk: number, ntx: number, nty: number) => {
    cancelAnimationFrame(anim);
    voando = true;
    if (reduce) {
      voando = false;
      k = nk; tx = ntx; ty = nty; apply(); return;
    }
    const k0 = k, x0 = tx, y0 = ty, t0 = performance.now();
    const passo = (t: number) => {
      const p = Math.min(1, (t - t0) / 700);
      const e = 1 - Math.pow(1 - p, 3);
      // interpola o zoom em escala logarítmica para o movimento parecer constante
      k = k0 * Math.pow(nk / k0, e);
      tx = x0 + (ntx - x0) * e;
      ty = y0 + (nty - y0) * e;
      apply();
      if (p < 1) anim = requestAnimationFrame(passo);
      else {
        voando = false;
        detalhar();
      }
    };
    anim = requestAnimationFrame(passo);
  };
  // converte px da tela para unidades do viewBox
  const escala = () => vb.width / svg.getBoundingClientRect().width;
  const zoomEm = (fator: number, cx = vb.width / 2, cy = vb.height / 2) => {
    const nk = Math.max(K_MIN, Math.min(K_MAX, k * fator));
    const f = nk / k;
    tx = cx - (cx - tx) * f;
    ty = cy - (cy - ty) * f;
    k = nk;
    apply();
    hideTip();
    marcar();
  };
  const marcar = () => {
    if (!usou) {
      usou = true;
      hint?.remove();
      track('mapa_interacao');
    }
  };
  const hideTip = () => {
    tip.classList.remove('on');
    root.querySelectorAll('.pt.on').forEach((p) => p.classList.remove('on'));
  };
  const mostrarTip = (pt: SVGElement) => {
    const r = pt.getBoundingClientRect();
    const rr = root.getBoundingClientRect();
    tip.textContent = `Mentorado em ${pt.dataset.city}, ${pt.dataset.uf}`;
    tip.classList.add('on');
    // mantém a dica dentro do mapa: ajusta na horizontal e vira para baixo perto do topo
    const meia = tip.offsetWidth / 2 + 10;
    const cx = Math.max(meia, Math.min(rr.width - meia, r.left + r.width / 2 - rr.left));
    const acima = r.top - rr.top > tip.offsetHeight + 24;
    tip.style.left = cx + 'px';
    tip.style.top = (acima ? r.top - rr.top : r.bottom - rr.top) + 'px';
    tip.style.transform = acima ? 'translate(-50%, calc(-100% - 14px))' : 'translate(-50%, 14px)';
    root.querySelectorAll('.pt.on').forEach((p) => p.classList.remove('on'));
    pt.classList.add('on');
  };

  // ponteiros
  const ptrs = new Map<number, { x: number; y: number }>();
  let last: { x: number; y: number } | null = null;
  let dist0 = 0;
  let k0 = 1;
  let arrastou = false;
  svg.addEventListener('pointerdown', (e) => {
    svg.setPointerCapture(e.pointerId);
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    arrastou = false;
    if (ptrs.size === 1) last = { x: e.clientX, y: e.clientY };
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      dist0 = Math.hypot(a.x - b.x, a.y - b.y);
      k0 = k;
    }
  });
  svg.addEventListener('pointermove', (e) => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const rect = svg.getBoundingClientRect();
      const cx = ((a.x + b.x) / 2 - rect.left) * escala();
      const cy = ((a.y + b.y) / 2 - rect.top) * escala();
      zoomEm((k0 * (d / dist0)) / k, cx, cy);
      arrastou = true;
      return;
    }
    if (last) {
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) arrastou = true;
      if (arrastou) {
        tx += dx * escala();
        ty += dy * escala();
        last = { x: e.clientX, y: e.clientY };
        apply();
        hideTip();
        marcar();
      }
    }
  });
  const fim = (e: PointerEvent) => {
    ptrs.delete(e.pointerId);
    if (ptrs.size === 0) last = null;
    if (ptrs.size === 1) last = [...ptrs.values()][0];
  };
  svg.addEventListener('pointerup', (e) => {
    const alvo = (e.target as Element).closest<SVGElement>('.pt');
    const estado = (document.elementFromPoint(e.clientX, e.clientY) || (e.target as Element)).closest<SVGPathElement>('.uf');
    if (!arrastou && alvo) {
      mostrarTip(alvo);
      marcar();
      track('mapa_ponto', { uf: alvo.dataset.uf! });
    } else if (!arrastou && estado) {
      hideTip();
      selecionar(estado === sel ? null : estado);
      marcar();
      track('mapa_estado', { uf: estado.dataset.uf! });
    } else if (!arrastou) hideTip();
    fim(e);
  });
  svg.addEventListener('pointercancel', fim);
  // desktop: passar o mouse mostra a cidade
  svg.addEventListener('pointerover', (e) => {
    if ((e as PointerEvent).pointerType !== 'mouse' || ptrs.size) return;
    const alvo = (e.target as Element).closest<SVGElement>('.pt');
    if (alvo) mostrarTip(alvo);
  });
  svg.addEventListener('pointerout', (e) => {
    if ((e as PointerEvent).pointerType === 'mouse' && (e.target as Element).closest('.pt')) hideTip();
  });
  svg.addEventListener(
    'wheel',
    (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      zoomEm(e.deltaY < 0 ? 1.25 : 0.8, (e.clientX - rect.left) * escala(), (e.clientY - rect.top) * escala());
    },
    { passive: false },
  );
  root.querySelectorAll<HTMLButtonElement>('[data-zoom]').forEach((b) =>
    b.addEventListener('click', () => {
      const a = b.dataset.zoom;
      if (a === 'in') zoomEm(1.5);
      else if (a === 'out') zoomEm(1 / 1.5);
      else {
        selecionar(null);
        hideTip();
        voar(1, 0, 0);
      }
      marcar();
    }),
  );
  apply();
})();
