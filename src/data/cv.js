// Single source of truth for the CV rendered at /cv/en and /cv/pt.
// Edit the text here; the page and the PDF follow.
//
// - Every translatable string is { en, pt }.
// - Dates are 'YYYY-MM'. `end: null` means current.
// - Every experience and bullet has a stable `id`, so job-specific variants
//   can later reorder, hide or reword them without touching this file.

const cv = {
  person: {
    name: 'Jean Paulo de Almeida',
    headline: {
      en: 'Senior Android Engineer · SDKs and mobile platform',
      pt: 'Engenheiro Android Sênior · SDKs e plataforma mobile',
    },
    location: 'Joinville, SC, Brazil',
    contacts: [
      { label: 'jeandealmeida.dev@gmail.com', href: 'mailto:jeandealmeida.dev@gmail.com' },
      { label: 'linkedin.com/in/jeanalmeida', href: 'https://www.linkedin.com/in/jeanalmeida/' },
      { label: 'github.com/jeandealmeida-dev', href: 'https://github.com/jeandealmeida-dev' },
      { label: 'jeandealmeida.dev', href: 'https://jeandealmeida.dev' },
    ],
  },

  summary: {
    en: [
      'Android engineer with almost 10 years in mobile. I do my best work on code that other teams and apps depend on, like SDKs and platform pieces.',
      'At XP I led the redesign of the real-time market data SDK shared by three apps. At Luizalabs I was the Android technical lead for the Ads SDKs behind the Magalu and Netshoes apps. At Thoughtworks I led the Android rebuild of Peloton’s Breathwrk app in Jetpack Compose, working with AI coding agents.',
      'I mentor junior developers and I stay calm when production breaks.',
    ],
    pt: [
      'Engenheiro Android com quase 10 anos em mobile. Meu melhor trabalho está no código de que outros times e apps dependem, como SDKs e peças de plataforma.',
      'Na XP, liderei a reformulação do SDK de dados de mercado em tempo real compartilhado por três apps. Na Luizalabs, fui o líder técnico Android dos SDKs de Ads que atendem os apps Magalu e Netshoes. Na Thoughtworks, liderei a reconstrução Android do app Breathwrk, da Peloton, em Jetpack Compose, trabalhando com agentes de IA de código.',
      'Mentoro devs júniores e mantenho a calma quando a produção quebra.',
    ],
  },

  experience: [
    {
      id: 'thoughtworks',
      company: 'Thoughtworks',
      client: { en: 'Client: Peloton (Breathwrk), Jan – Oct 2026', pt: 'Cliente: Peloton (Breathwrk), jan – out 2026' },
      role: { en: 'Senior Android Developer', pt: 'Desenvolvedor Android Sênior' },
      start: '2026-01',
      end: null,
      intro: {
        en: 'Peloton acquired Breathwrk, a guided-breathing wellness app. I joined to lead the Android rebrand, working in English with a distributed team.',
        pt: 'A Peloton comprou o Breathwrk, app de respiração guiada. Entrei para liderar o rebrand do app Android, trabalhando em inglês com um time distribuído.',
      },
      bullets: [
        {
          id: 'tw-rewrite',
          text: {
            en: 'What started as a rebrand became a full rewrite of the Android app in Jetpack Compose, which I led.',
            pt: 'O que começou como rebrand virou a reescrita completa do app Android em Jetpack Compose, que liderei.',
          },
        },
        {
          id: 'tw-ai',
          text: {
            en: 'AI-assisted development: I directed AI coding agents through the rewrite and reviewed what they produced.',
            pt: 'Desenvolvimento assistido por IA: dirigi agentes de IA de código durante a reescrita e revisei o que eles produziram.',
          },
        },
        {
          id: 'tw-release',
          text: {
            en: 'The rewrite went from first commit to release in about 5 months and reached 100% of users in July.',
            pt: 'A reescrita foi do primeiro commit ao lançamento em cerca de 5 meses e chegou a 100% dos usuários em julho.',
          },
        },
        {
          id: 'tw-metrics',
          text: {
            en: '91% crash-free users on Firebase.',
            pt: '91% de usuários sem crash no Firebase.',
          },
        },
      ],
    },
    {
      id: 'luizalabs',
      company: 'Luizalabs (Magazine Luiza)',
      role: { en: 'Senior Android Developer', pt: 'Desenvolvedor Android Sênior' },
      start: '2024-09',
      end: '2026-01',
      intro: {
        en: 'Team of 2 Android, 2 iOS and 2 web developers, plus a PM.',
        pt: 'Time com 2 devs Android, 2 iOS e 2 web, mais um PM.',
      },
      bullets: [
        {
          id: 'lz-lead',
          text: {
            en: 'Android technical lead for the Ads SDKs used by the Magalu and Netshoes apps.',
            pt: 'Líder técnico Android dos SDKs de Ads usados pelos apps Magalu e Netshoes.',
          },
        },
        {
          id: 'lz-queue',
          text: {
            en: 'Led the refactor of the SDK’s event delivery to make it resilient: events are sent in batches and none is lost when the app is offline or closed.',
            pt: 'Liderei a refatoração do envio de eventos do SDK para torná-lo resiliente: os eventos saem em lotes e nenhum se perde com o app offline ou fechado.',
          },
        },
        {
          id: 'lz-warroom',
          text: {
            en: 'Ran war rooms and watched release health in Datadog and Firebase.',
            pt: 'Conduzi war rooms e acompanhei a saúde dos releases no Datadog e no Firebase.',
          },
        },
        {
          id: 'lz-perf',
          text: {
            en: 'Fixed bugs and improved performance across the Netshoes and Magalu apps.',
            pt: 'Corrigi bugs e melhorei a performance dos apps Netshoes e Magalu.',
          },
        },
      ],
    },
    {
      id: 'xp',
      company: 'XP Inc.',
      role: { en: 'Mid Mobile Engineer, Android and Flutter', pt: 'Engenheiro Mobile Pleno, Android e Flutter' },
      start: '2021-10',
      end: '2024-02',
      intro: {
        en: 'Brazil’s largest independent investment platform, with 4.7M active clients. Apps: XP, Rico and Clear.',
        pt: 'Maior plataforma de investimentos independente do Brasil, com 4,7 milhões de clientes ativos. Apps: XP, Rico e Clear.',
      },
      bullets: [
        {
          id: 'xp-sse',
          text: {
            en: 'Led the redesign of the real-time market data SDK shared by the XP, Rico and Clear apps, from the proof of concept to production.',
            pt: 'Liderei a reformulação do SDK de dados de mercado em tempo real compartilhado pelos apps XP, Rico e Clear, da prova de conceito à produção.',
          },
        },
        {
          id: 'xp-tests',
          text: {
            en: 'Raised native unit test coverage to 70%.',
            pt: 'Subi a cobertura de testes unitários do código nativo para 70%.',
          },
        },
        {
          id: 'xp-flutter',
          text: {
            en: 'Worked on the first phase of the native-to-Flutter migration.',
            pt: 'Atuei na fase inicial da migração do código nativo para Flutter.',
          },
        },
        {
          id: 'xp-release',
          text: {
            en: 'Handled the release cycle of the three apps and joined war rooms for critical production issues.',
            pt: 'Cuidei do ciclo de releases dos três apps e participei de war rooms em problemas críticos de produção.',
          },
        },
        {
          id: 'xp-mentor',
          text: {
            en: 'Mentored junior developers through onboarding in Android.',
            pt: 'Mentorei devs júniores no onboarding em Android.',
          },
        },
      ],
    },
    {
      id: 'break',
      company: { en: 'Career break', pt: 'Pausa na carreira' },
      role: { en: 'South America', pt: 'América do Sul' },
      start: '2017-01',
      end: '2021-09',
      location: null,
      bullets: [
        {
          id: 'break-1',
          text: {
            en: 'Four years living across South America.',
            pt: 'Quatro anos morando na América do Sul.',
          },
        },
      ],
    },
    {
      id: 'omnichat',
      company: 'OmniChat',
      role: { en: 'Mid Android Developer', pt: 'Desenvolvedor Android Pleno' },
      location: 'Curitiba, Brazil',
      start: '2015-12',
      end: '2016-11',
      intro: {
        en: 'Conversational commerce startup that sold through WhatsApp, Facebook and Instagram.',
        pt: 'Startup de comércio conversacional, com vendas por WhatsApp, Facebook e Instagram.',
      },
      bullets: [
        {
          id: 'om-sole',
          text: {
            en: 'Only Android developer in the early stage. I chose the stack and defined the architecture from scratch.',
            pt: 'Único dev Android na fase inicial. Escolhi a stack e defini a arquitetura do zero.',
          },
        },
        {
          id: 'om-features',
          text: {
            en: 'Built product links, payment processing, and order status and tracking, plus the SQLite persistence and REST/JSON client layer.',
            pt: 'Construí links de produto, processamento de pagamento e acompanhamento de pedidos, além da persistência em SQLite e da camada REST/JSON.',
          },
        },
        {
          id: 'om-clients',
          text: {
            en: 'Joined visits to clients (pharmacies, florists, schools) to see how they used the product.',
            pt: 'Participei de visitas a clientes (farmácias, floriculturas, escolas) para ver como usavam o produto.',
          },
        },
      ],
    },
    {
      id: 'snowman',
      company: 'Snowman Labs',
      role: { en: 'Mid Android Developer', pt: 'Desenvolvedor Android Pleno' },
      location: 'Curitiba, Brazil',
      start: '2015-06',
      end: '2015-11',
      intro: {
        en: 'Software house delivering mobile products end to end.',
        pt: 'Software house que entrega produtos mobile de ponta a ponta.',
      },
      bullets: [
        {
          id: 'sn-apps',
          text: {
            en: 'Built Java Android apps for several clients, from healthcare to social media, including startup and government projects.',
            pt: 'Desenvolvi apps Android em Java para vários clientes, da área médica a redes sociais, incluindo startups e projetos de governo.',
          },
        },
        {
          id: 'sn-libs',
          text: {
            en: 'Maintained internal libraries and SDKs.',
            pt: 'Mantive bibliotecas e SDKs internos.',
          },
        },
      ],
    },
    {
      id: 'totvs',
      company: 'TOTVS',
      role: { en: 'Mobile Systems Analyst', pt: 'Analista de Sistemas Mobile' },
      location: 'Joinville, Brazil',
      start: '2014-02',
      end: '2015-05',
      bullets: [
        {
          id: 'tv-fluig',
          text: {
            en: 'Worked on the Android app for Fluig, TOTVS’s enterprise collaboration platform (social network, workflow and document management) used by companies across Brazil.',
            pt: 'Trabalhei no app Android do Fluig, plataforma de colaboração corporativa da TOTVS (rede social, workflow e gestão de documentos) usada por empresas de todo o Brasil.',
          },
        },
        {
          id: 'tv-legacy',
          text: {
            en: 'Fixed legacy code and shipped new features.',
            pt: 'Corrigi código legado e entreguei novas funcionalidades.',
          },
        },
      ],
    },
    {
      id: 'softin',
      company: 'Softin Sistemas',
      role: { en: 'Junior Web and Android Developer', pt: 'Desenvolvedor Web e Android Júnior' },
      location: 'Joinville, Brazil',
      start: '2012-05',
      end: '2014-01',
      bullets: [
        {
          id: 'sf-android',
          text: {
            en: 'Started on .NET/C# web, then moved to Android. Built and published Java apps with SQLite and REST/JSON, including a field-service app for appliance technicians.',
            pt: 'Comecei em web .NET/C# e passei para Android. Desenvolvi e publiquei apps Java com SQLite e REST/JSON, incluindo um app de campo para técnicos de linha branca.',
          },
        },
        {
          id: 'sf-practices',
          text: {
            en: 'Practiced TDD, pair programming and code review from day one.',
            pt: 'Pratiquei TDD, pair programming e code review desde o primeiro dia.',
          },
        },
      ],
    },
  ],

  skills: [
    {
      id: 'android',
      label: { en: 'Android', pt: 'Android' },
      items: ['Kotlin', 'Java', 'Jetpack Compose', 'Coroutines and Flow', 'Room', 'WorkManager', 'Retrofit', 'Hilt', 'Dagger', 'Koin', 'RxJava'],
    },
    {
      id: 'cross',
      label: { en: 'Cross-platform', pt: 'Multiplataforma' },
      items: ['Kotlin Multiplatform', 'Flutter', 'Dart'],
    },
    {
      id: 'arch',
      label: { en: 'Architecture and quality', pt: 'Arquitetura e qualidade' },
      items: ['Clean Architecture', 'MVVM', 'SOLID', 'TDD', 'Unit testing', 'Code review', 'SDK design'],
    },
    {
      id: 'tools',
      label: { en: 'Tools', pt: 'Ferramentas' },
      items: ['Firebase', 'Feature flags (Remote Config)', 'CI/CD (Azure DevOps, GitHub Actions)', 'Datadog', 'Git', 'Gradle (Kotlin DSL)', 'Scrum and Kanban', 'AI-assisted development (Claude Code, Cursor)'],
    },
  ],

  education: [
    {
      id: 'udesc',
      school: 'Universidade do Estado de Santa Catarina (UDESC)',
      degree: { en: 'B.S. in Computer Science', pt: 'Bacharelado em Ciência da Computação' },
      start: '2010',
      end: '2013',
    },
  ],

  languages: [
    { id: 'pt', name: { en: 'Portuguese', pt: 'Português' }, level: { en: 'Native', pt: 'Nativo' } },
    { id: 'en', name: { en: 'English', pt: 'Inglês' }, level: { en: 'Fluent', pt: 'Fluente' } },
    { id: 'es', name: { en: 'Spanish', pt: 'Espanhol' }, level: { en: 'Fluent', pt: 'Fluente' } },
    { id: 'fr', name: { en: 'French', pt: 'Francês' }, level: { en: 'Basic', pt: 'Básico' } },
  ],

  ui: {
    summary: { en: 'Summary', pt: 'Resumo' },
    experience: { en: 'Experience', pt: 'Experiência' },
    skills: { en: 'Skills', pt: 'Habilidades' },
    education: { en: 'Education', pt: 'Formação' },
    languages: { en: 'Languages', pt: 'Idiomas' },
    present: { en: 'Present', pt: 'Atual' },
    savePdf: { en: 'Save as PDF', pt: 'Salvar PDF' },
    back: { en: 'Back to site', pt: 'Voltar ao site' },
    docTitle: { en: 'Jean Paulo de Almeida - CV', pt: 'Jean Paulo de Almeida - CV (PT)' },
  },
};

export default cv;
