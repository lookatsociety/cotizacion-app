import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceInputProps {
  onResult: (text: string) => void;
}

export default function VoiceInput({ onResult }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [open, setOpen] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  // Initialize speech recognition on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "es-ES";

        recognitionInstance.onstart = () => {
          setIsListening(true);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error", event);
          setIsListening(false);
          toast({
            title: "Error",
            description: "No se pudo iniciar el reconocimiento de voz.",
            variant: "destructive",
          });
        };

        recognitionInstance.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(finalTranscript || interimTranscript);
        };

        setRecognition(recognitionInstance);
      }
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [toast]);

  const startListening = () => {
    setTranscript("");
    if (recognition) {
      try {
        recognition.start();
        setOpen(true);
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    } else {
      toast({
        title: "No disponible",
        description: "El reconocimiento de voz no está disponible en este navegador.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const handleAddToQuotation = () => {
    if (transcript) {
      onResult(transcript);
      toast({
        title: "Texto convertido",
        description: "El texto ha sido agregado a la cotización.",
      });
    }
    setOpen(false);
    stopListening();
    setTranscript("");
  };

  const handleClose = () => {
    stopListening();
    setOpen(false);
    setTranscript("");
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-primary-600 hover:text-primary-700" 
        onClick={startListening}
      >
        <Mic className="h-4 w-4 mr-1.5" />
        Voz
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Entrada por Voz</DialogTitle>
            <DialogDescription>
              Habla para agregar un producto o servicio a la cotización
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex justify-center mb-4">
              <Button
                variant={isListening ? "destructive" : "default"}
                size="lg"
                className="rounded-full w-16 h-16 flex items-center justify-center"
                onClick={isListening ? stopListening : startListening}
              >
                {isListening ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground mb-4">
              {isListening ? "Escuchando..." : "Haz clic en el micrófono para comenzar"}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg min-h-[100px] border">
              {transcript ? (
                <p className="text-sm">{transcript}</p>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  {isListening 
                    ? "Di el nombre del producto, precio y cantidad..." 
                    : "Aquí aparecerá el texto detectado"
                  }
                </p>
              )}
            </div>

            <div className="text-xs text-gray-500 mt-2">
              Sugerencia: Di algo como "Servicio de diseño web, precio 1500, cantidad 1"
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddToQuotation}
              disabled={!transcript}
            >
              Agregar a Cotización
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
