import { useAuth } from "@/_core/hooks/useAuth";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STATUS_LABELS, ROLES } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Zap,
  User,
  Building2,
  FileText,
  MessageSquare,
  Plus,
} from "lucide-react";
import { Link, useRoute } from "wouter";

export default function ProjectDetail() {
  const { user } = useAuth();
  const [, params] = useRoute("/proyectos/:id");
  const projectId = params?.id ? parseInt(params.id) : 0;

  const { data: project, isLoading } = trpc.projects.getById.useQuery(
    { id: projectId },
    { enabled: projectId > 0 }
  );

  const { data: tramites } = trpc.tramites.getByProject.useQuery(
    { projectId },
    { enabled: projectId > 0 }
  );

  const { data: documents } = trpc.documents.getByProject.useQuery(
    { projectId },
    { enabled: projectId > 0 }
  );

  const { data: messages } = trpc.messages.getByProject.useQuery(
    { projectId },
    { enabled: projectId > 0 }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <main className="container flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <main className="container py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground">Proyecto no encontrado</p>
              <Button asChild className="mt-4">
                <Link href="/proyectos">Volver a proyectos</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const canEdit = user?.role === ROLES.ADMIN || user?.role === ROLES.ASESOR;

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="mb-4 gap-2">
            <Link href="/proyectos">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {project.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{project.address}</span>
                  </div>
                )}
                {project.systemCapacityKw && (
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    <span>{project.systemCapacityKw} kW</span>
                  </div>
                )}
              </div>
            </div>
            <Badge variant="secondary" className="w-fit">
              {STATUS_LABELS[project.status] || project.status}
            </Badge>
          </div>
        </div>

        {/* Info Cards Grid - Responsive */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={<User className="h-5 w-5" />}
            label="Cliente"
            value={`ID: ${project.clientId}`}
          />
          {project.networkOperatorId && (
            <InfoCard
              icon={<Building2 className="h-5 w-5" />}
              label="Operador de Red"
              value={`ID: ${project.networkOperatorId}`}
            />
          )}
          <InfoCard
            icon={<FileText className="h-5 w-5" />}
            label="Trámites"
            value={tramites?.length || 0}
          />
          <InfoCard
            icon={<MessageSquare className="h-5 w-5" />}
            label="Mensajes"
            value={messages?.length || 0}
          />
        </div>

        {/* Tabs - Mobile friendly */}
        <Tabs defaultValue="tramites" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tramites">Trámites</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="comunicacion">Comunicación</TabsTrigger>
          </TabsList>

          {/* Trámites Tab */}
          <TabsContent value="tramites" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Trámites del Proyecto</CardTitle>
                  <CardDescription>Gestiona los trámites asociados</CardDescription>
                </div>
                {canEdit && (
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Nuevo Trámite</span>
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {tramites && tramites.length > 0 ? (
                  <div className="space-y-3">
                    {tramites.map((tramite) => (
                      <div
                        key={tramite.id}
                        className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">Trámite #{tramite.id}</p>
                          <p className="text-sm text-muted-foreground">
                            Tipo: {tramite.tramiteTypeId}
                          </p>
                        </div>
                        <Badge variant="secondary">{tramite.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No hay trámites registrados
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentos Tab */}
          <TabsContent value="documentos" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Documentos</CardTitle>
                  <CardDescription>Archivos del proyecto</CardDescription>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Subir</span>
                </Button>
              </CardHeader>
              <CardContent>
                {documents && documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground">{doc.documentType}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No hay documentos</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comunicación Tab */}
          <TabsContent value="comunicacion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comunicación</CardTitle>
                <CardDescription>Mensajes y comentarios del proyecto</CardDescription>
              </CardHeader>
              <CardContent>
                {messages && messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="rounded-lg border border-border p-4">
                        <p className="text-sm">{msg.content}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Usuario ID: {msg.senderId}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No hay mensajes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="truncate font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
