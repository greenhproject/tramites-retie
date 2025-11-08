import { useAuth } from "@/_core/hooks/useAuth";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES } from "@/const";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function NewProject() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    systemCapacityKw: "",
    networkOperatorId: "",
    assignedEngineerId: "",
    assignedAdvisorId: "",
    clientId: "",
  });

  const { data: networkOperators } = trpc.networkOperators.getAll.useQuery();
  const { data: engineers } = trpc.users.getByRole.useQuery({ role: "ingeniero" });
  const { data: advisors } = trpc.users.getByRole.useQuery({ role: "asesor" });
  const { data: clients } = trpc.users.getByRole.useQuery({ role: "cliente" });

  const createProject = trpc.projects.create.useMutation({
    onSuccess: () => {
      toast.success("Proyecto creado exitosamente");
      setLocation("/proyectos");
    },
    onError: (error) => {
      toast.error("Error al crear proyecto: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.clientId) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    createProject.mutate({
      name: formData.name,
      address: formData.address || undefined,
      systemCapacityKw: formData.systemCapacityKw || undefined,
      networkOperatorId: formData.networkOperatorId ? parseInt(formData.networkOperatorId) : undefined,
      assignedEngineerId: formData.assignedEngineerId ? parseInt(formData.assignedEngineerId) : undefined,
      assignedAdvisorId: formData.assignedAdvisorId ? parseInt(formData.assignedAdvisorId) : undefined,
      clientId: parseInt(formData.clientId),
    });
  };

  const canAccess = user?.role === ROLES.ADMIN || user?.role === ROLES.ASESOR;

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <main className="container py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground">No tienes permisos para crear proyectos</p>
              <Button asChild className="mt-4">
                <Link href="/proyectos">Volver a proyectos</Link>
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
          <Button asChild variant="ghost" size="sm" className="mb-4 gap-2">
            <Link href="/proyectos">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Proyecto</h1>
          <p className="text-muted-foreground">Crea un nuevo proyecto solar</p>
        </div>

        {/* Form */}
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
            <CardDescription>
              Completa los datos básicos del proyecto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre del Proyecto */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre del Proyecto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Ej: Instalación Solar Residencial"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Cliente */}
              <div className="space-y-2">
                <Label htmlFor="clientId">
                  Cliente <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                >
                  <SelectTrigger id="clientId">
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name} ({client.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Textarea
                  id="address"
                  placeholder="Dirección completa del proyecto"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Capacidad del Sistema */}
              <div className="space-y-2">
                <Label htmlFor="systemCapacityKw">Capacidad del Sistema (kW)</Label>
                <Input
                  id="systemCapacityKw"
                  type="text"
                  placeholder="Ej: 10.5"
                  value={formData.systemCapacityKw}
                  onChange={(e) => setFormData({ ...formData, systemCapacityKw: e.target.value })}
                />
              </div>

              {/* Grid de 2 columnas en desktop */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Operador de Red */}
                <div className="space-y-2">
                  <Label htmlFor="networkOperatorId">Operador de Red</Label>
                  <Select
                    value={formData.networkOperatorId}
                    onValueChange={(value) => setFormData({ ...formData, networkOperatorId: value })}
                  >
                    <SelectTrigger id="networkOperatorId">
                      <SelectValue placeholder="Selecciona operador" />
                    </SelectTrigger>
                    <SelectContent>
                      {networkOperators?.map((operator) => (
                        <SelectItem key={operator.id} value={operator.id.toString()}>
                          {operator.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ingeniero Asignado */}
                <div className="space-y-2">
                  <Label htmlFor="assignedEngineerId">Ingeniero Asignado</Label>
                  <Select
                    value={formData.assignedEngineerId}
                    onValueChange={(value) => setFormData({ ...formData, assignedEngineerId: value })}
                  >
                    <SelectTrigger id="assignedEngineerId">
                      <SelectValue placeholder="Selecciona ingeniero" />
                    </SelectTrigger>
                    <SelectContent>
                      {engineers?.map((engineer) => (
                        <SelectItem key={engineer.id} value={engineer.id.toString()}>
                          {engineer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Asesor Asignado */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="assignedAdvisorId">Asesor Comercial</Label>
                  <Select
                    value={formData.assignedAdvisorId}
                    onValueChange={(value) => setFormData({ ...formData, assignedAdvisorId: value })}
                  >
                    <SelectTrigger id="assignedAdvisorId">
                      <SelectValue placeholder="Selecciona asesor" />
                    </SelectTrigger>
                    <SelectContent>
                      {advisors?.map((advisor) => (
                        <SelectItem key={advisor.id} value={advisor.id.toString()}>
                          {advisor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" asChild>
                  <Link href="/proyectos">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={createProject.isPending} className="gap-2">
                  {createProject.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Crear Proyecto
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
