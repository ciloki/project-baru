import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useData } from "@/context/DataContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Twitter, MessageSquareLock, Github, Linkedin, Youtube } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(1, { message: "Please select a subject." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export default function AboutContactSection() {
  const { sendContactMessage } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const aboutSection = useScrollAnimation();
  const contactSection = useScrollAnimation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "General Inquiry",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await sendContactMessage(
        values.name,
        values.email,
        values.subject,
        values.message
      );
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="about" className="py-16 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-start lg:justify-between lg:gap-12">
          {/* About Section */}
          <motion.div
            ref={aboutSection.ref}
            className="lg:w-1/2 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -30 }}
            animate={aboutSection.isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">About Airdrops Hunter</h2>
            <p className="text-gray-300 mb-4">
              Airdrops Hunter is your trusted platform for discovering legitimate cryptocurrency airdrops. 
              Our team of crypto experts verifies each airdrop to ensure quality and safety for our community.
            </p>
            <p className="text-gray-300 mb-6">
              Founded in 2021, we've helped thousands of crypto enthusiasts earn free tokens worth 
              millions of dollars through carefully vetted airdrops.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-dark-lighter p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-gray-300">Verified Airdrops</div>
              </div>
              <div className="bg-dark-lighter p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">150K+</div>
                <div className="text-sm text-gray-300">Community Members</div>
              </div>
              <div className="bg-dark-lighter p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">$10M+</div>
                <div className="text-sm text-gray-300">Value Distributed</div>
              </div>
              <div className="bg-dark-lighter p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-gray-300">Support Available</div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors duration-150">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors duration-150">
                <MessageSquareLock className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors duration-150">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors duration-150">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors duration-150">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            ref={contactSection.ref}
            id="contact"
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            animate={contactSection.isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-dark-lighter rounded-xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-6">Contact Us</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Your Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your@email.com" 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Subject</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-dark-light border-gray-700 text-white focus:border-primary">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-dark-light border-gray-700 text-white">
                            <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                            <SelectItem value="Airdrop Submission">Airdrop Submission</SelectItem>
                            <SelectItem value="Partnership Opportunity">Partnership Opportunity</SelectItem>
                            <SelectItem value="Report an Issue">Report an Issue</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Your message here..." 
                            rows={4} 
                            {...field} 
                            className="bg-dark-light border-gray-700 text-white focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
