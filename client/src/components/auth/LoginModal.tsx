import { useState } from "react";
import { X } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { useData } from "@/context/DataContext";
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
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Login form schema
const loginFormSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

// Register form schema
const registerFormSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function LoginModal() {
  const { closeLoginModal } = useUI();
  const { login, register: registerUser } = useData();
  const [activeTab, setActiveTab] = useState("login");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);

  // Login form
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login form submission
  async function onSubmitLogin(values: z.infer<typeof loginFormSchema>) {
    setIsSubmittingLogin(true);
    try {
      await login(values.username, values.password);
      loginForm.reset();
      closeLoginModal();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmittingLogin(false);
    }
  }

  // Handle register form submission
  async function onSubmitRegister(values: z.infer<typeof registerFormSchema>) {
    setIsSubmittingRegister(true);
    try {
      await registerUser(values.username, values.email, values.password);
      registerForm.reset();
      setActiveTab("login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmittingRegister(false);
    }
  }

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeLoginModal();
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
    >
      <motion.div 
        className="bg-dark-lighter rounded-xl max-w-md w-full p-6 m-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <button onClick={closeLoginModal} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your username" 
                          {...field} 
                          className="bg-dark-light border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          className="bg-dark-light border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="flex justify-end mt-1">
                        <a href="#" className="text-sm text-primary hover:text-primary-light">Forgot Password?</a>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-dark mt-4"
                  disabled={isSubmittingLogin}
                >
                  {isSubmittingLogin ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </Form>

            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <button 
                  onClick={() => setActiveTab("register")}
                  className="text-primary hover:text-primary-light focus:outline-none"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="register">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Choose a username" 
                          {...field} 
                          className="bg-dark-light border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your@email.com" 
                          {...field} 
                          className="bg-dark-light border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          className="bg-dark-light border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          className="bg-dark-light border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-dark mt-4"
                  disabled={isSubmittingRegister}
                >
                  {isSubmittingRegister ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>

            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <button 
                  onClick={() => setActiveTab("login")}
                  className="text-primary hover:text-primary-light focus:outline-none"
                >
                  Log In
                </button>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
