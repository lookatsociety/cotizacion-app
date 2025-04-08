import { UseFormReturn } from "react-hook-form";
import { QuotationFormData } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

interface TaxAndNotesProps {
  form: UseFormReturn<QuotationFormData>;
  calculateTotals: () => void;
}

export default function TaxAndNotes({ form, calculateTotals }: TaxAndNotesProps) {
  const [hasIva, setHasIva] = useState(true);
  const [hasCustomTax, setHasCustomTax] = useState(false);
  const [customTaxName, setCustomTaxName] = useState("");
  const [customTaxRate, setCustomTaxRate] = useState(0);

  useEffect(() => {
    if (hasIva) {
      form.setValue("taxRate", 16);
    } else if (hasCustomTax) {
      form.setValue("taxRate", customTaxRate);
    } else {
      form.setValue("taxRate", 0);
    }
    calculateTotals();
  }, [hasIva, hasCustomTax, customTaxRate, form, calculateTotals]);

  const handleIvaChange = (checked: boolean) => {
    setHasIva(checked);
    if (checked) {
      setHasCustomTax(false);
    }
  };

  const handleCustomTaxChange = (checked: boolean) => {
    setHasCustomTax(checked);
    if (checked) {
      setHasIva(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-3">Impuestos</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <Checkbox 
                  id="tax_iva" 
                  checked={hasIva}
                  onCheckedChange={handleIvaChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <Label 
                  htmlFor="tax_iva" 
                  className="ml-2 text-sm text-neutral-700"
                >
                  IVA (16%)
                </Label>
              </div>
              
              <div className="flex items-center">
                <Checkbox 
                  id="tax_custom" 
                  checked={hasCustomTax}
                  onCheckedChange={handleCustomTaxChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <Label 
                  htmlFor="tax_custom" 
                  className="ml-2 text-sm text-neutral-700"
                >
                  Impuesto personalizado
                </Label>
              </div>
              
              <div className="pl-6">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Nombre"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={!hasCustomTax}
                    value={customTaxName}
                    onChange={(e) => setCustomTaxName(e.target.value)}
                  />
                  <div className="flex items-center">
                    <Input
                      type="number"
                      placeholder="%"
                      min="0"
                      max="100"
                      className="w-16 px-3 py-2 border border-gray-300 rounded-md"
                      disabled={!hasCustomTax}
                      value={customTaxRate}
                      onChange={(e) => setCustomTaxRate(Number(e.target.value))}
                    />
                    <span className="ml-1 text-sm text-neutral-500">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Resumen</h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between text-sm py-1">
                  <span>Subtotal:</span>
                  <span>
                    ${form.getValues("subtotal").toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span>
                    {hasCustomTax && customTaxName ? customTaxName : "IVA"} ({form.getValues("taxRate")}%):
                  </span>
                  <span>
                    ${form.getValues("taxAmount").toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium py-1 border-t border-gray-200 mt-1 pt-1">
                  <span>Total:</span>
                  <span>
                    ${form.getValues("total").toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-3">Notas</h2>
            <Textarea
              rows={8}
              placeholder="Ingrese cualquier nota adicional, términos o condiciones..."
              className="w-full resize-none"
              {...form.register("notes")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
