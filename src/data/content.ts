import { LINKS } from './config';

const GH = 'https://github.com/LucasRangelSSouza/';

export type Motif = 'agents' | 'data' | 'vision' | 'chip' | 'wave' | 'sensor' | 'code' | 'flow' | 'dash' | 'rag' | 'mesh' | 'erp';
export type Grupo = 'empresas' | 'fisico' | 'ia' | 'automacao' | 'proprios';

export const GRUPOS: Record<Grupo, string> = {
  empresas: 'Para empresas',
  fisico: 'Visão computacional e eletrônica',
  ia: 'IA própria, sem limites',
  automacao: 'Automação com agentes',
  proprios: 'Produtos e pesquisa',
};

export interface Projeto {
  titulo: string;
  frase: string;
  grupo: Grupo;
  motif: Motif;
  link?: { rotulo: string; href: string };
  destaque?: number; // ordem entre os seis visíveis
  img?: string; // arquivo em /img/projetos; sem ele vale a ilustração do `motif`
  problema?: string; // o que travava (só nos destaques)
  resultado?: string; // o que ficou resolvido (só nos destaques)
}

const gh = (repo: string) => ({ rotulo: 'GitHub', href: GH + repo });

// "O que eu já resolvi": problema -> o que foi feito -> resultado. Sem nome de cliente, porque contrato é contrato.
export const PROJETOS: Projeto[] = [
  { titulo: 'Agentes de IA que trabalham pela empresa', frase: 'Uma plataforma onde cada agente tem a sua função, as suas ferramentas e a memória do negócio.', problema: 'Equipe afogada em tarefa repetida: e-mail, planilha, consulta no sistema.', resultado: 'Agentes assumiram a rotina; as pessoas voltaram a vender e decidir.', grupo: 'empresas', motif: 'agents', destaque: 1 },
  { titulo: 'Cliente 360 e CRM', frase: 'Vários sistemas num painel só, com as análises que a diretoria usa para decidir.', problema: 'Cada setor com o seu cadastro; ninguém sabia quem era o cliente.', resultado: 'Uma visão só, por cliente, e a diretoria decidindo com número na mão.', grupo: 'empresas', motif: 'dash', destaque: 2 },
  { titulo: 'Câmeras que enxergam, seguem e medem', img: 'cameras', frase: 'Visão computacional que detecta pessoas, veículos e objetos em imagem e em vídeo.', problema: 'Câmera no teto gravando e ninguém olhando.', resultado: 'A mesma câmera virou alerta, contagem e relatório.', grupo: 'fisico', motif: 'vision', link: gh('vision-detection-tracking-bench'), destaque: 3 },
  { titulo: 'Clonamos o sistema obsoleto em tecnologia nova', img: 'clonar', frase: 'O sistema velho que trava a operação ganha uma versão moderna, sem a empresa parar.', problema: 'Sistema de 15 anos que ninguém mais sabia mexer.', resultado: 'Versão nova no ar, com a operação rodando o tempo todo.', grupo: 'empresas', motif: 'code', destaque: 4 },
  { titulo: 'IA própria, rodando no seu servidor', img: 'propria', frase: 'O seu próprio modelo de IA, dentro da sua arquitetura. Sem serviço de terceiros e sem mandar dado para fora.', problema: 'Dado sensível que não podia sair da empresa.', resultado: 'IA dentro de casa, sem mensalidade e sem vazamento.', grupo: 'ia', motif: 'chip', destaque: 5 },
  { titulo: 'LUAR, atendimento com IA', img: 'luar', frase: 'O nosso produto: caixa de entrada com IA, Kanban e agentes que trabalham nos computadores da empresa.', problema: 'Atendimento que não dava conta e lead esfriando na fila.', resultado: 'Resposta em segundos, fila organizada e venda que não escapa.', grupo: 'proprios', motif: 'agents', link: { rotulo: 'Site do LUAR', href: 'https://luar.rangeltech.net' }, destaque: 6 },
  { titulo: 'Agentes que decidem preço e produção', img: 'precos', frase: 'Troque a planilha por uma recomendação pronta na hora de definir preço e mix.', grupo: 'empresas', motif: 'agents' },
  { titulo: 'Recomendação que aumenta a venda', img: 'recomendacao', frase: 'Sugestões de produto testadas em produção, para vender mais para quem já compra.', grupo: 'empresas', motif: 'data' },
  { titulo: 'Previsão de vendas e de demanda', img: 'previsao', frase: 'Os dados da empresa organizados e a previsão do que vai sair, semana a semana.', grupo: 'empresas', motif: 'data' },
  { titulo: 'Motor de risco de crédito', img: 'risco', frase: 'Lago de dados, painéis e um modelo que separa risco financeiro de má-fé.', grupo: 'empresas', motif: 'data' },
  { titulo: 'ERP e SaaS do zero', frase: 'Sistema sob medida, multiempresa, do banco de dados à tela.', grupo: 'empresas', motif: 'erp', link: gh('Projeto-Sistema-ERP') },
  { titulo: 'Agente de IA que conversa com os seus documentos', frase: 'Pergunte em português e receba a resposta tirada dos arquivos da sua empresa, com a fonte.', grupo: 'empresas', motif: 'rag', link: gh('rag-chat') },
  { titulo: 'Painéis de BI para a diretoria', img: 'bi', frase: 'Painéis de gestão no ar em poucos dias, rodando no servidor da própria empresa.', grupo: 'empresas', motif: 'dash', link: gh('metabase-postgres-docker') },
  { titulo: 'Câmeras inteligentes', img: 'cameras2', frase: 'O vídeo das câmeras vira evento que dá para pesquisar, investigar e agir.', grupo: 'fisico', motif: 'vision', link: gh('multi-camera-rtsp-capacity') },
  { titulo: 'Prototipagem de sensores e eletrônica', frase: 'Do circuito na bancada à nuvem: placa, firmware, leitura do sensor e painel.', grupo: 'fisico', motif: 'sensor', link: gh('sensoriamento_esp32') },
  { titulo: 'Da foto ao modelo 3D', img: 'modelo3d', frase: 'Transformar imagens em modelo 3D e em gêmeo digital de um local ou de uma peça.', grupo: 'fisico', motif: 'mesh', link: gh('image-to-3d-and-digital-twin') },
  { titulo: 'IA sem limites e sem recusa', img: 'semlimites', frase: 'Modelo próprio sem as travas dos serviços públicos, para quem precisa de resposta e não de sermão.', grupo: 'ia', motif: 'chip' },
  { titulo: 'IA compacta que cabe em máquina pequena', img: 'compacta', frase: 'Versões enxutas do mesmo modelo, que rodam em equipamento barato sem perder qualidade.', grupo: 'ia', motif: 'chip', link: gh('quantization-and-offload-lab') },
  { titulo: 'Voz que ouve e fala', img: 'voz', frase: 'Transcrição de áudio e voz sintética em tempo real.', grupo: 'ia', motif: 'wave', link: gh('voice-stt-tts-bench') },
  { titulo: 'Clonagem de voz e deepfake em tempo real', img: 'deepfake', frase: 'Avatar com o seu rosto e a sua voz para gravar vídeo sem estar na frente da câmera.', grupo: 'ia', motif: 'wave' },
  { titulo: 'Imagens e vídeos gerados por IA', img: 'imagemia', frase: 'Imagem e vídeo gerados na sua própria arquitetura: sem mensalidade, sem crédito e sem plataforma paga. Você paga só a GPU.', grupo: 'ia', motif: 'chip' },
  { titulo: 'IA que corrige código', img: 'cursor', frase: 'Acha o problema e abre a correção; a decisão final é de uma pessoa.', grupo: 'ia', motif: 'code' },
  { titulo: 'Assistente de código dentro do editor', img: 'codigo', frase: 'Uma extensão que leva o agente de IA para dentro do editor do programador.', grupo: 'ia', motif: 'code', link: gh('hermes-vscode') },
  { titulo: 'Robôs que usam sites por você', img: 'robos', frase: 'Automação de navegador: preenche, consulta e confere como uma pessoa faria.', grupo: 'automacao', motif: 'flow', link: gh('web-automation-lab') },
  { titulo: 'Agentes de IA mais baratos', img: 'baratos', frase: 'Técnicas que reduzem o custo de rodar agentes, dizendo com clareza o que foi provado.', grupo: 'automacao', motif: 'flow', link: gh('agent-tooling-token-savings') },
  { titulo: 'Dados públicos em escala', img: 'publicos', frase: 'Transformamos dado aberto do governo em produto e painel.', grupo: 'automacao', motif: 'data' },
  { titulo: 'Roteirização, desenho 3D e produção de conteúdo', img: 'conteudo', frase: 'Dezenas de ferramentas testadas e transformadas em fluxos prontos: o que você recebe é o resultado, não a ferramenta.', grupo: 'automacao', motif: 'flow' },
  { titulo: 'Cluster multi-GPU para IA em massa', img: 'cluster', frase: 'Infraestrutura própria de placas de vídeo para processar IA em grande volume, com custo por resultado medido e publicado.', grupo: 'proprios', motif: 'chip', link: { rotulo: 'Hub', href: LINKS.github + '/gpu-ai-benchmark-hub' } },
];

export const FAQ: { p: string; r: string }[] = [
  { p: 'Isso é curso?', r: 'Não. Curso te entrega aula. Aqui você me entrega o problema e eu resolvo: conecto no seu computador, construo, subo e te mostro. Você aprende no caminho, mas o meu papel é resolver, não dar aula.' },
  { p: 'Preciso saber programar?', r: 'Não. O que você precisa é de alguém que saiba qual técnica resolve o seu problema (agente, visão computacional, previsão, modelo próprio), monte a arquitetura certa e corrija quando sai errado. Isso sou eu do seu lado.' },
  { p: 'Você trabalha só com chat e prompts?', r: 'Não. Chat é a parte mais visível. Em 12 anos eu entreguei visão computacional, previsão de demanda, motores de risco e de preço, voz, imagem e modelos próprios rodando no servidor do cliente. O que entra no seu projeto é o que resolve o seu problema.' },
  { p: 'Qual a diferença entre o WhatsApp e o cara a cara?', r: 'Nos dois eu faço por você. Pelo WhatsApp você manda o problema e eu resolvo no seu ritmo: conecto, subo, corrijo e te mostro. Cara a cara, além do WhatsApp, eu te vejo três vezes por semana por vídeo, só nós dois, e a gente constrói junto na tela.' },
  { p: 'Como é a call de 30 minutos?', r: 'É antes de qualquer pagamento. Você me conta o problema, eu te mostro como trabalho e o que dá para resolver, e a gente fecha o escopo. Se fizer sentido para nós dois, eu te mando o link para começar.' },
  { p: 'E se eu não tiver tempo?', r: 'Se você não tem tempo, é porque está fazendo na mão o que a IA faria em minutos. O caminho pelo WhatsApp foi feito para quem tem pouco tempo: você avança quando pode, e eu destravo quando você trava.' },
  { p: 'O que a garantia cobre?', r: 'Tudo. Nos primeiros 7 dias, se você achar que não vale, pede o reembolso integral, sem explicar o motivo.' },
  { p: 'Posso pagar parcelado?', r: 'Sim. Pix ou cartão em até 12 vezes, no checkout. Para empresas, por contrato, do jeito que fizer sentido: boleto, cartão ou o que combinarmos.' },
  { p: 'Vou ganhar dinheiro garantido?', r: 'Ninguém sério garante isso. Eu garanto o caminho, as ferramentas e eu do seu lado até o seu projeto estar no ar. O que você vende depois é o que você constrói.' },
  { p: 'Vocês fazem o projeto da minha empresa?', r: 'Fazemos. Você me conta o problema, a gente coloca a solução no papel antes de começar e eu monto dentro da sua própria estrutura, sem depender de serviço de terceiros.' },
];
