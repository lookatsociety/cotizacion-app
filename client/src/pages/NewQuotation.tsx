import { useState } from "react";
import QuotationForm from "@/components/QuotationForm";
import QuotationPreview from "@/components/QuotationPreview";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QuotationFormData, CompanyInfo } from "@shared/schema";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CompanyInfoManager from "@/components/CompanyInfoManager";

export default function NewQuotation() {
  const [showPreview, setShowPreview] = useState(true);
  const [quotationData, setQuotationData] = useState<QuotationFormData | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleFormData = (data: QuotationFormData) => {
    setQuotationData({
      ...data,
      companyName: companyInfo?.name || data.companyName,
      companyEmail: companyInfo?.email || data.companyEmail,
      companyPhone: companyInfo?.phone || data.companyPhone,
      companyAddress: companyInfo?.address || data.companyAddress,
    });
  };

  const handleCompanySelect = (info: CompanyInfo) => {
    setCompanyInfo(info);
    
    if (quotationData) {
      const updatedQuotation = {
        ...quotationData,
        companyName: info.name,
        companyEmail: info.email,
        companyPhone: info.phone,
        companyAddress: info.address,
      };
      setQuotationData(updatedQuotation);
    }
    
    setShowCompanyInfo(false);
  };

  const handleCreateQuotation = async (data: QuotationFormData, status: 'draft' | 'sent' = 'sent') => {
    try {
      const response = await fetch("/api/quotations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          status,
        }),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Cotización creada correctamente",
        });
        queryClient.invalidateQueries({ queryKey: ["quotations"] });
        setLocation("/quotations");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la cotización",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nueva Cotización</h1>
        <Button variant="outline" onClick={() => setShowCompanyInfo(!showCompanyInfo)}>
          {showCompanyInfo ? "Ocultar Info. Empresa" : "Modificar Info. Empresa"}
        </Button>
      </div>

      {showCompanyInfo && (
        <CompanyInfoManager onSelect={handleCompanySelect} />
      )}

      <div className="flex flex-col h-full">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex justify-between items-center px-6 py-3">
            <div className="flex items-center space-x-4">
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

        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 h-full">
            <div className="space-y-6 overflow-y-auto">
              <QuotationForm 
                onFormDataChange={handleFormData}
                companyInfo={companyInfo}
              />
            </div>
            
            {showPreview && (
              <div className="overflow-y-auto">
                <QuotationPreview 
                  quotation={quotationData}
                  companyInfo={companyInfo}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
