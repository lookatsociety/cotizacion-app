import { QuotationWithItems } from "@shared/schema";
import spekLogo from "@/assets/images/spek_logo.png";

interface CreativeTemplateProps {
  quotation: QuotationWithItems;
  companyInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export default function CreativeTemplate({ 
  quotation, 
  companyInfo = {
    name: "Servicios y Productos Especializados Krapsol (S.P.E.K) S.A. de C.V.",
    email: "vgalvan@spekmx.com",
    phone: "81 1991 1723",
    address: "www.spekmx.com",
  }
}: CreativeTemplateProps) {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-black quotation-template" style={{ width: '100%', margin: '0 auto' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-600 to-secondary-500 text-white p-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-white p-4 rounded-lg">
                <img src={spekLogo} alt="SPEK Industrial" className="h-40 object-contain" />
              </div>
            </div>
            <div className="text-white/90 mt-4">
              Por medio de la presente S.P.E.K le presenta a usted la cotización de los trabajos solicitados
            </div>
            <div className="mt-2 text-white">
              <span className="font-bold">Proyecto:</span> {quotation.projectName || "Servicios SPEK Industrial"}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">SPEK</div>
            <div className="text-white/90 text-sm">Ing. Victor Galván Santoyo</div>
            <div className="text-white/80 text-sm">Servicios y Productos Especializados Krapsol (S.P.E.K) S.A. de C.V.</div>
            <div className="text-white/80 text-sm">{companyInfo.phone}</div>
            <div className="text-white/80 text-sm">{companyInfo.email} &nbsp;&nbsp; {companyInfo.address}</div>
            <div className="bg-white/20 rounded-md px-3 py-1 mt-2 text-sm inline-block">
              #{quotation.quotationNumber}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mt-10">
          <div>
            <div className="text-white/80 text-sm uppercase tracking-wider mb-1">Para</div>
            <div className="text-lg font-medium">{quotation.customerName}</div>
            {quotation.customerEmail && <div className="text-white/80">{quotation.customerEmail}</div>}
            {quotation.customerPhone && <div className="text-white/80">{quotation.customerPhone}</div>}
            {quotation.customerAddress && <div className="text-white/80 mt-1">{quotation.customerAddress}</div>}
          </div>
          
          <div>
            <div className="text-white/80 text-sm uppercase tracking-wider mb-1">Detalles</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-white/80 text-xs">Fecha de emisión</div>
                <div>{formatDate(quotation.date as unknown as string)}</div>
              </div>
              <div>
                <div className="text-white/80 text-xs">Válido hasta</div>
                <div>
                  {quotation.validUntil ? formatDate(quotation.validUntil as unknown as string) : "30 días después"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Items */}
      <div className="p-8">
        <div className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
          Productos y Servicios
        </div>
        
        <div className="space-y-6">
          {quotation.items.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 grid grid-cols-12 gap-4">
              {item.image && (
                <div className="col-span-2">
                  <div className="aspect-square rounded-md overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
              
              <div className={`${item.image ? 'col-span-6' : 'col-span-8'}`}>
                <div className="font-medium text-lg">{item.name}</div>
                {item.description && <div className="text-gray-500 mt-1">{item.description}</div>}
              </div>
              
              <div className="col-span-2 text-right self-center">
                <div className="text-sm text-gray-500"><span className="font-mono mr-1">#{index + 1}</span> Precio × {item.quantity}</div>
                <div className="font-medium">{formatCurrency(Number(item.price))}</div>
              </div>
              
              <div className="col-span-2 text-right self-center">
                <div className="text-sm text-gray-500">Total</div>
                <div className="font-bold text-lg">{formatCurrency(Number(item.total))}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="mt-8 border-t border-dashed border-gray-200 pt-6">
          <div className="flex justify-end">
            <div className="w-72">
              <div className="flex justify-between items-center py-3">
                <div className="text-gray-500">Subtotal</div>
                <div className="text-lg">{formatCurrency(Number(quotation.subtotal))}</div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="text-gray-500">IVA ({Number(quotation.taxRate)}%)</div>
                <div className="text-lg">{formatCurrency(Number(quotation.taxAmount))}</div>
              </div>
              <div className="flex justify-between items-center py-4">
                <div className="text-xl font-bold">Total</div>
                <div className="text-2xl font-bold text-secondary-600">{formatCurrency(Number(quotation.total))}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        {quotation.notes && (
          <div className="mt-10 bg-gray-50 p-6 rounded-lg border-l-4 border-secondary-500">
            <div className="font-bold mb-2">Notas</div>
            <p className="text-gray-700">{quotation.notes}</p>
          </div>
        )}
        
        {/* Delivery & Payment Terms */}
        {quotation.deliveryTerms && (
          <div className="mt-6 bg-gray-50 p-6 rounded-lg border-l-4 border-secondary-500">
            <div className="font-bold mb-2">Condiciones de entrega y pago</div>
            <p className="text-gray-700">{quotation.deliveryTerms}</p>
          </div>
        )}
        
        {/* Thank You */}
        <div className="mt-12 text-center">
          <div className="inline-block mx-auto px-8 py-3 bg-secondary-50 text-secondary-600 rounded-full font-medium">
            ¡Gracias por la oportunidad de trabajar juntos!
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <div>
              {companyInfo.name} | {companyInfo.address}
            </div>
            <div className="mt-1">
              {companyInfo.phone} | {companyInfo.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
