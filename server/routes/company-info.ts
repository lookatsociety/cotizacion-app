import { Router } from "express";
import { db } from "../db";
import { companyInfo } from "@shared/schema";
import { eq } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Get all company info for the current user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const companies = await db.query.companyInfo.findMany({
      where: eq(companyInfo.userId, req.user!.id),
    });
    res.json(companies);
  } catch (error) {
    console.error("Error fetching company info:", error);
    res.status(500).json({ message: "Error al obtener la información" });
  }
});

// Create new company info
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address, website, representative, isDefault } = req.body;
    
    // If this is set as default, remove default from others
    if (isDefault) {
      await db
        .update(companyInfo)
        .set({ isDefault: false })
        .where(eq(companyInfo.userId, req.user!.id));
    }

    // Asegurarnos de que tenemos un userId válido
    if (!req.user?.id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const [newCompany] = await db
      .insert(companyInfo)
      .values({
        userId: req.user.id,
        name,
        email,
        phone,
        address,
        website,
        representative,
        isDefault: isDefault || false,
      })
      .returning();

    res.status(201).json(newCompany);
  } catch (error) {
    console.error("Error creating company info:", error);
    res.status(500).json({ message: "Error al crear la información" });
  }
});

// Delete company info
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await db
      .delete(companyInfo)
      .where(eq(companyInfo.id, parseInt(id)))
      .where(eq(companyInfo.userId, req.user!.id));

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting company info:", error);
    res.status(500).json({ message: "Error al eliminar la información" });
  }
});

// Update company info
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, isDefault } = req.body;

    // If this is set as default, remove default from others
    if (isDefault) {
      await db
        .update(companyInfo)
        .set({ isDefault: false })
        .where(eq(companyInfo.userId, req.user!.id));
    }

    const [updatedCompany] = await db
      .update(companyInfo)
      .set({
        name,
        email,
        phone,
        address,
        isDefault,
        updatedAt: new Date(),
      })
      .where(eq(companyInfo.id, parseInt(id)))
      .where(eq(companyInfo.userId, req.user!.id))
      .returning();

    if (!updatedCompany) {
      return res.status(404).json({ message: "Información no encontrada" });
    }

    res.json(updatedCompany);
  } catch (error) {
    console.error("Error updating company info:", error);
    res.status(500).json({ message: "Error al actualizar la información" });
  }
});

export default router; 