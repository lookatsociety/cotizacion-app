import { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { QuotationFormData } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Image, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AiAssistantModal from "./AiAssistantModal";
import VoiceInput from "./VoiceInput";

interface ItemsTableProps {
  form: UseFormReturn<QuotationFormData>;
  calculateTotals: () => void;
}

export default function ItemsTable({ form, calculateTotals }: ItemsTableProps) {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [targetItemIndex, setTargetItemIndex] = useState<number | null>(null);
  
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const addItem = () => {
    append({
      name: "",
      description: "",
      image: "",
      quantity: 1,
      price: 0,
      total: 0,
    });
  };

  const removeItem = (index: number) => {
    remove(index);
    calculateTotals();
  };

  const updateItemTotal = (index: number) => {
    const items = form.getValues("items");
    const item = items[index];
    const total = item.quantity * item.price;
    
    update(index, {
      ...item,
      total,
    });
    
    calculateTotals();
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64 for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const items = form.getValues("items");
      const item = items[index];
      update(index, {
        ...item,
        image: event.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    const items = form.getValues("items");
    const item = items[index];
    update(index, {
      ...item,
      image: "",
    });
  };

  const openAiModal = (index: number) => {
    setTargetItemIndex(index);
    setIsAiModalOpen(true);
  };

  const handleAiGenerated = (description: string) => {
    if (targetItemIndex === null) return;
    
    const items = form.getValues("items");
    const item = items[targetItemIndex];
    update(targetItemIndex, {
      ...item,
      description,
    });
    
    setIsAiModalOpen(false);
    setTargetItemIndex(null);
  };

  const handleVoiceInput = (text: string) => {
    // Basic parsing to extract product details from voice input
    const priceMatch = text.match(/precio (\d+)/i) || text.match(/(\d+) pesos/i);
    const quantityMatch = text.match(/cantidad (\d+)/i) || text.match(/(\d+) unidades/i);
    const nameEndIndex = text.search(/precio|cantidad|pesos|unidades/i);
    
    const name = nameEndIndex > -1 ? text.substring(0, nameEndIndex).trim() : text.trim();
    const price = priceMatch ? parseInt(priceMatch[1]) : 0;
    const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
    
    append({
      name,
      description: "",
      image: "",
      quantity,
      price,
      total: quantity * price,
    });
    
    calculateTotals();
  };

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Productos y Servicios</h2>
          
          <div className="flex items-center space-x-2">
            <VoiceInput onResult={handleVoiceInput} />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-600 hover:text-primary-700" 
              onClick={() => openAiModal(0)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1.5">
                <path d="M12 8V4H8"></path>
                <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                <path d="M2 14h2"></path>
                <path d="M20 14h2"></path>
                <path d="M15 13v2"></path>
                <path d="M9 13v2"></path>
              </svg>
              Gemini AI
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Producto</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Imagen</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Cant.</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Precio</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</th>
                <th className="px-3 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <Input
                        type="text"
                        placeholder="Nombre del producto o servicio"
                        className="w-full border-0 focus:ring-0 text-sm"
                        {...form.register(`items.${index}.name` as const)}
                        onChange={(e) => {
                          form.setValue(`items.${index}.name`, e.target.value);
                        }}
                      />
                      <Textarea
                        placeholder="Descripción (opcional)"
                        className="w-full border-0 focus:ring-0 text-xs text-neutral-500 resize-none min-h-[1.5rem]"
                        rows={1}
                        {...form.register(`items.${index}.description` as const)}
                      />
                      <div className="flex mt-1">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs text-primary-600"
                          onClick={() => openAiModal(index)}
                        >
                          Generar descripción con AI
                        </Button>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {form.getValues(`items.${index}.image`) ? (
                      <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                        <img 
                          src={form.getValues(`items.${index}.image`)} 
                          alt="Producto" 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 h-5 w-5 p-0 bg-white rounded-bl-md shadow-sm hover:bg-gray-100"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3 text-neutral-500" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center w-16 h-16 border border-dashed border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(index, e)}
                        />
                        <Image className="h-5 w-5 text-gray-400" />
                      </label>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min="1"
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                      {...form.register(`items.${index}.quantity` as const, {
                        valueAsNumber: true,
                        onChange: () => updateItemTotal(index),
                      })}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center">
                      <span className="text-sm text-neutral-500 mr-1">$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                        {...form.register(`items.${index}.price` as const, {
                          valueAsNumber: true,
                          onChange: () => updateItemTotal(index),
                        })}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-sm">
                      $
                      {form
                        .getValues(`items.${index}.total`)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-neutral-400 hover:text-red-500"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4">
          <Button
            type="button"
            variant="ghost"
            className="text-primary-600 hover:text-primary-700 font-medium"
            onClick={addItem}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Agregar Ítem
          </Button>
        </div>
      </CardContent>
      
      <AiAssistantModal
        open={isAiModalOpen}
        onOpenChange={setIsAiModalOpen}
        onDescriptionGenerated={handleAiGenerated}
      />
    </Card>
  );
}
