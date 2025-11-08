import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * USUARIOS Y ROLES
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "cliente", "ingeniero", "asesor"]).default("cliente").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * OPERADORES DE RED
 */
export const networkOperators = mysqlTable("network_operators", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  region: varchar("region", { length: 255 }),
  contactInfo: text("contactInfo"),
  requirements: json("requirements").$type<Record<string, any>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NetworkOperator = typeof networkOperators.$inferSelect;
export type InsertNetworkOperator = typeof networkOperators.$inferInsert;

/**
 * PROYECTOS
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  openSolarId: varchar("openSolarId", { length: 255 }).unique(),
  clientId: int("clientId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  systemCapacityKw: varchar("systemCapacityKw", { length: 50 }),
  status: varchar("status", { length: 100 }).default("draft").notNull(),
  networkOperatorId: int("networkOperatorId"),
  assignedEngineerId: int("assignedEngineerId"),
  assignedAdvisorId: int("assignedAdvisorId"),
  technicalData: json("technicalData").$type<Record<string, any>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * TIPOS DE TRÁMITES (configurables por admin)
 */
export const tramiteTypes = mysqlTable("tramite_types", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["retie", "operador", "upme", "otro"]).default("operador").notNull(),
  formTemplate: json("formTemplate").$type<Record<string, any>>(),
  workflowStates: json("workflowStates").$type<string[]>(),
  requiredDocuments: json("requiredDocuments").$type<string[]>(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TramiteType = typeof tramiteTypes.$inferSelect;
export type InsertTramiteType = typeof tramiteTypes.$inferInsert;

/**
 * TRÁMITES
 */
export const tramites = mysqlTable("tramites", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  tramiteTypeId: int("tramiteTypeId").notNull(),
  status: varchar("status", { length: 100 }).default("borrador").notNull(),
  assignedToId: int("assignedToId"),
  formData: json("formData").$type<Record<string, any>>(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  dueDate: timestamp("dueDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Tramite = typeof tramites.$inferSelect;
export type InsertTramite = typeof tramites.$inferInsert;

/**
 * HISTORIAL DE ESTADOS DE TRÁMITES
 */
export const tramiteStatusHistory = mysqlTable("tramite_status_history", {
  id: int("id").autoincrement().primaryKey(),
  tramiteId: int("tramiteId").notNull(),
  fromStatus: varchar("fromStatus", { length: 100 }),
  toStatus: varchar("toStatus", { length: 100 }).notNull(),
  changedById: int("changedById").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TramiteStatusHistory = typeof tramiteStatusHistory.$inferSelect;
export type InsertTramiteStatusHistory = typeof tramiteStatusHistory.$inferInsert;

/**
 * DOCUMENTOS
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  tramiteId: int("tramiteId"),
  projectId: int("projectId"),
  documentType: varchar("documentType", { length: 255 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"),
  version: int("version").default(1).notNull(),
  uploadedById: int("uploadedById").notNull(),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * PLANTILLAS DE DOCUMENTOS
 */
export const documentTemplates = mysqlTable("document_templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  templateType: varchar("templateType", { length: 100 }).notNull(),
  content: text("content").notNull(),
  variables: json("variables").$type<string[]>(),
  networkOperatorId: int("networkOperatorId"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DocumentTemplate = typeof documentTemplates.$inferSelect;
export type InsertDocumentTemplate = typeof documentTemplates.$inferInsert;

/**
 * NOTIFICACIONES
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  relatedEntityType: varchar("relatedEntityType", { length: 100 }),
  relatedEntityId: int("relatedEntityId"),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * MENSAJES/COMUNICACIÓN
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId"),
  tramiteId: int("tramiteId"),
  senderId: int("senderId").notNull(),
  content: text("content").notNull(),
  attachments: json("attachments").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * LOG DE SINCRONIZACIÓN CON OPENSOLAR
 */
export const openSolarSyncLog = mysqlTable("opensolar_sync_log", {
  id: int("id").autoincrement().primaryKey(),
  syncType: varchar("syncType", { length: 100 }).notNull(),
  direction: mysqlEnum("direction", ["from_opensolar", "to_opensolar"]).notNull(),
  entityType: varchar("entityType", { length: 100 }),
  entityId: varchar("entityId", { length: 255 }),
  status: mysqlEnum("status", ["success", "error", "pending"]).default("pending").notNull(),
  details: json("details").$type<Record<string, any>>(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OpenSolarSyncLog = typeof openSolarSyncLog.$inferSelect;
export type InsertOpenSolarSyncLog = typeof openSolarSyncLog.$inferInsert;

/**
 * CONFIGURACIÓN DE WEBHOOKS DE OPENSOLAR
 */
export const openSolarWebhooks = mysqlTable("opensolar_webhooks", {
  id: int("id").autoincrement().primaryKey(),
  webhookId: varchar("webhookId", { length: 255 }).unique(),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  lastTriggered: timestamp("lastTriggered"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OpenSolarWebhook = typeof openSolarWebhooks.$inferSelect;
export type InsertOpenSolarWebhook = typeof openSolarWebhooks.$inferInsert;

/**
 * RELACIONES
 */
export const usersRelations = relations(users, ({ many }) => ({
  projectsAsClient: many(projects, { relationName: "clientProjects" }),
  projectsAsEngineer: many(projects, { relationName: "engineerProjects" }),
  projectsAsAdvisor: many(projects, { relationName: "advisorProjects" }),
  tramites: many(tramites),
  documents: many(documents),
  notifications: many(notifications),
  messages: many(messages),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(users, {
    fields: [projects.clientId],
    references: [users.id],
    relationName: "clientProjects",
  }),
  assignedEngineer: one(users, {
    fields: [projects.assignedEngineerId],
    references: [users.id],
    relationName: "engineerProjects",
  }),
  assignedAdvisor: one(users, {
    fields: [projects.assignedAdvisorId],
    references: [users.id],
    relationName: "advisorProjects",
  }),
  networkOperator: one(networkOperators, {
    fields: [projects.networkOperatorId],
    references: [networkOperators.id],
  }),
  tramites: many(tramites),
  documents: many(documents),
  messages: many(messages),
}));

export const tramitesRelations = relations(tramites, ({ one, many }) => ({
  project: one(projects, {
    fields: [tramites.projectId],
    references: [projects.id],
  }),
  tramiteType: one(tramiteTypes, {
    fields: [tramites.tramiteTypeId],
    references: [tramiteTypes.id],
  }),
  assignedTo: one(users, {
    fields: [tramites.assignedToId],
    references: [users.id],
  }),
  documents: many(documents),
  statusHistory: many(tramiteStatusHistory),
  messages: many(messages),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  tramite: one(tramites, {
    fields: [documents.tramiteId],
    references: [tramites.id],
  }),
  project: one(projects, {
    fields: [documents.projectId],
    references: [projects.id],
  }),
  uploadedBy: one(users, {
    fields: [documents.uploadedById],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [messages.projectId],
    references: [projects.id],
  }),
  tramite: one(tramites, {
    fields: [messages.tramiteId],
    references: [tramites.id],
  }),
}));
