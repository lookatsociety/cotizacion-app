import { QuotationWithItems } from "@shared/schema";
import spekLogo from "@/assets/images/spek_logo.png";

interface ProfessionalTemplateProps {
  quotation: QuotationWithItems;
  companyInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export default function ProfessionalTemplate({ 
  quotation, 
  companyInfo = {
    name: "Mi Empresa SRL",
    email: "contacto@miempresa.com",
    phone: "+52 (123) 456-7890",
    address: "Av. Principal 123, Ciudad de México, CDMX, 06000",
  }
}: ProfessionalTemplateProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center justify-start">
            <img src={spekLogo} alt="SPEK Industrial" className="h-32 object-contain mb-2" />
          </div>
          <div className="text-sm text-neutral-500 mt-1 font-mono">#{quotation.quotationNumber}</div>
        </div>
        
        <div>
          <div className="text-xl font-bold text-primary-600 text-right">FOLIO</div>
          <div className="text-neutral-800 font-mono text-right">#{quotation.quotationNumber}</div>
        </div>
      </div>
      
      {/* Info Rows */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xs font-medium text-neutral-500 uppercase mb-1">Para</h3>
          <div className="text-neutral-800 font-medium">{quotation.customerName}</div>
          {quotation.customerEmail && <div className="text-sm text-neutral-600">{quotation.customerEmail}</div>}
          {quotation.customerPhone && <div className="text-sm text-neutral-600">{quotation.customerPhone}</div>}
          {quotation.customerAddress && <div className="text-sm text-neutral-600 mt-1">{quotation.customerAddress}</div>}
        </div>
        
        <div>
          <h3 className="text-xs font-medium text-neutral-500 uppercase mb-1">De</h3>
          <div className="text-neutral-800 font-medium">{companyInfo.name}</div>
          <div className="text-sm text-neutral-600">{companyInfo.email}</div>
          <div className="text-sm text-neutral-600">{companyInfo.phone}</div>
          <div className="text-sm text-neutral-600 mt-1">{companyInfo.address}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xs font-medium text-neutral-500 uppercase mb-1">Fecha de Emisión</h3>
          <div className="text-sm text-neutral-800">{formatDate(quotation.date as unknown as string)}</div>
        </div>
        
        <div>
          <h3 className="text-xs font-medium text-neutral-500 uppercase mb-1">Válido Hasta</h3>
          <div className="text-sm text-neutral-800">
            {quotation.validUntil ? formatDate(quotation.validUntil as unknown as string) : "30 días después de la emisión"}
          </div>
        </div>
      </div>
      
      {/* Items Table */}
      <div className="mb-8">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Descripción</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Cant.</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Precio</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody>
            {quotation.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-4 px-4">
                  {item.image ? (
                    <div className="flex">
                      <div className="mr-3 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.description && <div className="text-sm text-neutral-500 mt-1">{item.description}</div>}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.description && <div className="text-sm text-neutral-500 mt-1">{item.description}</div>}
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 text-center">{item.quantity}</td>
                <td className="py-4 px-4 text-right">{formatCurrency(Number(item.price))}</td>
                <td className="py-4 px-4 text-right font-medium">{formatCurrency(Number(item.total))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 text-sm">
            <div className="text-neutral-600">Subtotal:</div>
            <div className="font-medium">{formatCurrency(Number(quotation.subtotal))}</div>
          </div>
          <div className="flex justify-between py-2 text-sm border-b border-gray-200">
            <div className="text-neutral-600">IVA ({Number(quotation.taxRate)}%):</div>
            <div className="font-medium">{formatCurrency(Number(quotation.taxAmount))}</div>
          </div>
          <div className="flex justify-between py-3 text-base">
            <div className="font-semibold">Total:</div>
            <div className="font-bold text-primary-600">{formatCurrency(Number(quotation.total))}</div>
          </div>
        </div>
      </div>
      
      {/* Notes */}
      {quotation.notes && (
        <div className="bg-gray-50 p-4 rounded-md text-sm text-neutral-600">
          <h3 className="font-medium text-neutral-800 mb-2">Notas</h3>
          <p>{quotation.notes}</p>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-8 text-center text-sm text-neutral-500 border-t border-gray-100 pt-6">
        <p>¿Preguntas? Contáctenos: {companyInfo.email} | {companyInfo.phone}</p>
        <p className="mt-1">Gracias por su preferencia.</p>
      </div>
    </div>
  );
}
