// Movimento da página: rolagem suave (Lenis), animações ligadas à rolagem (GSAP ScrollTrigger),
// cena de "quem sou eu" esfregada pela rolagem, contadores e tom do fundo por seção. Tudo some com "reduzir movimento".
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lite = document.documentElement.classList.contains('lite');
const RT: any = (window as any).__rt || {};

gsap.registerPlugin(ScrollTrigger);

/* ---------- rolagem suave ---------- */
let lenis: Lenis | null = null;
if (!reduce && !lite) {
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // o quiz é um dialog modal: a rolagem suave da página não pode roubar a roda dele
  const obs = new MutationObserver(() => (document.documentElement.classList.contains('quiz-open') ? lenis!.stop() : lenis!.start()));
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  // âncoras do menu
  document.querySelectorAll<HTMLAnchorElement>('a[href^="/#"], a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!.replace(/^\/?#/, '');
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis!.scrollTo(el, { offset: -72, duration: 1.1 });
    }),
  );
}

/* ---------- título do hero: entra por palavra ---------- */
(function hero() {
  const h1 = document.querySelector<HTMLElement>('[data-split]');
  if (!h1) return;
  const split = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      node.textContent!.split(/(\s+)/).forEach((p) => {
        if (!p) return;
        if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
        else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; frag.appendChild(s); }
      });
      node.parentNode!.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) [...node.childNodes].forEach(split);
  };
  split(h1);
  const words = h1.querySelectorAll('.w');
  if (reduce) return;
  gsap.set(words, { yPercent: 110, opacity: 0, rotateX: -30 });
  gsap.to(words, { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.9, ease: 'power4.out', stagger: 0.055, delay: 0.1 });
  gsap.from('.hero [data-reveal]', { y: 26, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.5, clearProps: 'all' });
})();

/* ---------- entrada das seções ---------- */
(function reveals() {
  const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter((e) => !e.closest('.hero'));
  if (reduce) return;
  gsap.set(els, { y: 32, opacity: 0 });
  ScrollTrigger.batch(els, {
    start: 'top 88%',
    onEnter: (b) => gsap.to(b, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.07, overwrite: true, clearProps: 'transform' }),
    once: true,
  });
})();

/* ---------- contadores ---------- */
(function counters() {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const alvo = Number(el.dataset.count || el.textContent);
    if (!alvo || reduce) return;
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(o, { v: alvo, duration: 1.6, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString('pt-BR')) }),
    });
  });
})();

/* ---------- tom do fundo muda por seção ---------- */
(function hue() {
  const secs = document.querySelectorAll<HTMLElement>('[data-hue]');
  const raiz = document.documentElement;
  secs.forEach((s) => {
    ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: (st) => st.isActive && raiz.style.setProperty('--hue', s.dataset.hue || '0') });
  });
})();

/* ---------- cena de "quem sou eu": fixa a tela e esfrega o vídeo (ou aproxima a foto) com as legendas ---------- */
(function cena() {
  const sec = document.querySelector<HTMLElement>('[data-cena]');
  if (!sec) return;
  const pin = sec.querySelector<HTMLElement>('[data-cena-pin]')!;
  const media = sec.querySelector<HTMLElement>('[data-cena-media]')!;
  const img = media.querySelector('img')!;
  const canvas = sec.querySelector<HTMLCanvasElement>('[data-cena-canvas]')!;
  const caps = [...sec.querySelectorAll<HTMLElement>('[data-cena-cap]')];
  if (reduce) { caps.forEach((c) => (c.style.opacity = '1')); sec.classList.add('cena--static'); return; }

  // sequência de quadros (quando o vídeo existir)
  const V = RT.video || { quadros: 0 };
  const mob = innerWidth < 760;
  const nq = V.quadros ? (mob ? Math.ceil(V.quadros / 2) : V.quadros) : 0;
  const frames: HTMLImageElement[] = [];
  let pronto = 0;
  if (nq) {
    const pasta = `${V.pasta}/${mob ? 'mob' : 'desk'}/`;
    for (let k = 1; k <= nq; k++) {
      const im = new Image();
      im.src = pasta + String(k).padStart(4, '0') + '.webp';
      im.onload = () => { pronto++; if (pronto === 1) { canvas.hidden = false; img.style.visibility = 'hidden'; desenha(0); } };
      frames.push(im);
    }
  }
  const ctx = canvas.getContext('2d');
  const dimensiona = () => { const r = media.getBoundingClientRect(); canvas.width = Math.round(r.width * Math.min(devicePixelRatio, 2)); canvas.height = Math.round(r.height * Math.min(devicePixelRatio, 2)); };
  let ultimo = -1;
  const desenha = (p: number) => {
    if (!nq || !ctx) return;
    const k = Math.min(nq - 1, Math.floor(p * nq));
    const im = frames[k];
    if (!im || !im.complete || k === ultimo) return;
    ultimo = k;
    if (!canvas.width) dimensiona();
    const cw = canvas.width, ch = canvas.height;
    const r = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
    const w = im.naturalWidth * r, hh = im.naturalHeight * r;
    ctx.drawImage(im, (cw - w) / 2, (ch - hh) / 2, w, hh);
  };
  addEventListener('resize', () => { if (nq) { dimensiona(); ultimo = -1; desenha(0); } });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + Math.round(innerHeight * (caps.length + 0.6)), pin: pin, scrub: 0.6, anticipatePin: 1, onUpdate: (st) => desenha(st.progress) },
  });
  if (!nq) tl.fromTo(img, { scale: 1.18, yPercent: -4 }, { scale: 1, yPercent: 2, ease: 'none', duration: caps.length + 0.6 }, 0);
  caps.forEach((c, k) => {
    tl.fromTo(c, { opacity: 0, y: 40, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' }, k + 0.15);
    if (k < caps.length - 1) tl.to(c, { opacity: 0, y: -30, filter: 'blur(6px)', duration: 0.3, ease: 'power2.in' }, k + 0.85);
  });
})();

/* ---------- cena 3D (carrega depois, só onde vale) ---------- */
(function tresD() {
  const box = document.querySelector<HTMLElement>('[data-cena3d]');
  if (!box || box.dataset.cena3d !== '1' || reduce || lite) return;
  const nav: any = navigator;
  const fraco = (nav.deviceMemory && nav.deviceMemory < 4) || (nav.hardwareConcurrency && nav.hardwareConcurrency < 4) || nav.connection?.saveData;
  const temWebGL = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })();
  if (fraco || !temWebGL) return;
  const io = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) return;
    io.disconnect();
    const ok = () => import('./cena3d').then((m) => m.montar(box, gsap, ScrollTrigger)).catch(() => {});
    if ('requestIdleCallback' in window) (window as any).requestIdleCallback(ok, { timeout: 2500 }); else setTimeout(ok, 600);
  }, { rootMargin: '600px' });
  io.observe(box);
})();

addEventListener('load', () => ScrollTrigger.refresh());
