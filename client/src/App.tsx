import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import NewQuotation from "@/pages/NewQuotation";
import Quotations from "@/pages/Quotations";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useEffect } from "react";

const ProtectedRoute = ({ component: Component, ...rest }: any) => {
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

  return <Component {...rest} />;
};

function Router() {
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

function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
