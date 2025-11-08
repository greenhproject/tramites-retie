import { useAuth } from "@/_core/hooks/useAuth";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ROLES, STATUS_LABELS } from "@/const";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Loader2, FolderKanban, MapPin, Zap } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Projects() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: projects, isLoading } = trpc.projects.getAll.useQuery();

  const filteredProjects = projects?.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canCreateProject = user?.role === ROLES.ADMIN || user?.role === ROLES.ASESOR;

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
            <p className="text-muted-foreground">
              Gestiona todos tus proyectos solares
            </p>
          </div>
          {canCreateProject && (
            <Button asChild className="gap-2">
              <Link href="/proyectos/nuevo">
                <Plus className="h-4 w-4" />
                Nuevo Proyecto
              </Link>
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar proyectos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Projects List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProjects && filteredProjects.length > 0 ? (
          <>
            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden lg:block">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border bg-muted/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium">Proyecto</th>
                          <th className="px-6 py-3 text-left text-sm font-medium">Ubicación</th>
                          <th className="px-6 py-3 text-left text-sm font-medium">Capacidad</th>
                          <th className="px-6 py-3 text-left text-sm font-medium">Estado</th>
                          <th className="px-6 py-3 text-right text-sm font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredProjects.map((project) => (
                          <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium">{project.name}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {project.address || "—"}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {project.systemCapacityKw ? `${project.systemCapacityKw} kW` : "—"}
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="secondary">
                                {STATUS_LABELS[project.status] || project.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button asChild variant="ghost" size="sm">
                                <Link href={`/proyectos/${project.id}`}>Ver detalles</Link>
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

            {/* Mobile Card View - Visible on mobile and tablet */}
            <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
              {filteredProjects.map((project) => (
                <Link key={project.id} href={`/proyectos/${project.id}`}>
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                          <CardDescription className="mt-1 flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{project.address || "Sin ubicación"}</span>
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="flex-shrink-0 text-xs">
                          {STATUS_LABELS[project.status] || project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {project.systemCapacityKw && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Zap className="h-4 w-4" />
                          <span>{project.systemCapacityKw} kW</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FolderKanban className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                {searchQuery ? "No se encontraron proyectos" : "No hay proyectos"}
              </h3>
              <p className="mb-6 text-center text-sm text-muted-foreground">
                {searchQuery
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza creando tu primer proyecto"}
              </p>
              {canCreateProject && !searchQuery && (
                <Button asChild className="gap-2">
                  <Link href="/proyectos/nuevo">
                    <Plus className="h-4 w-4" />
                    Crear Proyecto
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
