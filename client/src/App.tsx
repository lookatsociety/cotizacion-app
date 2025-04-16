import { Route, Switch, useLocation, Link } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import NewQuotation from "@/pages/NewQuotation";
import Quotations from "@/pages/Quotations";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useEffect } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/ThemeProvider";

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

// Componente temporal para páginas no implementadas aún
function PlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
        <FileText size={40} />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Página en construcción</h2>
      <p className="text-gray-500 text-center max-w-md mb-6">
        Esta sección está actualmente en desarrollo y estará disponible próximamente.
      </p>
      <Link href="/">
        <Button>
          Volver al Dashboard
        </Button>
      </Link>
    </div>
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
      <Route path="/customers">
        {() => <ProtectedRoute component={PlaceholderPage} />}
      </Route>
      <Route path="/products">
        {() => <ProtectedRoute component={PlaceholderPage} />}
      </Route>
      <Route path="/reports">
        {() => <ProtectedRoute component={PlaceholderPage} />}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRoute component={PlaceholderPage} />}
      </Route>
      <Route path="/templates">
        {() => <ProtectedRoute component={PlaceholderPage} />}
      </Route>
      <Route path="/help">
        {() => <ProtectedRoute component={PlaceholderPage} />}
      </Route>
      <Route>
        {() => <ProtectedRoute component={NotFound} />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
