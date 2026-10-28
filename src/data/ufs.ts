// Código IBGE -> sigla e nome. Usado pelo mapa (clique no estado) e pelo gerador de geometria.
export const UFS: Record<string, { uf: string; nome: string }> = {
  '11': { uf: 'RO', nome: 'Rondônia' }, '12': { uf: 'AC', nome: 'Acre' }, '13': { uf: 'AM', nome: 'Amazonas' },
  '14': { uf: 'RR', nome: 'Roraima' }, '15': { uf: 'PA', nome: 'Pará' }, '16': { uf: 'AP', nome: 'Amapá' },
  '17': { uf: 'TO', nome: 'Tocantins' }, '21': { uf: 'MA', nome: 'Maranhão' }, '22': { uf: 'PI', nome: 'Piauí' },
  '23': { uf: 'CE', nome: 'Ceará' }, '24': { uf: 'RN', nome: 'Rio Grande do Norte' }, '25': { uf: 'PB', nome: 'Paraíba' },
  '26': { uf: 'PE', nome: 'Pernambuco' }, '27': { uf: 'AL', nome: 'Alagoas' }, '28': { uf: 'SE', nome: 'Sergipe' },
  '29': { uf: 'BA', nome: 'Bahia' }, '31': { uf: 'MG', nome: 'Minas Gerais' }, '32': { uf: 'ES', nome: 'Espírito Santo' },
  '33': { uf: 'RJ', nome: 'Rio de Janeiro' }, '35': { uf: 'SP', nome: 'São Paulo' }, '41': { uf: 'PR', nome: 'Paraná' },
  '42': { uf: 'SC', nome: 'Santa Catarina' }, '43': { uf: 'RS', nome: 'Rio Grande do Sul' }, '50': { uf: 'MS', nome: 'Mato Grosso do Sul' },
  '51': { uf: 'MT', nome: 'Mato Grosso' }, '52': { uf: 'GO', nome: 'Goiás' }, '53': { uf: 'DF', nome: 'Distrito Federal' },
};
