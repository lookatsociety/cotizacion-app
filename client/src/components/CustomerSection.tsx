import { UseFormReturn } from "react-hook-form";
import { QuotationFormData } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface CustomerSectionProps {
  form: UseFormReturn<QuotationFormData>;
}

export default function CustomerSection({ form }: CustomerSectionProps) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Información del Cliente</h2>
          <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
            <UserPlus className="mr-1.5 h-4 w-4" />
            Seleccionar Cliente
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <label className="form-label">Empresa / Cliente</label>
                <FormControl>
                  <Input 
                    placeholder="Nombre de la empresa o cliente" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <label className="form-label">Correo Electrónico</label>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="correo@ejemplo.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <label className="form-label">Teléfono</label>
                  <FormControl>
                    <Input 
                      placeholder="+52 (123) 456-7890" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="customerAddress"
            render={({ field }) => (
              <FormItem>
                <label className="form-label">Dirección</label>
                <FormControl>
                  <Textarea 
                    rows={2} 
                    placeholder="Dirección completa" 
                    {...field} 
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
