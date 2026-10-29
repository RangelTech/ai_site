// Regra fixa de escassez, igual todo mês: o mês é dividido em três partes e as vagas
// "sobrando" caem de uma parte para a outra. O bônus vale sempre até o último dia do mês atual.
// Usado no build (valor inicial do HTML) e no navegador (valor do dia de quem está visitando).

export const TOTAL_VAGAS = 4;
export const TOTAL_MENTORADOS = 15;

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/** Dias 1 a 10: 3 vagas. Dias 11 a 20: 2 vagas. Dia 21 em diante: 1 vaga. */
export function vagasRestantes(d: Date = new Date()): number {
  const dia = d.getDate();
  return dia <= 10 ? 3 : dia <= 20 ? 2 : 1;
}

/** Acompanhamento (até 15 mentorados): mesma regra de terço do mês. Dias 1 a 10: 11 vagas. 11 a 20: 7. Dia 21 em diante: 3. */
export function mentoradosRestantes(d: Date = new Date()): number {
  const dia = d.getDate();
  return dia <= 10 ? 11 : dia <= 20 ? 7 : 3;
}

export function fraseMentorados(n: number): string {
  return `Restam ${n} de ${TOTAL_MENTORADOS} vagas`;
}

/** Frase curta para o cartão: "Restam 3 de 4 vagas" ou "Resta só 1 de 4 vagas". */
export function fraseVagas(n: number): string {
  return n === 1 ? `Resta só 1 de ${TOTAL_VAGAS} vagas` : `Restam ${n} de ${TOTAL_VAGAS} vagas`;
}

/** Versão para a chamada final: "restam 2 vagas" ou "resta só 1 vaga". */
export function fraseVagasCurta(n: number): string {
  return n === 1 ? 'resta só 1 vaga' : `restam ${n} vagas`;
}

/** Último dia do mês de `d`: texto ("31 de outubro") e quantos dias faltam, contando hoje. */
export function fimDoMes(d: Date = new Date()): { texto: string; faltam: number } {
  const ultimo = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const faltam = ultimo.getDate() - d.getDate();
  return { texto: `${ultimo.getDate()} de ${MESES[ultimo.getMonth()]}`, faltam };
}

export function fraseFaltam(faltam: number): string {
  return faltam <= 0 ? 'Termina hoje.' : faltam === 1 ? 'Falta 1 dia.' : `Faltam ${faltam} dias.`;
}
