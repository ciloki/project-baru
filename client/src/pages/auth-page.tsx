import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Helmet } from "react-helmet";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect } from "wouter";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Register form schema
const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function AuthPage() {
  const { user, isLoadingUser, login, register } = useData();
  const [activeTab, setActiveTab] = useState("login");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Handle login form submission
  async function onSubmitLogin(values: z.infer<typeof loginSchema>) {
    setIsSubmittingLogin(true);
    try {
      await login(values.username, values.password);
      // Redirect to homepage after successful login
      window.location.href = '/';
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setIsSubmittingLogin(false);
    }
  }

  // Handle register form submission
  async function onSubmitRegister(values: z.infer<typeof registerSchema>) {
    setIsSubmittingRegister(true);
    try {
      await register(values.username, values.email, values.password);
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setIsSubmittingRegister(false);
    }
  }

  // If user is already logged in, redirect to homepage
  if (user) {
    // Force a hard redirect to make sure all state is refreshed
    window.location.href = '/';
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Login/Register | Airdrops Hunter</title>
        <meta name="description" content="Login or register to access more features of Airdrops Hunter" />
      </Helmet>

      <div className="min-h-screen bg-gray-900 flex">
        {/* Left side - Forms */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">Welcome to Airdrops Hunter</h1>
            
            <Tabs defaultValue="login" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" {...field} />
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
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isSubmittingLogin}>
                      {isSubmittingLogin ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
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
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isSubmittingRegister}>
                      {isSubmittingRegister ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Register"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Right side - Hero Image */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 justify-center items-center p-12">
          <div className="max-w-lg text-white">
            <h2 className="text-4xl font-bold mb-6">Discover the Best Crypto Airdrops</h2>
            <p className="text-xl mb-8">
              Join Airdrops Hunter to access exclusive airdrops, personalized notifications,
              and stay ahead of the crypto market.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg p-4 rounded-lg">
                <h3 className="font-bold text-xl mb-2">Track Airdrops</h3>
                <p>Get notified about new airdrops matching your criteria</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg p-4 rounded-lg">
                <h3 className="font-bold text-xl mb-2">Expert Tips</h3>
                <p>Learn strategies to maximize your airdrop earnings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}