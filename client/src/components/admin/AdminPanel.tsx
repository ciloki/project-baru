import { useState, useEffect } from "react";
import { X, Upload, Bold, Italic, Underline, Link2, Image, ListOrdered, List, Quote, Code } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useUI } from "@/context/UIContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { motion } from "framer-motion";

// Airdrop form schema
const airdropFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  projectName: z.string().min(2, { message: "Project name must be at least 2 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  estimatedValue: z.string().min(1, { message: "Please enter an estimated value." }),
  status: z.string().min(1, { message: "Please select a status." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  requirements: z.string().nullable().optional(),
  logoUrl: z.string().url({ message: "Please enter a valid URL for the logo." }),
  coverImageUrl: z.string().url({ message: "Please enter a valid URL for the cover image." }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  participants: z.coerce.number().nonnegative({ message: "Participants must be a positive number." }).optional(),
});

// Blog form schema
const blogFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }),
  tags: z.string().nullable().optional(),
});

export default function AdminPanel() {
  const { closeAdminPanel } = useUI();
  const { createAirdrop, createBlogPost, user } = useData();
  const [activeTab, setActiveTab] = useState("airdrops");
  const [isSubmittingAirdrop, setIsSubmittingAirdrop] = useState(false);
  const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);
  
  // Redirect non-admin users
  useEffect(() => {
    if (user && !user.isAdmin) {
      closeAdminPanel();
    }
  }, [user, closeAdminPanel]);
  
  // If user is not logged in or not an admin, don't render the panel
  if (!user || !user.isAdmin) {
    return null;
  }

  // Airdrop form
  const airdropForm = useForm<z.infer<typeof airdropFormSchema>>({
    resolver: zodResolver(airdropFormSchema),
    defaultValues: {
      title: "",
      projectName: "",
      category: "DeFi",
      estimatedValue: "$50-$200",
      status: "Active",
      description: "",
      requirements: "",
      logoUrl: "https://pixabay.com/get/gd5f7ee8c780f6ba5a493a3da8d798bd002b1a1a12b32ed737e536e35228b3073c8598b30950c3f234ddb7abe0afb02536c8e1d97de891490a8252edfc99dea54_1280.jpg",
      coverImageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      participants: 0,
    },
  });

  // Blog form
  const blogForm = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      category: "Guide",
      content: "",
      imageUrl: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      tags: "",
    },
  });

  // Handle airdrop form submission
  async function onSubmitAirdrop(values: z.infer<typeof airdropFormSchema>) {
    setIsSubmittingAirdrop(true);
    try {
      await createAirdrop({
        ...values,
        startDate: values.startDate ? new Date(values.startDate) : null,
        endDate: values.endDate ? new Date(values.endDate) : null,
        participants: values.participants || 0,
        requirements: values.requirements || null,
        logoUrl: values.logoUrl || null,
        coverImageUrl: values.coverImageUrl || null,
      });
      airdropForm.reset();
      closeAdminPanel();
    } catch (error) {
      console.error("Error creating airdrop:", error);
    } finally {
      setIsSubmittingAirdrop(false);
    }
  }

  // Handle blog form submission
  async function onSubmitBlog(values: z.infer<typeof blogFormSchema>) {
    setIsSubmittingBlog(true);
    try {
      await createBlogPost({
        ...values,
        authorId: user?.id || 1,
        tags: values.tags || null,
      });
      blogForm.reset();
      closeAdminPanel();
    } catch (error) {
      console.error("Error creating blog post:", error);
    } finally {
      setIsSubmittingBlog(false);
    }
  }

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeAdminPanel();
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
    >
      <motion.div 
        className="bg-dark-lighter rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-dark-lighter border-b border-gray-700 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <button onClick={closeAdminPanel} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="airdrops">Create Airdrop</TabsTrigger>
              <TabsTrigger value="blog">Create Blog Post</TabsTrigger>
            </TabsList>
            
            <TabsContent value="airdrops">
              <h3 className="text-xl font-semibold text-white mb-4">Create New Airdrop</h3>
              <Form {...airdropForm}>
                <form onSubmit={airdropForm.handleSubmit(onSubmitAirdrop)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={airdropForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-300">Airdrop Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter airdrop title" 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={airdropForm.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Project Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter project name" 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={airdropForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-dark-light border-gray-700 text-white">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-dark-light border-gray-700 text-white">
                            <SelectItem value="DeFi">DeFi</SelectItem>
                            <SelectItem value="NFT">NFT</SelectItem>
                            <SelectItem value="GameFi">GameFi</SelectItem>
                            <SelectItem value="Layer 2">Layer 2</SelectItem>
                            <SelectItem value="Metaverse">Metaverse</SelectItem>
                            <SelectItem value="Exchange">Exchange</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={airdropForm.control}
                    name="estimatedValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Estimated Value</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="$50-$200" 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={airdropForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-dark-light border-gray-700 text-white">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-dark-light border-gray-700 text-white">
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                            <SelectItem value="Ending Soon">Ending Soon</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={airdropForm.control}
                    name="participants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Participants</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={airdropForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-300">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter airdrop description" 
                            rows={3} 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={airdropForm.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-300">Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter airdrop requirements" 
                            rows={3} 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={airdropForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Start Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={airdropForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">End Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={airdropForm.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-300">Logo URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/logo.png" 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">Preview:</p>
                          {field.value && (
                            <div className="mt-1 w-10 h-10 rounded-full overflow-hidden">
                              <img src={field.value} alt="Logo preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={airdropForm.control}
                    name="coverImageUrl"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-300">Cover Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/cover.png" 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">Preview:</p>
                          {field.value && (
                            <div className="mt-1 w-full h-24 rounded-md overflow-hidden">
                              <img src={field.value} alt="Cover preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2 mt-4 flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={closeAdminPanel}
                      className="mr-4"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-primary-dark"
                      disabled={isSubmittingAirdrop}
                    >
                      {isSubmittingAirdrop ? "Creating..." : "Create Airdrop"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="blog">
              <h3 className="text-xl font-semibold text-white mb-4">Create Blog Post</h3>
              <Form {...blogForm}>
                <form onSubmit={blogForm.handleSubmit(onSubmitBlog)} className="space-y-4">
                  <FormField
                    control={blogForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Article Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter article title" 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={blogForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-dark-light border-gray-700 text-white">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-dark-light border-gray-700 text-white">
                            <SelectItem value="Guide">Guide</SelectItem>
                            <SelectItem value="News">News</SelectItem>
                            <SelectItem value="Analysis">Analysis</SelectItem>
                            <SelectItem value="Tutorial">Tutorial</SelectItem>
                            <SelectItem value="Strategy">Strategy</SelectItem>
                            <SelectItem value="Security">Security</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={blogForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Content</FormLabel>
                        <div className="bg-dark-light border border-gray-700 rounded-md overflow-hidden">
                          <div className="flex border-b border-gray-700 px-3 py-2">
                            <button type="button" className="text-gray-400 hover:text-white p-1 mr-1">
                              <Bold size={16} />
                            </button>
                            <button type="button" className="text-gray-400 hover:text-white p-1 mr-1">
                              <Italic size={16} />
                            </button>
                            <button type="button" className="text-gray-400 hover:text-white p-1 mr-1">
                              <Underline size={16} />
                            </button>
                            <button type="button" className="text-gray-400 hover:text-white p-1 mr-1">
                              <Link2 size={16} />
                            </button>
                            <button type="button" className="text-gray-400 hover:text-white p-1 mr-1">
                              <Image size={16} />
                            </button>
                            <button type="button" className="text-gray-400 hover:text-white p-1 mr-1">
                              <List size={16} />
                            </button>
                            <button type="button" className="text-gray-400 hover:text-white p-1 mr-1">
                              <ListOrdered size={16} />
                            </button>
                            <button type="button" className="text-gray-400 hover:text-white p-1 mr-1">
                              <Quote size={16} />
                            </button>
                            <button type="button" className="text-gray-400 hover:text-white p-1 mr-1">
                              <Code size={16} />
                            </button>
                          </div>
                          <FormControl>
                            <Textarea 
                              placeholder="Write your article content here..." 
                              rows={8} 
                              {...field} 
                              className="w-full px-4 py-2 text-white bg-transparent border-0 focus:ring-0"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={blogForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Featured Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/image.png" 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">Preview:</p>
                          {field.value && (
                            <div className="mt-1 w-full h-32 rounded-md overflow-hidden">
                              <img src={field.value} alt="Featured image preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={blogForm.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Tags</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter tags separated by commas" 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-6 flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={closeAdminPanel}
                      className="mr-4"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-primary-dark"
                      disabled={isSubmittingBlog}
                    >
                      {isSubmittingBlog ? "Publishing..." : "Publish"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </motion.div>
  );
}
