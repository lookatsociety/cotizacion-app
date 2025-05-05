import { Router } from "express";
import { db } from "../db";
import { quotations } from "@shared/schema";
import { eq } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Get all quotations for the current user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userQuotations = await db.query.quotations.findMany({
      where: eq(quotations.userId, req.user!.id),
      orderBy: quotations.date,
    });
    res.json(userQuotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({ message: "Error al obtener las cotizaciones" });
  }
});

// Create new quotation
router.post("/", authenticateToken, async (req, res) => {
  try {
    const quotationData = {
      ...req.body,
      userId: req.user!.id,
    };

    const [newQuotation] = await db
      .insert(quotations)
      .values(quotationData)
      .returning();

    res.status(201).json(newQuotation);
  } catch (error) {
    console.error("Error creating quotation:", error);
    res.status(500).json({ message: "Error al crear la cotización" });
  }
});

// Generate quotation number
router.get("/generate-quotation-number", authenticateToken, async (req, res) => {
  try {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    
    // Get count of quotations for this month
    const count = await db.query.quotations.count({
      where: eq(quotations.userId, req.user!.id),
    });
    
    const sequential = (count + 1).toString().padStart(3, "0");
    const quotationNumber = `COT-${year}${month}-${sequential}`;
    
    res.json({ quotationNumber });
  } catch (error) {
    console.error("Error generating quotation number:", error);
    res.status(500).json({ message: "Error al generar el número de cotización" });
  }
});

export default router; 