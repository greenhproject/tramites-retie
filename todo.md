# TODO - Sistema de Gestión de Trámites RETIE

## Fase 1: Esquema de Base de Datos
- [x] Definir tablas para roles personalizados (admin, cliente, ingeniero, asesor)
- [x] Crear tabla de proyectos con integración OpenSolar
- [x] Diseñar tabla de trámites y tipos de trámites
- [x] Crear tabla de formularios configurables
- [x] Diseñar tabla de documentos y plantillas
- [x] Crear tabla de operadores de red
- [x] Diseñar tabla de estados de workflow
- [x] Crear tabla de notificaciones y mensajes
- [x] Diseñar tabla de sincronización con OpenSolar
- [x] Implementar migraciones de base de datos

## Fase 2: Autenticación y Roles
- [x] Extender modelo de usuario con roles personalizados
- [x] Implementar middleware de autorización por rol
- [x] Crear procedimientos protegidos por rol (admin, ingeniero, asesor, cliente)
- [x] Desarrollar página de login personalizada
- [x] Implementar gestión de usuarios (admin)
- [ ] Crear sistema de invitaciones por rol

## Fase 3: Gestión de Proyectos
- [x] Crear CRUD de proyectos
- [x] Implementar dashboard de proyectos por rol
- [x] Desarrollar vista de detalles de proyecto
- [ ] Crear sistema de asignación de proyectos a ingenieros/asesores
- [x] Implementar filtros y búsqueda de proyectos
- [ ] Desarrollar sincronización básica con OpenSolar

## Fase 4: Trámites Configurables
- [x] Crear constructor de formularios dinámicos (admin)
- [x] Implementar tipos de trámites configurables
- [ ] Desarrollar renderizado dinámico de formularios
- [ ] Crear sistema de validaciones configurables
- [ ] Implementar guardado automático de progreso
- [x] Desarrollar gestión de trámites por proyecto

## Fase 5: Workflow de Trámites
- [ ] Crear sistema de estados configurables
- [ ] Implementar transiciones de estado con validaciones
- [ ] Desarrollar timeline visual de trámites
- [ ] Crear sistema de recordatorios y vencimientos
- [ ] Implementar asignación automática de responsables
- [ ] Desarrollar historial de cambios de estado

## Fase 6: Gestión Documental
- [ ] Implementar carga de documentos a S3
- [ ] Crear sistema de categorización de documentos
- [ ] Desarrollar versionamiento de documentos
- [ ] Implementar generador de documentos desde plantillas
- [ ] Crear editor de plantillas con variables dinámicas
- [ ] Desarrollar descarga masiva de documentos
- [ ] Implementar vista previa de documentos

## Fase 7: Comunicación y Notificaciones
- [x] Crear sistema de mensajería interna
- [x] Implementar notificaciones en tiempo real
- [ ] Desarrollar notificaciones por email
- [ ] Crear sistema de comentarios por trámite
- [ ] Implementar menciones entre usuarios
- [ ] Desarrollar historial de comunicaciones
- [ ] Crear preferencias de notificaciones por usuario

## Fase 8: Integración OpenSolar
- [ ] Configurar autenticación con API de OpenSolar
- [ ] Implementar webhooks de OpenSolar
- [ ] Desarrollar sincronización de proyectos (OpenSolar → Plataforma)
- [ ] Implementar actualización de estados (Plataforma → OpenSolar)
- [ ] Crear sincronización de contactos
- [ ] Desarrollar manejo de conflictos de datos
- [ ] Implementar log de sincronizaciones

## Fase 9: Dashboards y Reportes
- [ ] Crear dashboard ejecutivo (admin)
- [ ] Desarrollar dashboard de ingeniero
- [ ] Crear dashboard de asesor comercial
- [ ] Implementar dashboard de cliente
- [ ] Desarrollar reportes de tiempos por etapa
- [ ] Crear reportes por operador de red
- [ ] Implementar gráficos y visualizaciones
- [ ] Desarrollar exportación de reportes

## Fase 10: Pruebas y Despliegue
- [ ] Realizar pruebas de flujos completos
- [ ] Verificar permisos por rol
- [ ] Probar integración con OpenSolar
- [ ] Validar generación de documentos
- [ ] Verificar notificaciones
- [ ] Realizar pruebas de rendimiento
- [ ] Crear checkpoint final para despliegue

## Fase 11: Documentación
- [ ] Documentar arquitectura del sistema
- [ ] Crear manual de usuario por rol
- [ ] Documentar API de integración
- [ ] Crear guía de configuración de formularios
- [ ] Documentar proceso de sincronización OpenSolar
