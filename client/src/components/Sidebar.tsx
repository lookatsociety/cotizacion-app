import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  BarChart, 
  Settings, 
  File, 
  HelpCircle, 
  LogOut, 
  Menu,
  X,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  sidebarOpen?: boolean;
}

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen, sidebarOpen = true }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <>
      {/* SIDEBAR PARA DESKTOP - Visible según estado sidebarOpen */}
      <div className={`${sidebarOpen ? 'md:flex' : 'md:hidden'} hidden h-screen w-64 flex-col fixed inset-y-0 bg-background border-r border-border z-30 transition-all duration-300`}>
        <div className="p-4 border-b border-border flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md flex items-center justify-center bg-primary text-primary-foreground">
            <FileText size={18} />
          </div>
          <span className="text-xl font-semibold text-foreground">CotizaApp</span>
        </div>
        
        <div className="p-3 border-b border-border">
          <div className="flex items-center space-x-3 relative group">
            <div className="relative">
              <Avatar className="cursor-pointer hover:ring-2 hover:ring-border transition-all">
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback>
                  {user?.displayName?.substring(0, 2) || user?.email?.substring(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="w-full h-full rounded-full bg-black/30 flex items-center justify-center text-white"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.displayName || user?.email}</div>
              <div className="text-xs text-muted-foreground">Cuenta Empresarial</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          <div className="py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Navegación</div>
          <nav className="space-y-1 px-3">
            <Link href="/">
              <a className={isActive("/") ? "sidebar-link-active" : "sidebar-link"}>
                <LayoutDashboard className={isActive("/") ? "sidebar-icon-active" : "sidebar-icon"} />
                <span className="ml-3">Dashboard</span>
              </a>
            </Link>
            <Link href="/quotations">
              <a className={isActive("/quotations") || isActive("/quotations/new") ? "sidebar-link-active" : "sidebar-link"}>
                <FileText className={isActive("/quotations") || isActive("/quotations/new") ? "sidebar-icon-active" : "sidebar-icon"} />
                <span className="ml-3">Cotizaciones</span>
              </a>
            </Link>
            <Link href="/customers">
              <a className={isActive("/customers") ? "sidebar-link-active" : "sidebar-link"}>
                <Users className={isActive("/customers") ? "sidebar-icon-active" : "sidebar-icon"} />
                <span className="ml-3">Clientes</span>
              </a>
            </Link>
            <Link href="/products">
              <a className={isActive("/products") ? "sidebar-link-active" : "sidebar-link"}>
                <Package className={isActive("/products") ? "sidebar-icon-active" : "sidebar-icon"} />
                <span className="ml-3">Productos</span>
              </a>
            </Link>
            <Link href="/reports">
              <a className={isActive("/reports") ? "sidebar-link-active" : "sidebar-link"}>
                <BarChart className={isActive("/reports") ? "sidebar-icon-active" : "sidebar-icon"} />
                <span className="ml-3">Reportes</span>
              </a>
            </Link>
          </nav>
          
          <div className="py-2 px-3 mt-6 text-xs font-medium text-muted-foreground uppercase">Preferencias</div>
          <nav className="space-y-1 px-3">
            <Link href="/settings">
              <a className={isActive("/settings") ? "sidebar-link-active" : "sidebar-link"}>
                <Settings className={isActive("/settings") ? "sidebar-icon-active" : "sidebar-icon"} />
                <span className="ml-3">Configuración</span>
              </a>
            </Link>
            <Link href="/templates">
              <a className={isActive("/templates") ? "sidebar-link-active" : "sidebar-link"}>
                <File className={isActive("/templates") ? "sidebar-icon-active" : "sidebar-icon"} />
                <span className="ml-3">Plantillas</span>
              </a>
            </Link>
            <Link href="/help">
              <a className={isActive("/help") ? "sidebar-link-active" : "sidebar-link"}>
                <HelpCircle className={isActive("/help") ? "sidebar-icon-active" : "sidebar-icon"} />
                <span className="ml-3">Ayuda</span>
              </a>
            </Link>
            <div className="theme-toggle-item mt-2">
              <div className="flex items-center">
                <Moon className="sidebar-icon" />
                <span className="ml-3">Modo oscuro</span>
              </div>
              <ThemeToggle />
            </div>
          </nav>
        </div>
        
        <div className="p-3 border-t border-border space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Modo oscuro</span>
            <ThemeToggle />
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
      
      {/* Mobile menu button removed - now handled by SidebarLayout */}
      
      {/* MOBILE MENU - Only visible when open */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar Panel */}
          <div className="fixed inset-y-0 left-0 w-64 bg-background z-50 flex flex-col shadow-lg">
            <div className="p-4 border-b border-border flex items-center space-x-3">
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-primary text-primary-foreground">
                <FileText size={18} />
              </div>
              <span className="text-xl font-semibold text-foreground">CotizaApp</span>
            </div>
            
            <div className="p-3 border-b border-border">
              <div className="flex items-center space-x-3 relative group">
                <div className="relative">
                  <Avatar className="cursor-pointer hover:ring-2 hover:ring-border transition-all">
                    <AvatarImage src={user?.photoURL || ""} />
                    <AvatarFallback>
                      {user?.displayName?.substring(0, 2) || user?.email?.substring(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="w-full h-full rounded-full bg-black/30 flex items-center justify-center text-white"
                      onClick={handleLogout}
                      title="Cerrar sesión"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user?.displayName || user?.email}</div>
                  <div className="text-xs text-muted-foreground">Cuenta Empresarial</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2">
              <div className="py-2 px-3 text-xs font-medium text-muted-foreground uppercase">Navegación</div>
              <nav className="space-y-1 px-3">
                <Link href="/">
                  <a 
                    className={isActive("/") ? "sidebar-link-active" : "sidebar-link"} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className={isActive("/") ? "sidebar-icon-active" : "sidebar-icon"} />
                    <span className="ml-3">Dashboard</span>
                  </a>
                </Link>
                <Link href="/quotations">
                  <a 
                    className={isActive("/quotations") || isActive("/quotations/new") ? "sidebar-link-active" : "sidebar-link"} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileText className={isActive("/quotations") || isActive("/quotations/new") ? "sidebar-icon-active" : "sidebar-icon"} />
                    <span className="ml-3">Cotizaciones</span>
                  </a>
                </Link>
                <Link href="/customers">
                  <a 
                    className={isActive("/customers") ? "sidebar-link-active" : "sidebar-link"} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Users className={isActive("/customers") ? "sidebar-icon-active" : "sidebar-icon"} />
                    <span className="ml-3">Clientes</span>
                  </a>
                </Link>
                <Link href="/products">
                  <a 
                    className={isActive("/products") ? "sidebar-link-active" : "sidebar-link"} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className={isActive("/products") ? "sidebar-icon-active" : "sidebar-icon"} />
                    <span className="ml-3">Productos</span>
                  </a>
                </Link>
                <Link href="/reports">
                  <a 
                    className={isActive("/reports") ? "sidebar-link-active" : "sidebar-link"} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BarChart className={isActive("/reports") ? "sidebar-icon-active" : "sidebar-icon"} />
                    <span className="ml-3">Reportes</span>
                  </a>
                </Link>
              </nav>
              
              <div className="py-2 px-3 mt-6 text-xs font-medium text-muted-foreground uppercase">Preferencias</div>
              <nav className="space-y-1 px-3">
                <Link href="/settings">
                  <a 
                    className={isActive("/settings") ? "sidebar-link-active" : "sidebar-link"} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className={isActive("/settings") ? "sidebar-icon-active" : "sidebar-icon"} />
                    <span className="ml-3">Configuración</span>
                  </a>
                </Link>
                <Link href="/templates">
                  <a 
                    className={isActive("/templates") ? "sidebar-link-active" : "sidebar-link"} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <File className={isActive("/templates") ? "sidebar-icon-active" : "sidebar-icon"} />
                    <span className="ml-3">Plantillas</span>
                  </a>
                </Link>
                <Link href="/help">
                  <a 
                    className={isActive("/help") ? "sidebar-link-active" : "sidebar-link"} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <HelpCircle className={isActive("/help") ? "sidebar-icon-active" : "sidebar-icon"} />
                    <span className="ml-3">Ayuda</span>
                  </a>
                </Link>
                <div className="theme-toggle-item mt-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center">
                    <Moon className="sidebar-icon" />
                    <span className="ml-3">Modo oscuro</span>
                  </div>
                  <ThemeToggle />
                </div>
              </nav>
            </div>
            
            <div className="p-3 border-t border-border space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Modo oscuro</span>
                <ThemeToggle />
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}