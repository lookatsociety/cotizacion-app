import { useState } from "react";
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
  ChevronDown, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X
} from "lucide-react";
import { useIsMobile, useSidebar } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Usar el nuevo hook que maneja toda la lógica de la barra lateral
  const { isOpen: sidebarOpen, toggle: toggleSidebar, close: closeSidebar, isMobile } = useSidebar();

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Implementation would toggle a dark class on the root element
    // or use localStorage to persist the preference
    toast({
      title: "Modo oscuro",
      description: isDarkMode ? "Modo claro activado" : "Modo oscuro activado",
    });
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-primary-600 text-white">
              <FileText size={16} />
            </div>
            <span className="text-lg font-semibold text-neutral-800">CotizaApp</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-9 w-9"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      )}

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`${isMobile ? 'fixed left-0 top-0 bottom-0 z-30' : 'relative'} 
          bg-white shadow-md flex flex-col border-r border-gray-200 flex-shrink-0 
          transition-all duration-300 ease-in-out
          ${isMobile ? (sidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-0 opacity-0 invisible') : 'w-64'}
        `}
      >
        {!isMobile && (
          <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-primary-600 text-white">
              <FileText size={18} />
            </div>
            <span className="text-xl font-semibold text-neutral-800">CotizaApp</span>
          </div>
        )}
        
        {/* Mobile sidebar header with close button */}
        {isMobile && (
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-primary-600 text-white">
                <FileText size={18} />
              </div>
              <span className="text-xl font-semibold text-neutral-800">CotizaApp</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSidebar}
              className="h-8 w-8"
            >
              <X size={18} />
            </Button>
          </div>
        )}
        
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user?.photoURL || ""} />
              <AvatarFallback>
                {user?.displayName?.substring(0, 2) || user?.email?.substring(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.displayName || user?.email}</div>
              <div className="text-xs text-neutral-500">Cuenta Empresarial</div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
              <ChevronDown className="h-4 w-4 text-neutral-400" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="py-2 px-3 text-xs font-medium text-neutral-500 uppercase">Navegación</div>
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
          
          <div className="py-2 px-3 mt-6 text-xs font-medium text-neutral-500 uppercase">Preferencias</div>
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
          </nav>
        </div>
        
        <div className="p-3 border-t border-gray-200 space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Modo Claro
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Modo Oscuro
              </>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile padding for the fixed header */}
        {isMobile && <div className="h-14"></div>}
        
        {/* Content area */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
