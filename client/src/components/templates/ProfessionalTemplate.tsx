import { QuotationWithItems } from "@shared/schema";
import { SpekIndustrialLogo } from "@/components/SpekLogo";

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
    name: "SPEK Industrial",
    email: "contacto@spekindustrial.com",
    phone: "+52 (123) 456-7890",
    address: "Av. Industrial 123, Ciudad de México, CDMX, 06000",
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
      <div className="flex flex-col mb-8">
        <div className="flex justify-between items-start">
          <div className="bg-black rounded-lg overflow-hidden p-4 -mx-4 -mt-4 mb-4">
            <SpekIndustrialLogo width={240} height={80} />
            <div className="text-sm text-white mt-2 font-mono">#{quotation.quotationNumber}</div>
          </div>
          
          <div className="flex items-center justify-center w-16 h-16 bg-black rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        
        <div className="bg-neutral-100 h-1 w-full my-4"></div>
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
      <div className="mb-8 overflow-hidden rounded-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left py-3 px-6 text-xs font-medium uppercase tracking-wider">Descripción</th>
              <th className="text-center py-3 px-6 text-xs font-medium uppercase tracking-wider">Cant.</th>
              <th className="text-right py-3 px-6 text-xs font-medium uppercase tracking-wider">Precio</th>
              <th className="text-right py-3 px-6 text-xs font-medium uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quotation.items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="py-4 px-6">
                  {item.image ? (
                    <div className="flex">
                      <div className="mr-3 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-gray-200" />
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
                <td className="py-4 px-6 text-center">{item.quantity}</td>
                <td className="py-4 px-6 text-right">{formatCurrency(Number(item.price))}</td>
                <td className="py-4 px-6 text-right font-medium">{formatCurrency(Number(item.total))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-72 border border-gray-200 rounded-md overflow-hidden">
          <div className="bg-gray-50 p-4">
            <div className="flex justify-between py-2 text-sm">
              <div className="text-neutral-600">Subtotal:</div>
              <div className="font-medium">{formatCurrency(Number(quotation.subtotal))}</div>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <div className="text-neutral-600">IVA ({Number(quotation.taxRate)}%):</div>
              <div className="font-medium">{formatCurrency(Number(quotation.taxAmount))}</div>
            </div>
          </div>
          <div className="flex justify-between py-4 px-4 text-base bg-black text-white">
            <div className="font-semibold">Total:</div>
            <div className="font-bold">{formatCurrency(Number(quotation.total))}</div>
          </div>
        </div>
      </div>
      
      {/* Notes */}
      {quotation.notes && (
        <div className="bg-black p-5 rounded-md text-white">
          <h3 className="font-medium text-white mb-3 uppercase tracking-wider">Notas</h3>
          <p className="font-light leading-relaxed">{quotation.notes}</p>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-10 text-center border-t border-gray-200 pt-8">
        <div className="inline-block bg-black text-white px-6 py-3 rounded-full">
          <p className="font-medium">¿Preguntas? Contáctenos: {companyInfo.email} | {companyInfo.phone}</p>
          <p className="mt-1 text-sm opacity-90">Gracias por su preferencia.</p>
        </div>
      </div>
    </div>
  );
}
