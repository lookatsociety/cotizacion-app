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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Link href="/quotations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cotización
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Cotizaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{quotations.length}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Cotizaciones creadas
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cotizaciones Enviadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {quotations.filter((q: any) => q.status === "sent").length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Esperando respuesta
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{customers.length}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Registrados en el sistema
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Cotizaciones Recientes</CardTitle>
                <Link href="/quotations">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Ver todas
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {quotations.length > 0 ? (
                <div className="space-y-4">
                  {quotations.slice(0, 5).map((quotation: any) => (
                    <div key={quotation.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                      <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{quotation.customerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(quotation.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {quotation.quotationNumber}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <div className="text-sm text-muted-foreground">No hay cotizaciones</div>
                  <Link href="/quotations/new">
                    <Button variant="outline" size="sm" className="mt-3">
                      <Plus className="mr-2 h-4 w-4" />
                      Crear cotización
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Clientes Recientes</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">
                  Ver todos
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {customers.length > 0 ? (
                <div className="space-y-4">
                  {customers.slice(0, 5).map((customer: any) => (
                    <div key={customer.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                      <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <div className="text-sm text-muted-foreground">No hay clientes</div>
                  <Button variant="outline" size="sm" className="mt-3">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar cliente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}
