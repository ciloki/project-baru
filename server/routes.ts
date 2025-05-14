import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAirdropSchema, 
  insertBlogPostSchema, 
  insertNewsletterSubscriptionSchema, 
  insertContactMessageSchema,
  insertUserSchema
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Helper function to handle Zod validation errors
  const validateRequest = (schema: any, data: any) => {
    try {
      return { success: true, data: schema.parse(data) };
    } catch (error) {
      if (error instanceof ZodError) {
        return { 
          success: false, 
          error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        };
      }
      return { success: false, error: 'Validation error' };
    }
  };

  // API endpoint to get current logged in user
  app.get('/api/users/current', async (req: Request, res: Response) => {
    // For demo purposes, return the admin user
    const user = await storage.getUserByUsername('admin');
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    }
    return res.status(401).json({ message: 'Not authenticated' });
  });

  // User routes
  app.post('/api/users/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const user = await storage.getUserByUsername(username);
    console.log('Login attempt:', username, 'User found:', !!user);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;
    console.log('Login successful:', userWithoutPassword);
    
    res.json(userWithoutPassword);
  });
  
  app.post('/api/users/register', async (req: Request, res: Response) => {
    const validation = validateRequest(insertUserSchema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    const { username, email } = validation.data;
    
    // Check if username or email already exists
    const existingUsername = await storage.getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    const existingEmail = await storage.getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const user = await storage.createUser(validation.data);
    
    // Don't send password in response
    const { password, ...userWithoutPassword } = user;
    
    res.status(201).json(userWithoutPassword);
  });

  // Airdrop routes
  app.get('/api/airdrops', async (_req: Request, res: Response) => {
    const airdrops = await storage.getAirdrops();
    res.json(airdrops);
  });
  
  app.get('/api/airdrops/status/:status', async (req: Request, res: Response) => {
    const { status } = req.params;
    const airdrops = await storage.getAirdropsByStatus(status);
    res.json(airdrops);
  });
  
  app.get('/api/airdrops/category/:category', async (req: Request, res: Response) => {
    const { category } = req.params;
    const airdrops = await storage.getAirdropsByCategory(category);
    res.json(airdrops);
  });
  
  app.get('/api/airdrops/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const airdrop = await storage.getAirdropById(id);
    
    if (!airdrop) {
      return res.status(404).json({ message: 'Airdrop not found' });
    }
    
    res.json(airdrop);
  });
  
  app.post('/api/airdrops', async (req: Request, res: Response) => {
    const validation = validateRequest(insertAirdropSchema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    const airdrop = await storage.createAirdrop(validation.data);
    res.status(201).json(airdrop);
  });
  
  app.put('/api/airdrops/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const validation = validateRequest(insertAirdropSchema.partial(), req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    const updatedAirdrop = await storage.updateAirdrop(id, validation.data);
    
    if (!updatedAirdrop) {
      return res.status(404).json({ message: 'Airdrop not found' });
    }
    
    res.json(updatedAirdrop);
  });
  
  app.delete('/api/airdrops/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const deleted = await storage.deleteAirdrop(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Airdrop not found' });
    }
    
    res.status(204).end();
  });

  // Blog post routes
  app.get('/api/blog-posts', async (_req: Request, res: Response) => {
    const blogPosts = await storage.getBlogPosts();
    res.json(blogPosts);
  });
  
  app.get('/api/blog-posts/category/:category', async (req: Request, res: Response) => {
    const { category } = req.params;
    const blogPosts = await storage.getBlogPostsByCategory(category);
    res.json(blogPosts);
  });
  
  app.get('/api/blog-posts/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const blogPost = await storage.getBlogPostById(id);
    
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.json(blogPost);
  });
  
  app.post('/api/blog-posts', async (req: Request, res: Response) => {
    const validation = validateRequest(insertBlogPostSchema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    const blogPost = await storage.createBlogPost(validation.data);
    res.status(201).json(blogPost);
  });
  
  app.put('/api/blog-posts/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const validation = validateRequest(insertBlogPostSchema.partial(), req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    const updatedBlogPost = await storage.updateBlogPost(id, validation.data);
    
    if (!updatedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.json(updatedBlogPost);
  });
  
  app.delete('/api/blog-posts/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const deleted = await storage.deleteBlogPost(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.status(204).end();
  });

  // Newsletter subscription route
  app.post('/api/newsletter', async (req: Request, res: Response) => {
    const validation = validateRequest(insertNewsletterSubscriptionSchema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    const subscription = await storage.createNewsletterSubscription(validation.data);
    res.status(201).json(subscription);
  });

  // Contact message route
  app.post('/api/contact', async (req: Request, res: Response) => {
    const validation = validateRequest(insertContactMessageSchema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    const message = await storage.createContactMessage(validation.data);
    res.status(201).json(message);
  });

  return httpServer;
}
