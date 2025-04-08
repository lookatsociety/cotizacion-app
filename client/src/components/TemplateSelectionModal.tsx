import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { templateImages } from "@/assets/templateImages";

interface TemplateSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate: string;
  onSelect: (template: string) => void;
}

export default function TemplateSelectionModal({
  open,
  onOpenChange,
  selectedTemplate,
  onSelect,
}: TemplateSelectionModalProps) {
  const templates = [
    {
      id: "professional",
      name: "Profesional",
      description: "Diseño corporativo estándar",
      image: templateImages.professional,
    },
    {
      id: "minimalist",
      name: "Minimalista",
      description: "Diseño simple y elegante",
      image: templateImages.minimalist,
    },
    {
      id: "creative",
      name: "Creativa",
      description: "Diseño moderno y colorido",
      image: templateImages.creative,
    },
    {
      id: "corporate",
      name: "Corporativa",
      description: "Diseño formal para empresas",
      image: templateImages.corporate,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Seleccionar Plantilla</DialogTitle>
          <DialogDescription>
            Elige el diseño que mejor se adapte a tus necesidades
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {templates.map((template) => (
            <div 
              key={template.id}
              className={`border rounded-lg p-3 cursor-pointer ${
                selectedTemplate === template.id
                  ? "border-primary-300 bg-primary-50"
                  : "border-gray-200 hover:border-primary-300 hover:bg-primary-50"
              }`}
              onClick={() => onSelect(template.id)}
            >
              <div className="bg-white rounded-md overflow-hidden shadow-sm mb-3 h-48">
                <img 
                  src={template.image} 
                  alt={`Plantilla ${template.name}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-neutral-500">{template.description}</p>
                </div>
                {selectedTemplate === template.id ? (
                  <div className="flex items-center">
                    <span className="font-medium text-primary-600 mr-2">Seleccionada</span>
                    <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs text-primary-600 border-primary-300 hover:bg-primary-600 hover:text-white"
                  >
                    Seleccionar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => onOpenChange(false)}
          >
            Aplicar Selección
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
