import { useCallback, useRef } from "react";
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
  const printFrameRef = useRef<HTMLIFrameElement>(null);
  
  const getTemplateComponent = useCallback(() => {
    if (!quotation) return null;
    
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
    // Una solución muy simple usando una ventana nueva para imprimir
    // Esto evita todos los problemas que hemos estado experimentando
    
    if (!quotation) return;
    
    // Creamos una nueva ventana para la impresión
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    // Obtenemos el componente de la plantilla actual
    const templateComponent = getTemplateComponent();
    if (!templateComponent) return;
    
    // Obtenemos el contenido HTML del template
    const templateDiv = document.createElement('div');
    
    // Estilos CSS esenciales para la plantilla
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cotización ${quotation.quotationNumber}</title>
        <style>
          @page { size: letter; margin: 1cm; }
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          /* Estilos para la cotización */
          .p-8 { padding: 2rem; }
          .bg-white { background-color: white; }
          .rounded-lg { border-radius: 0.5rem; }
          .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .border-2 { border-width: 2px; border-style: solid; }
          .border-black { border-color: black; }
          
          /* Flexbox y Grid */
          .flex { display: flex; }
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .gap-8 { gap: 2rem; }
          .items-start { align-items: flex-start; }
          .items-center { align-items: center; }
          .justify-between { justify-content: space-between; }
          .justify-start { justify-content: flex-start; }
          
          /* Espaciado */
          .mb-8 { margin-bottom: 2rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mb-2 { margin-bottom: 0.5rem; }
          .mb-1 { margin-bottom: 0.25rem; }
          .mt-8 { margin-top: 2rem; }
          .mt-3 { margin-top: 0.75rem; }
          .mt-2 { margin-top: 0.5rem; }
          .mt-1 { margin-top: 0.25rem; }
          .mr-3 { margin-right: 0.75rem; }
          .mr-1 { margin-right: 0.25rem; }
          
          /* Tipografía */
          .text-xs { font-size: 0.75rem; }
          .text-sm { font-size: 0.875rem; }
          .text-base { font-size: 1rem; }
          .text-lg { font-size: 1.125rem; }
          .text-xl { font-size: 1.25rem; }
          .font-bold { font-weight: 700; }
          .font-semibold { font-weight: 600; }
          .font-medium { font-weight: 500; }
          .uppercase { text-transform: uppercase; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .font-mono { font-family: monospace; }
          
          /* Colores de texto */
          .text-neutral-800 { color: #262626; }
          .text-neutral-600 { color: #525252; }
          .text-neutral-500 { color: #737373; }
          .text-primary-600 { color: #2563eb; }
          
          /* Bordes */
          .border-t { border-top-width: 1px; border-top-style: solid; }
          .border-b { border-bottom-width: 1px; border-bottom-style: solid; }
          .border-gray-200 { border-color: #e5e7eb; }
          .border-gray-100 { border-color: #f3f4f6; }
          
          /* Fondos */
          .bg-gray-50 { background-color: #f9fafb; }
          .rounded-md { border-radius: 0.375rem; }
          
          /* Tablas */
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 0.75rem 1rem; }
          
          /* Imágenes */
          .object-contain { object-fit: contain; }
          .object-cover { object-fit: cover; }
          .h-40 { height: 10rem; }
          .w-16 { width: 4rem; }
          .h-16 { height: 4rem; }
          .w-64 { width: 16rem; }
          
          /* Estilos adicionales necesarios */
          .p-4 { padding: 1rem; }
          .px-4 { padding-left: 1rem; padding-right: 1rem; }
          .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
          .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
          .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
          .pt-6 { padding-top: 1.5rem; }
          .relative { position: relative; }
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
        </style>
      </head>
      <body>
        <div class="quotation-template">
    `);
    
    // Agregamos el HTML del componente de cotización actual
    let templateHTML = '';
    switch (quotation.template) {
      case "minimalist":
        templateHTML = `
          <h1>Cotización # ${quotation.quotationNumber}</h1>
          <div class="flex justify-between items-start mb-8">
            <div>
              <p>SPEK Industrial</p>
              <p>Proyecto: ${quotation.projectName || "Servicios SPEK Industrial"}</p>
            </div>
            <div>
              <p>Fecha: ${new Date(quotation.date || new Date()).toLocaleDateString('es-MX')}</p>
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
              <p><b>SPEK</b></p>
              <p>Ing. Victor Galván Santoyo</p>
              <p>Servicios y Productos Especializados Krapsol (S.P.E.K) S.A. de C.V.</p>
              <p>81 1991 1723</p>
              <p>vgalvan@spekmx.com &nbsp;&nbsp;&nbsp;&nbsp; www.spekmx.com</p>
            </div>
          </div>
          <table border="1" style="width:100%; border-collapse: collapse;">
            <tr>
              <th>Descripción</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
            ${quotation.items?.map((item, index) => `
              <tr>
                <td>
                  <p><b>${item.name}</b></p>
                  <p>${item.description || ''}</p>
                </td>
                <td style="text-align:center;">#${index + 1} ${item.quantity}</td>
                <td style="text-align:right;">${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(item.price))}</td>
                <td style="text-align:right;"><b>${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(item.total))}</b></td>
              </tr>
            `).join('')}
          </table>
          <div style="margin-top: 2rem; text-align: right;">
            <p>Subtotal: ${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(quotation.subtotal))}</p>
            <p>IVA (${Number(quotation.taxRate)}%): ${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(quotation.taxAmount))}</p>
            <p><b>Total: ${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(quotation.total))}</b></p>
          </div>
          ${quotation.notes ? `
            <div style="margin-top: 1rem; padding: 1rem; background-color: #f9fafb; border-radius: 0.375rem;">
              <h3>Notas</h3>
              <p>${quotation.notes}</p>
            </div>
          ` : ''}
          ${quotation.deliveryTerms ? `
            <div style="margin-top: 1rem; padding: 1rem; background-color: #f9fafb; border-radius: 0.375rem;">
              <h3>Condiciones de entrega y pago</h3>
              <p>${quotation.deliveryTerms}</p>
            </div>
          ` : ''}
          <div style="margin-top: 2rem; text-align: center; padding-top: 1.5rem; border-top: 1px solid #f3f4f6;">
            <p>¿Preguntas? Contáctenos: vgalvan@spekmx.com | 81 1991 1723</p>
            <p>Gracias por su preferencia.</p>
          </div>
        `;
        break;
      default:
        templateHTML = `
          <h1>Cotización # ${quotation.quotationNumber}</h1>
          <div class="flex justify-between items-start mb-8">
            <div>
              <p>SPEK Industrial</p>
              <p>Proyecto: ${quotation.projectName || "Servicios SPEK Industrial"}</p>
            </div>
            <div>
              <p>Fecha: ${new Date(quotation.date || new Date()).toLocaleDateString('es-MX')}</p>
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
              <p><b>SPEK</b></p>
              <p>Ing. Victor Galván Santoyo</p>
              <p>Servicios y Productos Especializados Krapsol (S.P.E.K) S.A. de C.V.</p>
              <p>81 1991 1723</p>
              <p>vgalvan@spekmx.com &nbsp;&nbsp;&nbsp;&nbsp; www.spekmx.com</p>
            </div>
          </div>
          <table border="1" style="width:100%; border-collapse: collapse;">
            <tr>
              <th>Descripción</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
            ${quotation.items?.map((item, index) => `
              <tr>
                <td>
                  <p><b>${item.name}</b></p>
                  <p>${item.description || ''}</p>
                </td>
                <td style="text-align:center;">#${index + 1} ${item.quantity}</td>
                <td style="text-align:right;">${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(item.price))}</td>
                <td style="text-align:right;"><b>${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(item.total))}</b></td>
              </tr>
            `).join('')}
          </table>
          <div style="margin-top: 2rem; text-align: right;">
            <p>Subtotal: ${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(quotation.subtotal))}</p>
            <p>IVA (${Number(quotation.taxRate)}%): ${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(quotation.taxAmount))}</p>
            <p><b>Total: ${new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'}).format(Number(quotation.total))}</b></p>
          </div>
          ${quotation.notes ? `
            <div style="margin-top: 1rem; padding: 1rem; background-color: #f9fafb; border-radius: 0.375rem;">
              <h3>Notas</h3>
              <p>${quotation.notes}</p>
            </div>
          ` : ''}
          ${quotation.deliveryTerms ? `
            <div style="margin-top: 1rem; padding: 1rem; background-color: #f9fafb; border-radius: 0.375rem;">
              <h3>Condiciones de entrega y pago</h3>
              <p>${quotation.deliveryTerms}</p>
            </div>
          ` : ''}
          <div style="margin-top: 2rem; text-align: center; padding-top: 1.5rem; border-top: 1px solid #f3f4f6;">
            <p>¿Preguntas? Contáctenos: vgalvan@spekmx.com | 81 1991 1723</p>
            <p>Gracias por su preferencia.</p>
          </div>
        `;
    }
    
    printWindow.document.write(templateHTML);
    printWindow.document.write('</div></body></html>');
    printWindow.document.close();
    
    // Imprimir después de que la ventana esté completamente cargada
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      // Cerramos la ventana después de imprimir
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
