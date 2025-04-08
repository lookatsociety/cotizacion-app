import { pgTable, text, serial, integer, boolean, timestamp, json, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  displayName: text("display_name"),
  googleId: text("google_id").unique(),
  photoUrl: text("photo_url"),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
});

export const quotations = pgTable("quotations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  quotationNumber: text("quotation_number").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  validUntil: timestamp("valid_until"),
  customerId: integer("customer_id"),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  customerAddress: text("customer_address"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  template: text("template").notNull().default("professional"),
  status: text("status").notNull().default("draft"),
});

export const quotationItems = pgTable("quotation_items", {
  id: serial("id").primaryKey(),
  quotationId: integer("quotation_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
});

export const insertQuotationSchema = createInsertSchema(quotations).omit({
  id: true,
});

export const insertQuotationItemSchema = createInsertSchema(quotationItems).omit({
  id: true,
});

// Custom schemas for frontend validation
export const quotationFormSchema = z.object({
  quotationNumber: z.string().min(1, "Número de cotización requerido"),
  date: z.string().min(1, "Fecha requerida"),
  validUntil: z.string().optional(),
  customerName: z.string().min(1, "Nombre del cliente requerido"),
  customerEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  customerPhone: z.string().optional().or(z.literal("")),
  customerAddress: z.string().optional().or(z.literal("")),
  subtotal: z.number().min(0, "El subtotal no puede ser negativo"),
  taxRate: z.number().min(0, "La tasa de impuestos no puede ser negativa"),
  taxAmount: z.number().min(0, "El monto de impuestos no puede ser negativo"),
  total: z.number().min(0, "El total no puede ser negativo"),
  notes: z.string().optional().or(z.literal("")),
  template: z.string().min(1, "Plantilla requerida"),
  items: z.array(
    z.object({
      name: z.string().min(1, "Nombre del ítem requerido"),
      description: z.string().optional().or(z.literal("")),
      image: z.string().optional().or(z.literal("")),
      quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
      price: z.number().min(0, "El precio no puede ser negativo"),
      total: z.number().min(0, "El total no puede ser negativo"),
    })
  ).min(1, "Debe agregar al menos un ítem"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertQuotation = z.infer<typeof insertQuotationSchema>;
export type InsertQuotationItem = z.infer<typeof insertQuotationItemSchema>;

export type User = typeof users.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Quotation = typeof quotations.$inferSelect;
export type QuotationItem = typeof quotationItems.$inferSelect;

export type QuotationWithItems = Quotation & {
  items: QuotationItem[];
};

export type QuotationFormData = z.infer<typeof quotationFormSchema>;
