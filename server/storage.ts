import {
  type User,
  type InsertUser,
  type Customer,
  type InsertCustomer,
  type Quotation,
  type InsertQuotation,
  type QuotationItem,
  type InsertQuotationItem,
  type QuotationWithItems,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Customer methods
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomersByUserId(userId: number): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  
  // Quotation methods
  getQuotation(id: number): Promise<QuotationWithItems | undefined>;
  getQuotationsByUserId(userId: number): Promise<Quotation[]>;
  createQuotation(quotation: InsertQuotation, items: InsertQuotationItem[]): Promise<QuotationWithItems>;
  updateQuotation(id: number, quotation: Partial<Quotation>, items?: InsertQuotationItem[]): Promise<QuotationWithItems | undefined>;
  deleteQuotation(id: number): Promise<boolean>;
  
  // Quotation Item methods
  getQuotationItems(quotationId: number): Promise<QuotationItem[]>;
  createQuotationItem(item: InsertQuotationItem): Promise<QuotationItem>;
  updateQuotationItem(id: number, item: Partial<QuotationItem>): Promise<QuotationItem | undefined>;
  deleteQuotationItem(id: number): Promise<boolean>;
  deleteQuotationItems(quotationId: number): Promise<boolean>;
  
  // Utility methods
  generateQuotationNumber(userId: number): Promise<string>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private customers: Map<number, Customer>;
  private quotations: Map<number, Quotation>;
  private quotationItems: Map<number, QuotationItem>;
  private userIdCounter: number;
  private customerIdCounter: number;
  private quotationIdCounter: number;
  private quotationItemIdCounter: number;

  constructor() {
    this.users = new Map();
    this.customers = new Map();
    this.quotations = new Map();
    this.quotationItems = new Map();
    this.userIdCounter = 1;
    this.customerIdCounter = 1;
    this.quotationIdCounter = 1;
    this.quotationItemIdCounter = 1;
    
    // Create default user
    this.createUser({
      username: "demo",
      password: "password",
      email: "demo@example.com",
      displayName: "Demo User",
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.googleId === googleId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Customer methods
  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }
  
  async getCustomersByUserId(userId: number): Promise<Customer[]> {
    return Array.from(this.customers.values()).filter(
      (customer) => customer.userId === userId,
    );
  }
  
  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.customerIdCounter++;
    const customer: Customer = { ...insertCustomer, id };
    this.customers.set(id, customer);
    return customer;
  }
  
  async updateCustomer(id: number, customerData: Partial<Customer>): Promise<Customer | undefined> {
    const existingCustomer = this.customers.get(id);
    if (!existingCustomer) return undefined;
    
    const updatedCustomer = { ...existingCustomer, ...customerData };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }
  
  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }

  // Quotation methods
  async getQuotation(id: number): Promise<QuotationWithItems | undefined> {
    const quotation = this.quotations.get(id);
    if (!quotation) return undefined;
    
    const items = await this.getQuotationItems(id);
    return { ...quotation, items };
  }
  
  async getQuotationsByUserId(userId: number): Promise<Quotation[]> {
    return Array.from(this.quotations.values()).filter(
      (quotation) => quotation.userId === userId,
    );
  }
  
  async createQuotation(insertQuotation: InsertQuotation, items: InsertQuotationItem[]): Promise<QuotationWithItems> {
    const id = this.quotationIdCounter++;
    const quotation: Quotation = { ...insertQuotation, id };
    this.quotations.set(id, quotation);
    
    const quotationItems: QuotationItem[] = [];
    for (const item of items) {
      const quotationItem = await this.createQuotationItem({
        ...item,
        quotationId: id,
      });
      quotationItems.push(quotationItem);
    }
    
    return { ...quotation, items: quotationItems };
  }
  
  async updateQuotation(id: number, quotationData: Partial<Quotation>, items?: InsertQuotationItem[]): Promise<QuotationWithItems | undefined> {
    const existingQuotation = this.quotations.get(id);
    if (!existingQuotation) return undefined;
    
    const updatedQuotation = { ...existingQuotation, ...quotationData };
    this.quotations.set(id, updatedQuotation);
    
    if (items) {
      await this.deleteQuotationItems(id);
      const quotationItems: QuotationItem[] = [];
      for (const item of items) {
        const quotationItem = await this.createQuotationItem({
          ...item,
          quotationId: id,
        });
        quotationItems.push(quotationItem);
      }
      return { ...updatedQuotation, items: quotationItems };
    }
    
    const existingItems = await this.getQuotationItems(id);
    return { ...updatedQuotation, items: existingItems };
  }
  
  async deleteQuotation(id: number): Promise<boolean> {
    await this.deleteQuotationItems(id);
    return this.quotations.delete(id);
  }

  // Quotation Item methods
  async getQuotationItems(quotationId: number): Promise<QuotationItem[]> {
    return Array.from(this.quotationItems.values()).filter(
      (item) => item.quotationId === quotationId,
    );
  }
  
  async createQuotationItem(insertItem: InsertQuotationItem): Promise<QuotationItem> {
    const id = this.quotationItemIdCounter++;
    const item: QuotationItem = { ...insertItem, id };
    this.quotationItems.set(id, item);
    return item;
  }
  
  async updateQuotationItem(id: number, itemData: Partial<QuotationItem>): Promise<QuotationItem | undefined> {
    const existingItem = this.quotationItems.get(id);
    if (!existingItem) return undefined;
    
    const updatedItem = { ...existingItem, ...itemData };
    this.quotationItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async deleteQuotationItem(id: number): Promise<boolean> {
    return this.quotationItems.delete(id);
  }
  
  async deleteQuotationItems(quotationId: number): Promise<boolean> {
    const itemsToDelete = Array.from(this.quotationItems.values())
      .filter((item) => item.quotationId === quotationId);
    
    for (const item of itemsToDelete) {
      this.quotationItems.delete(item.id);
    }
    
    return true;
  }
  
  // Utility methods
  async generateQuotationNumber(userId: number): Promise<string> {
    const userQuotations = await this.getQuotationsByUserId(userId);
    const currentYear = new Date().getFullYear();
    const count = userQuotations.length + 1;
    return `COT-${currentYear}-${count.toString().padStart(4, '0')}`;
  }
}

export const storage = new MemStorage();
