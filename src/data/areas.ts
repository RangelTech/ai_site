// Conteúdo dos modais de "O que eu faço" e "Setores". Sem nome de cliente, porque contrato é contrato.
// Cada chave aparece em data-info no chip. `feitos` = o que a gente já entregou nessa área.

export interface Area {
  titulo: string;
  texto: string;
  feitos: string[];
  msg?: string; // mensagem do WhatsApp deste modal; sem ela vale "quero saber mais sobre <título>"
}

export const AREAS: Record<string, Area> = {
  agentes: {
    titulo: 'Agentes de IA',
    texto: 'Desenvolvemos agentes de inteligência artificial para resolver qualquer problema da sua empresa: atendimento, vendas, financeiro, análise de dados, documentos. Cada agente recebe uma função, as ferramentas certas e a memória do seu negócio.',
    feitos: ['Plataforma onde vários agentes trabalham juntos, cada um com a sua função', 'Agente que responde perguntas em português sobre os documentos e os bancos de dados da empresa', 'Agentes que recomendam preço e produção no lugar da planilha'],
  },
  visao: {
    titulo: 'Visão computacional',
    texto: 'Trabalhamos com processamento de imagem e vídeo em tempo real para vários propósitos: contar, medir, seguir e identificar objetos e pessoas.',
    feitos: ['Mensuração de estoque a partir de imagens', 'Tracking de pessoas e veículos em vídeo', 'Câmeras de segurança que viram eventos pesquisáveis', 'Testes de capacidade para dezenas de câmeras ao mesmo tempo'],
  },
  propria: {
    titulo: 'IA própria, sem restrições',
    texto: 'Desenvolvemos e implantamos o seu próprio modelo de inteligência artificial, com muito menos recusas em responder, dentro do seu ambiente e sem depender de nenhum provedor externo. Os seus dados não saem da sua empresa.',
    feitos: ['Modelos rodando em servidor próprio, com API e custo por resposta medido', 'Versões compactadas que rodam em máquinas menores sem perder qualidade', 'Cluster de placas de vídeo para processar IA em grande volume'],
  },
  voz: {
    titulo: 'Clonagem de voz e deepfake',
    texto: 'Avatar em tempo real com o seu rosto e a sua voz, para gravar vídeos e atender sem estar na frente da câmera. Já temos uma prova de conceito funcionando.',
    feitos: ['Troca de rosto e conversão de voz em tempo real', 'Transcrição de áudio e voz sintética com baixa latência'],
  },
  imagemia: {
    titulo: 'Imagem e vídeo por IA',
    texto: 'Montamos para você um ambiente privado de geração de imagens e vídeos com IA: roda no seu servidor, sem depender nem pagar plataformas externas, e os seus prompts e imagens não saem da empresa.',
    feitos: ['Ambientes privados de geração de imagem e de vídeo, na GPU do cliente', 'Geração em lote com o custo por imagem medido', 'Pipelines de vídeo com codificação e entrega automáticas'],
  },
  dados: {
    titulo: 'Engenharia de dados e BI',
    texto: 'Organizamos os dados espalhados da empresa em um lugar só e entregamos painéis que a diretoria usa de verdade para decidir.',
    feitos: ['Lagos de dados com dezenas de fontes públicas e privadas', 'Painéis no Metabase e no Power BI', 'Cliente 360 juntando vários sistemas'],
  },
  previsao: {
    titulo: 'Previsão de demanda',
    texto: 'Modelos de previsão de vendas e de demanda, semana a semana, para comprar e produzir melhor.',
    feitos: ['Previsão semanal de demanda para indústria', 'Modelos de recomendação que aumentaram a venda no varejo'],
  },
  erp: {
    titulo: 'ERP e SaaS sob medida',
    texto: 'Sistemas feitos do zero para o seu processo, multiempresa, do banco de dados à tela.',
    feitos: ['ERP completo multiempresa', 'Produtos SaaS com cobrança e permissões por cliente'],
  },
  clonar: {
    titulo: 'Clonar sistema obsoleto em tecnologia nova',
    texto: 'O sistema velho que trava a operação ganha uma versão moderna, com a mesma lógica de negócio, sem a empresa parar um dia.',
    feitos: ['Reconstrução de sistemas legados em tecnologia atual', 'Migração gradual, com os dois lados rodando juntos até a troca'],
  },
  automacao: {
    titulo: 'Automação de processos',
    texto: 'Robôs e agentes que fazem o trabalho repetitivo: usar sites, preencher, consultar, conferir e avisar, como uma pessoa faria.',
    feitos: ['Automação de navegador testada em ambiente isolado', 'Fluxos que ligam planilha, e-mail e WhatsApp'],
  },
  sensores: {
    titulo: 'Sensorização e prototipagem eletrônica',
    texto: 'Do circuito na bancada à nuvem: escolha do sensor, placa, firmware, envio dos dados e painel. Eu venho da mecatrônica e tenho muita experiência em eletrônica.',
    feitos: ['Protótipos com ESP32 enviando dados para a nuvem', 'Sensores de ambiente e de chão de fábrica com painel em tempo real'],
  },
  cameras: {
    titulo: 'Câmeras inteligentes',
    texto: 'O vídeo das câmeras vira evento que dá para pesquisar, investigar e agir, em vez de horas de gravação que ninguém assiste.',
    feitos: ['Detecção e contagem em várias câmeras RTSP', 'Alertas automáticos por tipo de evento'],
  },
  modelo3d: {
    titulo: 'Da foto ao modelo 3D',
    texto: 'Transformamos fotos em modelo 3D e em gêmeo digital de um local ou de uma peça.',
    feitos: ['Reconstrução 3D a partir de imagens', 'Gêmeo digital de ambientes e pilhas de material'],
  },

  varejo: {
    titulo: 'Varejo',
    texto: 'Atendemos qualquer área do varejo: mercados, atacadistas, farmácias, lojas físicas e e-commerce. As soluções são feitas para o seu negócio, não de prateleira.',
    feitos: ['Recomendação de produtos que aumentou a venda', 'Previsão de demanda e de estoque', 'Cliente 360 e painéis para a diretoria'],
  },
  financas: {
    titulo: 'Finanças',
    texto: 'Bancos, meios de pagamento e empresas de crédito: decisões mais rápidas e com menos risco.',
    feitos: ['Motor de risco de crédito que separa risco financeiro de má-fé', 'Lagos de dados e painéis para áreas de risco', 'Agentes que respondem sobre contratos e documentos'],
  },
  industria: {
    titulo: 'Indústria',
    texto: 'Do chão de fábrica ao escritório: ver, medir e prever o que acontece na operação.',
    feitos: ['Mensuração de estoque por imagem', 'Previsão de demanda semanal', 'Sensores e painéis em tempo real'],
  },
  educacao: {
    titulo: 'Educação',
    texto: 'Plataformas, dados e agentes para redes de ensino e empresas de formação.',
    feitos: ['Lago de dados educacional com dezenas de fontes públicas', 'Painéis de investimento e desempenho para secretarias', 'Apoio a plataformas de cursos e tutoria'],
  },
  saude: {
    titulo: 'Saúde',
    texto: 'Clínicas, redes e operadoras: atendimento e documentos com agentes de IA, e dados organizados para decidir melhor.',
    feitos: ['Agentes de atendimento por WhatsApp', 'Organização de documentos e prontuários para busca em linguagem natural'],
  },
  agro: {
    titulo: 'Agronegócio',
    texto: 'Decisões de preço, produção e mercado apoiadas por dados e agentes de IA.',
    feitos: ['Agentes de análise de mercado para precificação', 'Pipelines de dados do campo à diretoria'],
  },
  logistica: {
    titulo: 'Logística',
    texto: 'Rotas, frotas e operação de transporte com dados e visão computacional.',
    feitos: ['Análise de pagamentos e uso de veículos em escala', 'Visão computacional para contagem e identificação em pátios'],
  },
};
