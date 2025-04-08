import { useState } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import QuotationForm from "@/components/QuotationForm";
import QuotationPreview from "@/components/QuotationPreview";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { QuotationFormData } from "@shared/schema";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function NewQuotation() {
  const [showPreview, setShowPreview] = useState(true);
  const [quotationData, setQuotationData] = useState<QuotationFormData | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleFormData = (data: QuotationFormData) => {
    setQuotationData(data);
  };

  const handleCreateQuotation = async (data: QuotationFormData, status: 'draft' | 'final' = 'final') => {
    try {
      await apiRequest("POST", "/api/quotations", {
        ...data,
        status,
        date: new Date(data.date).toISOString(),
        validUntil: data.validUntil ? new Date(data.validUntil).toISOString() : null,
      });
      
      await queryClient.invalidateQueries({ queryKey: ["/api/quotations"] });
      
      toast({
        title: "Cotización creada",
        description: status === 'draft' 
          ? "Se ha guardado un borrador de la cotización" 
          : "La cotización ha sido creada exitosamente",
      });
      
      setLocation("/quotations");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo crear la cotización",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarLayout>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-6 py-3">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-neutral-800">Nueva Cotización</h1>
            
            <div className="flex items-center">
              <span className="text-sm text-neutral-500 mr-2">Mostrar Vista Previa</span>
              <Switch 
                checked={showPreview} 
                onCheckedChange={setShowPreview} 
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={() => quotationData && handleCreateQuotation(quotationData, 'draft')}
            >
              Guardar Borrador
            </Button>
            <Button 
              onClick={() => quotationData && handleCreateQuotation(quotationData)}
              className="bg-secondary-500 hover:bg-secondary-600"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Crear Cotización
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} p-6 overflow-y-auto`}>
          <QuotationForm onFormDataChange={handleFormData} />
        </div>
        
        {showPreview && (
          <div className="w-1/2 bg-gray-100 border-l border-gray-200 overflow-y-auto p-6">
            <QuotationPreview quotation={quotationData} />
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
