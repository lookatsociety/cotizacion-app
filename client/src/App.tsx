import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import NewQuotation from "@/pages/NewQuotation";
import Quotations from "@/pages/Quotations";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useEffect } from "react";
import SidebarLayout from "@/components/SidebarLayout";

// Componente para verificar la autenticación
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

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/quotations">
        {() => <ProtectedRoute component={Quotations} />}
      </Route>
      <Route path="/quotations/new">
        {() => <ProtectedRoute component={NewQuotation} />}
      </Route>
      <Route>
        {() => <ProtectedRoute component={NotFound} />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
