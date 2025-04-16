import { useCallback } from "react";
import { QuotationFormData, QuotationWithItems } from "@shared/schema";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import MinimalistTemplate from "./templates/MinimalistTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import { Button } from "@/components/ui/button";
import { Eye, Printer, FileDown } from "lucide-react";
import { generatePdf } from "@/lib/generatePdf";

interface QuotationPreviewProps {
  quotation: QuotationFormData | null;
}

export default function QuotationPreview({ quotation }: QuotationPreviewProps) {
  const renderTemplate = useCallback(() => {
    if (!quotation) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-center">
            <Eye className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Complete el formulario para ver la vista previa</p>
          </div>
        </div>
      );
    }

    // Convert to format expected by templates
    const quotationWithItems = {
      ...quotation,
      items: quotation.items || [],
      date: quotation.date ? new Date(quotation.date) : new Date(),
      validUntil: quotation.validUntil ? new Date(quotation.validUntil) : null,
      id: 0,  // Campos requeridos por QuotationWithItems pero no usados en visualización
      userId: 0,
      customerId: null,
      status: 'draft',
    } as QuotationWithItems;

    switch (quotation.template) {
      case "minimalist":
        return <MinimalistTemplate quotation={quotationWithItems} />;
      case "creative":
        return <CreativeTemplate quotation={quotationWithItems} />;
      case "professional":
      default:
        return <ProfessionalTemplate quotation={quotationWithItems} />;
    }
  }, [quotation]);

  const handlePrintPreview = () => {
    // Preparar la página para impresión - ocultar todo excepto la plantilla
    document.body.classList.add('printing');
    document.documentElement.style.overflow = 'hidden'; // Evitar scroll en HTML
    
    // Imprimir con un pequeño retraso para permitir que los estilos CSS se apliquen
    setTimeout(() => {
      window.print();
      
      // Quitar la clase después de la impresión para restaurar la vista normal
      setTimeout(() => {
        document.body.classList.remove('printing');
        document.documentElement.style.overflow = ''; // Restaurar scroll
      }, 500);
    }, 300);
  };

  const handleExportPdf = () => {
    if (quotation) {
      generatePdf(quotation);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="bg-gray-100 p-4 md:p-8 rounded-lg">
        <div className="relative shadow-xl">
          {renderTemplate()}
        </div>
      </div>
      
      {/* Export Options */}
      <div className="bg-white px-8 py-4 rounded-lg border border-gray-200 mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-neutral-600">Plantilla:</span>
          <span className="text-sm font-medium capitalize">
            {quotation?.template || "Profesional"}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={handlePrintPreview}>
            <Printer className="mr-1.5 h-4 w-4" />
            Imprimir
          </Button>
          <Button 
            size="sm"
            onClick={handleExportPdf}
            disabled={!quotation}
          >
            <FileDown className="mr-1.5 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
