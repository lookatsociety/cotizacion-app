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

// Componente que envuelve las rutas protegidas con el SidebarLayout
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
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

  return <SidebarLayout>{children}</SidebarLayout>;
};

function Router() {
  const location = useLocation()[0];
  const isLoginPage = location === "/login";

  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      {/* Para todas las demás rutas, usamos ProtectedLayout */}
      <Route path="/">
        {(params) => (
          <ProtectedLayout>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/quotations" component={Quotations} />
              <Route path="/quotations/new" component={NewQuotation} />
              <Route component={NotFound} />
            </Switch>
          </ProtectedLayout>
        )}
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
