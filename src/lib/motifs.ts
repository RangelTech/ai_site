import type { Motif } from '../data/content';

// Ilustrações dos cards: telas de produto desenhadas em SVG (nenhuma tela de cliente).
// Troque por prints reais quando existirem: basta apontar o `motif` do projeto para uma imagem em /public/img.
const C = { bg: '#071226', bar: '#0d1c3a', ln: '#27457a', tx: '#9db4d6', hi: '#5cc8ff', hi2: '#8ad9ff', am: '#f2b84b', ok: '#52e0a1', rd: '#ff6b7a' };
const t = (x: number, y: number, s: string, size = 9, fill = C.tx, w = 500) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" fill="${fill}" font-family="Inter,system-ui,sans-serif">${s}</text>`;
const win = (titulo: string, inner: string) => `<svg viewBox="0 0 400 200" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
  <rect width="400" height="200" fill="${C.bg}"/><rect width="400" height="22" fill="${C.bar}"/>
  <circle cx="12" cy="11" r="3.2" fill="#ff6b6b" opacity=".8"/><circle cx="24" cy="11" r="3.2" fill="${C.am}" opacity=".8"/><circle cx="36" cy="11" r="3.2" fill="${C.ok}" opacity=".8"/>
  ${t(52, 14.5, titulo, 8.5, C.tx)}${inner}</svg>`;
const bars = (x: number, y: number, hs: number[], w = 14, gap = 8, fill = C.hi) => hs.map((h, i) => `<rect x="${x + i * (w + gap)}" y="${y - h}" width="${w}" height="${h}" rx="3" fill="${fill}" opacity="${0.45 + (i / hs.length) * 0.55}"/>`).join('');
const card = (x: number, y: number, w: number, h: number) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#0d1f42" stroke="${C.ln}" stroke-width=".8"/>`;

export const MOTIFS: Record<Motif, string> = {
  dash: win('Painel de vendas · Metabase', `
    ${card(14, 32, 114, 42)}${t(24, 48, 'Receita do mês', 8)}${t(24, 66, 'R$ 1,84 mi', 16, '#fff', 700)}${t(96, 66, '+12%', 9, C.ok, 700)}
    ${card(143, 32, 114, 42)}${t(153, 48, 'Clientes ativos', 8)}${t(153, 66, '4.208', 16, '#fff', 700)}${t(214, 66, '+5%', 9, C.ok, 700)}
    ${card(272, 32, 114, 42)}${t(282, 48, 'Ticket médio', 8)}${t(282, 66, 'R$ 437', 16, '#fff', 700)}${t(344, 66, '-2%', 9, C.rd, 700)}
    ${card(14, 84, 236, 104)}${t(24, 100, 'Vendas por semana', 8.5, '#cfe0f7', 600)}${bars(28, 176, [30, 42, 36, 58, 50, 70, 64, 82], 18, 8)}
    ${card(262, 84, 124, 104)}${t(272, 100, 'Por canal', 8.5, '#cfe0f7', 600)}
    <circle cx="324" cy="144" r="26" fill="none" stroke="${C.hi}" stroke-width="12" stroke-dasharray="90 164" transform="rotate(-90 324 144)"/><circle cx="324" cy="144" r="26" fill="none" stroke="${C.am}" stroke-width="12" stroke-dasharray="44 164" stroke-dashoffset="-90" transform="rotate(-90 324 144)"/><circle cx="324" cy="144" r="26" fill="none" stroke="${C.ok}" stroke-width="12" stroke-dasharray="30 164" stroke-dashoffset="-134" transform="rotate(-90 324 144)"/>`),

  rag: win('Agente · documentos da empresa', `
    <rect x="150" y="34" width="236" height="26" rx="10" fill="${C.hi}" opacity=".9"/>${t(160, 51, 'Qual o prazo de entrega do contrato 214?', 9, '#04121f', 600)}
    <rect x="14" y="70" width="270" height="66" rx="10" fill="#0d1f42" stroke="${C.ln}" stroke-width=".8"/>
    ${t(24, 86, 'O prazo é de 45 dias corridos após a', 9, '#e8eef8')}${t(24, 99, 'assinatura, com multa de 2% ao mês de atraso.', 9, '#e8eef8')}
    <rect x="24" y="110" width="104" height="18" rx="9" fill="rgba(92,200,255,.14)" stroke="${C.hi}" stroke-width=".7"/>${t(33, 122, 'contrato_214.pdf · p. 7', 7.5, C.hi2, 600)}
    <rect x="134" y="110" width="82" height="18" rx="9" fill="rgba(92,200,255,.14)" stroke="${C.hi}" stroke-width=".7"/>${t(143, 122, 'aditivo_02.docx', 7.5, C.hi2, 600)}
    <rect x="14" y="152" width="372" height="32" rx="16" fill="#0d1f42" stroke="${C.ln}" stroke-width=".8"/>${t(30, 172, 'Pergunte sobre os seus documentos…', 9, '#6b82a6')}
    <circle cx="368" cy="168" r="11" fill="${C.hi}"/><path d="M363 168h10m-4-4 4 4-4 4" stroke="#04121f" stroke-width="1.8" fill="none" stroke-linecap="round"/>`),

  agents: win('Plataforma de agentes', `
    <g stroke="${C.ln}" stroke-width="1.2" fill="none"><path d="M118 74 200 112M118 150 200 112M282 74 200 112M282 150 200 112"/></g>
    <circle cx="200" cy="112" r="26" fill="#0d1f42" stroke="${C.hi}" stroke-width="1.6"/>${t(181, 115, 'Supervisor', 8.5, '#fff', 700)}
    <rect x="62" y="56" width="112" height="34" rx="9" fill="#0d1f42" stroke="${C.ln}"/><circle cx="76" cy="73" r="5" fill="${C.ok}"/>${t(88, 71, 'Agente Vendas', 8.5, '#e8eef8', 600)}${t(88, 82, 'CRM · e-mail', 7.5)}
    <rect x="226" y="56" width="112" height="34" rx="9" fill="#0d1f42" stroke="${C.ln}"/><circle cx="240" cy="73" r="5" fill="${C.ok}"/>${t(252, 71, 'Agente Dados', 8.5, '#e8eef8', 600)}${t(252, 82, 'SQL · painéis', 7.5)}
    <rect x="62" y="134" width="112" height="34" rx="9" fill="#0d1f42" stroke="${C.ln}"/><circle cx="76" cy="151" r="5" fill="${C.am}"/>${t(88, 149, 'Agente Suporte', 8.5, '#e8eef8', 600)}${t(88, 160, 'WhatsApp', 7.5)}
    <rect x="226" y="134" width="112" height="34" rx="9" fill="#0d1f42" stroke="${C.ln}"/><circle cx="240" cy="151" r="5" fill="${C.ok}"/>${t(252, 149, 'Agente Finanças', 8.5, '#e8eef8', 600)}${t(252, 160, 'ERP · boletos', 7.5)}
    ${t(14, 36, 'Fila de tarefas', 8.5, '#cfe0f7', 600)}${t(300, 36, '4 agentes ativos', 8.5, C.ok, 600)}${t(14, 192, 'Supervisor distribuiu 12 tarefas nos últimos 5 min', 8)}`),

  vision: `<svg viewBox="0 0 400 200" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="vz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16315f"/><stop offset="1" stop-color="#0a1428"/></linearGradient></defs>
    <rect width="400" height="200" fill="url(#vz)"/><path d="M0 128h400v72H0z" fill="#0c172b"/><path d="M0 128 140 112h120l140 16" fill="#122342"/>
    <path d="M60 200 170 128M340 200 230 128" stroke="#26406c" stroke-width="2"/>
    <rect x="60" y="82" width="22" height="48" rx="8" fill="#2a4a80"/><rect x="62" y="70" width="16" height="16" rx="8" fill="#3a5c96"/>
    <rect x="150" y="96" width="46" height="26" rx="6" fill="#2a4a80"/><rect x="156" y="90" width="28" height="12" rx="4" fill="#35588f"/>
    <rect x="290" y="76" width="22" height="52" rx="8" fill="#2a4a80"/><rect x="292" y="64" width="16" height="16" rx="8" fill="#3a5c96"/>
    <g fill="none" stroke-width="1.6"><rect x="52" y="62" width="38" height="72" rx="3" stroke="${C.ok}"/><rect x="144" y="86" width="58" height="42" rx="3" stroke="${C.hi}"/><rect x="282" y="56" width="38" height="76" rx="3" stroke="${C.ok}"/></g>
    <rect x="52" y="50" width="62" height="12" rx="3" fill="${C.ok}"/>${t(56, 59, 'pessoa 0.97', 7.5, '#04121f', 700)}
    <rect x="144" y="74" width="58" height="12" rx="3" fill="${C.hi}"/>${t(148, 83, 'carro 0.93', 7.5, '#04121f', 700)}
    <rect x="282" y="44" width="66" height="12" rx="3" fill="${C.ok}"/>${t(286, 53, 'pessoa 0.95', 7.5, '#04121f', 700)}
    <rect x="10" y="10" width="112" height="22" rx="6" fill="rgba(5,8,15,.7)"/><circle cx="21" cy="21" r="3.5" fill="${C.rd}"/>${t(30, 24, 'CAM 03 · AO VIVO', 8, '#fff', 700)}
    <rect x="300" y="10" width="90" height="22" rx="6" fill="rgba(5,8,15,.7)"/>${t(308, 24, '28 FPS · 3 objetos', 8, C.hi2, 600)}</svg>`,

  sensor: `<svg viewBox="0 0 400 200" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="200" fill="#08142b"/>
    <g stroke="#17315f" stroke-width=".6"><path d="M0 40h400M0 80h400M0 120h400M0 160h400M50 0v200M100 0v200M150 0v200M200 0v200M250 0v200M300 0v200M350 0v200"/></g>
    ${t(14, 20, 'DATASHEET · SENSOR DE TEMPERATURA E UMIDADE', 8.5, '#cfe0f7', 700)}
    <rect x="62" y="62" width="112" height="82" rx="6" fill="#0f2a55" stroke="${C.hi}" stroke-width="1.4"/><rect x="82" y="80" width="40" height="40" rx="3" fill="#06122a" stroke="${C.hi2}"/><circle cx="148" cy="86" r="6" fill="none" stroke="${C.am}" stroke-width="1.4"/>
    <g stroke="${C.hi2}" stroke-width="2"><path d="M74 144v14M92 144v14M110 144v14M128 144v14M146 144v14M164 144v14"/></g>
    <g stroke="${C.am}" stroke-width=".9" fill="none"><path d="M62 52h112M62 48v8M174 48v8"/><path d="M190 62v82M186 62h8M186 144h8"/></g>
    ${t(100, 46, '12,0 mm', 8, C.am, 600)}${t(196, 106, '9,5', 8, C.am, 600)}
    <rect x="232" y="42" width="156" height="14" fill="#0d1f42"/>${t(238, 52, 'Parâmetro', 7.5, '#cfe0f7', 600)}${t(318, 52, 'Valor', 7.5, '#cfe0f7', 600)}
    ${[['Faixa de temp.', '-40 a 125 °C'], ['Precisão', '± 0,3 °C'], ['Umidade', '0 a 100 %'], ['Tensão', '1,8 a 3,6 V'], ['Interface', 'I²C · SPI']].map((r, i) => `${t(238, 70 + i * 17, r[0], 8)}${t(318, 70 + i * 17, r[1], 8, '#fff', 600)}<path d="M232 ${76 + i * 17}h156" stroke="#17315f" stroke-width=".7"/>`).join('')}
    <path d="M232 168c14-22 22 14 38-6s24 12 40-8 26 6 40-10" stroke="${C.ok}" stroke-width="1.6" fill="none"/>${t(232, 190, 'Leitura ao vivo · 24,6 °C', 8, C.ok, 600)}</svg>`,

  mesh: win('Reconstrução 3D · da foto ao modelo', `
    <rect x="14" y="32" width="86" height="156" rx="8" fill="#0d1f42" stroke="${C.ln}" stroke-width=".8"/>
    ${[0, 1, 2].map((i) => `<rect x="22" y="${40 + i * 49}" width="70" height="42" rx="5" fill="${['#1b3b72', '#244b8a', '#1b3b72'][i]}"/><circle cx="${42 + i * 10}" cy="${58 + i * 49}" r="9" fill="#35588f"/><path d="M22 ${82 + i * 49} 50 ${66 + i * 49} 92 ${82 + i * 49}" fill="#102a55"/>`).join('')}
    <g transform="translate(250 110)" stroke="${C.hi}" stroke-width="1" fill="none" opacity=".95">
      <path d="M-86 24 0 62 86 24 0-14Z"/><path d="M-86 24v-52L0-66 86-28v52M0-14v-52M-86-28 0-14 86-28"/><path d="M0 62V-14M-43 43V-21M43 43V-21M-43-3 43-3M-86 24l86-38M86 24 0-14"/>
      <path d="M-40-40 0-54 40-40 0-26Z" stroke="${C.hi2}"/><path d="M-50 30 0 48 50 30" stroke="${C.hi2}"/>
    </g>
    <g fill="${C.hi2}"><circle cx="250" cy="48" r="2.4"/><circle cx="164" cy="82" r="2.4"/><circle cx="336" cy="82" r="2.4"/><circle cx="250" cy="172" r="2.4"/><circle cx="164" cy="134" r="2.4"/><circle cx="336" cy="134" r="2.4"/></g>
    ${t(116, 36, 'Malha · 48.210 faces', 8.5, '#cfe0f7', 600)}${t(300, 188, 'Gêmeo digital', 8.5, C.ok, 600)}`),

  chip: win('Cluster multi-GPU · 8 placas', `
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const x = 14 + (i % 4) * 94; const y = 32 + Math.floor(i / 4) * 78; const u = [92, 88, 95, 71, 97, 84, 90, 76][i]; return `<rect x="${x}" y="${y}" width="86" height="70" rx="8" fill="#0d1f42" stroke="${C.ln}" stroke-width=".8"/>${t(x + 8, y + 15, 'GPU ' + i, 8.5, '#cfe0f7', 700)}${t(x + 52, y + 15, (58 + i * 3) + ' °C', 7.5, C.am, 600)}<rect x="${x + 8}" y="${y + 28}" width="70" height="8" rx="4" fill="#06122a"/><rect x="${x + 8}" y="${y + 28}" width="${(70 * u) / 100}" height="8" rx="4" fill="${C.hi}"/>${t(x + 8, y + 52, 'uso ' + u + '%', 8, '#fff', 600)}${t(x + 8, y + 63, (18 + (i % 3)) + ' / 24 GB', 7.5)}`; }).join('')}`),

  wave: win('Voz · clonagem em tempo real', `
    ${t(14, 40, 'Entrada (microfone)', 8.5, '#cfe0f7', 600)}
    <path d="M14 66h12M30 54v24M38 46v40M46 58v16M54 40v52M62 56v20M70 48v36M78 60v12M86 42v48M94 54v24M102 62v8M110 50v32M118 58v16M126 66h14" stroke="${C.tx}" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M150 66h20m-6-6 6 6-6 6" stroke="${C.hi}" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${t(186, 40, 'Saída (voz clonada)', 8.5, C.hi2, 600)}
    <path d="M186 66h12M202 54v24M210 44v44M218 58v16M226 38v56M234 56v20M242 46v40M250 60v12M258 40v52M266 54v24M274 62v8M282 48v36M290 58v16M298 66h14" stroke="${C.hi}" stroke-width="3" stroke-linecap="round" fill="none"/>
    ${t(14, 118, 'Espectrograma', 8.5, '#cfe0f7', 600)}
    ${Array.from({ length: 34 }, (_, i) => Array.from({ length: 7 }, (_, j) => `<rect x="${14 + i * 11}" y="${126 + j * 9}" width="9" height="7" rx="1.5" fill="${j < 3 ? C.hi : C.am}" opacity="${(0.12 + 0.88 * Math.abs(Math.sin(i * 0.9 + j * 1.7))) * (1 - j * 0.11)}"/>`).join('')).join('')}`),

  code: win('agente.py · correção sugerida', `
    ${[['1', '', 'def calcula_total(itens):'], ['2', '-', '    total = sum(i.preco for i in itens)'], ['3', '+', '    total = sum(i.preco * i.qtd for i in itens)'], ['4', '', '    return round(total, 2)'], ['5', '', ''], ['6', '', 'def aplica_desconto(total, pct):'], ['7', '-', '    return total - pct'], ['8', '+', '    return total * (1 - pct / 100)']].map((l, i) => `<rect x="0" y="${30 + i * 18}" width="400" height="18" fill="${l[1] === '-' ? 'rgba(255,107,122,.16)' : l[1] === '+' ? 'rgba(82,224,161,.16)' : 'transparent'}"/>${t(10, 43 + i * 18, l[0], 8, '#4d6690')}${t(28, 43 + i * 18, l[1] || ' ', 9, l[1] === '-' ? C.rd : C.ok, 700)}${t(42, 43 + i * 18, l[2].replace(/</g, '&lt;'), 9, l[1] === '-' ? '#ffb0b8' : l[1] === '+' ? '#a8f0cf' : '#cfe0f7', 500)}`).join('')}
    <rect x="14" y="178" width="150" height="16" rx="8" fill="rgba(92,200,255,.16)" stroke="${C.hi}" stroke-width=".7"/>${t(24, 189, 'Correção aberta · aguarda revisão', 7.5, C.hi2, 600)}`),

  flow: win('Fluxo de automação', `
    ${[[22, 44, 'Gatilho', 'Novo pedido', C.ok], [150, 44, 'Navegador', 'Consulta site', C.hi], [278, 44, 'IA', 'Classifica', C.am], [86, 120, 'Planilha', 'Registra', C.hi], [214, 120, 'WhatsApp', 'Avisa o cliente', C.ok]].map((n) => `<rect x="${n[0]}" y="${n[1]}" width="104" height="50" rx="10" fill="#0d1f42" stroke="${n[4]}" stroke-width="1.1"/><circle cx="${Number(n[0]) + 14}" cy="${Number(n[1]) + 16}" r="4" fill="${n[4]}"/>${t(Number(n[0]) + 24, Number(n[1]) + 19, String(n[2]), 9, '#fff', 700)}${t(Number(n[0]) + 12, Number(n[1]) + 38, String(n[3]), 8)}`).join('')}
    <g stroke="${C.hi}" stroke-width="1.4" fill="none" stroke-linecap="round"><path d="M126 69h24M254 69h24M330 94c0 10-60 8-60 26M278 78 190 120M138 94c0 8 0 14-4 26M190 145h24" opacity=".8"/></g>`),

  erp: win('ERP · pedidos', `
    <rect x="0" y="22" width="70" height="178" fill="#0a1a36"/>${['Início', 'Pedidos', 'Estoque', 'Financeiro', 'Clientes'].map((s, i) => `${i === 1 ? `<rect x="6" y="${40 + i * 24 - 10}" width="58" height="20" rx="6" fill="rgba(92,200,255,.18)"/>` : ''}${t(14, 44 + i * 24, s, 8.5, i === 1 ? '#fff' : C.tx, i === 1 ? 700 : 500)}`).join('')}
    ${t(84, 40, 'Pedidos recentes', 10, '#fff', 700)}<rect x="318" y="28" width="68" height="18" rx="9" fill="${C.hi}"/>${t(328, 40, '+ Novo pedido', 7.5, '#04121f', 700)}
    <rect x="84" y="54" width="302" height="16" fill="#0d1f42"/>${t(92, 65, 'Nº', 7.5, '#cfe0f7', 600)}${t(124, 65, 'Cliente', 7.5, '#cfe0f7', 600)}${t(232, 65, 'Valor', 7.5, '#cfe0f7', 600)}${t(320, 65, 'Status', 7.5, '#cfe0f7', 600)}
    ${[['1042', 'Mercado Aurora', 'R$ 4.820', 'Pago', C.ok], ['1041', 'Clínica Vida', 'R$ 1.290', 'Aberto', C.am], ['1040', 'Auto Peças Sul', 'R$ 9.350', 'Pago', C.ok], ['1039', 'Escola Nova', 'R$ 2.710', 'Enviado', C.hi], ['1038', 'Rede Farma', 'R$ 6.040', 'Pago', C.ok]].map((r, i) => `${t(92, 87 + i * 20, r[0], 8.5)}${t(124, 87 + i * 20, r[1], 8.5, '#e8eef8')}${t(232, 87 + i * 20, r[2], 8.5, '#fff', 600)}<rect x="316" y="${77 + i * 20}" width="44" height="14" rx="7" fill="${r[4]}" opacity=".2"/>${t(324, 87 + i * 20, r[3], 7.5, r[4], 700)}<path d="M84 ${94 + i * 20}h302" stroke="#17315f" stroke-width=".6"/>`).join('')}`),
};
