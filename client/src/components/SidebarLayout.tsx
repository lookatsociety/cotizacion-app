import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si estamos en móvil o no
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Comprobar al inicio
    checkScreenSize();
    
    // Comprobar cuando cambia el tamaño de la ventana
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Establecer estado inicial basado en el tamaño de la pantalla
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Función para alternar la barra lateral
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen}
        sidebarOpen={sidebarOpen}
      />
      
      {/* Botón para mostrar/ocultar la barra lateral - con estilos adaptados según el dispositivo */}
      <button
        onClick={toggleSidebar}
        className={`fixed z-50 flex items-center justify-center shadow-sm ${
          isMobile 
            ? "bottom-4 right-4 w-12 h-12 bg-blue-600 text-white rounded-full" 
            : "top-4 left-4 w-10 h-10 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
        }`}
        aria-label={sidebarOpen ? "Ocultar menú" : "Mostrar menú"}
      >
        {isMobile ? (
          mobileMenuOpen ? <X size={24} /> : <Menu size={24} />
        ) : sidebarOpen ? (
          <X size={20} />
        ) : (
          <Menu size={20} />
        )}
      </button>
      
      {/* Contenido principal - ajusta el margen dependiendo del estado de la barra lateral */}
      <div className={`flex-1 min-w-0 transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}`}>
        <main className="p-4 md:p-6">
          <div className="h-10"></div> {/* Espacio para el botón fijo */}
          {children}
        </main>
      </div>
    </div>
  );
}