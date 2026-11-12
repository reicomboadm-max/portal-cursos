import type { Course, Order, StudentUser, SiteSettings } from "@/types";

export const SITE_SETTINGS: SiteSettings = {
  siteName: "Portal Cursos Concursos",
  tagline: "Prepare-se com os melhores cursos para concursos públicos",
  adminEmails: ["admin@seuemail.com", "admin2@seuemail.com"],
  pixKey: "SUA_CHAVE_PIX_AQUI",
  pixKeyType: "EVP",
  beneficiaryName: "SEU NOME / EMPRESA AQUI",
  beneficiaryCity: "Sua Cidade - UF",
  whatsappSupport: "5511999999999",
  telegramSupport: "@seusuporte",
  bannerNotice: "🔥 Novos cursos Fiscal e Tribunais disponíveis com acesso imediato via Google Drive!",
  deliveryTimeNotice: "Envio do acesso ao Drive em até 24 horas após confirmação do pagamento PIX",
  allowSelfRegistration: true,
  veloraEnabled: true,
  veloraApiKey: "vl_live_sk_232b3775033a405b872c4955940c4a27",
  veloraApiSecret: "bb958b13-2902-46ce-b5ea-fa2293ed6a58",
  veloraWebhookSecret: "b17ce96282830488fbb6935a7b6782791",
};

export const SEGMENTS: { key: string; label: string; color: string }[] = [
  { key: "fiscal", label: "Fiscal", color: "text-brand-500 border-brand-500/30" },
  { key: "tribunais", label: "Tribunais", color: "text-accent-cyan border-accent-cyan/30" },
];

export const COURSES: Course[] = [
  {
    id: "curso-fiscal-estrategia",
    slug: "curso-fiscal-estrategia-concursos",
    title: "Curso Fiscal - Estratégia Concursos",
    segment: "fiscal",
    platform: "Estratégia Concursos",
    description: "Preparação completa para concursos da área fiscal. Conteúdo atualizado com as últimas mudanças na legislação tributária e aduaneira.",
    shortDescription: "Direito Tributário, Aduaneiro e Contábil para concursos fiscais.",
    badge: "Mais Vendido",
    originalPrice: 899,
    price: 599,
    driveUrl: "https://drive.google.com/drive/folders/SEU_ID_FISCAL",
    features: [
      "+400 aulas em vídeo",
      "Apostilas em PDF atualizadas",
      "Simulados comentados",
      "Suporte por WhatsApp",
      "Acesso via Google Drive por 12 meses",
    ],
    folderSize: "140 GB",
    totalFiles: "+400 Aulas em Vídeo e PDF",
    updatedAt: "2026-10-15",
    active: true,
    coverGradient: "from-brand-600 to-brand-800",
    stockStatus: "in_stock",
  },
  {
    id: "curso-fiscal-gran",
    slug: "curso-fiscal-gran-cursos",
    title: "Curso Fiscal - Gran Cursos Online",
    segment: "fiscal",
    platform: "Gran Cursos Online",
    description: "Curso intensivo para cargos fiscais federais, estaduais e municipais. Foco em Receita Federal, Banco do Brasil e prefeituras.",
    shortDescription: "Curso intensivo para cargos fiscais federais, estaduais e municipais.",
    badge: "Edital Publicado",
    originalPrice: 749,
    price: 499,
    driveUrl: "https://drive.google.com/drive/folders/SEU_ID_FISCAL_GRAN",
    features: [
      "+320 aulas em vídeo",
      "Material de apoio em PDF",
      "Questões de provas anteriores",
      "Plantão de dúvidas",
      "Acesso via Google Drive por 12 meses",
    ],
    folderSize: "95 GB",
    totalFiles: "+320 Aulas em Vídeo e PDF",
    updatedAt: "2026-09-22",
    active: true,
    coverGradient: "from-emerald-600 to-emerald-900",
    stockStatus: "in_stock",
  },
  {
    id: "curso-tribunais-estrategia",
    slug: "curso-tribunais-estrategia-concursos",
    title: "Curso Tribunais - Estratégia Concursos",
    segment: "tribunais",
    platform: "Estratégia Concursos",
    description: "Preparação para concursos de tribunais (TJ, TRF, TST, TSE, STJ, STF). Direito Processual Civil, Penal e Constitucional com foco em carreira de juiz e servidores.",
    shortDescription: "Preparação para concursos de tribunais de justiça e federais.",
    badge: "Edital Iminente",
    originalPrice: 949,
    price: 649,
    driveUrl: "https://drive.google.com/drive/folders/SEU_ID_TRIBUNAIS",
    features: [
      "+500 aulas em vídeo",
      "Apostilas atualizadas",
      "Banco de questões comentadas",
      "Suporte por WhatsApp",
      "Acesso via Google Drive por 12 meses",
    ],
    folderSize: "180 GB",
    totalFiles: "+500 Aulas em Vídeo e PDF",
    updatedAt: "2026-10-01",
    active: true,
    coverGradient: "from-purple-600 to-purple-900",
    stockStatus: "in_stock",
  },
  {
    id: "curso-tribunais-direcao",
    slug: "curso-tribunais-direcao-concursos",
    title: "Curso Tribunais - Direção Concursos",
    segment: "tribunais",
    platform: "Direção Concursos",
    description: "Curso focado em concursos para técnicos e analistas judiciais. Direito Administrativo, Processual e Constitucional.",
    shortDescription: "Curso focado em técnicos e analistas judiciais.",
    badge: "Super Atualizado 2026",
    originalPrice: 699,
    price: 449,
    driveUrl: "https://drive.google.com/drive/folders/SEU_ID_TRIBUNAIS_DIR",
    features: [
      "+280 aulas em vídeo",
      "Resumos para revisão",
      "Simulados por disciplina",
      "Acesso via Google Drive por 12 meses",
    ],
    folderSize: "85 GB",
    totalFiles: "+280 Aulas em Vídeo e PDF",
    updatedAt: "2026-08-30",
    active: true,
    coverGradient: "from-accent-amber to-accent-amber/80",
    stockStatus: "in_stock",
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getCoursesBySegment(segment: string): Course[] {
  return COURSES.filter((c) => c.segment === segment);
}

export function getActiveCourses(): Course[] {
  return COURSES.filter((c) => c.active);
}

export const MOCK_STUDENTS: StudentUser[] = [
  {
    id: "student-1",
    name: "João Silva",
    email: "joao.silva@gmail.com",
    password: "123456",
    role: "student",
    purchasedCourseIds: ["curso-fiscal-estrategia"],
    createdAt: "2026-09-10",
  },
  {
    id: "student-2",
    name: "Maria Oliveira",
    email: "maria.oliveira@gmail.com",
    password: "123456",
    role: "student",
    purchasedCourseIds: ["curso-tribunais-estrategia"],
    createdAt: "2026-09-15",
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2026-001",
    studentName: "João Silva",
    studentEmail: "joao.silva@gmail.com",
    studentWhatsapp: "11999999999",
    courseId: "curso-fiscal-estrategia",
    courseTitle: "Curso Fiscal - Estratégia Concursos",
    courseSegment: "fiscal",
    amount: 599,
    paymentMethod: "PIX",
    status: "PAID",
    pixCopyPaste: "00020126580014BR.GOV.BCB.PIX0136f0f3f8e0-1234-4567-89ab-cdef01234567895204000053039865405599.005802BR5925Joao Silva da Silva6009Sao Paulo62290525MERCADO PAGO:ID123630407140304A6EE0",
    pixQrCodeUrl: "",
    driveUrl: "https://drive.google.com/drive/folders/SEU_ID_FISCAL",
    createdAt: "2026-09-10T10:30:00",
    paidAt: "2026-09-10T10:35:00",
  },
  {
    id: "ORD-2026-002",
    studentName: "Maria Oliveira",
    studentEmail: "maria.oliveira@gmail.com",
    studentWhatsapp: "11888888888",
    courseId: "curso-tribunais-estrategia",
    courseTitle: "Curso Tribunais - Estratégia Concursos",
    courseSegment: "tribunais",
    amount: 649,
    paymentMethod: "PIX",
    status: "PAID",
    pixCopyPaste: "00020126580014BR.GOV.BCB.PIX0136f0f3f8e0-1234-4567-89ab-cdef01234567895204000053039865405649.005802BR5922Maria Oliveira6009Sao Paulo62290525MERCADO PAGO:ID987654321630407140304A6EE0",
    pixQrCodeUrl: "",
    driveUrl: "https://drive.google.com/drive/folders/SEU_ID_TRIBUNAIS",
    createdAt: "2026-09-15T14:20:00",
    paidAt: "2026-09-15T14:25:00",
  },
];
