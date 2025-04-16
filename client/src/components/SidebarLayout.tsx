import React from "react";
import Sidebar from "./Sidebar";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Contenido principal - desplazado para dejar espacio a la barra lateral en pantallas md y superiores */}
      <div className="flex-1 min-w-0 md:ml-64">
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}