import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyInfo, companyInfoSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Building2, Plus, Save, Trash } from "lucide-react";
import { auth } from "@/lib/firebase";

interface CompanyInfoManagerProps {
  onSelect: (info: CompanyInfo) => void;
}

export default function CompanyInfoManager({ onSelect }: CompanyInfoManagerProps) {
  const [savedCompanies, setSavedCompanies] = useState<CompanyInfo[]>([]);
  const { toast } = useToast();
  
  const loadCompanies = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/company-info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al cargar la información");
      const data = await response.json();
      setSavedCompanies(data);
    } catch (error) {
      console.error("Error loading companies:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información de las empresas",
        variant: "destructive",
      });
    }
  };

  // Cargar empresas al inicio
  useEffect(() => {
    loadCompanies();
  }, []);

  const form = useForm({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      representative: "",
      isDefault: false,
    },
  });

  const onSubmit = async (data: CompanyInfo) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/company-info", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          isDefault: data.isDefault || false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar");
      }

      const savedInfo = await response.json();
      
      // Actualizar la lista de empresas
      setSavedCompanies(prev => [...prev, savedInfo]);
      
      // Llamar a onSelect con la información completa
      onSelect({
        id: savedInfo.id,
        name: savedInfo.name,
        email: savedInfo.email,
        phone: savedInfo.phone,
        address: savedInfo.address,
        website: savedInfo.website || "",
        representative: savedInfo.representative || "",
        isDefault: savedInfo.isDefault,
      });
      
      toast({
        title: "Éxito",
        description: "Información de la empresa guardada correctamente",
      });

      form.reset();
    } catch (error) {
      console.error("Error saving company:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la información",
        variant: "destructive",
      });
    }
  };

  const deleteCompany = async (id: number) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`/api/company-info/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar");

      setSavedCompanies(savedCompanies.filter(company => company.id !== id));
      
      toast({
        title: "Éxito",
        description: "Información de la empresa eliminada correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la información",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información de la Empresa
            </h2>
            <Button variant="outline" size="sm" onClick={() => form.reset()}>
              <Plus className="h-4 w-4 mr-1" />
              Nueva
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Nombre de la empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="representative"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Representante" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Dirección" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Sitio web" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-1" />
                Guardar Información
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {savedCompanies.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-neutral-500 mb-4">Empresas Guardadas</h3>
            <div className="space-y-3">
              {savedCompanies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{company.name}</div>
                    <div className="text-sm text-neutral-500">{company.representative}</div>
                    <div className="text-sm text-neutral-500">{company.email} • {company.phone}</div>
                    <div className="text-sm text-neutral-500">{company.address}</div>
                    {company.website && <div className="text-sm text-neutral-500">{company.website}</div>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelect(company)}
                    >
                      Usar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => company.id && deleteCompany(company.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 