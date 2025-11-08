import { useAuth } from "@/_core/hooks/useAuth";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE, getLoginUrl, ROLES, ROLE_LABELS } from "@/const";
import { trpc } from "@/lib/trpc";
import { FolderKanban, FileText, TrendingUp, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container py-8">
        <DashboardContent user={user} />
      </main>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto max-w-3xl space-y-6 py-12 md:space-y-8 md:py-20">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {APP_TITLE}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Gestiona tus trámites ante operadores de red y certificaciones RETIE de forma
            eficiente, organizada y colaborativa.
          </p>
          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2 text-base">
              <a href={getLoginUrl()}>
                Iniciar Sesión
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid w-full max-w-5xl gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<FolderKanban className="h-8 w-8 text-primary" />}
            title="Gestión de Proyectos"
            description="Organiza y da seguimiento a todos tus proyectos solares en un solo lugar"
          />
          <FeatureCard
            icon={<FileText className="h-8 w-8 text-primary" />}
            title="Trámites Configurables"
            description="Formularios dinámicos adaptados a cada operador de red y tipo de trámite"
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 text-primary" />}
            title="Reportes y Análisis"
            description="Visualiza el progreso y tiempos de respuesta de tus trámites"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-border bg-card/50 backdrop-blur transition-all hover:shadow-lg">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function DashboardContent({ user }: { user: any }) {
  const { data: projects, isLoading: projectsLoading } = trpc.projects.getAll.useQuery();
  const { data: notifications } = trpc.notifications.getMy.useQuery();

  const stats = {
    totalProjects: projects?.length || 0,
    activeProjects: projects?.filter((p) => p.status === "in_progress").length || 0,
    pendingTramites: 0, // TODO: calcular desde trámites
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Bienvenido, {user.name}
        </h1>
        <p className="text-muted-foreground">
          {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS]}
        </p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Proyectos Totales"
          value={stats.totalProjects}
          icon={<FolderKanban className="h-5 w-5" />}
          loading={projectsLoading}
        />
        <StatsCard
          title="Proyectos Activos"
          value={stats.activeProjects}
          icon={<TrendingUp className="h-5 w-5" />}
          loading={projectsLoading}
        />
        <StatsCard
          title="Trámites Pendientes"
          value={stats.pendingTramites}
          icon={<Clock className="h-5 w-5" />}
          loading={false}
        />
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Proyectos Recientes</CardTitle>
            <CardDescription>Tus últimos proyectos actualizados</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/proyectos">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {projectsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <Link key={project.id} href={`/proyectos/${project.id}`}>
                  <div className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 sm:p-4">
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="truncate font-medium">{project.name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {project.address || "Sin dirección"}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <span className="hidden whitespace-nowrap rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:inline">
                        {project.status}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderKanban className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No hay proyectos aún</p>
              {(user.role === ROLES.ADMIN || user.role === ROLES.ASESOR) && (
                <Button asChild variant="link" className="mt-2">
                  <Link href="/proyectos/nuevo">Crear primer proyecto</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Notifications - Only on larger screens */}
      {notifications && notifications.length > 0 && (
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle>Notificaciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-3"
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
