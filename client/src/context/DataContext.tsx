import React, { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Airdrop, BlogPost, NewsletterSubscription, ContactMessage, User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface DataContextProps {
  // Auth
  user: User | null;
  isLoadingUser: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  
  // Airdrops
  airdrops: Airdrop[];
  isLoadingAirdrops: boolean;
  createAirdrop: (airdrop: Omit<Airdrop, "id" | "createdAt">) => Promise<void>;
  updateAirdrop: (id: number, airdrop: Partial<Airdrop>) => Promise<void>;
  deleteAirdrop: (id: number) => Promise<void>;
  
  // Blog posts
  blogPosts: BlogPost[];
  isLoadingBlogPosts: boolean;
  createBlogPost: (blogPost: Omit<BlogPost, "id" | "publishedAt">) => Promise<void>;
  updateBlogPost: (id: number, blogPost: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: number) => Promise<void>;
  
  // Newsletter
  subscribeToNewsletter: (email: string, interests: string) => Promise<void>;
  
  // Contact
  sendContactMessage: (name: string, email: string, subject: string, message: string) => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  // Auth queries
  const { data: user, isLoading: isLoadingUser } = useQuery<User | null>({
    queryKey: ['/api/users/current'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/users/current', { credentials: 'include' });
        if (res.status === 401) return null;
        await throwIfResNotOk(res);
        const userData = await res.json();
        console.log('User data from API:', userData);
        return userData;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    }
  });

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await apiRequest('POST', '/api/users/login', { username, password });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/users/current'], data);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async ({ username, email, password }: { username: string; email: string; password: string }) => {
      const res = await apiRequest('POST', '/api/users/register', { username, email, password, isAdmin: false });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Airdrop queries
  const { data: airdrops = [], isLoading: isLoadingAirdrops } = useQuery<Airdrop[]>({
    queryKey: ['/api/airdrops'],
    queryFn: async () => {
      const res = await fetch('/api/airdrops');
      await throwIfResNotOk(res);
      return res.json();
    }
  });

  const createAirdropMutation = useMutation({
    mutationFn: async (airdrop: Omit<Airdrop, "id" | "createdAt">) => {
      const res = await apiRequest('POST', '/api/airdrops', airdrop);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/airdrops'] });
      toast({
        title: "Airdrop created",
        description: "Your airdrop has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create airdrop",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateAirdropMutation = useMutation({
    mutationFn: async ({ id, airdrop }: { id: number; airdrop: Partial<Airdrop> }) => {
      const res = await apiRequest('PUT', `/api/airdrops/${id}`, airdrop);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/airdrops'] });
      toast({
        title: "Airdrop updated",
        description: "Your airdrop has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update airdrop",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteAirdropMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/airdrops/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/airdrops'] });
      toast({
        title: "Airdrop deleted",
        description: "Your airdrop has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete airdrop",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Blog post queries
  const { data: blogPosts = [], isLoading: isLoadingBlogPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
    queryFn: async () => {
      const res = await fetch('/api/blog-posts');
      await throwIfResNotOk(res);
      return res.json();
    }
  });

  const createBlogPostMutation = useMutation({
    mutationFn: async (blogPost: Omit<BlogPost, "id" | "publishedAt">) => {
      const res = await apiRequest('POST', '/api/blog-posts', blogPost);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      toast({
        title: "Blog post created",
        description: "Your blog post has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create blog post",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateBlogPostMutation = useMutation({
    mutationFn: async ({ id, blogPost }: { id: number; blogPost: Partial<BlogPost> }) => {
      const res = await apiRequest('PUT', `/api/blog-posts/${id}`, blogPost);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      toast({
        title: "Blog post updated",
        description: "Your blog post has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update blog post",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteBlogPostMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/blog-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      toast({
        title: "Blog post deleted",
        description: "Your blog post has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete blog post",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Newsletter subscription
  const newsletterSubscriptionMutation = useMutation({
    mutationFn: async ({ email, interests }: { email: string; interests: string }) => {
      const res = await apiRequest('POST', '/api/newsletter', { email, interests });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription successful",
        description: "Thank you for subscribing to our newsletter!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Contact message
  const contactMessageMutation = useMutation({
    mutationFn: async ({ name, email, subject, message }: { name: string; email: string; subject: string; message: string }) => {
      const res = await apiRequest('POST', '/api/contact', { name, email, subject, message });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully. We'll get back to you soon!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  async function throwIfResNotOk(res: Response) {
    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }
  }

  return (
    <DataContext.Provider
      value={{
        // Auth
        user: user || null,
        isLoadingUser,
        login: async (username, password) => {
          await loginMutation.mutateAsync({ username, password });
        },
        register: async (username, email, password) => {
          await registerMutation.mutateAsync({ username, email, password });
        },
        
        // Airdrops
        airdrops,
        isLoadingAirdrops,
        createAirdrop: async (airdrop) => {
          await createAirdropMutation.mutateAsync(airdrop);
        },
        updateAirdrop: async (id, airdrop) => {
          await updateAirdropMutation.mutateAsync({ id, airdrop });
        },
        deleteAirdrop: async (id) => {
          await deleteAirdropMutation.mutateAsync(id);
        },
        
        // Blog posts
        blogPosts,
        isLoadingBlogPosts,
        createBlogPost: async (blogPost) => {
          await createBlogPostMutation.mutateAsync(blogPost);
        },
        updateBlogPost: async (id, blogPost) => {
          await updateBlogPostMutation.mutateAsync({ id, blogPost });
        },
        deleteBlogPost: async (id) => {
          await deleteBlogPostMutation.mutateAsync(id);
        },
        
        // Newsletter
        subscribeToNewsletter: async (email, interests) => {
          await newsletterSubscriptionMutation.mutateAsync({ email, interests });
        },
        
        // Contact
        sendContactMessage: async (name, email, subject, message) => {
          await contactMessageMutation.mutateAsync({ name, email, subject, message });
        }
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  
  return context;
}
