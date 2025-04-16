import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      
      {/* Mobile menu button - fixed position */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="mobile-menu-button md:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>
      
      {/* Contenido principal - desplazado para dejar espacio a la barra lateral en pantallas md y superiores */}
      <div className="flex-1 min-w-0 md:ml-64">
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}