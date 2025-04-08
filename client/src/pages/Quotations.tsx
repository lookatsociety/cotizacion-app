import SidebarLayout from "@/components/SidebarLayout";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download, Search, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { generatePdf } from "@/lib/generatePdf";

export default function Quotations() {
  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ["/api/quotations"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Borrador</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Enviada</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aceptada</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rechazada</Badge>;
      default:
        return <Badge variant="secondary">Final</Badge>;
    }
  };

  const handleExportPdf = async (quotation: any) => {
    const completeQuotation = await fetch(`/api/quotations/${quotation.id}`).then(res => res.json());
    generatePdf(completeQuotation);
  };

  return (
    <SidebarLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Cotizaciones</h1>
          <Link href="/quotations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cotización
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Todas las cotizaciones</CardTitle>
                <CardDescription>
                  Gestiona y revisa todas tus cotizaciones
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-8"
                  placeholder="Buscar cotizaciones..."
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Cargando cotizaciones...</div>
            ) : quotations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Cotización</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotations.map((quotation: any) => (
                    <TableRow key={quotation.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                          {quotation.quotationNumber}
                        </div>
                      </TableCell>
                      <TableCell>{quotation.customerName}</TableCell>
                      <TableCell>
                        {new Date(quotation.date).toLocaleDateString('es-MX')}
                      </TableCell>
                      <TableCell>{formatCurrency(quotation.total)}</TableCell>
                      <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleExportPdf(quotation)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem>Duplicar</DropdownMenuItem>
                              <DropdownMenuItem>Enviar por Email</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <div className="text-muted-foreground mb-2">
                  No hay cotizaciones disponibles
                </div>
                <Link href="/quotations/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear nueva cotización
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
