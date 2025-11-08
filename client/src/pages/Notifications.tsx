import { useAuth } from "@/_core/hooks/useAuth";
import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, Bell, CheckCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Notifications() {
  const { user } = useAuth();
  const { data: notifications, isLoading, refetch } = trpc.notifications.getMy.useQuery();

  const markAsRead = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Notificación marcada como leída");
    },
  });

  const markAllAsRead = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Todas las notificaciones marcadas como leídas");
    },
  });

  // Delete functionality will be added later

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="container py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notificaciones</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0
                ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? "es" : ""} sin leer`
                : "No tienes notificaciones sin leer"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              {markAllAsRead.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )}
              Marcar todas como leídas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.isRead ? "border-primary/50 bg-primary/5" : ""
                }`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                            !notification.isRead
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Bell className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            {!notification.isRead && (
                              <Badge variant="default" className="h-5 px-2 text-xs">
                                Nueva
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 sm:flex-col">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => markAsRead.mutate({ id: notification.id })}
                          disabled={markAsRead.isPending}
                        >
                          <CheckCheck className="h-4 w-4" />
                          <span className="hidden sm:inline">Marcar leída</span>
                        </Button>
                      )}

                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bell className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No tienes notificaciones</h3>
              <p className="text-center text-sm text-muted-foreground">
                Aquí aparecerán las actualizaciones importantes
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
