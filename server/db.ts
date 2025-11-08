import { eq, and, desc, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, User,
  projects, Project, InsertProject,
  tramites, Tramite, InsertTramite,
  tramiteTypes, TramiteType, InsertTramiteType,
  networkOperators, NetworkOperator, InsertNetworkOperator,
  documents, Document, InsertDocument,
  documentTemplates, DocumentTemplate, InsertDocumentTemplate,
  notifications, Notification, InsertNotification,
  messages, Message, InsertMessage,
  tramiteStatusHistory, TramiteStatusHistory, InsertTramiteStatusHistory,
  openSolarSyncLog, OpenSolarSyncLog, InsertOpenSolarSyncLog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

/**
 * USUARIOS
 */
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUsersByRole(role: User["role"]) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).where(eq(users.role, role));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserRole(userId: number, role: User["role"]) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

/**
 * OPERADORES DE RED
 */
export async function createNetworkOperator(operator: InsertNetworkOperator) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(networkOperators).values(operator);
  return result;
}

export async function getAllNetworkOperators() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(networkOperators).orderBy(networkOperators.name);
}

export async function getNetworkOperatorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(networkOperators).where(eq(networkOperators.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * PROYECTOS
 */
export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projects).values(project);
  return result;
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProjectByOpenSolarId(openSolarId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.openSolarId, openSolarId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProjectsByClient(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(projects).where(eq(projects.clientId, clientId)).orderBy(desc(projects.createdAt));
}

export async function getProjectsByEngineer(engineerId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(projects).where(eq(projects.assignedEngineerId, engineerId)).orderBy(desc(projects.createdAt));
}

export async function getProjectsByAdvisor(advisorId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(projects).where(eq(projects.assignedAdvisorId, advisorId)).orderBy(desc(projects.createdAt));
}

export async function getAllProjects() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(projects).orderBy(desc(projects.createdAt));
}

export async function updateProject(id: number, data: Partial<Project>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(projects).set(data).where(eq(projects.id, id));
}

/**
 * TIPOS DE TRÁMITES
 */
export async function createTramiteType(tramiteType: InsertTramiteType) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tramiteTypes).values(tramiteType);
  return result;
}

export async function getAllTramiteTypes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tramiteTypes).where(eq(tramiteTypes.isActive, true)).orderBy(tramiteTypes.name);
}

export async function getTramiteTypeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tramiteTypes).where(eq(tramiteTypes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateTramiteType(id: number, data: Partial<TramiteType>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(tramiteTypes).set(data).where(eq(tramiteTypes.id, id));
}

/**
 * TRÁMITES
 */
export async function createTramite(tramite: InsertTramite) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tramites).values(tramite);
  return result;
}

export async function getTramiteById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tramites).where(eq(tramites.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTramitesByProject(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tramites).where(eq(tramites.projectId, projectId)).orderBy(desc(tramites.createdAt));
}

export async function getTramitesByAssignedUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tramites).where(eq(tramites.assignedToId, userId)).orderBy(desc(tramites.createdAt));
}

export async function updateTramite(id: number, data: Partial<Tramite>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(tramites).set(data).where(eq(tramites.id, id));
}

/**
 * HISTORIAL DE ESTADOS
 */
export async function createStatusHistory(history: InsertTramiteStatusHistory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tramiteStatusHistory).values(history);
  return result;
}

export async function getStatusHistoryByTramite(tramiteId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tramiteStatusHistory).where(eq(tramiteStatusHistory.tramiteId, tramiteId)).orderBy(desc(tramiteStatusHistory.createdAt));
}

/**
 * DOCUMENTOS
 */
export async function createDocument(document: InsertDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(documents).values(document);
  return result;
}

export async function getDocumentsByTramite(tramiteId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(documents).where(eq(documents.tramiteId, tramiteId)).orderBy(desc(documents.createdAt));
}

export async function getDocumentsByProject(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(documents).where(eq(documents.projectId, projectId)).orderBy(desc(documents.createdAt));
}

export async function getDocumentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * PLANTILLAS DE DOCUMENTOS
 */
export async function createDocumentTemplate(template: InsertDocumentTemplate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(documentTemplates).values(template);
  return result;
}

export async function getAllDocumentTemplates() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(documentTemplates).where(eq(documentTemplates.isActive, true)).orderBy(documentTemplates.name);
}

export async function getDocumentTemplateById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(documentTemplates).where(eq(documentTemplates.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * NOTIFICACIONES
 */
export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(notifications).values(notification);
  return result;
}

export async function getNotificationsByUser(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
}

export async function getUnreadNotificationsCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return result[0]?.count || 0;
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}

export async function markAllNotificationsAsRead(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ isRead: true }).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
}

/**
 * MENSAJES
 */
export async function createMessage(message: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(messages).values(message);
  return result;
}

export async function getMessagesByProject(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(messages).where(eq(messages.projectId, projectId)).orderBy(messages.createdAt);
}

export async function getMessagesByTramite(tramiteId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(messages).where(eq(messages.tramiteId, tramiteId)).orderBy(messages.createdAt);
}

/**
 * LOG DE SINCRONIZACIÓN OPENSOLAR
 */
export async function createSyncLog(log: InsertOpenSolarSyncLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(openSolarSyncLog).values(log);
  return result;
}

export async function getRecentSyncLogs(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(openSolarSyncLog).orderBy(desc(openSolarSyncLog.createdAt)).limit(limit);
}

export async function getSyncLogsByEntity(entityType: string, entityId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(openSolarSyncLog).where(and(eq(openSolarSyncLog.entityType, entityType), eq(openSolarSyncLog.entityId, entityId))).orderBy(desc(openSolarSyncLog.createdAt));
}
