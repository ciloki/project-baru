import { 
  users, User, InsertUser, 
  airdrops, Airdrop, InsertAirdrop,
  blogPosts, BlogPost, InsertBlogPost,
  newsletterSubscriptions, NewsletterSubscription, InsertNewsletterSubscription,
  contactMessages, ContactMessage, InsertContactMessage
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Airdrop methods
  getAirdrops(): Promise<Airdrop[]>;
  getAirdropsByStatus(status: string): Promise<Airdrop[]>;
  getAirdropsByCategory(category: string): Promise<Airdrop[]>;
  getAirdropById(id: number): Promise<Airdrop | undefined>;
  createAirdrop(airdrop: InsertAirdrop): Promise<Airdrop>;
  updateAirdrop(id: number, airdrop: Partial<InsertAirdrop>): Promise<Airdrop | undefined>;
  deleteAirdrop(id: number): Promise<boolean>;
  
  // Blog post methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Newsletter subscription methods
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  
  // Contact message methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private airdrops: Map<number, Airdrop>;
  private blogPosts: Map<number, BlogPost>;
  private newsletterSubscriptions: Map<number, NewsletterSubscription>;
  private contactMessages: Map<number, ContactMessage>;
  
  private userId: number;
  private airdropId: number;
  private blogPostId: number;
  private subscriptionId: number;
  private messageId: number;

  constructor() {
    this.users = new Map();
    this.airdrops = new Map();
    this.blogPosts = new Map();
    this.newsletterSubscriptions = new Map();
    this.contactMessages = new Map();
    
    this.userId = 1;
    this.airdropId = 1;
    this.blogPostId = 1;
    this.subscriptionId = 1;
    this.messageId = 1;
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@airdrops-hunter.com",
      isAdmin: true
    });
    
    // Create sample airdrops
    const demoAirdrops = [
      {
        title: "MoonToken Airdrop",
        projectName: "MoonToken",
        description: "Participate in MoonToken's community airdrop and earn up to 500 MOON tokens.",
        requirements: "Complete social media tasks and join Telegram group.",
        category: "DeFi",
        estimatedValue: "$50-$200",
        status: "Ending Soon",
        participants: 10543,
        logoUrl: "https://pixabay.com/get/gd5f7ee8c780f6ba5a493a3da8d798bd002b1a1a12b32ed737e536e35228b3073c8598b30950c3f234ddb7abe0afb02536c8e1d97de891490a8252edfc99dea54_1280.jpg",
        coverImageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        startDate: new Date("2023-06-01"),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        createdAt: new Date()
      },
      {
        title: "NexusChain Airdrop",
        projectName: "NexusChain",
        description: "Complete simple tasks to qualify for the NexusChain governance token distribution.",
        requirements: "Trade on the platform, refer friends, and hold NXS tokens.",
        category: "Layer 2",
        estimatedValue: "$100-$500",
        status: "Active",
        participants: 25129,
        logoUrl: "https://pixabay.com/get/gb905f4b1c715da45adec4d65a6aaf873bb239df4a7f408ba9ff0f6afb34879f20526bb1d0076738ce86010a6b03c56bd28c9c3bda77e0b064727b212886e5545_1280.jpg",
        coverImageUrl: "https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        startDate: new Date("2023-06-10"),
        endDate: new Date("2023-07-10"),
        createdAt: new Date()
      },
      {
        title: "CryptoSwap Airdrop",
        projectName: "CryptoSwap",
        description: "Early users of CryptoSwap DEX will receive SWAP tokens based on trading volume.",
        requirements: "Create an account, complete KYC, and perform at least 3 trades.",
        category: "Exchange",
        estimatedValue: "$75-$300",
        status: "Upcoming",
        participants: 8742,
        logoUrl: "https://pixabay.com/get/g085c385914709533f6ed0b39504b96fa8d18c242f5587601c5b27044a42ed07ff20f3a18261c215b87099efc8bf93ee19d12927cf04f2e36acfc254f8fcda7eb_1280.jpg",
        coverImageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        createdAt: new Date()
      },
      {
        title: "MetaWorld Airdrop",
        projectName: "MetaWorld",
        description: "Join the MetaWorld virtual reality platform and claim your META governance tokens.",
        requirements: "Create a MetaWorld account, visit 3 virtual locations, and invite 2 friends.",
        category: "Metaverse",
        estimatedValue: "$150-$400",
        status: "Ending Soon",
        participants: 15321,
        logoUrl: "https://pixabay.com/get/gb147de8a9712e7a7cfac336003e0d2249f3e71f6035afce17c66c29c82ab4207ab5b2ccdf19e6d98f57e69b3e999c900d191277b1e02e26244e68999b3b07ab2_1280.jpg",
        coverImageUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        startDate: new Date("2023-06-05"),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        createdAt: new Date()
      },
      {
        title: "DeFiChain Airdrop",
        projectName: "DeFiChain",
        description: "Stake your assets on DeFiChain to qualify for their upcoming governance token airdrop.",
        requirements: "Stake at least $100 worth of assets for 30 days, and participate in governance voting.",
        category: "DeFi",
        estimatedValue: "$200-$600",
        status: "Active",
        participants: 32874,
        logoUrl: "https://pixabay.com/get/gd6e5e99d434d4fe2d289d604b84ac139790819248dc9b06c8bb787e3bb892b3a92a8c1a4d13c4c9e2d9cde7aa41ef9776e3eada8ae97d63ee4d7522dbf9164cc_1280.jpg",
        coverImageUrl: "https://pixabay.com/get/g753de007736eec7c90ddb3b2b9c5a44705d796d76bb5a61842461afcfa1f2e185e1cc0c826e44af4f237e4a345909c5c94166cb68e54072b77f2eaccf04efafc_1280.jpg",
        startDate: new Date("2023-06-15"),
        endDate: new Date("2023-07-15"),
        createdAt: new Date()
      },
      {
        title: "GameFi Airdrop",
        projectName: "GameFi",
        description: "Try GameFi's play-to-earn platform and receive GAME tokens based on gameplay.",
        requirements: "Create a GameFi account, complete the tutorial, and play at least 5 games.",
        category: "Gaming",
        estimatedValue: "$50-$250",
        status: "Upcoming",
        participants: 12638,
        logoUrl: "https://pixabay.com/get/gc305c6a9335a1cddd4d9f9dd9c15c3af1e99d64016273d87a227c491058ccbf3c1910cfc84b7c57a8676205b5a4df06f984ebc14d2ea16bf8a63e3b6c3f11d29_1280.jpg",
        coverImageUrl: "https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // 40 days from now
        createdAt: new Date()
      }
    ];
    
    demoAirdrops.forEach(airdrop => {
      this.createAirdrop(airdrop as InsertAirdrop);
    });
    
    // Create sample blog posts
    const demoBlogPosts = [
      {
        title: "Top 5 Airdrops Coming in 2023",
        content: "Explore the most anticipated crypto airdrops of 2023 and how to prepare for them.",
        category: "Guide",
        imageUrl: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        authorId: 1,
        tags: "airdrops,guide,2023,crypto",
        publishedAt: new Date("2023-06-15")
      },
      {
        title: "How to Maximize Your Airdrop Rewards",
        content: "Learn proven strategies to increase your chances of qualifying for high-value airdrops.",
        category: "Strategy",
        imageUrl: "https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        authorId: 1,
        tags: "strategy,rewards,maximize,tips",
        publishedAt: new Date("2023-06-10")
      },
      {
        title: "Security Tips for Airdrop Participants",
        content: "Protect yourself from scams and stay safe while hunting for legitimate crypto airdrops.",
        category: "Security",
        imageUrl: "https://pixabay.com/get/gbf1dfb16f7a38e0221b6b847bbf43035912d14da0679b90b8d5c1b557aac963bf63e6dc14872862b649772d95ef8f80dcccc539d6c11ac29076ac3ad9f3d7229_1280.jpg",
        authorId: 1,
        tags: "security,scams,protection,safety",
        publishedAt: new Date("2023-06-05")
      }
    ];
    
    demoBlogPosts.forEach(blogPost => {
      this.createBlogPost(blogPost as InsertBlogPost);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { 
      ...user, 
      id,
      isAdmin: user.isAdmin ?? false 
    };
    this.users.set(id, newUser);
    return newUser;
  }

  // Airdrop methods
  async getAirdrops(): Promise<Airdrop[]> {
    return Array.from(this.airdrops.values());
  }

  async getAirdropsByStatus(status: string): Promise<Airdrop[]> {
    return Array.from(this.airdrops.values()).filter(
      (airdrop) => airdrop.status === status
    );
  }

  async getAirdropsByCategory(category: string): Promise<Airdrop[]> {
    return Array.from(this.airdrops.values()).filter(
      (airdrop) => airdrop.category === category
    );
  }

  async getAirdropById(id: number): Promise<Airdrop | undefined> {
    return this.airdrops.get(id);
  }

  async createAirdrop(airdrop: InsertAirdrop): Promise<Airdrop> {
    const id = this.airdropId++;
    const newAirdrop: Airdrop = { 
      ...airdrop, 
      id,
      requirements: airdrop.requirements ?? null,
      participants: airdrop.participants ?? null,
      logoUrl: airdrop.logoUrl ?? null,
      coverImageUrl: airdrop.coverImageUrl ?? null,
      startDate: airdrop.startDate ?? null,
      endDate: airdrop.endDate ?? null,
      createdAt: new Date()
    };
    this.airdrops.set(id, newAirdrop);
    return newAirdrop;
  }

  async updateAirdrop(id: number, airdrop: Partial<InsertAirdrop>): Promise<Airdrop | undefined> {
    const existingAirdrop = this.airdrops.get(id);
    if (!existingAirdrop) {
      return undefined;
    }
    
    const updatedAirdrop = { ...existingAirdrop, ...airdrop };
    this.airdrops.set(id, updatedAirdrop);
    return updatedAirdrop;
  }

  async deleteAirdrop(id: number): Promise<boolean> {
    return this.airdrops.delete(id);
  }

  // Blog post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(
      (post) => post.category === category
    );
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostId++;
    const newBlogPost: BlogPost = { 
      ...blogPost, 
      id,
      publishedAt: blogPost.publishedAt || new Date()
    };
    this.blogPosts.set(id, newBlogPost);
    return newBlogPost;
  }

  async updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingBlogPost = this.blogPosts.get(id);
    if (!existingBlogPost) {
      return undefined;
    }
    
    const updatedBlogPost = { ...existingBlogPost, ...blogPost };
    this.blogPosts.set(id, updatedBlogPost);
    return updatedBlogPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Newsletter subscription methods
  async createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const id = this.subscriptionId++;
    const newSubscription: NewsletterSubscription = { 
      ...subscription, 
      id,
      createdAt: new Date()
    };
    this.newsletterSubscriptions.set(id, newSubscription);
    return newSubscription;
  }

  // Contact message methods
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.messageId++;
    const newMessage: ContactMessage = { 
      ...message, 
      id,
      createdAt: new Date()
    };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }
}

// Import database client
import { db } from "./db";

// Use DatabaseStorage instead of MemStorage for persistence
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getAirdrops(): Promise<Airdrop[]> {
    return await db.select().from(airdrops);
  }

  async getAirdropsByStatus(status: string): Promise<Airdrop[]> {
    return await db.select().from(airdrops).where(eq(airdrops.status, status));
  }

  async getAirdropsByCategory(category: string): Promise<Airdrop[]> {
    return await db.select().from(airdrops).where(eq(airdrops.category, category));
  }

  async getAirdropById(id: number): Promise<Airdrop | undefined> {
    const [airdrop] = await db.select().from(airdrops).where(eq(airdrops.id, id));
    return airdrop || undefined;
  }

  async createAirdrop(airdrop: InsertAirdrop): Promise<Airdrop> {
    const [newAirdrop] = await db.insert(airdrops).values(airdrop).returning();
    return newAirdrop;
  }

  async updateAirdrop(id: number, airdropData: Partial<InsertAirdrop>): Promise<Airdrop | undefined> {
    const [updatedAirdrop] = await db.update(airdrops)
      .set(airdropData)
      .where(eq(airdrops.id, id))
      .returning();
    return updatedAirdrop || undefined;
  }

  async deleteAirdrop(id: number): Promise<boolean> {
    const result = await db.delete(airdrops).where(eq(airdrops.id, id));
    return !!result;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.category, category));
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(blogPost).returning();
    return newPost;
  }

  async updateBlogPost(id: number, blogPostData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db.update(blogPosts)
      .set(blogPostData)
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost || undefined;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return !!result;
  }

  async createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const [newSubscription] = await db.insert(newsletterSubscriptions).values(subscription).returning();
    return newSubscription;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  // To handle session storage with connect-pg-simple
  sessionStore = new PostgresSessionStore({
    conObject: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    createTableIfMissing: true
  });

  constructor() {
    // Initialize admin user if it doesn't exist yet
    this.initializeAdminUser();
  }

  private async initializeAdminUser() {
    const adminExists = await this.getUserByUsername("admin");
    if (!adminExists) {
      await this.createUser({
        username: "admin",
        password: "admin123",
        email: "admin@airdrops-hunter.com",
        isAdmin: true
      });
      console.log("Admin user created successfully");
    }
  }
}

// Import needed tools
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";

// Create PostgreSQL session store
const PostgresSessionStore = connectPg(session);

export const storage = new DatabaseStorage();
