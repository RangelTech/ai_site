import type { Motif } from '../data/content';

// Ilustrações em SVG feitas para os cards ("esquema de referência"): nenhuma tela de cliente.
// Cada uma tem 400 x 150 e usa só as classes .draw, .soft e .amb.
export const MOTIFS: Record<Motif, string> = {
  agents: `<svg viewBox="0 0 400 150" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <g class="draw soft"><path d="M200 75 90 36M200 75 90 114M200 75 310 36M200 75 310 114M200 75 200 18M200 75 200 132"/></g>
    <g class="draw"><circle cx="200" cy="75" r="22"/><circle cx="200" cy="75" r="8" class="amb"/><circle cx="90" cy="36" r="12"/><circle cx="90" cy="114" r="12"/><circle cx="310" cy="36" r="12"/><circle cx="310" cy="114" r="12"/><circle cx="200" cy="18" r="9"/><circle cx="200" cy="132" r="9"/></g>
  </svg>`,
  data: `<svg viewBox="0 0 400 150" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <g class="draw soft"><path d="M40 120h320M40 90h320M40 60h320M40 30h320"/></g>
    <g class="draw"><path d="M50 112c40-8 52-52 92-48s52 30 92 8 54-52 94-44 36 26 24 22"/></g>
    <g class="draw amb"><path d="M50 128c40-4 52-22 92-20s52 12 92 2 54-22 94-18"/></g>
    <g class="draw"><circle cx="142" cy="64" r="5"/><circle cx="234" cy="72" r="5"/><circle cx="328" cy="28" r="5"/></g>
  </svg>`,
  vision: `<svg viewBox="0 0 400 150" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <g class="draw soft"><path d="M20 130 380 130"/><path d="M60 130 130 80M130 80 200 130M200 130 270 70M270 70 340 130"/></g>
    <g class="draw"><path d="M120 30h-24v24M120 120h-24V96M290 30h24v24M290 120h24V96"/><rect x="132" y="48" width="64" height="72" rx="6"/></g>
    <g class="draw amb"><path d="M222 56h58v52h-58z"/></g>
    <g class="draw"><circle cx="164" cy="42" r="3"/></g>
  </svg>`,
  chip: `<svg viewBox="0 0 400 150" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <g class="draw soft"><path d="M150 18v22M180 18v22M210 18v22M240 18v22M150 110v22M180 110v22M210 110v22M240 110v22M110 50h22M110 75h22M110 100h22M268 50h22M268 75h22M268 100h22"/></g>
    <g class="draw"><rect x="132" y="40" width="136" height="70" rx="12"/><path d="M168 62h64v26h-64z"/></g>
    <g class="draw amb"><path d="M180 75h40"/></g>
  </svg>`,
  wave: `<svg viewBox="0 0 400 150" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <g class="draw"><path d="M30 75h30M70 50v50M86 30v90M102 58v34M118 40v70M134 62v26M150 20v110M166 46v58M182 64v22M198 34v82M214 56v38M230 24v102M246 52v46M262 66v18M278 38v74M294 58v34M310 46v58M326 66v18M342 70v10M358 75h12"/></g>
    <g class="draw amb"><path d="M150 20v110M230 24v102"/></g>
  </svg>`,
  sensor: `<svg viewBox="0 0 400 150" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <g class="draw"><rect x="28" y="52" width="60" height="46" rx="8"/><rect x="170" y="38" width="62" height="74" rx="10"/><rect x="312" y="52" width="60" height="46" rx="8"/></g>
    <g class="draw soft"><path d="M88 75h82M232 75h80"/><path d="M104 62l10 13-10 13M262 62l10 13-10 13" class="amb"/></g>
    <g class="draw amb"><path d="M190 62h22M190 76h22M190 90h14"/></g>
  </svg>`,
  code: `<svg viewBox="0 0 400 150" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <g class="draw"><rect x="60" y="24" width="280" height="102" rx="14"/><path d="M60 50h280"/></g>
    <g class="draw soft"><circle cx="82" cy="37" r="3.5"/><circle cx="98" cy="37" r="3.5"/><circle cx="114" cy="37" r="3.5"/></g>
    <g class="draw"><path d="M92 78l-16 12 16 12M230 78l16 12-16 12"/></g>
    <g class="draw amb"><path d="M184 70l-20 40M196 70l-8 40" /></g>
    <g class="draw soft"><path d="M130 66h44M130 84h70M130 102h30"/></g>
  </svg>`,
  flow: `<svg viewBox="0 0 400 150" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <g class="draw"><rect x="28" y="56" width="64" height="38" rx="10"/><rect x="168" y="22" width="64" height="38" rx="10"/><rect x="168" y="90" width="64" height="38" rx="10"/><rect x="308" y="56" width="64" height="38" rx="10"/></g>
    <g class="draw soft"><path d="M92 75h30c14 0 18-34 46-34M92 75h30c14 0 18 34 46 34M232 41c28 0 32 34 46 34h30M232 109c28 0 32-34 46-34h30"/></g>
    <g class="draw amb"><circle cx="200" cy="41" r="4"/><circle cx="200" cy="109" r="4"/></g>
  </svg>`,
};
