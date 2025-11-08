import { useAuth } from "@/_core/hooks/useAuth";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLES } from "@/const";
import { FileText, Building2, Settings, Workflow } from "lucide-react";
import { Link } from "wouter";

export default function Configuration() {
  const { user } = useAuth();

  if (user?.role !== ROLES.ADMIN) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <main className="container py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground">No tienes permisos para ver esta página</p>
              <Button asChild className="mt-4">
                <Link href="/">Volver al inicio</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Administra la configuración del sistema
          </p>
        </div>

        {/* Configuration Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ConfigCard
            icon={<FileText className="h-8 w-8 text-primary" />}
            title="Tipos de Trámites"
            description="Configura los tipos de trámites y formularios dinámicos"
            href="/configuracion/tramites"
          />
          
          <ConfigCard
            icon={<Building2 className="h-8 w-8 text-primary" />}
            title="Operadores de Red"
            description="Gestiona los operadores de red y sus requisitos"
            href="/configuracion/operadores"
          />
          
          <ConfigCard
            icon={<Workflow className="h-8 w-8 text-primary" />}
            title="Workflows"
            description="Define los flujos de trabajo y estados de trámites"
            href="/configuracion/workflows"
          />
          
          <ConfigCard
            icon={<Settings className="h-8 w-8 text-primary" />}
            title="Integración OpenSolar"
            description="Configura la sincronización con OpenSolar"
            href="/configuracion/opensolar"
          />
        </div>

        {/* System Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
            <CardDescription>Detalles de la plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Versión:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Última actualización:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Empresa:</span>
              <span className="font-medium">Green House Project</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function ConfigCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
        <CardHeader>
          <div className="mb-2">{icon}</div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
