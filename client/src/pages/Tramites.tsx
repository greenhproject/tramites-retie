import { useAuth } from "@/_core/hooks/useAuth";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES, STATUS_LABELS, STATUS_COLORS } from "@/const";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Loader2, FileText, Filter } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Tramites() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: allProjects } = trpc.projects.getAll.useQuery();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  
  // Por ahora mostramos un mensaje, luego implementaremos getAll para admin
  const tramites: any[] = [];
  const isLoading = false;
  const { data: projects } = trpc.projects.getAll.useQuery();

  const filteredTramites = tramites?.filter((tramite: any) => {
    const matchesSearch = tramite.id.toString().includes(searchQuery);
    const matchesStatus = statusFilter === "all" || tramite.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const canCreateTramite = user?.role === ROLES.ADMIN || user?.role === ROLES.INGENIERO;

  const getProjectName = (projectId: number) => {
    return projects?.find((p) => p.id === projectId)?.name || `Proyecto #${projectId}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trámites</h1>
            <p className="text-muted-foreground">
              Gestiona todos los trámites RETIE y operadores
            </p>
          </div>
          {canCreateTramite && (
            <Button asChild className="gap-2">
              <Link href="/tramites/nuevo">
                <Plus className="h-4 w-4" />
                Nuevo Trámite
              </Link>
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="en_revision">En Revisión</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="en_proceso">En Proceso</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tramites List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTramites && filteredTramites.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border bg-muted/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
                          <th className="px-6 py-3 text-left text-sm font-medium">Proyecto</th>
                          <th className="px-6 py-3 text-left text-sm font-medium">Tipo</th>
                          <th className="px-6 py-3 text-left text-sm font-medium">Estado</th>
                          <th className="px-6 py-3 text-left text-sm font-medium">
                            Fecha Creación
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredTramites.map((tramite: any) => (
                          <tr key={tramite.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium">#{tramite.id}</div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {getProjectName(tramite.projectId)}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              Tipo #{tramite.tramiteTypeId}
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                className={STATUS_COLORS[tramite.status] || ""}
                                variant="secondary"
                              >
                                {STATUS_LABELS[tramite.status] || tramite.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {new Date(tramite.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button asChild variant="ghost" size="sm">
                                <Link href={`/tramites/${tramite.id}`}>Ver detalles</Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
              {filteredTramites.map((tramite: any) => (
                <Link key={tramite.id} href={`/tramites/${tramite.id}`}>
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg">Trámite #{tramite.id}</CardTitle>
                          <CardDescription className="mt-1 truncate text-xs">
                            {getProjectName(tramite.projectId)}
                          </CardDescription>
                        </div>
                        <Badge
                          className={STATUS_COLORS[tramite.status] || ""}
                          variant="secondary"
                        >
                          {STATUS_LABELS[tramite.status] || tramite.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tipo:</span>
                        <span>Tipo #{tramite.tramiteTypeId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Creado:</span>
                        <span>{new Date(tramite.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                {searchQuery || statusFilter !== "all"
                  ? "No se encontraron trámites"
                  : "No hay trámites"}
              </h3>
              <p className="mb-6 text-center text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "Intenta con otros filtros"
                  : "Comienza creando tu primer trámite"}
              </p>
              {canCreateTramite && !searchQuery && statusFilter === "all" && (
                <Button asChild className="gap-2">
                  <Link href="/tramites/nuevo">
                    <Plus className="h-4 w-4" />
                    Crear Trámite
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
