import { QuotationWithItems } from "@shared/schema";
import spekLogo from "@/assets/images/spek_logo.png";

interface MinimalistTemplateProps {
  quotation: QuotationWithItems;
  companyInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export default function MinimalistTemplate({ 
  quotation, 
  companyInfo = {
    name: "Servicios y Productos Especializados Krapsol (S.P.E.K) S.A. de C.V.",
    email: "vgalvan@spekmx.com",
    phone: "81 1991 1723",
    address: "www.spekmx.com",
  }
}: MinimalistTemplateProps) {
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
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto border-2 border-black">
      {/* Header */}
      <div className="border-b pb-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div>
              <img src={spekLogo} alt="SPEK Industrial" className="h-40 object-contain mb-3" />
              <div className="text-sm text-gray-600 mt-3">
                Por medio de la presente S.P.E.K le presenta a usted la cotización de los trabajos solicitados
              </div>
              <div className="mt-2">
                <span className="font-bold">Proyecto:</span> {quotation.projectName || "Servicios SPEK Industrial"}
              </div>
            </div>
          </div>
          <div className="text-sm text-right">
            <div className="font-bold text-lg">SPEK</div>
            <div className="text-sm">Ing. Victor Galván Santoyo</div>
            <div className="text-sm text-gray-600">Servicios y Productos Especializados Krapsol (S.P.E.K) S.A. de C.V.</div>
            <div className="text-sm text-gray-600">{companyInfo.phone}</div>
            <div className="text-sm text-gray-600">{companyInfo.email} &nbsp;&nbsp; {companyInfo.address}</div>
            <div className="mt-2 font-mono text-gray-600 text-xs">FOLIO: #{quotation.quotationNumber}</div>
          </div>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="grid grid-cols-2 gap-12 mb-10">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
            Información de Cotización
          </div>
          <div className="space-y-1">
            <div className="grid grid-cols-2">
              <span className="text-sm text-gray-500">Número</span>
              <span className="text-sm font-mono">{quotation.quotationNumber}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-gray-500">Fecha</span>
              <span className="text-sm">{formatDate(quotation.date as unknown as string)}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-gray-500">Validez</span>
              <span className="text-sm">
                {quotation.validUntil ? formatDate(quotation.validUntil as unknown as string) : "30 días"}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
            Cliente
          </div>
          <div className="text-base font-medium">{quotation.customerName}</div>
          {quotation.customerEmail && <div className="text-sm text-gray-500">{quotation.customerEmail}</div>}
          {quotation.customerPhone && <div className="text-sm text-gray-500">{quotation.customerPhone}</div>}
          {quotation.customerAddress && <div className="text-sm text-gray-500 mt-1">{quotation.customerAddress}</div>}
        </div>
      </div>
      
      {/* Items */}
      <div className="mb-10">
        <div className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">
          Detalle
        </div>
        
        <div className="border-t border-b border-gray-200 py-2 grid grid-cols-12 text-xs font-medium uppercase text-gray-500">
          <div className="col-span-6">Descripción</div>
          <div className="col-span-2 text-center">Cantidad</div>
          <div className="col-span-2 text-right">Precio</div>
          <div className="col-span-2 text-right">Total</div>
        </div>
        
        {quotation.items.map((item, index) => (
          <div key={index} className="py-4 grid grid-cols-12 border-b border-gray-100">
            <div className="col-span-6">
              {item.image ? (
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded mr-3" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {item.description && <div className="text-sm text-gray-500">{item.description}</div>}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-medium">{item.name}</div>
                  {item.description && <div className="text-sm text-gray-500">{item.description}</div>}
                </div>
              )}
            </div>
            <div className="col-span-2 text-center self-center">{item.quantity}</div>
            <div className="col-span-2 text-right self-center">{formatCurrency(Number(item.price))}</div>
            <div className="col-span-2 text-right self-center font-medium">{formatCurrency(Number(item.total))}</div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 text-sm">
            <div className="text-gray-500">Subtotal</div>
            <div>{formatCurrency(Number(quotation.subtotal))}</div>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <div className="text-gray-500">IVA ({Number(quotation.taxRate)}%)</div>
            <div>{formatCurrency(Number(quotation.taxAmount))}</div>
          </div>
          <div className="flex justify-between py-2 text-base font-medium border-t border-gray-200 mt-2 pt-2">
            <div>Total</div>
            <div>{formatCurrency(Number(quotation.total))}</div>
          </div>
        </div>
      </div>
      
      {/* Notes */}
      {quotation.notes && (
        <div className="text-sm text-gray-600 border-t border-gray-100 pt-6 mt-6">
          <div className="font-medium mb-1">Notas</div>
          <p>{quotation.notes}</p>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-12 pt-6 border-t text-xs text-gray-500 text-center">
        <div>{companyInfo.name} | {companyInfo.address}</div>
        <div className="mt-1">{companyInfo.phone} | {companyInfo.email}</div>
      </div>
    </div>
  );
}
