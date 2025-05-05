import { pgTable, text, serial, integer, boolean, timestamp, json, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  username: text("username"),
  password: text("password"),
  name: text("name"),
  firebaseUid: text("firebase_uid").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  projectName: text("project_name"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  deliveryTerms: text("delivery_terms"),
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

export const companyInfo = pgTable("company_info", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  website: text("website"),
  representative: text("representative"),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6).optional(),
  email: z.string().email(),
  displayName: z.string().optional(),
  googleId: z.string().optional(),
  photoUrl: z.string().url().optional(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
});

export const insertQuotationSchema = z.object({
  userId: z.number(),
  customerId: z.number(),
  title: z.string(),
  status: z.enum(["draft", "sent", "accepted", "rejected"]),
  validUntil: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const insertQuotationItemSchema = z.object({
  quotationId: z.number(),
  description: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
  discount: z.number().min(0).max(100).optional(),
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
  projectName: z.string().optional().or(z.literal("")),
  companyName: z.string().min(1, "Nombre de la empresa requerido"),
  companyEmail: z.string().email("Email inválido"),
  companyPhone: z.string().min(1, "Teléfono requerido"),
  companyAddress: z.string().min(1, "Dirección requerida"),
  subtotal: z.number().min(0, "El subtotal no puede ser negativo"),
  taxRate: z.number().min(0, "La tasa de impuestos no puede ser negativa"),
  taxAmount: z.number().min(0, "El monto de impuestos no puede ser negativo"),
  total: z.number().min(0, "El total no puede ser negativo"),
  notes: z.string().optional().or(z.literal("")),
  deliveryTerms: z.string().optional().or(z.literal("")),
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

// Validation schemas
export const companyInfoSchema = z.object({
  id: z.number().optional(),
  userId: z.number().optional(),
  name: z.string().min(1, "Nombre de la empresa requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Teléfono requerido"),
  address: z.string().min(1, "Dirección requerida"),
  website: z.string().optional(),
  representative: z.string().optional(),
  isDefault: z.boolean().default(false),
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

export type CompanyInfo = z.infer<typeof companyInfoSchema>;
