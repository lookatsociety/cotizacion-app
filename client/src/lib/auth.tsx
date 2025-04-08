import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "./queryClient";

interface User {
  id: number;
  username: string;
  email?: string;
  displayName?: string;
  googleId?: string;
  photoUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  googleLogin: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user
  const { data: user, isSuccess, isError } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        
        if (res.status === 401) {
          return null;
        }
        
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        
        return res.json();
      } catch (error) {
        return null;
      }
    },
    retry: false,
  });

  useEffect(() => {
    if (isSuccess || isError) {
      setIsLoading(false);
    }
  }, [isSuccess, isError]);

  const login = async (username: string, password: string) => {
    const response = await apiRequest("POST", "/api/auth/login", {
      username,
      password,
    });

    const userData = await response.json();
    queryClient.setQueryData(["/api/auth/me"], userData);
    
    return userData;
  };

  const googleLogin = async () => {
    window.location.href = "/api/auth/google";
  };

  const logout = async () => {
    await apiRequest("POST", "/api/auth/logout", {});
    queryClient.setQueryData(["/api/auth/me"], null);
    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
  };

  const value = {
    user: user || null,
    isAuthenticated: !!user,
    isLoading,
    login,
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
