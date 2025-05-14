import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useData } from "@/context/DataContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Search, Filter } from "lucide-react";
import { getStatusColor, getTimeRemaining, formatNumber } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AllAirdrops() {
  const { airdrops, isLoadingAirdrops } = useData();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [filteredAirdrops, setFilteredAirdrops] = useState([]);
  
  // Get unique categories from airdrops
  const categories = airdrops ? 
    ["All", ...new Set(airdrops.map(airdrop => airdrop.category))] : 
    ["All", "DeFi", "NFT", "GameFi", "Layer 2", "Metaverse", "Exchange"];
  
  // Get unique statuses from airdrops
  const statuses = airdrops ?
    ["All", ...new Set(airdrops.map(airdrop => airdrop.status))] :
    ["All", "Active", "Upcoming", "Ending Soon", "Completed"];

  // Filter airdrops based on search, category, and status
  useEffect(() => {
    if (!airdrops) return;
    
    let filtered = [...airdrops];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        airdrop => 
          airdrop.title.toLowerCase().includes(query) || 
          airdrop.projectName.toLowerCase().includes(query) || 
          airdrop.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(airdrop => airdrop.category === selectedCategory);
    }
    
    // Filter by status
    if (selectedStatus !== "All") {
      filtered = filtered.filter(airdrop => airdrop.status === selectedStatus);
    }
    
    setFilteredAirdrops(filtered);
  }, [airdrops, searchQuery, selectedCategory, selectedStatus]);

  // Handler for search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Animation variants
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
    <div className="pt-20 pb-16 bg-dark">
      <Helmet>
        <title>All Airdrops - Airdrops Hunter</title>
        <meta name="description" content="Browse and filter through our collection of verified cryptocurrency airdrops. Find the best opportunities to earn free tokens." />
        <meta property="og:title" content="All Airdrops - Airdrops Hunter" />
        <meta property="og:description" content="Browse verified cryptocurrency airdrops and earn free tokens. Filter by category, status, and search for specific projects." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="crypto airdrops, all airdrops, free tokens, cryptocurrency, blockchain, filter airdrops" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">All Crypto Airdrops</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Browse through our curated collection of verified cryptocurrency airdrops. 
            Filter by category, status, or search for specific projects.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search airdrops..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-dark-lighter border-gray-700 text-white"
            />
          </div>
          
          <div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-dark-lighter border-gray-700 text-white">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-dark-lighter border-gray-700 text-white">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-dark-lighter border-gray-700 text-white">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-dark-lighter border-gray-700 text-white">
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedStatus("All");
            }}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:text-white"
          >
            Reset Filters
          </Button>
        </div>

        {/* Results Count */}
        {!isLoadingAirdrops && (
          <p className="text-gray-400 mb-6">
            Showing {filteredAirdrops.length} {filteredAirdrops.length === 1 ? 'airdrop' : 'airdrops'}
          </p>
        )}

        {/* Airdrops Grid */}
        {isLoadingAirdrops ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        ) : filteredAirdrops.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredAirdrops.map((airdrop) => (
                <motion.div
                  key={airdrop.id}
                  variants={itemVariants}
                  layout
                  className="bg-dark-lighter rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative">
                    <img 
                      src={airdrop.coverImageUrl} 
                      alt={`${airdrop.title}`} 
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute top-0 right-0 ${getStatusColor(airdrop.status)} text-sm font-semibold px-3 py-1 m-2 rounded-full`}>
                      {airdrop.status === "Ending Soon" && airdrop.endDate
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
                    <p className="text-gray-300 mb-4 line-clamp-2">{airdrop.description}</p>
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
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-white mb-2">No airdrops found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
