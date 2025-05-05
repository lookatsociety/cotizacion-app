import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuotationFormData, quotationFormSchema } from "@shared/schema";
import CustomerSection from "./CustomerSection";
import ItemsTable from "./ItemsTable";
import TaxAndNotes from "./TaxAndNotes";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TemplateSelectionModal from "./TemplateSelectionModal";
import { useToast } from "@/hooks/use-toast";
import { CompanyInfo } from "@shared/schema";

interface QuotationFormProps {
  onFormDataChange: (data: QuotationFormData) => void;
  companyInfo?: CompanyInfo;
}

export default function QuotationForm({ onFormDataChange, companyInfo }: QuotationFormProps) {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [currentCompanyInfo, setCurrentCompanyInfo] = useState(companyInfo);
  const { toast } = useToast();
  
  // Get initial quotation number from API
  interface QuotationNumberResponse {
    quotationNumber: string;
  }
  
  const { data: quotationNumberData } = useQuery<QuotationNumberResponse>({
    queryKey: ["/api/generate-quotation-number"],
  });
  
  // Actualizar cuando cambie la información de la empresa
  useEffect(() => {
    setCurrentCompanyInfo(companyInfo);
  }, [companyInfo]);

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      quotationNumber: "",
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      projectName: "",
      template: "professional",
      items: [],
      subtotal: 0,
      taxRate: 16,
      taxAmount: 0,
      total: 0,
      notes: "Esta cotización es válida por 30 días a partir de la fecha de emisión. Los precios no incluyen costos adicionales que puedan surgir durante el desarrollo del proyecto.",
      deliveryTerms: "Entrega en sitio acordado. Pago 50% anticipo, 50% contra entrega. Tiempo de entrega estimado: 15 días hábiles.",
      companyName: currentCompanyInfo?.name || "",
      companyEmail: currentCompanyInfo?.email || "",
      companyPhone: currentCompanyInfo?.phone || "",
      companyAddress: currentCompanyInfo?.address || "",
    }
  });
  
  // Actualizar el formulario cuando cambie la información de la empresa
  useEffect(() => {
    if (currentCompanyInfo) {
      form.setValue("companyName", currentCompanyInfo.name);
      form.setValue("companyEmail", currentCompanyInfo.email);
      form.setValue("companyPhone", currentCompanyInfo.phone);
      form.setValue("companyAddress", currentCompanyInfo.address);
    }
  }, [currentCompanyInfo, form]);
  
  // Update form when quotation number is fetched
  useEffect(() => {
    if (quotationNumberData?.quotationNumber) {
      form.setValue("quotationNumber", quotationNumberData.quotationNumber);
    }
  }, [quotationNumberData, form]);
  
  // Send form data to parent component whenever it changes
  useEffect(() => {
    const subscription = form.watch((data) => {
      onFormDataChange(data as QuotationFormData);
    });
    return () => subscription.unsubscribe();
  }, [form, onFormDataChange]);
  
  // Calculate totals when items change
  const calculateTotals = () => {
    const items = form.getValues("items");
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    const taxRate = form.getValues("taxRate") || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    
    form.setValue("subtotal", subtotal);
    form.setValue("taxAmount", taxAmount);
    form.setValue("total", total);
  };
  
  // Handle template selection
  const handleTemplateSelect = (template: string) => {
    form.setValue("template", template);
    setIsTemplateModalOpen(false);
    
    toast({
      title: "Plantilla seleccionada",
      description: `Se ha seleccionado la plantilla ${template}`,
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="pt-5">
            <h2 className="text-lg font-medium mb-4">Información de la Cotización</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Número de Cotización</label>
                <Input
                  {...form.register("quotationNumber")}
                  className="bg-gray-50 font-mono"
                  readOnly
                />
              </div>
              
              <div>
                <label className="form-label">Fecha</label>
                <div className="relative">
                  <Input
                    type="date"
                    {...form.register("date")}
                  />
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="flex justify-between items-center">
                  <label className="form-label">Plantilla</label>
                  <button 
                    type="button"
                    className="text-primary-600 text-sm hover:text-primary-700"
                    onClick={() => setIsTemplateModalOpen(true)}
                  >
                    Cambiar plantilla
                  </button>
                </div>
                <div className="relative">
                  <Input
                    {...form.register("template")}
                    className="capitalize"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Customer Section */}
        <CustomerSection form={form} />
        
        {/* Items Table */}
        <ItemsTable form={form} calculateTotals={calculateTotals} />
        
        {/* Tax and Notes */}
        <TaxAndNotes form={form} calculateTotals={calculateTotals} />
      </form>
      
      <TemplateSelectionModal 
        open={isTemplateModalOpen}
        onOpenChange={setIsTemplateModalOpen}
        selectedTemplate={form.getValues("template")}
        onSelect={handleTemplateSelect}
      />
    </Form>
  );
}
