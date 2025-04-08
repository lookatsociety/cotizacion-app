import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as z from "zod";
import { insertUserSchema, insertQuotationSchema, insertQuotationItemSchema } from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize session
const configureSession = async (app: Express) => {
  const memoryStoreModule = await import('memorystore');
  const MemoryStore = memoryStoreModule.default(session);
  
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "keyboard cat",
    })
  );
};

// Configure passport for authentication
const configurePassport = (app: Express) => {
  // Local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Google strategy if environment variables are available
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user exists
            let user = await storage.getUserByGoogleId(profile.id);
            
            if (!user) {
              // Create user if doesn't exist
              const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
              user = await storage.createUser({
                username: email || `google_${profile.id}`,
                password: '', // No password for OAuth users
                email,
                displayName: profile.displayName,
                googleId: profile.id,
                photoUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
              });
            }
            
            return done(null, user);
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Initialize passport and session
  app.use(passport.initialize());
  app.use(passport.session());
};

// Check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session and passport
  await configureSession(app);
  configurePassport(app);

  // Initialize Gemini AI if API key is available
  let genAI: any = null;
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  // Authentication routes
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(req.user);
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });

  // Customer routes
  app.get("/api/customers", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const customers = await storage.getCustomersByUserId(userId);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching customers" });
    }
  });

  app.post("/api/customers", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const customerData = { ...req.body, userId };
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      res.status(500).json({ message: "Error creating customer" });
    }
  });

  // Quotation routes
  app.get("/api/quotations", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const quotations = await storage.getQuotationsByUserId(userId);
      res.json(quotations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quotations" });
    }
  });

  app.get("/api/quotations/:id", isAuthenticated, async (req, res) => {
    try {
      const quotationId = parseInt(req.params.id);
      const quotation = await storage.getQuotation(quotationId);
      
      if (!quotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      
      // Check if quotation belongs to user
      if ((req.user as any).id !== quotation.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(quotation);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quotation" });
    }
  });

  app.post("/api/quotations", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { items, ...quotationData } = req.body;
      
      // Validate quotation data
      const validatedQuotation = insertQuotationSchema.parse({
        ...quotationData,
        userId,
      });
      
      // Validate items
      const validatedItems = items.map((item: any) => 
        insertQuotationItemSchema.parse(item)
      );
      
      const quotation = await storage.createQuotation(validatedQuotation, validatedItems);
      res.status(201).json(quotation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Error creating quotation" });
    }
  });

  app.put("/api/quotations/:id", isAuthenticated, async (req, res) => {
    try {
      const quotationId = parseInt(req.params.id);
      const existingQuotation = await storage.getQuotation(quotationId);
      
      if (!existingQuotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      
      // Check if quotation belongs to user
      if ((req.user as any).id !== existingQuotation.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const { items, ...quotationData } = req.body;
      const updatedQuotation = await storage.updateQuotation(quotationId, quotationData, items);
      res.json(updatedQuotation);
    } catch (error) {
      res.status(500).json({ message: "Error updating quotation" });
    }
  });

  app.delete("/api/quotations/:id", isAuthenticated, async (req, res) => {
    try {
      const quotationId = parseInt(req.params.id);
      const existingQuotation = await storage.getQuotation(quotationId);
      
      if (!existingQuotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      
      // Check if quotation belongs to user
      if ((req.user as any).id !== existingQuotation.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteQuotation(quotationId);
      res.json({ message: "Quotation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting quotation" });
    }
  });

  // Quotation number generation
  app.get("/api/generate-quotation-number", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const quotationNumber = await storage.generateQuotationNumber(userId);
      res.json({ quotationNumber });
    } catch (error) {
      res.status(500).json({ message: "Error generating quotation number" });
    }
  });

  // Gemini AI integration for product descriptions
  app.post("/api/generate-description", isAuthenticated, async (req, res) => {
    try {
      if (!genAI) {
        return res.status(503).json({ message: "Gemini AI service unavailable" });
      }
      
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(
        `Generate a professional product or service description for a quotation. Keep it concise (max 2-3 sentences) and focus on value proposition. Use formal business language. The product/service is: ${prompt}`
      );
      
      const response = result.response;
      const text = response.text();
      
      res.json({ description: text });
    } catch (error) {
      res.status(500).json({ message: "Error generating description with AI" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
