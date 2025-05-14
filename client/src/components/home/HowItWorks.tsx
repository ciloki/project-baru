import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function HowItWorks() {
  const titleSection = useScrollAnimation();
  const step1 = useScrollAnimation({ threshold: 0.2 });
  const step2 = useScrollAnimation({ threshold: 0.2 });
  const step3 = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-16 bg-dark-lighter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={titleSection.ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={titleSection.isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">How It Works</h2>
          <p className="mt-4 text-lg text-gray-300">Simple steps to start earning free crypto tokens</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <motion.div
            ref={step1.ref}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={step1.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white text-2xl font-bold mb-4">1</div>
            <h3 className="text-xl font-bold text-white mb-2">Find Airdrops</h3>
            <p className="text-gray-300">Browse our curated list of legitimate cryptocurrency airdrops from verified projects.</p>
          </motion.div>
          
          {/* Step 2 */}
          <motion.div
            ref={step2.ref}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={step2.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white text-2xl font-bold mb-4">2</div>
            <h3 className="text-xl font-bold text-white mb-2">Complete Tasks</h3>
            <p className="text-gray-300">Follow the requirements for each airdrop, which may include social media tasks or community engagement.</p>
          </motion.div>
          
          {/* Step 3 */}
          <motion.div
            ref={step3.ref}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={step3.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white text-2xl font-bold mb-4">3</div>
            <h3 className="text-xl font-bold text-white mb-2">Receive Tokens</h3>
            <p className="text-gray-300">Get your free tokens delivered directly to your wallet when the distribution occurs.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
