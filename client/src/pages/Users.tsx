import { useAuth } from "@/_core/hooks/useAuth";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ROLES, ROLE_LABELS } from "@/const";
import { trpc } from "@/lib/trpc";
import { Loader2, Users as UsersIcon, Shield, Mail } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Users() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<string>("");

  const { data: users, isLoading, refetch } = trpc.users.getAll.useQuery();

  const updateRole = trpc.users.updateRole.useMutation({
    onSuccess: () => {
      toast.success("Rol actualizado exitosamente");
      refetch();
      setSelectedUser(null);
      setNewRole("");
    },
    onError: (error) => {
      toast.error("Error al actualizar rol: " + error.message);
    },
  });

  const handleUpdateRole = () => {
    if (!selectedUser || !newRole) return;
    updateRole.mutate({
      userId: selectedUser.id,
      role: newRole as any,
    });
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra roles y permisos de usuarios</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Total Usuarios"
            value={users?.length || 0}
            loading={isLoading}
          />
          <StatsCard
            label="Administradores"
            value={users?.filter((u) => u.role === "admin").length || 0}
            loading={isLoading}
          />
          <StatsCard
            label="Ingenieros"
            value={users?.filter((u) => u.role === "ingeniero").length || 0}
            loading={isLoading}
          />
          <StatsCard
            label="Clientes"
            value={users?.filter((u) => u.role === "cliente").length || 0}
            loading={isLoading}
          />
        </div>

        {/* Users List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users && users.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border bg-muted/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium">Usuario</th>
                          <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                          <th className="px-6 py-3 text-left text-sm font-medium">Rol</th>
                          <th className="px-6 py-3 text-left text-sm font-medium">
                            Último acceso
                          </th>
                          <th className="px-6 py-3 text-right text-sm font-medium">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                  {u.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div className="font-medium">{u.name || "Sin nombre"}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {u.email || "—"}
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="secondary">
                                {ROLE_LABELS[u.role as keyof typeof ROLE_LABELS]}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {new Date(u.lastSignedIn).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUser(u);
                                      setNewRole(u.role);
                                    }}
                                  >
                                    Cambiar Rol
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Cambiar Rol de Usuario</DialogTitle>
                                    <DialogDescription>
                                      Selecciona el nuevo rol para {u.name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <Select value={newRole} onValueChange={setNewRole}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="admin">Administrador</SelectItem>
                                        <SelectItem value="ingeniero">Ingeniero</SelectItem>
                                        <SelectItem value="asesor">Asesor Comercial</SelectItem>
                                        <SelectItem value="cliente">Cliente</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => setSelectedUser(null)}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button
                                        onClick={handleUpdateRole}
                                        disabled={updateRole.isPending}
                                      >
                                        {updateRole.isPending && (
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Actualizar
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
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
              {users.map((u) => (
                <Card key={u.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          {u.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="truncate text-base">{u.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{u.email}</span>
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rol:</span>
                      <Badge variant="secondary">
                        {ROLE_LABELS[u.role as keyof typeof ROLE_LABELS]}
                      </Badge>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedUser(u);
                            setNewRole(u.role);
                          }}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Cambiar Rol
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cambiar Rol de Usuario</DialogTitle>
                          <DialogDescription>
                            Selecciona el nuevo rol para {u.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <Select value={newRole} onValueChange={setNewRole}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="ingeniero">Ingeniero</SelectItem>
                              <SelectItem value="asesor">Asesor Comercial</SelectItem>
                              <SelectItem value="cliente">Cliente</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button variant="outline" onClick={() => setSelectedUser(null)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleUpdateRole} disabled={updateRole.isPending}>
                              {updateRole.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Actualizar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <UsersIcon className="mb-4 h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground">No hay usuarios registrados</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

function StatsCard({ label, value, loading }: { label: string; value: number; loading: boolean }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        {loading ? (
          <Loader2 className="mt-2 h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <div className="mt-2 text-3xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
