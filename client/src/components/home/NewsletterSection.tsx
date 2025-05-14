import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useData } from "@/context/DataContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CheckCircle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  interests: z.string().min(1, { message: "Please select your interests." }),
  terms: z.boolean().refine((value) => value === true, {
    message: "You must agree to receive newsletter emails.",
  }),
});

export default function NewsletterSection() {
  const { subscribeToNewsletter } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const leftSection = useScrollAnimation();
  const rightSection = useScrollAnimation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      interests: "All Airdrops",
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await subscribeToNewsletter(values.email, values.interests);
      form.reset();
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="newsletter" className="py-16 bg-dark-lighter relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:flex lg:items-center lg:justify-between">
          <motion.div
            ref={leftSection.ref}
            className="lg:w-1/2 mb-8 lg:mb-0"
            initial={{ opacity: 0, x: -30 }}
            animate={leftSection.isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Never Miss an Airdrop</h2>
            <p className="text-xl text-gray-300 mb-6">Subscribe to our newsletter and get the latest airdrop opportunities delivered to your inbox.</p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                Early notifications about new airdrops
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                Exclusive guides and strategies
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                Market insights and token analysis
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                Priority access to limited drops
              </li>
            </ul>
          </motion.div>

          <motion.div
            ref={rightSection.ref}
            className="lg:w-2/5"
            initial={{ opacity: 0, x: 30 }}
            animate={rightSection.isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-dark rounded-xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">Join Our Newsletter</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Interests</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-dark-light border-gray-700 text-white focus:border-primary">
                              <SelectValue placeholder="Select your interests" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-dark-light border-gray-700 text-white">
                            <SelectItem value="All Airdrops">All Airdrops</SelectItem>
                            <SelectItem value="DeFi Airdrops">DeFi Airdrops</SelectItem>
                            <SelectItem value="NFT Airdrops">NFT Airdrops</SelectItem>
                            <SelectItem value="Gaming Airdrops">Gaming Airdrops</SelectItem>
                            <SelectItem value="Layer 2 Projects">Layer 2 Projects</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-gray-300">
                            I agree to receive newsletter emails
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe Now"}
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
