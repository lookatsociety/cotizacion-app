import { useCallback, useRef } from "react";
import { QuotationFormData, CompanyInfo } from "@shared/schema";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import MinimalistTemplate from "./templates/MinimalistTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import { Button } from "@/components/ui/button";
import { Eye, Printer, FileDown } from "lucide-react";
import { generatePdf } from "@/lib/generatePdf";

interface QuotationPreviewProps {
  quotation: QuotationFormData | null;
  companyInfo?: CompanyInfo;
}

export default function QuotationPreview({ quotation, companyInfo }: QuotationPreviewProps) {
  const printFrameRef = useRef<HTMLIFrameElement>(null);
  
  const getTemplateComponent = useCallback(() => {
    if (!quotation) return null;
    
    // Convert to format expected by templates
    const quotationWithItems: QuotationWithItems = {
      ...quotation,
      items: quotation.items || [],
      date: quotation.date ? new Date(quotation.date) : new Date(),
      validUntil: quotation.validUntil ? new Date(quotation.validUntil) : null,
      id: 0,
      userId: 0,
      customerId: null,
      status: 'draft',
      customerName: quotation.customerName || null,
      customerEmail: quotation.customerEmail || null,
      customerPhone: quotation.customerPhone || null,
      customerAddress: quotation.customerAddress || null,
    };

    // Asegurarse de que la información de la empresa se pase correctamente
    const company = companyInfo ? {
      name: companyInfo.name,
      email: companyInfo.email,
      phone: companyInfo.phone,
      address: companyInfo.address,
      website: companyInfo.website,
      representative: companyInfo.representative,
    } : undefined;

    switch (quotation.template) {
      case "minimalist":
        return <MinimalistTemplate quotation={quotationWithItems} companyInfo={company} />;
      case "creative":
        return <CreativeTemplate quotation={quotationWithItems} companyInfo={company} />;
      case "professional":
      default:
        return <ProfessionalTemplate quotation={quotationWithItems} companyInfo={company} />;
    }
  }, [quotation, companyInfo]);
  
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

    return getTemplateComponent();
  }, [quotation, getTemplateComponent]);

  const handlePrintPreview = () => {
    if (!quotation) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const templateComponent = getTemplateComponent();
    if (!templateComponent) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cotización ${quotation.quotationNumber}</title>
        <style>
          @page { size: letter; margin: 1cm; }
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          .quotation-template { 
            border: 2px solid black;
            border-radius: 8px;
            padding: 2rem;
            background-color: white;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            margin: 0 auto;
          }
          /* Estilos adicionales necesarios */
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .items-start { align-items: flex-start; }
          .mb-8 { margin-bottom: 2rem; }
          .text-sm { font-size: 0.875rem; }
          .text-neutral-600 { color: #525252; }
          .mt-3 { margin-top: 0.75rem; }
          .font-bold { font-weight: bold; }
          .text-right { text-align: right; }
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .gap-8 { gap: 2rem; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 0.75rem 1rem; text-align: left; }
          .border-t { border-top: 1px solid #e5e7eb; }
          .text-center { text-align: center; }
          .pt-6 { padding-top: 1.5rem; }
        </style>
      </head>
      <body>
        <div class="quotation-template">
    `);
    
    // Agregamos el contenido específico según la plantilla
    switch (quotation.template) {
      case "minimalist":
        printWindow.document.write(`
          <div class="flex justify-between items-start mb-8">
            <div>
              <h1>Cotización #${quotation.quotationNumber}</h1>
              <p class="text-sm text-neutral-600 mt-3">
                Fecha: ${new Date(quotation.date).toLocaleDateString('es-MX')}
              </p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3>Para</h3>
              <p>${quotation.customerName || ''}</p>
              <p>${quotation.customerEmail || ''}</p>
              <p>${quotation.customerPhone || ''}</p>
              <p>${quotation.customerAddress || ''}</p>
            </div>
            <div>
              <h3>De</h3>
              <p><strong>${companyInfo?.name || ''}</strong></p>
              <p>${companyInfo?.representative || ''}</p>
              <p>${companyInfo?.email || ''}</p>
              <p>${companyInfo?.phone || ''}</p>
              <p>${companyInfo?.address || ''}</p>
              <p>${companyInfo?.website || ''}</p>
            </div>
          </div>
          
          <table border="1">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${quotation.items?.map((item, index) => `
                <tr>
                  <td>
                    <strong>${item.name}</strong><br>
                    ${item.description || ''}
                  </td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(item.price))}</td>
                  <td style="text-align: right;"><strong>${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(item.total))}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 2rem; text-align: right;">
            <p>Subtotal: ${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(quotation.subtotal))}</p>
            <p>IVA (${quotation.taxRate}%): ${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(quotation.taxAmount))}</p>
            <p><strong>Total: ${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(quotation.total))}</strong></p>
          </div>
          
          ${quotation.notes ? `
            <div style="margin-top: 1rem; padding: 1rem; background-color: #f9fafb; border-radius: 0.375rem;">
              <h3>Notas</h3>
              <p>${quotation.notes}</p>
            </div>
          ` : ''}
          
          <div class="border-t text-center pt-6" style="margin-top: 2rem;">
            <p>¿Preguntas? Contáctenos: ${companyInfo?.email || ''} | ${companyInfo?.phone || ''}</p>
            <p>Gracias por su preferencia</p>
          </div>
        `);
        break;
      
      default:
        printWindow.document.write(`
          <div class="flex justify-between items-start mb-8">
            <div>
              <h1>Cotización #${quotation.quotationNumber}</h1>
              <p class="text-sm text-neutral-600 mt-3">
                Por medio de la presente le presentamos a usted la cotización de los trabajos solicitados
              </p>
              <p class="mt-2">
                <strong>Proyecto:</strong> ${quotation.projectName || ""}
              </p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3>Para</h3>
              <p>${quotation.customerName || ''}</p>
              <p>${quotation.customerEmail || ''}</p>
              <p>${quotation.customerPhone || ''}</p>
              <p>${quotation.customerAddress || ''}</p>
            </div>
            <div>
              <h3>De</h3>
              <p><strong>${companyInfo?.name || ''}</strong></p>
              <p>${companyInfo?.representative || ''}</p>
              <p>${companyInfo?.email || ''}</p>
              <p>${companyInfo?.phone || ''}</p>
              <p>${companyInfo?.address || ''}</p>
              <p>${companyInfo?.website || ''}</p>
            </div>
          </div>
          
          <table border="1">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${quotation.items?.map((item, index) => `
                <tr>
                  <td>
                    <strong>${item.name}</strong><br>
                    ${item.description || ''}
                  </td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(item.price))}</td>
                  <td style="text-align: right;"><strong>${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(item.total))}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 2rem; text-align: right;">
            <p>Subtotal: ${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(quotation.subtotal))}</p>
            <p>IVA (${quotation.taxRate}%): ${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(quotation.taxAmount))}</p>
            <p><strong>Total: ${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(quotation.total))}</strong></p>
          </div>
          
          ${quotation.notes ? `
            <div style="margin-top: 1rem; padding: 1rem; background-color: #f9fafb; border-radius: 0.375rem;">
              <h3>Notas</h3>
              <p>${quotation.notes}</p>
            </div>
          ` : ''}
          
          <div class="border-t text-center pt-6" style="margin-top: 2rem;">
            <p>¿Preguntas? Contáctenos: ${companyInfo?.email || ''} | ${companyInfo?.phone || ''}</p>
            <p>Gracias por su preferencia</p>
          </div>
        `);
    }
    
    printWindow.document.write('</div></body></html>');
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  const handleExportPdf = () => {
    if (quotation) {
      generatePdf(quotation);
    }
  };

  return (
    <div className="mx-auto max-w-4xl print-container">
      <div className="bg-gray-100 p-4 md:p-8 rounded-lg print-bg">
        <div className="relative shadow-xl">
          {renderTemplate()}
        </div>
      </div>
      
      {/* Export Options */}
      <div className="bg-white px-8 py-4 rounded-lg border border-gray-200 mt-4 flex justify-between items-center print-hide">
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
      
      {/* iframe oculto para impresión */}
      <iframe 
        ref={printFrameRef} 
        style={{ display: 'none' }} 
        title="Impresión" />
    </div>
  );
}
