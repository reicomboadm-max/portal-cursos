export type SegmentType = "fiscal" | "policial" | "tribunais" | "administrativo" | "disciplinas";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Course {
  id: string;
  slug: string;
  title: string;
  segment: SegmentType;
  platform: string; // "Estratégia Concursos", "Gran Cursos", "Direção Concursos", etc.
  description: string;
  shortDescription?: string;
  badge?: string; // "Mais Vendido", "Edital Publicado", "Edital Iminente", "Super Atualizado 2026"
  originalPrice: number;
  price: number;
  driveUrl: string;
  features: string[];
  folderSize: string; // "140 GB", "95 GB"
  totalFiles: string; // "+1.400 Aulas em Vídeo e PDF"
  updatedAt: string;
  active: boolean;
  coverGradient: string;
  rating?: number;
  reviewsCount?: number;
  syllabusHighlights?: string[];
  stockStatus: StockStatus; // Controle de estoque
  stockQuantity?: number; // Quantidade disponível (opcional)
}

export type OrderStatus = "PENDING" | "PAID" | "DELIVERED" | "CANCELED";

export interface Order {
  id: string;
  studentName: string;
  studentEmail: string; // Gmail informado para envio
  studentWhatsapp?: string;
  studentCpf?: string;
  courseId: string;
  courseTitle: string;
  courseSegment: SegmentType;
  amount: number;
  paymentMethod: "PIX" | "Cartão" | "Transferência";
  status: OrderStatus;
  pixCopyPaste: string;
  pixQrCodeUrl?: string;
  driveUrl: string;
  createdAt: string;
  paidAt?: string;
  deliveredAt?: string;
  deliveryEstimatedMax?: string; // Data limite (24h)
  veloraTransactionId?: string;
  studentState?: string; // UF (ex: "DF", "SP", "RJ", "MG")
  studentCity?: string;
  utmSource?: string;
}

export interface VisitorEvent {
  path: string;
  state?: string;
  city?: string;
  device: "mobile" | "desktop" | "tablet";
  utmSource?: string;
  referrer?: string;
  timestamp: string;
}

export interface AnalyticsStats {
  todayVisits: number;
  yesterdayVisits: number;
  totalVisits: number;
  uniqueVisitors: number;
  visitsByHour: Record<string, number>;
  visitsByState: Record<string, number>;
  visitsByUtm: Record<string, number>;
  recentEvents: VisitorEvent[];
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "student" | "admin";
  purchasedCourseIds: string[];
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  adminEmails: string[];
  pixKey: string;
  pixKeyType: string;
  beneficiaryName: string;
  beneficiaryCity: string;
  whatsappSupport: string;
  telegramSupport: string;
  telegramChannel?: string;
  bannerNotice: string;
  deliveryTimeNotice: string; // Ex: "Envio em até 24 horas após confirmação do PIX"
  allowSelfRegistration: boolean;
  veloraEnabled?: boolean;
  veloraApiKey?: string;
  veloraApiSecret?: string;
  veloraWebhookSecret?: string;
  googleAnalyticsId?: string; // Ex: G-XXXXXXXXXX
  facebookPixelId?: string; // Ex: 123456789012345
}
