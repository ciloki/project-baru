import { useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedAirdrops from "@/components/home/FeaturedAirdrops";
import HowItWorks from "@/components/home/HowItWorks";
import BlogSection from "@/components/home/BlogSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import AboutContactSection from "@/components/home/AboutContactSection";
import { Helmet } from "react-helmet";

export default function Home() {
  // Add scroll animation behavior
  useEffect(() => {
    const animateElements = () => {
      document.querySelectorAll('.animate-on-scroll').forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight * 0.9) {
          element.classList.add('is-visible');
        }
      });
    };

    // Call once on load to check for elements already in view
    animateElements();
    
    // Add scroll event listener
    window.addEventListener('scroll', animateElements);
    
    // Clean up listener
    return () => {
      window.removeEventListener('scroll', animateElements);
    };
  }, []);

  return (
    <div>
      <Helmet>
        <title>Airdrops Hunter - Find Free Crypto Airdrops</title>
        <meta name="description" content="Discover the best free cryptocurrency airdrops. Stay updated with the latest opportunities to earn free tokens and coins." />
        <meta property="og:title" content="Airdrops Hunter - Find Free Crypto Airdrops" />
        <meta property="og:description" content="Discover legitimate cryptocurrency airdrops and earn free tokens. Our team verifies each airdrop to ensure quality and safety." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="crypto airdrops, free tokens, cryptocurrency, blockchain, airdrop hunter" />
      </Helmet>

      <main className="pt-16">
        <HeroSection />
        <FeaturedAirdrops />
        <HowItWorks />
        <BlogSection />
        <NewsletterSection />
        <AboutContactSection />
      </main>
    </div>
  );
}
