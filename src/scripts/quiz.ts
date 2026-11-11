// Quiz de qualificação (spec SITE_V2, seções 10 e 17.3). Uma pergunta por tela, contato antes do resultado,
// resultado calculado pelo back-end (com regra local de reserva, para nunca perder o lead se a API cair).

type Opc = { id: string; label: string; sub?: string; valor?: number };
type Dados = { quiz: any; checkout: string; numero: string; vagas: number; precos: { individual: number; acompanhamento: number } };
type Resp = Record<string, string>;

const dlg = document.querySelector<HTMLDialogElement>('[data-quiz-dialog]');
const dadosEl = document.getElementById('quiz-data');
if (dlg && dadosEl && typeof dlg.showModal === 'function') {
  const D: Dados = JSON.parse(dadosEl.textContent || '{}');
  const Q = D.quiz;
  const API: string = (window as any).__rt?.api || '';
  const body = dlg.querySelector<HTMLElement>('[data-quiz-body]')!;
  const bar = dlg.querySelector<HTMLElement>('[data-quiz-bar]')!;
  const stepEl = dlg.querySelector<HTMLElement>('[data-quiz-step]')!;
  const back = dlg.querySelector<HTMLButtonElement>('[data-quiz-back]')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const track = (nome: string, dados?: Record<string, string | number | boolean>) => {
    try { const u = (window as any).umami; if (u?.track) u.track(nome, dados); } catch {}
  };

  let resp: Resp = {};
  let token = '';
  let i = 0;
  let enviando = false;

  const salvar = () => { try { sessionStorage.setItem('rt_quiz', JSON.stringify({ resp, token, i })); } catch {} };
  const restaurar = () => { try { const s = JSON.parse(sessionStorage.getItem('rt_quiz') || 'null'); if (s) { resp = s.resp || {}; token = s.token || ''; i = s.i || 0; } } catch {} };

  const utm = () => {
    const q = new URLSearchParams(location.search);
    const o: Record<string, string> = {};
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) { const v = q.get(k) || sessionStorage.getItem(k) || ''; if (v) o[k] = v; }
    return o;
  };

  // ---------- telas ----------
  type Tela = { id: string; titulo: string | (() => string); sub?: string | (() => string); tipo: 'opcoes' | 'feedback' | 'contato' | 'texto' | 'formato' | 'resultado'; opcoes?: () => Opc[]; placeholder?: string; obrig?: boolean };
  const txt = (v: string | (() => string) | undefined) => (typeof v === 'function' ? v() : v || '');
  const empresa = () => resp.situacao === 'empresa';
  const TELAS: Tela[] = [
    { id: 'situacao', titulo: 'Me diz onde você está hoje.', tipo: 'opcoes', opcoes: () => Q.situacoes },
    { id: 'objetivo', titulo: 'O que você quer resolver?', tipo: 'opcoes', opcoes: () => (empresa() ? Q.objetivos.empresa : Q.objetivos.pessoa) },
    { id: 'feedback', titulo: '', tipo: 'feedback' },
    { id: 'contato', titulo: 'Para eu te responder, me diz quem você é.', sub: 'Eu mesmo leio cada resposta.', tipo: 'contato' },
    { id: 'problema', titulo: 'Em uma frase: qual é o problema, ou o que você quer construir?', sub: 'Pode ser do seu jeito. É isso que eu vou ler antes de falar com você.', tipo: 'texto', placeholder: 'Ex.: quero um sistema que responda os meus clientes no WhatsApp sozinho', obrig: true },
    { id: 'tentou', titulo: 'O que você já tentou e por que não deu certo?', sub: 'Curso, freelancer, fazer sozinho, ferramenta pronta...', tipo: 'texto', placeholder: 'Ex.: fiz dois cursos e travei na hora de colocar no ar' },
    { id: 'custo', titulo: () => (empresa() ? 'Quanto custa hoje a pessoa ou o processo que você quer automatizar?' : 'Quanto esse problema te custa por mês, ou te faz deixar de ganhar?'), sub: () => (empresa() ? 'Salário mais encargos, por mês. Um chute honesto basta.' : 'Um chute honesto basta.'), tipo: 'opcoes', opcoes: () => (empresa() ? Q.custoEmpresa : Q.custo) },
    { id: 'prazo', titulo: 'Quando você quer ter isso resolvido?', tipo: 'opcoes', opcoes: () => Q.prazo },
    { id: 'formato', titulo: 'Como você prefere que eu resolva com você?', tipo: 'formato', opcoes: () => Q.formato },
    { id: 'resultado', titulo: '', tipo: 'resultado' },
  ];
  const TELAS_EMPRESA: Tela[] = [
    TELAS[0], TELAS[1], TELAS[2], TELAS[3], TELAS[4],
    { id: 'porte', titulo: 'Quantas pessoas trabalham na empresa?', tipo: 'opcoes', opcoes: () => Q.porte },
    { id: 'decisor', titulo: 'Quem decide a contratação de um projeto assim?', tipo: 'opcoes', opcoes: () => Q.decisor },
    TELAS[6], TELAS[7], TELAS[9],
  ];
  const telas = () => (empresa() ? TELAS_EMPRESA : TELAS);
  const total = () => telas().length - 1; // a tela de resultado não conta na barra

  // ---------- API ----------
  const api = async (metodo: string, caminho: string, corpo?: any) => {
    if (!API) throw new Error('sem api');
    const r = await fetch(API + caminho, { method: metodo, headers: { 'content-type': 'application/json' }, body: corpo ? JSON.stringify(corpo) : undefined, credentials: 'omit' });
    if (!r.ok) throw new Error('api ' + r.status);
    return r.json();
  };
  const criarLead = async () => {
    const j = await api('POST', '/api/quiz', { situacao: resp.situacao, objetivo: resp.objetivo, nome: resp.nome, whatsapp: resp.whatsapp, email: resp.email, origem: utm(), site: '' });
    token = j.token; salvar();
  };
  const gravar = async (campos: Resp) => { if (token) try { await api('PATCH', `/api/quiz/${token}`, campos); } catch {} };

  // regra local de reserva (igual à 17.3), usada só se a API não responder
  const resultadoLocal = () => {
    if (empresa()) return { resultado: 'empresa', quente: resp.prazo !== 'pesquisando', destino: { tipo: 'whatsapp', url: waUrl() } };
    if (resp.prazo === 'pesquisando') return { resultado: 'frio', quente: false, destino: { tipo: 'obrigado', url: '' } };
    if (resp.formato === 'cara_a_cara' && (resp.prazo === 'semana' || resp.prazo === '30dias')) return { resultado: 'cara_a_cara', quente: true, destino: { tipo: 'whatsapp', url: waUrl() } };
    return { resultado: 'whatsapp', quente: resp.prazo !== '3meses', destino: { tipo: 'checkout', url: D.checkout } };
  };
  const waUrl = () => {
    const sit = (Q.situacoes as Opc[]).find((s) => s.id === resp.situacao)?.label || '';
    const txt = `Oi, Lucas! Sou ${resp.nome || ''}. ${sit}. Meu problema: ${resp.problema || ''}`;
    const insta = (sessionStorage.getItem('utm_source') || '').toLowerCase() === 'instagram' ? (window as any).__rt?.sufixo || '' : '';
    return `https://wa.me/${D.numero}?text=${encodeURIComponent(txt + insta)}`;
  };

  // ---------- render ----------
  const h = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
  const render = () => {
    const t = telas()[i];
    const n = Math.min(i + 1, total());
    bar.style.width = (t.tipo === 'resultado' ? 100 : (n / total()) * 100) + '%';
    stepEl.textContent = t.tipo === 'resultado' ? 'Pronto' : `${n} de ${total()}`;
    back.hidden = i === 0 || t.tipo === 'resultado';
    let html = '';
    if (t.tipo === 'opcoes') {
      html = `<h2 class="quiz__t display">${h(txt(t.titulo))}</h2>${txt(t.sub) ? `<p class="quiz__sub">${h(txt(t.sub))}</p>` : ''}<div class="quiz__opts">` +
        t.opcoes!().map((o) => `<button type="button" class="quiz__opt${resp[t.id] === o.id ? ' on' : ''}" data-opt="${o.id}"><b>${h(o.label)}</b>${o.sub ? `<span>${h(o.sub)}</span>` : ''}</button>`).join('') + '</div>';
    } else if (t.tipo === 'formato') {
      html = `<h2 class="quiz__t display">${h(txt(t.titulo))}</h2><div class="quiz__opts quiz__opts--2">` +
        t.opcoes!().map((o) => `<button type="button" class="quiz__opt quiz__opt--big${resp[t.id] === o.id ? ' on' : ''}" data-opt="${o.id}"><b>${h(o.label)}</b><span>${h(o.sub || '')}</span></button>`).join('') +
        `</div><label class="quiz__chk"><input type="checkbox" data-compromisso ${resp.compromisso === 'sim' ? 'checked' : ''}/><span>Se eu te mostrar o caminho, você está pronto para começar?</span></label>`;
    } else if (t.tipo === 'feedback') {
      const fb = Q.feedback[resp.situacao] || Q.feedback.empregado;
      html = `<p class="quiz__fb-tag">Entendi.</p><h2 class="quiz__t quiz__t--fb display">${h(fb)}</h2><button type="button" class="btn btn--hot btn--block" data-next>Continuar</button>`;
    } else if (t.tipo === 'contato') {
      html = `<h2 class="quiz__t display">${h(txt(t.titulo))}</h2><p class="quiz__sub">${h(txt(t.sub))}</p><form class="quiz__form" data-form novalidate>
        <label><span>Seu nome</span><input name="nome" autocomplete="name" required maxlength="80" value="${h(resp.nome || '')}" /></label>
        <label><span>Seu WhatsApp</span><input name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" required placeholder="(62) 9 9999-9999" value="${h(resp.whatsapp || '')}" /></label>
        <label><span>Seu e-mail</span><input name="email" type="email" inputmode="email" autocomplete="email" required placeholder="voce@email.com" value="${h(resp.email || '')}" /></label>
        <input class="quiz__hp" name="site" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <p class="quiz__err" data-err hidden></p>
        <button type="submit" class="btn btn--hot btn--block" data-submit>Continuar</button>
        <p class="quiz__lgpd">Ao continuar você aceita receber contato por WhatsApp e e-mail sobre esta conversa. <a href="/privacidade" target="_blank">Política de privacidade</a>.</p>
      </form>`;
    } else if (t.tipo === 'texto') {
      html = `<h2 class="quiz__t display">${h(txt(t.titulo))}</h2>${txt(t.sub) ? `<p class="quiz__sub">${h(txt(t.sub))}</p>` : ''}<form class="quiz__form" data-form novalidate>
        <textarea name="${t.id}" rows="4" maxlength="600" placeholder="${h(t.placeholder || '')}" ${t.obrig ? 'required' : ''}>${h(resp[t.id] || '')}</textarea>
        <p class="quiz__err" data-err hidden></p>
        <button type="submit" class="btn btn--hot btn--block" data-submit>Continuar</button>${t.obrig ? '' : '<button type="button" class="quiz__skip" data-skip>Pular</button>'}
      </form>`;
    } else {
      html = `<div class="quiz__wait"><i></i><p>Lendo as suas respostas…</p></div>`;
    }
    body.innerHTML = html;
    body.scrollTop = 0;
    if (!reduce) { body.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.16,1,.3,1)' }); }
    const foco = body.querySelector<HTMLElement>('input, textarea, button');
    if (foco && innerWidth > 720) foco.focus({ preventScroll: true });
    track('quiz_tela', { tela: t.id, n });
    if (t.tipo === 'resultado') concluir();
  };

  const ir = (delta: number) => { i = Math.max(0, Math.min(telas().length - 1, i + delta)); salvar(); render(); };

  const mostrarResultado = (r: any) => {
    const nome = (resp.nome || '').split(' ')[0];
    const brl = (v: number) => 'R$ ' + v.toLocaleString('pt-BR');
    const custo = ([...(Q.custo as Opc[]), ...(Q.custoEmpresa as Opc[])]).find((c) => c.id === resp.custo);
    let custoTxt = '';
    if (custo && custo.valor) {
      const mes = custo.valor, ano = mes * 12;
      if (empresa()) custoTxt = `Essa tarefa custa até <b>${brl(mes)} por mês</b>: <b>${brl(ano)} por ano</b>, todo ano. Um projeto de IA que custe menos que isso se paga no primeiro ano. Do segundo em diante, é só economia.`;
      else {
        const preco = r.resultado === 'cara_a_cara' ? D.precos.individual : D.precos.acompanhamento;
        const meses = Math.max(1, Math.ceil(preco / mes));
        custoTxt = `Isso está te custando até <b>${brl(mes)} por mês</b>, ou <b>${brl(ano)} por ano</b>. ${r.resultado === 'frio' ? '' : `Resolvido, a mentoria se paga em <b>${meses} ${meses === 1 ? 'mês' : 'meses'}</b>.`}`;
      }
    }
    const tipo = r.destino?.tipo;
    const url = r.destino?.url || '';
    const cab: Record<string, [string, string, string]> = {
      cara_a_cara: ['cara a cara', 'Marcar minha call de 30 minutos', 'Antes de qualquer pagamento, a gente conversa por vídeo: você me conta o problema, eu te mostro como trabalho e fechamos o escopo. Escolha um horário na minha agenda.'],
      whatsapp: ['pelo WhatsApp', 'Quero começar pelo WhatsApp', 'Você entra hoje, manda o problema e eu resolvo com você: conecto, subo e te mostro. Pix ou cartão em até 12 vezes. Garantia de 7 dias: não resolveu, devolvo.'],
      empresa: ['com um projeto para a sua empresa', 'Falar com o Lucas agora', 'Eu leio o que você escreveu e volto com o próximo passo. O escopo vai para o papel antes de começar.'],
      frio: ['no seu tempo', 'Entendi, me avisa quando for a hora', 'Sem pressa. Eu te mando por e-mail, nos próximos dias, o que eu faria no seu lugar. Quando quiser resolver, é só voltar aqui.'],
    };
    const [como, botao, expl] = cab[r.resultado] || cab.whatsapp;
    const acao = tipo === 'obrigado' ? `<button type="button" class="btn btn--hot btn--block" data-quiz-close>${botao}</button>` : `<a class="btn btn--hot btn--block" href="${h(url)}" ${tipo === 'whatsapp' ? 'target="_blank" rel="noopener"' : ''} data-track="quiz_${tipo}">${botao}</a>`;
    body.innerHTML = `<p class="quiz__fb-tag">${h(nome ? nome + ', pelo que você me contou:' : 'Pelo que você me contou:')}</p>
      <blockquote class="quiz__q">“${h(resp.problema || '')}”</blockquote>
      <p class="quiz__sub">${custoTxt}</p>
      <h2 class="quiz__t display">O melhor jeito de eu resolver isso com você é <em class="hot">${h(como)}.</em></h2>
      <p class="quiz__sub">${h(expl)}</p>${acao}
      <p class="quiz__lgpd">${tipo === 'checkout' ? 'Pagamento seguro. ' : ''}Garantia de 7 dias. ${r.quente ? 'Eu respondo rápido.' : ''}</p>`;
    track('quiz_resultado', { resultado: r.resultado, destino: tipo, quente: !!r.quente });
  };

  const concluir = async () => {
    if (enviando) return;
    enviando = true;
    let r: any;
    try {
      if (!token) await criarLead();
      await gravar({ problema: resp.problema, tentou: resp.tentou, custo_mes: resp.custo, prazo: resp.prazo, formato: resp.formato, compromisso: resp.compromisso, empresa: empresa() ? { porte: resp.porte, decisor: resp.decisor } : undefined });
      r = await api('POST', `/api/quiz/${token}/concluir`);
    } catch {
      r = resultadoLocal();
      track('quiz_api_falhou');
    }
    enviando = false;
    try { sessionStorage.removeItem('rt_quiz'); } catch {}
    mostrarResultado(r);
  };

  // ---------- eventos ----------
  body.addEventListener('click', async (e) => {
    const el = e.target as HTMLElement;
    const opt = el.closest<HTMLElement>('[data-opt]');
    const t = telas()[i];
    if (opt) {
      resp[t.id] = opt.dataset.opt!;
      body.querySelectorAll('.quiz__opt').forEach((b) => b.classList.toggle('on', b === opt));
      if (t.tipo === 'formato') { resp.compromisso = body.querySelector<HTMLInputElement>('[data-compromisso]')?.checked ? 'sim' : 'nao'; }
      if (t.id === 'situacao') { delete resp.objetivo; }
      if (token && t.id !== 'situacao' && t.id !== 'objetivo') gravar({ [t.id === 'custo' ? 'custo_mes' : t.id]: resp[t.id], compromisso: resp.compromisso });
      setTimeout(() => ir(1), reduce ? 0 : 160);
      return;
    }
    if (el.closest('[data-next]')) return ir(1);
    if (el.closest('[data-skip]')) { delete resp[t.id]; return ir(1); }
    if (el.closest('[data-quiz-close]')) return fechar();
  });
  body.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const err = form.querySelector<HTMLElement>('[data-err]')!;
    const t = telas()[i];
    const fd = new FormData(form);
    if (t.tipo === 'contato') {
      const nome = String(fd.get('nome') || '').trim();
      const wa = String(fd.get('whatsapp') || '').replace(/\D/g, '');
      const email = String(fd.get('email') || '').trim().toLowerCase();
      if (nome.length < 2) return erro(err, 'Me diz o seu nome.');
      if (wa.length < 10 || wa.length > 13) return erro(err, 'Esse WhatsApp não parece certo. Use DDD + número.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return erro(err, 'Esse e-mail não parece certo.');
      if (String(fd.get('site') || '')) return; // robô
      resp.nome = nome; resp.whatsapp = wa; resp.email = email;
      const btn = form.querySelector<HTMLButtonElement>('[data-submit]')!;
      btn.disabled = true; btn.textContent = 'Salvando…';
      try { if (!token) await criarLead(); } catch { track('quiz_api_falhou'); }
      btn.disabled = false;
      track('quiz_lead');
      return ir(1);
    }
    const v = String(fd.get(t.id) || '').trim();
    if (t.obrig && v.length < 8) return erro(err, 'Conta um pouco mais: é isso que eu vou ler.');
    resp[t.id] = v;
    gravar({ [t.id]: v });
    ir(1);
  });
  const erro = (el: HTMLElement, msg: string) => { el.textContent = msg; el.hidden = false; };
  back.addEventListener('click', () => ir(-1));
  dlg.querySelector('[data-quiz-close]')?.addEventListener('click', () => fechar());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) fechar(); });
  dlg.addEventListener('close', () => { document.documentElement.classList.remove('quiz-open'); track('quiz_fechou', { tela: telas()[i]?.id }); });

  const abrir = (pre: Resp = {}) => {
    restaurar();
    Object.assign(resp, pre);
    if (pre.situacao) i = Math.max(i, 1);
    if (telas()[i]?.tipo === 'resultado') i = 0;
    document.documentElement.classList.add('quiz-open');
    dlg.showModal();
    salvar();
    render();
    track('quiz_abriu', { situacao: resp.situacao || '', formato: resp.formato || '' });
  };
  const fechar = () => { salvar(); dlg.close(); };

  document.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-quiz]');
    if (!b) return;
    e.preventDefault();
    const pre: Resp = {};
    if (b.dataset.situacao) pre.situacao = b.dataset.situacao;
    if (b.dataset.formato) pre.formato = b.dataset.formato;
    abrir(pre);
  });

  // retomar pelo link do e-mail (?q=token)
  const q = new URLSearchParams(location.search).get('q');
  if (q) {
    api('GET', `/api/quiz/${q}`).then((j) => {
      token = q; resp = {}; for (const k of ['situacao','objetivo','nome','whatsapp','email','problema','tentou','prazo','formato','compromisso']) if (j[k]) resp[k] = j[k]; if (j.custo_mes) resp.custo = j.custo_mes; if (j.empresa_porte) resp.porte = j.empresa_porte; if (j.empresa_decisor) resp.decisor = j.empresa_decisor;
      const ts = telas();
      i = Math.max(1, ts.findIndex((t) => t.tipo !== 'feedback' && t.tipo !== 'resultado' && !resp[t.id]));
      if (i < 0) i = ts.length - 1;
      document.documentElement.classList.add('quiz-open'); dlg.showModal(); render();
      track('quiz_retomou');
    }).catch(() => abrir());
  }
}
