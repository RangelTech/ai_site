// Dados de prova (mapa, números, depoimentos, logos) lidos NO BUILD do back-end (GET /api/prova).
// Nenhum arquivo de dados mora neste repositório. Se a API falhar, o build falha de propósito.
// Para construir sem rede (desenvolvimento), aponte PROVA_LOCAL para um arquivo JSON fora do repositório.
import { readFileSync } from 'node:fs';
import { API } from '../data/config';

export interface Ponto { uf: string; cidade: string; lat: number; lon: number; tipo: 'mentorado' | 'empresa'; regiao?: string }
export interface Depoimento { nome: string; cargo: string; texto: string; foto?: string }
export interface Logo { nome: string; arquivo: string; altura?: number }
export interface Prova { mapa: Ponto[]; numeros: { mentorados: number; estados: number; empresas: number }; depoimentos: Depoimento[]; logos: Logo[] }

function completa(p: Partial<Prova>): Prova {
  const mapa = (p.mapa || []) as Ponto[];
  const ment = mapa.filter((x) => x.tipo === 'mentorado');
  return {
    mapa,
    depoimentos: p.depoimentos || [],
    logos: p.logos || [],
    numeros: p.numeros || { mentorados: ment.length, estados: new Set(ment.map((x) => x.uf)).size, empresas: mapa.length - ment.length },
  };
}

export async function carregarProva(): Promise<Prova> {
  const local = process.env.PROVA_LOCAL;
  if (local) return completa(JSON.parse(readFileSync(local, 'utf-8')));
  const url = (process.env.PROVA_URL || API.base) + '/api/prova';
  const r = await fetch(url, { headers: { accept: 'application/json' } });
  if (!r.ok) throw new Error(`prova: ${url} respondeu ${r.status}`);
  const j = await r.json();
  if (!Array.isArray(j.mapa) || !j.mapa.length) throw new Error('prova: resposta sem mapa');
  return completa(j);
}
