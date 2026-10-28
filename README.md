# ai_site

Site de vendas de Lucas Rangel (`ai.rangeltech.net`). Astro estático, sem framework de UI, em português. Especificação: `personal-skills/spec_instagram/`.

## Rodar

```bash
npm install
npm run dev      # http://127.0.0.1:4321
npm run build    # gera dist/ (HTML, CSS e JS estáticos, para o nginx)
```

## Onde mexer

| O quê | Arquivo |
|---|---|
| Número do WhatsApp, mensagens por botão, vagas do mês, Umami, links | `src/data/config.ts` |
| Logos, 26 cards de projeto, FAQ, depoimentos | `src/data/content.ts` |
| Textos das seções | `src/pages/index.astro` |
| Páginas legais | `content/*.md` (viram `/privacidade`, `/termos`, `/reembolso`) |
| Paleta, tipografia, vidro, movimento | `src/styles/global.css` |
| Mapa de mentorados | `src/data/mentorados_ficticios.json` (**fictício**) e `src/components/BrazilMap.astro` |
| Comportamento (mapa, métricas, vidro, WhatsApp) | `src/scripts/site.ts` |

## Dados fictícios (decisão de Lucas, spec 4.9 e 4.12)

Os 3 depoimentos (`DEPOIMENTOS` em `content.ts`, marcados `ficticio: true`) e os 61 pontos do mapa são fictícios e estão no ar para revisão. Trocar pelos reais quando existirem.

## Métricas

Umami sem cookie e sem banner. Em `config.ts`, preencha `UMAMI.src` e `UMAMI.websiteId`. Eventos enviados: `clique` (por botão), `secao_vista` (tempo por seção), `rolagem` (25, 50, 75, 100%), `mapa_interacao`, `mapa_ponto`, `projetos_ver_todos`, `projetos_filtro`. Para ver no console sem Umami, abra a página com `?debug=1`.

## WhatsApp e origem

Cada botão abre `wa.me` com a mensagem do botão. Com `?utm_source=instagram`, a mensagem ganha " (vim pelo Instagram)".

## Deploy

Igual ao `luar_site`: contêiner nginx servindo `dist/`, Traefik com TLS, registro DNS `ai` em `terraform/dns.tf`, release lido pelo `release-intake` (repositório público). Ver spec 4.7.
