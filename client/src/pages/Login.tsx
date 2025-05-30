import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import spekLogoPath from "../assets/spek-logo.jpg";

export default function Login() {
  const { googleLogin, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await googleLogin();
    } catch (error: any) {
      setAuthError("Error al iniciar sesión. Por favor, intenta de nuevo.");
      console.error("Error de autenticación:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative bg-moving-clouds px-4 py-6 sm:px-6">
      {/* Fondo con efecto de nubes/degradado */}
      
      <Card className="w-full max-w-[90%] sm:max-w-md border-2 border-white/80 shadow-2xl bg-black relative z-10 overflow-hidden rounded-xl box-ghost-glow">
        {/* No background gradient to match with the logo's pure black */}
        
        <CardHeader className="relative z-20 space-y-2 flex flex-col items-center pt-6 sm:pt-8 pb-2">
          <div className="flex justify-center mb-4 sm:mb-6 relative">
            <img src={spekLogoPath} alt="SPEK Industrial" className="h-auto max-w-[180px] sm:max-w-[220px]" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-light tracking-wider text-white">
            COTIZACIONES
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-400">
            Sistema de gestión de cotizaciones
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-20 space-y-4 sm:space-y-6 pt-2 sm:pt-4 px-4 sm:px-6">
          {authError && (
            <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-white text-xs sm:text-sm">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <AlertDescription className="mt-1 text-xs sm:text-sm">
                {authError}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-center">
            <Button 
              className="w-full max-w-full sm:max-w-xs bg-white hover:bg-gray-100 text-black text-xs sm:text-sm rounded-md flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-xl py-2 sm:py-3" 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando...
                </span>
              ) : (
                <>
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Iniciar sesión con Google
                </>
              )}
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="relative z-20 flex justify-center pt-2 pb-6 sm:pb-8 text-[10px] sm:text-xs text-gray-500">
          © {new Date().getFullYear()} SPEK Industrial
        </CardFooter>
      </Card>
    </div>
  );
}
