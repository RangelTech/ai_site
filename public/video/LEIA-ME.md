# Vídeo de "quem sou eu"

Até o vídeo chegar, a cena usa as fotos (`src/assets/lucas.jpg`). Quando o Lucas gravar (30 a 60 s, 4K, horizontal e vertical, fundo limpo):

1. Colocar o bruto fora do repositório e gerar, no Docker (ffmpeg), sem instalar nada no PC:

```
# reprodução normal (1080p, com áudio), para o botão "assistir"
ffmpeg -i bruto.mp4 -vf scale=-2:1080 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -movflags +faststart quem-sou-eu.mp4
# sequência esfregada pela rolagem: 120 quadros de 1280 px (desktop) e 60 de 720 px (celular), WebP
ffmpeg -i bruto.mp4 -t 15 -vf "fps=8,scale=1280:-2" -c:v libwebp -q:v 72 quadros/desk/%04d.webp
ffmpeg -i bruto-vertical.mp4 -t 15 -vf "fps=4,scale=720:-2" -c:v libwebp -q:v 70 quadros/mob/%04d.webp
```

2. Em `src/data/config.ts`, `VIDEO.quadros` = número de quadros de `desk` (os de `mob` são a metade) e `VIDEO.mp4 = '/video/quem-sou-eu.mp4'`.
3. Orçamento: primeira visita até 2,5 MB somando vídeo e quadros; o restante carrega sob demanda.
