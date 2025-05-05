import { Router } from "express";
import { db } from "../db";
import { customers } from "@shared/schema";
import { eq } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Get all customers for the current user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userCustomers = await db.query.customers.findMany({
      where: eq(customers.userId, req.user!.id),
      orderBy: customers.name,
    });
    res.json(userCustomers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Error al obtener los clientes" });
  }
});

// Create new customer
router.post("/", authenticateToken, async (req, res) => {
  try {
    const customerData = {
      ...req.body,
      userId: req.user!.id,
    };

    const [newCustomer] = await db
      .insert(customers)
      .values(customerData)
      .returning();

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Error al crear el cliente" });
  }
});

export default router; 