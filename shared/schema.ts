import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const airdrops = pgTable("airdrops", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  projectName: text("project_name").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  category: text("category").notNull(),
  estimatedValue: text("estimated_value").notNull(),
  status: text("status").notNull(), // Active, Upcoming, Ending Soon, Completed
  participants: integer("participants").default(0),
  logoUrl: text("logo_url"),
  coverImageUrl: text("cover_image_url"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  authorId: integer("author_id").references(() => users.id),
  tags: text("tags"),
  publishedAt: timestamp("published_at").defaultNow(),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  interests: text("interests"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertAirdropSchema = createInsertSchema(airdrops).omit({ id: true, createdAt: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, publishedAt: true });
export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({ id: true, createdAt: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Airdrop = typeof airdrops.$inferSelect;
export type InsertAirdrop = z.infer<typeof insertAirdropSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
