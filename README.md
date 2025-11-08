# Sistema de Gestión de Trámites RETIE

Plataforma web completa para gestionar trámites ante operadores de red y certificaciones RETIE para proyectos de energía solar.

## 🌟 Características Principales

- **Sistema de Roles**: Admin, Cliente, Ingeniero, Asesor Comercial
- **Gestión de Proyectos**: CRUD completo con asignación de responsables
- **Trámites Configurables**: Tipos de trámites personalizables por operador
- **Notificaciones en Tiempo Real**: Centro de notificaciones integrado
- **Diseño Responsive**: 100% optimizado para móviles y tablets
- **Integración OpenSolar**: Preparado para sincronización bidireccional

## 🎨 Diseño

- Paleta de colores de Green House Project (#6CBF00)
- Interfaz limpia y moderna estilo Apple
- Componentes shadcn/ui + Tailwind CSS 4

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Express 4 + tRPC 11
- **Base de Datos**: MySQL/TiDB con Drizzle ORM
- **Autenticación**: Manus OAuth
- **Estilos**: Tailwind CSS 4
- **Componentes**: shadcn/ui

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
# Las variables del sistema ya están preconfiguradas en Manus

# Aplicar migraciones de base de datos
pnpm db:push

# Iniciar servidor de desarrollo
pnpm dev
```

## 🗄️ Estructura de Base de Datos

- **users**: Usuarios con roles personalizados
- **projects**: Proyectos solares
- **tramites**: Trámites individuales
- **tramite_types**: Tipos de trámites configurables
- **documents**: Documentos asociados a proyectos/trámites
- **notifications**: Notificaciones del sistema
- **messages**: Mensajería interna
- **network_operators**: Operadores de red
- **opensolar_sync_logs**: Logs de sincronización

## 🚀 Despliegue

El proyecto está configurado para desplegarse en la plataforma Manus:

1. Crear checkpoint desde la interfaz
2. Hacer clic en "Publish" en el dashboard
3. La aplicación estará disponible en tu dominio personalizado

## 📝 Próximas Funcionalidades

- [ ] Integración bidireccional con OpenSolar
- [ ] Sistema de carga de documentos a S3
- [ ] Notificaciones por email
- [ ] Formularios dinámicos completos
- [ ] Generación de documentos desde plantillas
- [ ] Timeline visual de trámites
- [ ] Reportes y analytics

## 👥 Roles y Permisos

### Administrador
- Gestión completa de usuarios
- Configuración de tipos de trámites
- Acceso a todos los proyectos
- Configuración del sistema

### Ingeniero
- Gestión de trámites técnicos
- Actualización de estados
- Carga de documentos técnicos

### Asesor Comercial
- Creación de proyectos
- Asignación de responsables
- Seguimiento comercial

### Cliente
- Visualización de sus proyectos
- Seguimiento de trámites
- Recepción de notificaciones

## 🔗 Enlaces

- **Repositorio**: https://github.com/greenhproject/tramites-retie
- **Empresa**: [Green House Project](https://www.greenhproject.com)
- **Documentación OpenSolar**: https://developers.opensolar.com/api/

## 📄 Licencia

Copyright © 2025 Green House Project. Todos los derechos reservados.
