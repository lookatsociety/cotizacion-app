import SidebarLayout from "@/components/SidebarLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Users, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const { data: quotations = [] } = useQuery({
    queryKey: ["/api/quotations"],
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
  });

  return (
    <SidebarLayout>
      {/* Ya no necesitamos padding aquí ya que lo maneja el SidebarLayout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <Link href="/quotations/new">
            <Button size={window.innerWidth < 640 ? "sm" : "default"} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              <span className="sm:inline">Nueva Cotización</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Total Cotizaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="text-2xl sm:text-3xl font-bold">{quotations.length}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                Cotizaciones creadas
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Cotizaciones Enviadas
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="text-2xl sm:text-3xl font-bold">
                {quotations.filter((q: any) => q.status === "sent").length}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                Esperando respuesta
              </div>
            </CardContent>
          </Card>
          
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Clientes
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="text-2xl sm:text-3xl font-bold">{customers.length}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                Registrados en el sistema
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm sm:text-base">Cotizaciones Recientes</CardTitle>
                <Link href="/quotations">
                  <Button variant="ghost" size="sm" className="text-[10px] sm:text-xs h-7 sm:h-8">
                    Ver todas
                    <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {quotations.length > 0 ? (
                <div className="space-y-2 sm:space-y-4">
                  {quotations.slice(0, 5).map((quotation: any) => (
                    <div key={quotation.id} className="flex items-center p-2 sm:p-3 bg-gray-50 rounded-md">
                      <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-primary-100 flex items-center justify-center mr-2 sm:mr-3">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center flex-wrap">
                          <div className="font-medium text-sm sm:text-base truncate mr-2">{quotation.customerName}</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground">
                            {new Date(quotation.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-[10px] sm:text-sm text-muted-foreground truncate">
                          {quotation.quotationNumber}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 sm:py-6">
                  <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                  <div className="text-xs sm:text-sm text-muted-foreground">No hay cotizaciones</div>
                  <Link href="/quotations/new">
                    <Button variant="outline" size="sm" className="mt-2 sm:mt-3 text-xs h-7 sm:h-8">
                      <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Crear cotización
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm sm:text-base">Clientes Recientes</CardTitle>
                <Button variant="ghost" size="sm" className="text-[10px] sm:text-xs h-7 sm:h-8">
                  Ver todos
                  <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {customers.length > 0 ? (
                <div className="space-y-2 sm:space-y-4">
                  {customers.slice(0, 5).map((customer: any) => (
                    <div key={customer.id} className="flex items-center p-2 sm:p-3 bg-gray-50 rounded-md">
                      <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-primary-100 flex items-center justify-center mr-2 sm:mr-3">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">{customer.name}</div>
                        <div className="text-[10px] sm:text-sm text-muted-foreground truncate">
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 sm:py-6">
                  <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                  <div className="text-xs sm:text-sm text-muted-foreground">No hay clientes</div>
                  <Button variant="outline" size="sm" className="mt-2 sm:mt-3 text-xs h-7 sm:h-8">
                    <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Agregar cliente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
    </SidebarLayout>
  );
}
