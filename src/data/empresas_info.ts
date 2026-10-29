// Modal de cada empresa da faixa de logos. Regra: falar do ESTILO do projeto e da tecnologia, nunca de cargo,
// de vínculo ou de detalhe contratual. Sempre "desenvolvemos / entregamos / demos manutenção".
// A chave é o `slug` do logo em content.ts (sem o sufixo .w).
import type { Area } from './areas';

const msg = (n: string) => `Oi, Lucas! Vi que vocês já atenderam a ${n} e quero um projeto parecido.`;

export const EMPRESAS_INFO: Record<string, Area> = {
  drogasil: {
    titulo: 'Drogasil',
    texto: 'Dados e IA para o varejo farmacêutico: pipelines que alimentam aplicações de inteligência artificial e uma base de clientes confiável.',
    feitos: ['Pipelines de dados com dbt e PySpark, orquestrados com Airflow', 'Golden ID e deduplicação de cadastros, com governança e catálogo de dados assistido por IA', 'Soluções com LLM, RAG e bancos vetoriais, com monitoramento de qualidade'],
    msg: msg('Drogasil'),
  },
  bradesco: {
    titulo: 'Bradesco',
    texto: 'Entregamos e demos manutenção a fluxos de dados e a pipelines de machine learning em um ambiente Databricks de grande porte.',
    feitos: ['Pipelines em Python, PySpark e Spark SQL, com dados preparados para treino e inferência', 'Monitoramento de jobs, clusters e modelos com MLflow', 'Dados e modelos versionados no ecossistema lakehouse, com entrega contínua'],
    msg: msg('Bradesco'),
  },
  scpc: {
    titulo: 'SCPC',
    texto: 'Pipelines de dados e de machine learning de ponta a ponta no Google Cloud, para uma empresa de análise de crédito.',
    feitos: ['Orquestração com Composer e processamento em Dataproc e Dataflow', 'Modelos treinados e servidos no Vertex AI', 'Entrega automatizada com CI/CD'],
    msg: msg('SCPC'),
  },
  cielo: {
    titulo: 'Cielo',
    texto: 'Integramos bases relacionais ao ecossistema de Big Data de um grande meio de pagamento.',
    feitos: ['Extração de bancos Oracle para um ambiente Hadoop com Hive e Spark', 'Modelagem de data warehouse', 'Serviços de dados e de machine learning na AWS'],
    msg: msg('Cielo'),
  },
  'drogaria-sao-paulo': {
    titulo: 'Drogaria São Paulo',
    texto: 'Desenvolvemos o data lake da empresa no Google Cloud, a partir dos dados que viviam no Qlik.',
    feitos: ['Extração e preparação dos dados do Qlik para a nuvem', 'Data lake no Cloud Storage, orquestrado com Composer e Airflow', 'Processamento e consultas no BigQuery'],
    msg: msg('Drogaria São Paulo'),
  },
  'sem-parar': {
    titulo: 'Sem Parar',
    texto: 'Migramos os bancos relacionais da empresa para um data lake na AWS e demos manutenção à plataforma de dados.',
    feitos: ['Data lake com S3, Glue e Athena, e modelos no SageMaker', 'Integração de CRM e Salesforce aos fluxos corporativos', 'Modelos de dados e indicadores de cliente em Databricks, para áreas de negócio'],
    msg: msg('Sem Parar'),
  },
  smarttbot: {
    titulo: 'Smarttbot',
    texto: 'Desenvolvemos e demos manutenção a sistemas web de ponta a ponta para uma plataforma de robôs de investimento.',
    feitos: ['Backends em Python e Node.js e interfaces em React', 'Containers com Docker e serviços na AWS', 'Bancos Redis e MySQL integrados à aplicação'],
    msg: msg('Smarttbot'),
  },
  cogna: {
    titulo: 'Cogna Educação',
    texto: 'Construímos a base de dados analíticos de um dos maiores grupos de educação do país.',
    feitos: ['Pipelines em Spark e Airflow a partir de bases como SAP HANA e MongoDB', 'Modelagem de data warehouse e processos de ETL', 'Políticas de governança de dados'],
    msg: msg('Cogna'),
  },
  totvs: {
    titulo: 'TOTVS',
    texto: 'Desenvolvemos soluções de software para o ecossistema TOTVS e demos suporte à infraestrutura de dados.',
    feitos: ['Funcionalidades e componentes de aplicações em Delphi', 'Instalação e administração de ambientes Oracle', 'Rotinas de banco de dados em PL/SQL'],
    msg: msg('TOTVS'),
  },
  senai: {
    titulo: 'SENAI IST',
    texto: 'Projetos de automação e sistemas embarcados no instituto de tecnologia em automação do SENAI.',
    feitos: ['Soluções multiplataforma: web, mobile e embarcadas', 'Programação de microcontroladores e comunicação MQTT', 'Administração de vários bancos de dados'],
    msg: msg('SENAI IST'),
  },
  cinemark: {
    titulo: 'Cinemark',
    texto: 'Modelos de machine learning para vender mais na bomboniere, em ambiente de nuvem.',
    feitos: ['Recomendação de produtos para o cliente na compra', 'Modelos de incidência por produto, com testes A/B', 'Pipelines de dados e avaliação em produção'],
    msg: msg('Cinemark'),
  },
  uisa: {
    titulo: 'UISA',
    texto: 'Desenvolvemos um sistema de agentes de inteligência artificial para apoiar a decisão de preço e de mix entre açúcar e etanol.',
    feitos: ['Vários agentes especializados, cada um com a sua função', 'Dados de mercado organizados na nuvem', 'Recomendações prontas no lugar da planilha'],
    msg: msg('UISA'),
  },
  lunelli: {
    titulo: 'Lunelli',
    texto: 'Construímos o data lake e a previsão de demanda de uma indústria têxtil.',
    feitos: ['Data lake em camadas bronze, prata e ouro na AWS', 'Modelos de previsão semanal de demanda', 'Ingestão dos dados do sistema de gestão da fábrica'],
    msg: msg('Lunelli'),
  },
  'capital-certo': {
    titulo: 'Capital Certo',
    texto: 'Entregamos a plataforma de dados e de risco de uma empresa de crédito, em infraestrutura própria.',
    feitos: ['Data lake e painéis de BI', 'Motor de risco que separa risco financeiro de indício de má-fé', 'Governança de dados sensíveis'],
    msg: msg('Capital Certo'),
  },
  jump: {
    titulo: 'Jump',
    texto: 'Projetos de dados e de inteligência artificial entregues em parceria, para clientes finais da consultoria.',
    feitos: ['Pipelines e plataformas de dados', 'Soluções com IA aplicadas ao negócio do cliente'],
    msg: msg('Jump'),
  },
  'triggo-labs': {
    titulo: 'Fleetcore (Triggo Labs)',
    texto: 'Projetos de dados e de inteligência artificial entregues em parceria, para clientes finais.',
    feitos: ['Pipelines e plataformas de dados', 'Soluções com IA aplicadas à operação do cliente'],
    msg: msg('a Fleetcore'),
  },
  bulk: {
    titulo: 'Bulk',
    texto: 'Projetos de dados e de inteligência artificial entregues para a empresa.',
    feitos: ['Pipelines e plataformas de dados', 'Soluções com IA aplicadas à operação'],
    msg: msg('Bulk'),
  },
  eduk: {
    titulo: 'Eduk',
    texto: 'Organizamos o data lake da plataforma de cursos no Google Cloud e demos manutenção a ele.',
    feitos: ['Replicação automática dos bancos de origem da plataforma', 'Modelo único de chaves de usuário e de curso', 'Camadas de consumo prontas para painéis e análises'],
    msg: msg('Eduk'),
  },
  mindlab: {
    titulo: 'MindLab',
    texto: 'Construímos e mantemos o data lake educacional da empresa, com dezenas de fontes públicas.',
    feitos: ['Fontes como Censo Escolar, IDEB, SAEB, SIOPE e PNCP, atualizadas todo dia', 'Indicadores financeiros da educação e painéis para secretarias', 'Documentação e linhagem dos dados'],
    msg: msg('MindLab'),
  },
  leega: {
    titulo: 'Leega',
    texto: 'Projetos de dados e de inteligência artificial entregues em parceria, para clientes finais da consultoria.',
    feitos: ['Pipelines e plataformas de dados', 'Modelos e agentes de IA aplicados ao negócio'],
    msg: msg('Leega'),
  },
  'quality-digital': {
    titulo: 'Quality Digital',
    texto: 'Projetos de IA e de dados para clientes de vários setores, entregues dentro da consultoria.',
    feitos: ['Plataformas de agentes de IA e RAG', 'Visão computacional e reconstrução 3D para estimar volume de estoque', 'Data lakes e previsão de demanda'],
    msg: msg('Quality Digital'),
  },
  sysmap: {
    titulo: 'SysMap',
    texto: 'Projetos de dados e de inteligência artificial entregues em parceria, para clientes finais da consultoria.',
    feitos: ['Pipelines e plataformas de dados', 'Soluções com IA aplicadas ao negócio do cliente'],
    msg: msg('SysMap'),
  },
  semantix: {
    titulo: 'Semantix',
    texto: 'Projetos de dados e de inteligência artificial entregues em parceria, para clientes finais.',
    feitos: ['Pipelines e plataformas de dados', 'Soluções com IA aplicadas ao negócio do cliente'],
    msg: msg('Semantix'),
  },
};
