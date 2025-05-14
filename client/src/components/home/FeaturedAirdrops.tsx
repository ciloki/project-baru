import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useData } from "@/context/DataContext";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusColor, getTimeRemaining, formatNumber } from "@/lib/utils";
import { Users } from "lucide-react";

const filters = ["All", "Upcoming", "Active", "Ending Soon", "High Value"];

export default function FeaturedAirdrops() {
  const { airdrops, isLoadingAirdrops } = useData();
  const [filteredAirdrops, setFilteredAirdrops] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  
  const titleSection = useScrollAnimation();
  const filterSection = useScrollAnimation();

  useEffect(() => {
    if (!airdrops) return;
    
    if (activeFilter === "All") {
      setFilteredAirdrops(airdrops.slice(0, 6));
    } else if (activeFilter === "High Value") {
      const sorted = [...airdrops].sort((a, b) => {
        const valueA = parseInt(a.estimatedValue.replace(/[^0-9]/g, ''));
        const valueB = parseInt(b.estimatedValue.replace(/[^0-9]/g, ''));
        return valueB - valueA;
      });
      setFilteredAirdrops(sorted.slice(0, 6));
    } else {
      const filtered = airdrops.filter(airdrop => {
        if (activeFilter === "Ending Soon") return airdrop.status === "Ending Soon";
        if (activeFilter === "Active") return airdrop.status === "Active";
        if (activeFilter === "Upcoming") return airdrop.status === "Upcoming";
        return true;
      });
      setFilteredAirdrops(filtered.slice(0, 6));
    }
  }, [airdrops, activeFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="airdrops" className="py-16 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={titleSection.ref}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={titleSection.isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Airdrops</h2>
          <p className="mt-4 text-lg text-gray-300">Don't miss these limited-time opportunities to earn free tokens</p>
        </motion.div>
        
        {/* Airdrop Filters */}
        <motion.div
          ref={filterSection.ref}
          className="mb-8 flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={filterSection.isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full ${
                activeFilter === filter
                  ? "bg-primary text-white"
                  : "bg-dark-lighter text-white hover:bg-primary"
              } transition duration-150 ease-in-out`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </motion.div>
        
        {/* Airdrops Grid */}
        {isLoadingAirdrops ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-dark-lighter rounded-xl overflow-hidden shadow-xl">
                <Skeleton className="w-full h-48" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            >
              {filteredAirdrops.map((airdrop) => (
                <motion.div
                  key={airdrop.id}
                  variants={itemVariants}
                  className="bg-dark-lighter rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative">
                    <img 
                      src={airdrop.coverImageUrl} 
                      alt={`${airdrop.title}`} 
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute top-0 right-0 ${getStatusColor(airdrop.status)} text-sm font-semibold px-3 py-1 m-2 rounded-full`}>
                      {airdrop.status === "Ending Soon" 
                        ? `Ends in ${getTimeRemaining(airdrop.endDate)}`
                        : airdrop.status
                      }
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <img 
                        src={airdrop.logoUrl} 
                        alt={`${airdrop.projectName} Logo`} 
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                      <h3 className="text-xl font-bold text-white">{airdrop.title}</h3>
                    </div>
                    <p className="text-gray-300 mb-4">{airdrop.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-secondary font-medium">Reward: {airdrop.estimatedValue}</span>
                      <span className="bg-dark px-2 py-1 rounded text-xs text-white">{airdrop.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-400 text-sm">{formatNumber(airdrop.participants)} participants</span>
                      </div>
                      <Link href={`/airdrops/${airdrop.id}`}>
                        <a className="text-primary hover:text-primary-light font-medium transition duration-150 ease-in-out">View Details &rarr;</a>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href="/airdrops">
            <a className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition duration-150 ease-in-out">
              View All Airdrops
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
