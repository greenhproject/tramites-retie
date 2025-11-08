import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

// Middleware para verificar rol de admin
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Se requiere rol de administrador' });
  }
  return next({ ctx });
});

// Middleware para verificar rol de ingeniero
const engineerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'ingeniero' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Se requiere rol de ingeniero' });
  }
  return next({ ctx });
});

// Middleware para verificar rol de asesor
const advisorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'asesor' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Se requiere rol de asesor' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  users: router({
    getAll: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),
    getByRole: adminProcedure.input(z.object({
      role: z.enum(["admin", "cliente", "ingeniero", "asesor"])
    })).query(async ({ input }) => {
      return await db.getUsersByRole(input.role);
    }),
    updateRole: adminProcedure.input(z.object({
      userId: z.number(),
      role: z.enum(["admin", "cliente", "ingeniero", "asesor"])
    })).mutation(async ({ input }) => {
      await db.updateUserRole(input.userId, input.role);
      return { success: true };
    }),
  }),

  networkOperators: router({
    getAll: protectedProcedure.query(async () => {
      return await db.getAllNetworkOperators();
    }),
    create: adminProcedure.input(z.object({
      name: z.string(),
      region: z.string().optional(),
      contactInfo: z.string().optional(),
      requirements: z.record(z.string(), z.any()).optional()
    })).mutation(async ({ input }) => {
      return await db.createNetworkOperator(input);
    }),
  }),

  projects: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      // Admin ve todos los proyectos
      if (ctx.user.role === 'admin') {
        return await db.getAllProjects();
      }
      // Cliente ve solo sus proyectos
      if (ctx.user.role === 'cliente') {
        return await db.getProjectsByClient(ctx.user.id);
      }
      // Ingeniero ve proyectos asignados
      if (ctx.user.role === 'ingeniero') {
        return await db.getProjectsByEngineer(ctx.user.id);
      }
      // Asesor ve proyectos asignados
      if (ctx.user.role === 'asesor') {
        return await db.getProjectsByAdvisor(ctx.user.id);
      }
      return [];
    }),
    
    getById: protectedProcedure.input(z.object({
      id: z.number()
    })).query(async ({ input, ctx }) => {
      const project = await db.getProjectById(input.id);
      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Proyecto no encontrado' });
      }
      
      // Verificar permisos
      const canAccess = 
        ctx.user.role === 'admin' ||
        project.clientId === ctx.user.id ||
        project.assignedEngineerId === ctx.user.id ||
        project.assignedAdvisorId === ctx.user.id;
      
      if (!canAccess) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'No tiene permisos para ver este proyecto' });
      }
      
      return project;
    }),
    
    create: protectedProcedure.input(z.object({
      name: z.string(),
      clientId: z.number(),
      address: z.string().optional(),
      systemCapacityKw: z.string().optional(),
      networkOperatorId: z.number().optional(),
      assignedEngineerId: z.number().optional(),
      assignedAdvisorId: z.number().optional(),
      openSolarId: z.string().optional(),
      technicalData: z.record(z.string(), z.any()).optional()
    })).mutation(async ({ input, ctx }) => {
      // Solo admin y asesor pueden crear proyectos
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'asesor') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'No tiene permisos para crear proyectos' });
      }
      
      const result = await db.createProject(input);
      return { success: true, insertId: result[0]?.insertId };
    }),
    
    update: protectedProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      address: z.string().optional(),
      systemCapacityKw: z.string().optional(),
      status: z.string().optional(),
      networkOperatorId: z.number().optional(),
      assignedEngineerId: z.number().optional(),
      assignedAdvisorId: z.number().optional(),
      technicalData: z.record(z.string(), z.any()).optional()
    })).mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const project = await db.getProjectById(id);
      
      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Proyecto no encontrado' });
      }
      
      // Verificar permisos de edición
      const canEdit = 
        ctx.user.role === 'admin' ||
        ctx.user.role === 'asesor' ||
        (ctx.user.role === 'ingeniero' && project.assignedEngineerId === ctx.user.id);
      
      if (!canEdit) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'No tiene permisos para editar este proyecto' });
      }
      
      await db.updateProject(id, data);
      return { success: true };
    }),
  }),

  tramiteTypes: router({
    getAll: protectedProcedure.query(async () => {
      return await db.getAllTramiteTypes();
    }),
    
    getById: protectedProcedure.input(z.object({
      id: z.number()
    })).query(async ({ input }) => {
      const tramiteType = await db.getTramiteTypeById(input.id);
      if (!tramiteType) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Tipo de trámite no encontrado' });
      }
      return tramiteType;
    }),
    
    create: adminProcedure.input(z.object({
      name: z.string(),
      description: z.string().optional(),
      category: z.enum(["retie", "operador", "upme", "otro"]),
      formTemplate: z.record(z.string(), z.any()).optional(),
      workflowStates: z.array(z.string()).optional(),
      requiredDocuments: z.array(z.string()).optional(),
    })).mutation(async ({ input }) => {
      const result = await db.createTramiteType(input);
      return { success: true, insertId: result[0]?.insertId };
    }),
    
    update: adminProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      category: z.enum(["retie", "operador", "upme", "otro"]).optional(),
      formTemplate: z.record(z.string(), z.any()).optional(),
      workflowStates: z.array(z.string()).optional(),
      requiredDocuments: z.array(z.string()).optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.updateTramiteType(id, data);
      return { success: true };
    }),
  }),

  tramites: router({
    getByProject: protectedProcedure.input(z.object({
      projectId: z.number()
    })).query(async ({ input, ctx }) => {
      const project = await db.getProjectById(input.projectId);
      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Proyecto no encontrado' });
      }
      
      // Verificar permisos
      const canAccess = 
        ctx.user.role === 'admin' ||
        project.clientId === ctx.user.id ||
        project.assignedEngineerId === ctx.user.id ||
        project.assignedAdvisorId === ctx.user.id;
      
      if (!canAccess) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      
      return await db.getTramitesByProject(input.projectId);
    }),
    
    getById: protectedProcedure.input(z.object({
      id: z.number()
    })).query(async ({ input, ctx }) => {
      const tramite = await db.getTramiteById(input.id);
      if (!tramite) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Trámite no encontrado' });
      }
      
      const project = await db.getProjectById(tramite.projectId);
      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Proyecto no encontrado' });
      }
      
      const canAccess = 
        ctx.user.role === 'admin' ||
        project.clientId === ctx.user.id ||
        project.assignedEngineerId === ctx.user.id ||
        project.assignedAdvisorId === ctx.user.id ||
        tramite.assignedToId === ctx.user.id;
      
      if (!canAccess) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      
      return tramite;
    }),
    
    create: protectedProcedure.input(z.object({
      projectId: z.number(),
      tramiteTypeId: z.number(),
      assignedToId: z.number().optional(),
      formData: z.record(z.string(), z.any()).optional(),
      dueDate: z.date().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input, ctx }) => {
      // Verificar que el usuario tenga permisos sobre el proyecto
      const project = await db.getProjectById(input.projectId);
      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Proyecto no encontrado' });
      }
      
      const canCreate = 
        ctx.user.role === 'admin' ||
        ctx.user.role === 'ingeniero' ||
        ctx.user.role === 'asesor';
      
      if (!canCreate) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      
      const result = await db.createTramite(input);
      return { success: true, insertId: result[0]?.insertId };
    }),
    
    update: protectedProcedure.input(z.object({
      id: z.number(),
      status: z.string().optional(),
      assignedToId: z.number().optional(),
      formData: z.record(z.string(), z.any()).optional(),
      dueDate: z.date().optional(),
      notes: z.string().optional(),
      completedAt: z.date().optional(),
    })).mutation(async ({ input, ctx }) => {
      const { id, status, ...data } = input;
      const tramite = await db.getTramiteById(id);
      
      if (!tramite) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Trámite no encontrado' });
      }
      
      const project = await db.getProjectById(tramite.projectId);
      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Proyecto no encontrado' });
      }
      
      const canEdit = 
        ctx.user.role === 'admin' ||
        (ctx.user.role === 'ingeniero' && project.assignedEngineerId === ctx.user.id) ||
        tramite.assignedToId === ctx.user.id;
      
      if (!canEdit) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      
      // Si hay cambio de estado, registrar en historial
      if (status && status !== tramite.status) {
        await db.createStatusHistory({
          tramiteId: id,
          fromStatus: tramite.status,
          toStatus: status,
          changedById: ctx.user.id,
        });
        await db.updateTramite(id, { ...data, status });
      } else {
        await db.updateTramite(id, data);
      }
      
      return { success: true };
    }),
    
    getStatusHistory: protectedProcedure.input(z.object({
      tramiteId: z.number()
    })).query(async ({ input }) => {
      return await db.getStatusHistoryByTramite(input.tramiteId);
    }),
  }),

  documents: router({
    getByTramite: protectedProcedure.input(z.object({
      tramiteId: z.number()
    })).query(async ({ input }) => {
      return await db.getDocumentsByTramite(input.tramiteId);
    }),
    
    getByProject: protectedProcedure.input(z.object({
      projectId: z.number()
    })).query(async ({ input }) => {
      return await db.getDocumentsByProject(input.projectId);
    }),
    
    create: protectedProcedure.input(z.object({
      tramiteId: z.number().optional(),
      projectId: z.number().optional(),
      documentType: z.string(),
      fileName: z.string(),
      fileKey: z.string(),
      fileUrl: z.string(),
      mimeType: z.string().optional(),
      fileSize: z.number().optional(),
      category: z.string().optional(),
    })).mutation(async ({ input, ctx }) => {
      const result = await db.createDocument({
        ...input,
        uploadedById: ctx.user.id,
      });
      return { success: true, insertId: result[0]?.insertId };
    }),
  }),

  notifications: router({
    getMy: protectedProcedure.query(async ({ ctx }) => {
      return await db.getNotificationsByUser(ctx.user.id);
    }),
    
    getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUnreadNotificationsCount(ctx.user.id);
    }),
    
    markAsRead: protectedProcedure.input(z.object({
      id: z.number()
    })).mutation(async ({ input }) => {
      await db.markNotificationAsRead(input.id);
      return { success: true };
    }),
    
    markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
      await db.markAllNotificationsAsRead(ctx.user.id);
      return { success: true };
    }),
  }),

  messages: router({
    getByProject: protectedProcedure.input(z.object({
      projectId: z.number()
    })).query(async ({ input }) => {
      return await db.getMessagesByProject(input.projectId);
    }),
    
    getByTramite: protectedProcedure.input(z.object({
      tramiteId: z.number()
    })).query(async ({ input }) => {
      return await db.getMessagesByTramite(input.tramiteId);
    }),
    
    create: protectedProcedure.input(z.object({
      projectId: z.number().optional(),
      tramiteId: z.number().optional(),
      content: z.string(),
      attachments: z.array(z.string()).optional(),
    })).mutation(async ({ input, ctx }) => {
      const result = await db.createMessage({
        ...input,
        senderId: ctx.user.id,
      });
      return { success: true, insertId: result[0]?.insertId };
    }),
  }),
});

export type AppRouter = typeof appRouter;
