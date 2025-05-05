import { Route, Switch, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import Dashboard from "@/pages/Dashboard";
import NewQuotation from "@/pages/NewQuotation";
import Quotations from "@/pages/Quotations";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import SidebarLayout from "@/components/SidebarLayout";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarLayout>
      <Component />
    </SidebarLayout>
  );
}

export default function Router() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  // Redirigir a /login si no está autenticado y no está en /login
  useEffect(() => {
    if (!isAuthenticated && location !== "/login") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, location]);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/quotations" component={() => <ProtectedRoute component={Quotations} />} />
      <Route path="/quotations/new" component={() => <ProtectedRoute component={NewQuotation} />} />
      <Route component={NotFound} />
    </Switch>
  );
} 