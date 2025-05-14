import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AirdropDetails from "@/pages/AirdropDetails";
import AllAirdrops from "@/pages/AllAirdrops";
import BlogPost from "@/pages/BlogPost";
import AllBlogPosts from "@/pages/AllBlogPosts";
import AuthPage from "@/pages/auth-page";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminPanel from "@/components/admin/AdminPanel";
import LoginModal from "@/components/auth/LoginModal";
import { useUI } from "@/context/UIContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/airdrops" component={AllAirdrops} />
      <Route path="/airdrops/:id" component={AirdropDetails} />
      <Route path="/blog" component={AllBlogPosts} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isAdminPanelOpen, isLoginModalOpen } = useUI();

  return (
    <TooltipProvider>
      <Toaster />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>

      {isAdminPanelOpen && <AdminPanel />}
      {isLoginModalOpen && <LoginModal />}
    </TooltipProvider>
  );
}

export default App;
