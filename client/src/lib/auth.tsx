import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  UserCredential
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { queryClient, apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  googleLogin: () => Promise<UserCredential | void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  googleLogin: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const googleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Esto ayuda a depurar
      console.log("Login exitoso:", result.user);
      
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido${result.user.displayName ? ', ' + result.user.displayName : ''}`,
      });
      
      return result;
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error);
      
      // Mensajes de error más específicos
      let errorMessage = "No se pudo iniciar sesión con Google";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Ventana de inicio de sesión cerrada. Intenta nuevamente.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Solicitud cancelada. Intenta nuevamente.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "La ventana emergente fue bloqueada por el navegador. Permite ventanas emergentes e intenta nuevamente.";
      }
      
      toast({
        title: "Error de inicio de sesión",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast({
        title: "Error al cerrar sesión",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    googleLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
