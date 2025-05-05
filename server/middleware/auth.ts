import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No se proporcionó token de autenticación" });
    }

    // Verificar el token de Firebase
    const decodedToken = await getAuth().verifyIdToken(token);
    
    // Buscar o crear el usuario en nuestra base de datos
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, decodedToken.uid))
      .limit(1);

    if (!user && decodedToken.email) {
      // Crear nuevo usuario si no existe
      [user] = await db
        .insert(users)
        .values({
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email.split("@")[0],
          firebaseUid: decodedToken.uid,
          username: decodedToken.email.split("@")[0],
        })
        .returning();
    }

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Agregar el usuario a la request
    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Error de autenticación:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}; 