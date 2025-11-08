export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "Sistema de Gestión de Trámites RETIE";

export const APP_LOGO = import.meta.env.VITE_APP_LOGO || "https://placehold.co/128x128/6CBF00/FFFFFF?text=GHP";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

// Roles disponibles en el sistema
export const ROLES = {
  ADMIN: "admin",
  CLIENTE: "cliente",
  INGENIERO: "ingeniero",
  ASESOR: "asesor",
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// Categorías de trámites
export const TRAMITE_CATEGORIES = {
  RETIE: "retie",
  OPERADOR: "operador",
  UPME: "upme",
  OTRO: "otro",
} as const;

// Estados comunes de trámites
export const TRAMITE_STATUS = {
  BORRADOR: "borrador",
  EN_REVISION: "en_revision",
  ENVIADO: "enviado",
  EN_PROCESO: "en_proceso",
  APROBADO: "aprobado",
  RECHAZADO: "rechazado",
  COMPLETADO: "completado",
} as const;

// Estados de proyectos
export const PROJECT_STATUS = {
  DRAFT: "draft",
  IN_PROGRESS: "in_progress",
  PENDING_APPROVAL: "pending_approval",
  APPROVED: "approved",
  ON_HOLD: "on_hold",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

// Mapeo de estados a colores
export const STATUS_COLORS: Record<string, string> = {
  borrador: "bg-gray-100 text-gray-800",
  en_revision: "bg-blue-100 text-blue-800",
  enviado: "bg-purple-100 text-purple-800",
  en_proceso: "bg-yellow-100 text-yellow-800",
  aprobado: "bg-green-100 text-green-800",
  rechazado: "bg-red-100 text-red-800",
  completado: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  pending_approval: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  on_hold: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

// Etiquetas legibles para estados
export const STATUS_LABELS: Record<string, string> = {
  borrador: "Borrador",
  en_revision: "En Revisión",
  enviado: "Enviado",
  en_proceso: "En Proceso",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  completado: "Completado",
  draft: "Borrador",
  in_progress: "En Progreso",
  pending_approval: "Pendiente de Aprobación",
  approved: "Aprobado",
  on_hold: "En Espera",
  completed: "Completado",
  cancelled: "Cancelado",
};

// Etiquetas legibles para roles
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  cliente: "Cliente",
  ingeniero: "Ingeniero",
  asesor: "Asesor Comercial",
};

// Información de la empresa
export const COMPANY_INFO = {
  name: "Green House Project",
  tagline: "Revoluciona el concepto de vivir",
  email: "info@greenhproject.com",
  phone: "(57) 3214567644",
  address: "Bodega C17, Parque Industrial Santo Domingo, Mosquera, Colombia",
};
