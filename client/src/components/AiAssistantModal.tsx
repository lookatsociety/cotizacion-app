import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface AiAssistantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDescriptionGenerated: (description: string) => void;
}

export default function AiAssistantModal({
  open,
  onOpenChange,
  onDescriptionGenerated,
}: AiAssistantModalProps) {
  const [prompt, setPrompt] = useState("");
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError("");
    
    try {
      const response = await apiRequest("POST", "/api/generate-description", {
        prompt: prompt.trim(),
      });
      
      const data = await response.json();
      setGeneratedDescription(data.description);
    } catch (err) {
      console.error("Error generating description:", err);
      setError("No se pudo generar la descripción. Por favor, intente de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToQuotation = () => {
    onDescriptionGenerated(generatedDescription);
    resetModal();
  };

  const resetModal = () => {
    setPrompt("");
    setGeneratedDescription("");
    setError("");
  };

  const handleClose = () => {
    resetModal();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary-600 mr-2">
              <path d="M12 8V4H8"></path>
              <rect width="16" height="12" x="4" y="8" rx="2"></rect>
              <path d="M2 14h2"></path>
              <path d="M20 14h2"></path>
              <path d="M15 13v2"></path>
              <path d="M9 13v2"></path>
            </svg>
            Gemini AI Asistente
          </DialogTitle>
          <DialogDescription>
            Utiliza Gemini AI para generar descripciones profesionales para tus productos o servicios.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            ¿Qué deseas generar?
          </label>
          <Textarea
            rows={3}
            placeholder="Describe el producto o servicio que quieres agregar..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="form-textarea"
          />
        </div>
        
        {isGenerating ? (
          <div className="border rounded-md p-4 bg-gray-50">
            <div className="flex items-start mb-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary-600">
                  <path d="M12 8V4H8"></path>
                  <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                  <path d="M2 14h2"></path>
                  <path d="M20 14h2"></path>
                  <path d="M15 13v2"></path>
                  <path d="M9 13v2"></path>
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">Gemini AI</div>
                <div className="text-xs text-neutral-500">Generando respuesta...</div>
              </div>
            </div>
            
            <div className="pl-11 text-sm">
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : generatedDescription ? (
          <div className="border rounded-md p-4 bg-gray-50">
            <div className="flex items-start mb-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary-600">
                  <path d="M12 8V4H8"></path>
                  <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                  <path d="M2 14h2"></path>
                  <path d="M20 14h2"></path>
                  <path d="M15 13v2"></path>
                  <path d="M9 13v2"></path>
                </svg>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">Gemini AI</div>
                <div className="text-xs text-neutral-500">Respuesta generada</div>
              </div>
            </div>
            
            <div className="pl-11 text-sm">
              {generatedDescription}
            </div>
          </div>
        ) : null}
        
        {error && (
          <div className="text-sm text-red-500 mt-2">
            {error}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          
          {generatedDescription ? (
            <Button onClick={handleAddToQuotation}>
              Agregar a Cotización
            </Button>
          ) : (
            <Button 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isGenerating}
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
