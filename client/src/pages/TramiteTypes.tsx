import { useAuth } from "@/_core/hooks/useAuth";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ROLES } from "@/const";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, FileText, Edit } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function TramiteTypes() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "operador" as "retie" | "operador" | "upme" | "otro",
  });

  const { data: tramiteTypes, isLoading, refetch } = trpc.tramiteTypes.getAll.useQuery();

  const createTramiteType = trpc.tramiteTypes.create.useMutation({
    onSuccess: () => {
      toast.success("Tipo de trámite creado exitosamente");
      refetch();
      setIsDialogOpen(false);
      setFormData({ name: "", description: "", category: "operador" });
    },
    onError: (error) => {
      toast.error("Error al crear tipo de trámite: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("El nombre es requerido");
      return;
    }
    createTramiteType.mutate(formData);
  };

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
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tipos de Trámites</h1>
            <p className="text-muted-foreground">
              Configura los tipos de trámites y formularios
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Tipo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Tipo de Trámite</DialogTitle>
                <DialogDescription>
                  Define un nuevo tipo de trámite con sus características
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ej: Solicitud de Conexión"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retie">RETIE</SelectItem>
                      <SelectItem value="operador">Operador de Red</SelectItem>
                      <SelectItem value="upme">UPME</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el propósito de este trámite"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createTramiteType.isPending}>
                    {createTramiteType.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Crear
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tramite Types List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tramiteTypes && tramiteTypes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tramiteTypes.map((type) => (
              <Card key={type.id} className="transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{type.name}</CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        {type.description || "Sin descripción"}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0 text-xs">
                      {type.category.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estados:</span>
                    <span className="font-medium">
                      {type.workflowStates?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Documentos:</span>
                    <span className="font-medium">
                      {type.requiredDocuments?.length || 0}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Edit className="h-3 w-3" />
                      <span className="hidden sm:inline">Editar</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Formulario
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No hay tipos de trámites</h3>
              <p className="mb-6 text-center text-sm text-muted-foreground">
                Crea el primer tipo de trámite para comenzar
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Crear Tipo de Trámite
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
