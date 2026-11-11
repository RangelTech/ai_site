// Cena 3D da seção "como funciona": a arquitetura (dados -> IA -> tela) se monta conforme a pessoa rola.
// Procedural, sem modelo externo (orçamento zero de download além da biblioteca). Pausa fora da tela.
import * as THREE from 'three';

export function montar(box: HTMLElement, gsap: any, ScrollTrigger: any) {
  const canvas = box.querySelector<HTMLCanvasElement>('[data-cena3d-canvas]')!;
  const poster = box.querySelector<HTMLElement>('[data-cena3d-poster]');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  cam.position.set(0, 1.6, 11);
  cam.lookAt(0, 0, 0);

  const AZUL = new THREE.Color('#5eb0ff');
  const CORAL = new THREE.Color('#FF4B32');
  scene.add(new THREE.AmbientLight('#8fb4ff', 0.5));
  const luz = new THREE.PointLight('#ffffff', 40, 40); luz.position.set(4, 6, 6); scene.add(luz);
  const luz2 = new THREE.PointLight(CORAL, 18, 30); luz2.position.set(0, -1, 4); scene.add(luz2);

  const grupo = new THREE.Group();
  scene.add(grupo);
  const pecas: { m: THREE.Object3D; alvo: THREE.Vector3; longe: THREE.Vector3; rot: THREE.Euler }[] = [];
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const add = (m: THREE.Object3D, x: number, y: number, z: number) => {
    m.position.set(x + rnd(-6, 6), y + rnd(-5, 5), z + rnd(-6, 2));
    m.rotation.set(rnd(-2, 2), rnd(-2, 2), rnd(-2, 2));
    pecas.push({ m, alvo: new THREE.Vector3(x, y, z), longe: m.position.clone(), rot: m.rotation.clone() });
    grupo.add(m);
  };

  // dados: grade de cubos à esquerda
  const matCubo = new THREE.MeshStandardMaterial({ color: '#0b1a36', emissive: AZUL, emissiveIntensity: 0.35, metalness: 0.4, roughness: 0.35 });
  const geoCubo = new THREE.BoxGeometry(0.42, 0.42, 0.42);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) add(new THREE.Mesh(geoCubo, matCubo), -4.4 + i * 0.6, -0.9 + j * 0.6, 0);
  // IA: núcleo coral com casca em arame
  const nucleo = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 2), new THREE.MeshStandardMaterial({ color: CORAL, emissive: CORAL, emissiveIntensity: 0.9, roughness: 0.3 }));
  add(nucleo, 0, 0, 0);
  const casca = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 1), new THREE.MeshBasicMaterial({ color: CORAL, wireframe: true, transparent: true, opacity: 0.45 }));
  add(casca, 0, 0, 0);
  const anel = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.03, 8, 80), new THREE.MeshBasicMaterial({ color: AZUL, transparent: true, opacity: 0.6 }));
  anel.rotation.x = Math.PI / 2.4; add(anel, 0, 0, 0); pecas[pecas.length - 1].rot.set(Math.PI / 2.4, 0, 0);
  // tela: placa à direita com "linhas de interface"
  const tela = new THREE.Group();
  tela.add(new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.9, 0.08), new THREE.MeshStandardMaterial({ color: '#0b1426', emissive: '#16315f', emissiveIntensity: 0.5, metalness: 0.3, roughness: 0.5 })));
  const linha = (w: number, y: number, cor: THREE.Color, op = 0.9) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.14, 0.02), new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: op })); m.position.set(-1.1 + w / 2, y, 0.06); tela.add(m); };
  linha(1.8, 0.55, AZUL, 0.8); linha(1.2, 0.2, AZUL, 0.5); linha(1.5, -0.15, AZUL, 0.5);
  const btn = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.34, 0.03), new THREE.MeshBasicMaterial({ color: CORAL })); btn.position.set(-0.55, -0.6, 0.06); tela.add(btn);
  add(tela, 4.2, 0, 0);
  // ligações: dados -> IA -> tela
  const ligMat = new THREE.LineDashedMaterial({ color: AZUL, dashSize: 0.18, gapSize: 0.12, transparent: true, opacity: 0.8 });
  const lig = (a: THREE.Vector3, b: THREE.Vector3) => { const g = new THREE.BufferGeometry().setFromPoints([a, b]); const l = new THREE.Line(g, ligMat); l.computeLineDistances(); grupo.add(l); return l; };
  const l1 = lig(new THREE.Vector3(-2.4, 0, 0), new THREE.Vector3(-1.5, 0, 0));
  const l2 = lig(new THREE.Vector3(1.5, 0, 0), new THREE.Vector3(2.8, 0, 0));
  const ligacoes = [l1, l2];
  ligacoes.forEach((l) => (l.visible = false));

  // partículas de fundo
  const pg = new THREE.BufferGeometry();
  const N = 160; const pos = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i++) pos[i] = rnd(-9, 9);
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: AZUL, size: 0.05, transparent: true, opacity: 0.55 }));
  scene.add(pts);

  const prog = { p: 0 };
  const aplica = () => {
    const e = prog.p;
    for (const pc of pecas) {
      const t = THREE.MathUtils.smoothstep(e, 0.05, 0.9);
      pc.m.position.lerpVectors(pc.longe, pc.alvo, t);
      pc.m.rotation.set(pc.rot.x * (1 - t) + (pc.m === anel ? Math.PI / 2.4 : 0) * t, pc.rot.y * (1 - t), pc.rot.z * (1 - t));
    }
    ligacoes.forEach((l) => (l.visible = e > 0.85));
  };
  const st = ScrollTrigger.create({ trigger: box, start: 'top 85%', end: 'bottom 45%', scrub: 0.8, onUpdate: (s: any) => { prog.p = s.progress; aplica(); } });

  const resize = () => { const r = box.getBoundingClientRect(); const w = Math.max(1, r.width), h = Math.max(1, r.height); renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  resize();
  addEventListener('resize', resize);
  canvas.hidden = false;
  if (poster) gsap.to(poster, { opacity: 0, duration: 0.6, onComplete: () => (poster.style.display = 'none') });

  let vivo = true, rodando = true;
  const io = new IntersectionObserver(([en]) => { rodando = en.isIntersecting; if (rodando) loop(performance.now()); }, { rootMargin: '200px' });
  io.observe(box);
  let mx = 0, my = 0;
  addEventListener('pointermove', (e) => { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });
  const loop = (t: number) => {
    if (!vivo || !rodando || document.hidden) return;
    const s = t / 1000;
    casca.rotation.y = s * 0.35; casca.rotation.x = s * 0.2;
    nucleo.rotation.y = -s * 0.5;
    anel.rotation.z = s * 0.25;
    (nucleo.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8 + Math.sin(s * 2.2) * 0.25;
    pts.rotation.y = s * 0.02;
    grupo.rotation.y += (mx * 0.18 - grupo.rotation.y) * 0.04;
    grupo.rotation.x += (my * 0.1 - grupo.rotation.x) * 0.04;
    renderer.render(scene, cam);
    requestAnimationFrame(loop);
  };
  document.addEventListener('visibilitychange', () => !document.hidden && rodando && loop(performance.now()));
  loop(performance.now());
  addEventListener('pagehide', () => { vivo = false; st.kill(); renderer.dispose(); });
}
