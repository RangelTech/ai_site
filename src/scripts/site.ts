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
  const K_MAX = 8;
  let usou = false;

  // o conteúdo ocupa [tx, tx + W*k]; mantém o mapa sempre cobrindo a janela, com uma folga
  const clamp = () => {
    const m = 60;
    tx = Math.max(vb.width * (1 - k) - m, Math.min(m, tx));
    ty = Math.max(vb.height * (1 - k) - m, Math.min(m, ty));
  };
  const apply = () => {
    clamp();
    layer.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${k.toFixed(3)})`);
    svg.style.setProperty('--k', String(k));
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
    if (!arrastou && alvo) {
      mostrarTip(alvo);
      marcar();
      track('mapa_ponto', { uf: alvo.dataset.uf! });
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
        k = 1;
        tx = 0;
        ty = 0;
        apply();
        hideTip();
      }
      marcar();
    }),
  );
  apply();
})();
