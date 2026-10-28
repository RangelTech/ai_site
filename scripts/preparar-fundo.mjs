// Reduz uma foto para servir de fundo (fica desfocada no site, então 960 px sobram).
// Uso: node scripts/preparar-fundo.mjs <foto> <saida.webp>
import sharp from 'sharp';

const [entrada, saida] = process.argv.slice(2);
if (!entrada || !saida) throw new Error('uso: node scripts/preparar-fundo.mjs <foto> <saida.webp>');
const info = await sharp(entrada).resize({ width: 960 }).webp({ quality: 55 }).toFile(saida);
console.log(saida, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`);
