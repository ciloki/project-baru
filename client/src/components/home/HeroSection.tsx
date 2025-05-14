import { Link } from "wouter";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function HeroSection() {
  const title = useScrollAnimation();
  const subtitle = useScrollAnimation();
  const buttons = useScrollAnimation();
  const logoContainer = useScrollAnimation();

  return (
    <section className="relative bg-dark overflow-hidden pt-20">
      <div className="hero-gradient absolute inset-0 opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <motion.h1
            ref={title.ref}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={title.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Discover Free <span className="text-primary">Crypto Airdrops</span>
          </motion.h1>
          
          <motion.p
            ref={subtitle.ref}
            className="mt-3 max-w-md mx-auto text-lg text-gray-300 sm:text-xl md:mt-5 md:max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={subtitle.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Hunt for the best cryptocurrency airdrops and earn free tokens. Stay updated with the latest opportunities in the crypto world.
          </motion.p>
          
          <motion.div
            ref={buttons.ref}
            className="mt-8 flex justify-center space-x-4"
            initial={{ opacity: 0, y: 30 }}
            animate={buttons.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/airdrops">
              <a className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary shadow-md hover:bg-primary-dark md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out">
                Explore Airdrops
              </a>
            </Link>
            <a 
              href="#newsletter" 
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-dark-lighter hover:bg-dark-light md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
              onClick={(e) => {
                e.preventDefault();
                const newsletterSection = document.getElementById('newsletter');
                if (newsletterSection) {
                  newsletterSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Subscribe
            </a>
          </motion.div>
        </div>
        
        {/* Crypto Logos */}
        <motion.div
          ref={logoContainer.ref}
          className="mt-16 grid grid-cols-4 gap-2 md:gap-8 items-center justify-items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={logoContainer.isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Bitcoin */}
          <motion.div 
            className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-yellow-500 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-white">
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,7.4H9.8V7H11V5.7H10.2V5.3H11V4H12V5.3H13.8V5.7H12V7H13.2V7.4H12V9.2C13.2,9.2 14,10 14,11C14,12 13.2,12.8 12,12.8V15H11V12.8C9.8,12.8 9,12 9,11C9,10 9.8,9.2 11,9.2V7.4M11,11.7C12.2,11.7 12.2,10.3 11,10.3V11.7M12,10.3C10.8,10.3 10.8,11.7 12,11.7V10.3Z" fill="currentColor" />
            </svg>
          </motion.div>
          
          {/* Ethereum */}
          <motion.div 
            className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-indigo-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
            whileHover={{ rotate: -10, scale: 1.1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-white">
              <path d="M12,1.75L5.75,12.25L12,16L18.25,12.25L12,1.75M5.75,13.5L12,22.25L18.25,13.5L12,17.25L5.75,13.5Z" fill="currentColor" />
            </svg>
          </motion.div>
          
          {/* Solana */}
          <motion.div 
            className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-purple-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-8 h-8 md:w-10 md:h-10">
              <path d="M93.94 42.63H13.78l20.28-22.3h80.16zm0 65.09H13.78l20.28-22.3h80.16zm0-32.55H13.78l20.28-22.3h80.16z" fill="currentColor" />
            </svg>
          </motion.div>
          
          {/* Cardano */}
          <motion.div 
            className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-blue-500 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
            whileHover={{ rotate: -10, scale: 1.1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-white">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12,7L9,12L12,17L15,12L12,7Z" fill="currentColor" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
